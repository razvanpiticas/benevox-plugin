import { accessSync, constants, existsSync, statSync } from "node:fs"
import { posix, win32 } from "node:path"

/**
 * Where a program lives on this machine, found the way the shell that installs an entry finds it.
 *
 * <p><b>A scheduled entry cannot name a program by its bare name.</b> cron starts its lines with a
 * PATH of its own, `/usr/bin:/bin`, and `claude` and `codex` are installed in `~/.local/bin`,
 * `/opt/homebrew/bin` or npm's global directory — none of which it carries. An entry written as
 * `claude -p …` is installed, listed, and fails with "claude: not found" every time it fires, where
 * nobody reads the error. So the program is looked up here, on the PATH of the person installing it,
 * and written into the entry by its full path — or the install is refused.</p>
 *
 * <p>Windows finds a program by trying each extension `PATHEXT` names, which is how `claude`
 * becomes npm's `claude.cmd`, so the lookup does the same there and nothing else.</p>
 */

/** The platform that finds a program through `PATHEXT` and separates PATH entries with `;`. */
const WINDOWS = "win32"

/** The error code a file that exists but may not be run answers an access check with. */
const NOT_PERMITTED = "EACCES"

/**
 * Whether a path is a file this user may run.
 *
 * Absence and a missing execute bit answer false, because both mean "not this one, keep looking".
 * Anything else is thrown: a lookup that took a failed read for "not here" would refuse a harness
 * that is installed, or pass over the one it should have found.
 *
 * @param {string} path the candidate
 * @returns {boolean}
 */
export const isExecutableFile = (path) => {
  if (!existsSync(path) || !statSync(path).isFile()) return false

  try {
    accessSync(path, constants.X_OK)
    return true
  } catch (error) {
    if (error.code === NOT_PERMITTED) return false

    throw error
  }
}

/**
 * The full path of a program, from the first PATH directory that carries it.
 *
 * @param {string} program the bare name, such as `claude`
 * @param {object} machine
 * @param {string} machine.platform the platform the PATH is read for
 * @param {string} machine.searchPath the PATH, as the environment carries it
 * @param {string} [machine.pathExtensions] `PATHEXT`, required on Windows
 * @param {function(string): boolean} machine.isExecutable whether a candidate path may be run
 * @returns {string} the full path
 * @throws when the PATH is empty, `PATHEXT` is missing on Windows, or no directory carries the program
 */
export const locateProgram = (program, { platform, searchPath, pathExtensions, isExecutable }) => {
  if (!program) throw new Error("locateProgram requires the name of the program to look for.")
  if (!platform) throw new Error("locateProgram requires the platform the PATH is read for.")
  if (typeof isExecutable !== "function") throw new Error("locateProgram requires a way of checking that a candidate may be run.")
  if (!searchPath) throw new Error(`This machine's PATH is empty, so "${program}" cannot be found and nothing can be installed to run it.`)

  const isWindows = platform === WINDOWS
  if (isWindows && !pathExtensions) throw new Error(`PATHEXT is not set, so Windows has no way of finding "${program}" and nothing can be installed to run it.`)

  const paths = isWindows ? win32 : posix
  const names = isWindows ? pathExtensions.split(paths.delimiter).filter((extension) => extension.length > 0).map((extension) => `${program}${extension.toLowerCase()}`) : [program]
  const directories = searchPath.split(paths.delimiter).filter((directory) => directory.length > 0)

  for (const directory of directories) {
    for (const name of names) {
      const candidate = paths.join(directory, name)
      if (isExecutable(candidate)) return candidate
    }
  }

  throw new Error(`"${program}" is not on this machine's PATH, so a scheduled entry would fail with "not found" every time it fired. Install it, or run this from a shell where "${program}" starts, and install again. Nothing was installed.`)
}
