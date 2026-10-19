import { execFileSync } from "node:child_process"

/**
 * The crontab entry that fires a routine on macOS and Linux.
 *
 * One line per routine, marked with the routine's id so this command can find its own work again
 * without owning the file. The person's other lines are read, kept and written back untouched:
 * a crontab is the machine's, not this product's, and a tool that rewrites it wholesale is a tool
 * that eats somebody's backup job the first time it is run.
 *
 * <p>The crontab itself is reached through an injected pair rather than called directly, so the
 * add, the refusal to add twice, the remove and the listing are all proved over a fake pair
 * instead of over the developer's own crontab.</p>
 */

/** What marks a line as this command's, and carries the routine it belongs to. */
const MARKER = "# benevox:"

/** Five fields, then the command, then the marker. */
const LINE_PATTERN = /^(?<cron>\S+ \S+ \S+ \S+ \S+)\s+(?<command>.*?)\s*#\s*benevox:(?<routineId>\S+)\s*$/

/** How the command is wrapped so it runs where the project is. */
const DIRECTORY_CHANGE = "cd"

/**
 * The variable the command is started with, set to the installer's own PATH.
 *
 * cron runs a line with `/usr/bin:/bin` and nothing else. The harness itself is written by its full
 * path, but an npm-installed one is a script that starts with `#!/usr/bin/env node`, and `node` lives
 * wherever the person's PATH says — so the line carries that PATH for the harness to start under.
 */
const SEARCH_PATH_VARIABLE = "PATH"

/**
 * How one single quote is written inside a single-quoted shell word: close it, escape the quote,
 * open it again. Written once, because the quoting and the reading back of it have to agree.
 */
const ESCAPED_SINGLE_QUOTE = "'\\''"

/** A single-quoted word as `quoteForShell` writes it, as the source of the patterns that read one back. */
const quotedWord = (group) => `'(?<${group}>(?:[^']|'\\\\'')*)'`

/** The exit status and the words `crontab -l` answers a person who has no crontab yet with. */
const NO_CRONTAB_STATUS = 1
const NO_CRONTAB_PATTERN = /no crontab for/

/**
 * Cron turns a bare `%` in the command into a line break and hands the rest to stdin, so every one
 * is written `\%`, and cron itself takes the backslash off again before `sh` sees the line.
 */
const PERCENT = "%"
const ESCAPED_PERCENT = "\\%"

/**
 * Reads the crontab through the given `execFileSync`, injected so the one failure that means
 * "empty" can be told apart from every other failure without running `crontab` in the suite.
 *
 * <p>Only the empty case answers `""`. Any other failure is thrown: `add` writes back what it read
 * plus one line, so a failed read taken for an empty crontab would wipe the person's own lines.</p>
 *
 * @param {function} exec `execFileSync`, or a stand-in for it
 * @returns {function(): string} the crontab's contents
 */
export const readCrontabWith = (exec) => () => {
  try {
    return exec("crontab", ["-l"], { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] })
  } catch (error) {
    if (error.status === NO_CRONTAB_STATUS && NO_CRONTAB_PATTERN.test(String(error.stderr))) return ""

    throw new Error(`crontab -l failed, so nothing was written: ${error.message}`)
  }
}

/** The crontab as the operating system holds it: read it whole, write it whole. */
export const systemCrontab = Object.freeze({
  read: readCrontabWith(execFileSync),
  write: (contents) => {
    execFileSync("crontab", ["-"], { input: contents, encoding: "utf8" })
  },
})

/**
 * Quotes one argument for `sh`, which is what cron runs a line with.
 *
 * Single quotes, because inside them every character but the single quote itself is literal — and
 * the boot prompt carries double quotes around the agent, the channel and the routine.
 *
 * @param {string} text the argument as it should reach the program
 * @returns {string} the argument as it is written on the line
 */
export const quoteForShell = (text) => `'${text.replaceAll("'", ESCAPED_SINGLE_QUOTE)}'`

/**
 * Appends one marked line, and refuses when this routine already has one.
 *
 * @param {object} options
 * @param {string} options.routineId the routine the entry belongs to
 * @param {object} options.cronLine as `parseCronLine` returned it; cron reads the five fields as written
 * @param {string} options.projectDirectory where the harness is started
 * @param {string} options.command the harness command, already quoted for `sh`, its program by full path
 * @param {string} options.searchPath the installer's PATH, which the command is started with
 * @param {{read: function, write: function}} [options.crontab] the crontab to write into
 * @returns {{routineId: string, cronLine: string, projectDirectory: string, command: string, installedAs: string}}
 */
export const addCronEntry = ({ routineId, cronLine, projectDirectory, command, searchPath, crontab = systemCrontab }) => {
  requireRoutineId(routineId)
  if (!cronLine) throw new Error("A crontab entry needs the routine's cron line.")
  if (!projectDirectory) throw new Error("A crontab entry needs the project directory.")
  if (!command) throw new Error("A crontab entry needs the command to run.")
  if (!searchPath) throw new Error("A crontab entry needs the PATH the harness is started with, because cron's own carries none of the places a harness is installed.")

  const contents = crontab.read()
  if (parseEntries(contents).some((entry) => entry.routineId === routineId)) {
    throw new Error(`This machine already carries a crontab entry for routine ${routineId}. Remove it first: benevox schedule remove --routine ${routineId}.`)
  }

  const wrapped = `${DIRECTORY_CHANGE} ${quoteForShell(projectDirectory)} && ${SEARCH_PATH_VARIABLE}=${quoteForShell(searchPath)} ${command}`
  const line = `${cronLine.raw} ${wrapped.replaceAll(PERCENT, ESCAPED_PERCENT)} ${MARKER}${routineId}`

  crontab.write(`${contents.replace(/\n*$/, "")}\n${line}\n`.replace(/^\n+/, ""))

  return { routineId, cronLine: cronLine.raw, projectDirectory, command, installedAs: line }
}

/**
 * Removes every line this routine owns, and says so when there were none.
 *
 * Absence is not an error: switching a routine off has to be safe to run twice, and a person who
 * removed the line by hand is not somebody to fail in front of.
 *
 * @returns {{removed: string[]}} the lines that were taken out
 */
export const removeCronEntry = ({ routineId, crontab = systemCrontab }) => {
  requireRoutineId(routineId)

  const contents = crontab.read()
  const lines = contents.length === 0 ? [] : contents.replace(/\n$/, "").split("\n")
  const removed = lines.filter((line) => markerOf(line) === routineId)

  if (removed.length === 0) return { removed: [] }

  const kept = lines.filter((line) => markerOf(line) !== routineId)
  crontab.write(kept.length === 0 ? "" : `${kept.join("\n")}\n`)

  return { removed }
}

/**
 * Every entry this command wrote, one per marked line.
 *
 * @returns {Array<{routineId: string, cronLine: string, projectDirectory: string, command: string, installedAs: string}>}
 */
export const listCronEntries = ({ crontab = systemCrontab } = {}) => parseEntries(crontab.read())

const parseEntries = (contents) => {
  if (contents.length === 0) return []

  return contents
    .split("\n")
    .map((line) => LINE_PATTERN.exec(line))
    .filter((match) => match !== null)
    .map((match) => {
      const wrapped = match.groups.command.replaceAll(ESCAPED_PERCENT, PERCENT)

      return {
        routineId: match.groups.routineId,
        cronLine: match.groups.cron,
        projectDirectory: readDirectory(wrapped),
        command: readCommand(wrapped),
        installedAs: match[0],
      }
    })
}

/** The directory change and the PATH a marked line opens with, before the command it runs. */
const WRAPPER_PATTERN = new RegExp(`^${DIRECTORY_CHANGE}\\s+${quotedWord("directory")}\\s+&&\\s+${SEARCH_PATH_VARIABLE}=${quotedWord("searchPath")}\\s+`)

/** The directory out of `cd '<dir>' && PATH='<path>' <command>`, unquoted. */
const readDirectory = (wrapped) => {
  const match = WRAPPER_PATTERN.exec(wrapped)
  if (match === null) return ""

  return match.groups.directory.replaceAll(ESCAPED_SINGLE_QUOTE, "'")
}

/** What the line actually runs, with the directory change and the PATH taken off the front. */
const readCommand = (wrapped) => wrapped.replace(WRAPPER_PATTERN, "")

const markerOf = (line) => {
  const match = LINE_PATTERN.exec(line)

  return match === null ? null : match.groups.routineId
}

const requireRoutineId = (routineId) => {
  if (!routineId) throw new Error("A crontab entry is found by the routine it belongs to, and no routine was named.")
}
