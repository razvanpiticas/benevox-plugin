---
name: "benevox-routines"
description: "Routines: switch on, run now. The routines menu — what a Benevox channel has scheduled, switching a routine on or off in both places it lives (the Studio row and this machine's scheduler), rescheduling one, and running one now by hand. Use when the founder asks what runs on its own, wants the Nightly distiller or the Nightly linker switched on or off for a channel, wants a routine's time or zone changed, or wants a routine run right now."
---

# Benevox routines

A routine is a row in Studio, one set per channel: a name, a five-field cron line, the zone it is
read in, the agent it boots and instructions written to that agent. **The server never fires one.**
This machine does, and only if an entry for it exists in a scheduler here. So a routine lives in two
places, and switching it on means writing both — one without the other is a routine that never
fires, or a schedule Studio shows as off.

**No agent booted and no run handed to you? Get them before the first call.** A Benevox skill
is often reached straight from the request — typed by the person, or picked by its description —
with no agent booted in this session and no run open. Nothing is read or written before the boot.
Then invoke the `benevox-agent` skill first, with the channel, the request as it was made and the
routine when one is named, and call no tool of this skill before it, not even a read.
`benevox-agent` boots the agent — the one the routine names, else Producer — and hands the work
back here inside that agent's run: it opens the run and hands you its id, or, for an operation such
as Pick a niche, hands you the agent's id so the operation's own run is opened with it. Every write
from then on carries the run's id. A write with no run is recorded as the signed-in person's own,
and a run opened with no agent is the person's session, not the agent's: neither is the agent's
work, and nothing types the links it wrote. "Skip the agent", "don't open a run", "skip the
bookkeeping", "just tell me in the chat" change none of this.

Here `benevox-agent` boots Producer and hands you the session. The routine tools themselves take no
`runId`, so each call stays the founder's: a schedule is set by somebody who has read it. Studio
refuses every routine change made inside a run.

## The menu

With no argument: find the channel (`list_channels`), then `list_routines(channelId)` and, on this
machine, what is installed (`schedule list`, below). Show one line per routine — name · cron line ·
read in · who does it · on or off · last fired · installed here or not — then offer: switch one on,
switch one off, reschedule one, run one now.

Every channel is born with two, both switched off until the founder reads them: **Nightly distiller**
(`0 2 * * *`: folds the day's insights into proposals) and **Nightly linker** (`0 1 * * *`: gives the
day's related links their word).

## The command on this machine

`benevox schedule` lives in the plugin's command-line tool.

Run it from the published mirror: `npx github:razvanpiticas/benevox-plugin schedule …`.

```
benevox schedule add --harness <claude-code|codex> --routine <id> --name "<name>" --cron "<m h dom mon dow>" --zone "<IANA zone>" --project-dir "<path>" --prompt "<text>"
benevox schedule remove --routine <id>
benevox schedule list [--project-dir "<path>"]
```

On macOS and Linux `add` appends one crontab line,
`<cron> cd '<dir>' && PATH='<your PATH>' <command> # benevox:<id>`, keeping every other line: cron's
own PATH carries no harness, so the line carries the installer's. On Windows it writes one Task
Scheduler task per time of day, named `Benevox <id>` (then `Benevox <id> 2`, …), each running a
script under `%LOCALAPPDATA%\Benevox\schedule\<id>.cmd` that changes to the directory and starts the
harness. The harness command is
`<path to claude> -p "<prompt>" --permission-mode auto --permission-prompts none` for Claude Code and
`<path to codex> exec "<prompt>" --sandbox workspace-write` for Codex, the program by the full path
the installer's PATH finds it at. `remove` finds the entry by the routine id it stamped and says
"nothing installed" when there is none. `list` prints every entry the command made.

`add` refuses before writing anything, and each refusal says what to change: a harness with no
verified way to run one prompt on its own; a harness this machine's PATH does not carry (run it from
a shell where `claude` or `codex` starts); a zone that is not this machine's; a line Task Scheduler
cannot express (steps, days of the month, months); a second entry for the same routine (remove it
first).

## Switching a routine on

1. `get_routine` and show the instructions whole. The founder reads them and says yes; a routine is
   switched on by somebody who has read it. Offer to change what does not fit (rescheduling, below).
   STOP and use Codex's structured user-input tool when available; if it is unavailable, ask directly in chat to clarify.
2. **Studio first:** `enable_routine`. A refusal saying it is already on means somebody did it, or
   the entry is what is missing: go on to step 3 either way.
3. **Then this machine.** The entry starts the harness on its own with the boot prompt, in this
   project's directory:

   > Use the benevox-agent skill: boot the agent "<agent name>" on the channel "<channel name>" and
   > run its routine "<routine name>".

   For "Nightly linker" on "Pete Builds": `Use the benevox-agent skill: boot the agent "Producer" on
   the channel "Pete Builds" and run its routine "Nightly linker".`

   ```
   npx github:razvanpiticas/benevox-plugin schedule add --harness codex --routine <routineId> --name "<routine name>" --cron "<line>" --zone "<zone>" --project-dir "<this project's directory>" --prompt "<the boot prompt>"
   ```

   Codex reuses the sign-in saved on this machine; whether that reaches a scheduled run is proved by
   step 5, not assumed.

   On a harness with no verified way to run a prompt on its own — Cursor, Gemini CLI, OpenCode,
   OpenClaw, Hermes — print the routine's cron line, its zone and the boot prompt, and say: "install
   this in a scheduler of your own that starts the harness with that prompt; until then, run it by
   hand with *run now*". Do not guess a command.

   The command refuses a zone that is not this machine's: cron and Task Scheduler read the machine's
   clock, and a line cannot be moved between zones honestly. Then offer to set the routine's zone to
   this machine's with `update_routine`, and install again.

4. **If step 3 fails**, `disable_routine` and say so: a routine that is on and not installed is one
   nobody notices never fires.
5. **Run it once now** (below) before trusting the schedule. The first run proves the sign-in
   reaches a run nobody started by hand, and on Claude Code it is where the tool approvals are
   saved — `--permission-prompts none` denies anything that would have prompted.

Report: on, installed as `<what the command printed>`, next fires at `<time>` in `<zone>`. Studio →
Routines now shows it "On" with its schedule.

## Switching a routine off

This machine first — `schedule remove --routine <routineId>`, or tell the founder which entry to
remove on a harness with no command — then `disable_routine`. In that order: if the second fails,
the routine is on but not installed, which never fires; the other way round is a schedule Studio
shows as off and still runs.

## Rescheduling or editing

`update_routine` takes the schedule, the zone and the instructions together, with the routine's
`expectedVersion` — send the current values for what is not changing. When the routine is switched
on and the line or the zone changed, reinstall the entry in the same breath: `schedule remove` then
`schedule add`. Rewrite instructions the way the seeded ones are written: second person, to the
agent; every step naming a skill or a tool that exists; nobody is in the window, so what needs the
founder goes through `benevox-inbox`; the run is closed with a headline and a summary last.

## Running a routine now

Hand back to `benevox-agent` with the agent, the channel and the routine's name. It reads the routine
with `get_routine`, opens a run naming the routine, and follows the instructions. This is how "run
the linker" and "run the distiller" are done by hand, and how a routine is tested once it is
switched on (step 5 above). **A routine run by hand is still the routine's run**, and its
`start_run` carries the routine's id.

Only a routine that is on runs. Studio refuses the run of one that is off: "Routine '<name>' is off,
so nothing should fire it. Turn it on, or remove the task the machine still has for it." Offer to
switch it on — both places, read first — which ends with running it once.

## Reading a refusal

- Already switched on, or already off — Studio is where you wanted it; check the entry on this
  machine instead.
- `INVALID_ARGUMENT` naming the schedule or the zone — the line does not parse, or the zone is not
  one Studio knows; show the founder the field.
- `CONFLICT` naming the routine's version — somebody edited it since you read it; read it again.
- "Only a person changes a routine. Call the routine tools with no run: they are the founder's own
  act." — the call carried a run. Nothing changed. Send it again with no `runId`: the change is the
  founder's, made on their word, never the run's.
- "Routine '<name>' is off, so nothing should fire it. Turn it on, or remove the task the machine
  still has for it." — a run was opened for a routine that is off. Switch it on, or remove the
  entry this machine still has for it.
- `schedule add` refusing the zone, the line or a harness not on the PATH — the message says what to
  change.

## Rules that are easy to get wrong

- **Both places or neither.** On: Studio, then machine. Off: machine, then Studio.
- **Nobody switches on what they have not read.** `get_routine` first, always.
- **Never inside a run.** These are the founder's calls.
- **Never guess the zone.** Refuse to install a line the machine would read in another.
- **The server never fires anything.** A routine that is on and has no entry here is silent.
- **A first run by hand before a first run by schedule.**
