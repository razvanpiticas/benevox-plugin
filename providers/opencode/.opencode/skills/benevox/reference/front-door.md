# The front door, line by line

Load this when writing the status, choosing the next action, or printing the menu. The skill
carries the six steps; this carries what each line is read from.

## The five status lines

Every line is read from the boot brief `boot_agent` answered, or from the one call the line names.
None is written from memory of an earlier session.

| Line | Read from | Say |
| --- | --- | --- |
| Where the channel stands | the brief's channel and its niches (current, draft, past) and brand decision; for a draft, `get_niche` on it for its readiness | "Pete Builds: current niche 'I help developers with a day job ship a product'. A draft is open: 3 of 8 procedures done; Make current waits on 'Pick a beachhead segment.' Brand: On me." No niche at all: "Pete Builds has no niche yet." No brand decision: "No brand decision yet." |
| Where we left off | the brief's where-we-left-off: the last ended or paused run's headline, its `Next:` and `Waiting:` lines, up to three earlier headlines, the paused runs | "Last session: 'Video 12 thumbnails: 3 candidates' — Next: pick the thumbnail. Waiting: founder records the intro. Before that: …. Paused: 'Pick a niche — waiting on the TAM'." A first boot: "No earlier sessions on this channel." |
| What changed since | the brief's changes since the last run ended, grouped by subject | "Since then: 3 changes to Video 12, 1 to the draft niche." Nothing: "Nothing changed since the last session." |
| What waits for you | the brief's inbox count — the items waiting on this channel — and the escalations your own sessions raised on this channel, resolved since your last session, each with the founder's note. A routine's answers go to that routine's next boot. Messages, run reports and insight reviews never come back in it | "2 things wait in Studio → Inbox for Pete Builds. You answered 'Which Demand test insight holds?': the newer one." Nothing: "Nothing waits in your inbox for Pete Builds." |
| The videos | the brief's videos by stage | "Videos: 2 ideas, 1 in scripting, 4 published." None: "No videos yet." |

## The next-action rule

From the lines above, the first that applies:

1. A paused run whose escalation was answered → "Resume the paused run '<headline>': the answer is
   in." — the skill that run belongs to (`benevox-niche` for a Pick a niche run).
2. A paused Pick a niche run, unanswered or not waiting on anything → "Continue Pick a niche at
   <first unfinished procedure>." — `benevox-niche`.
3. A draft niche with no paused run → "Continue the draft niche: <first unfinished procedure>." —
   `benevox-niche`.
4. No current niche and no draft → "Pick a niche for <channel>: nothing aims your videos yet." —
   `benevox-niche`.
5. The last run's `Next:` line → that sentence, and the skill that does it.
6. Otherwise → "Nothing is waiting; say what to work on."

Say the sentence, name the skill, ask "Do it now?" and wait for the answer.

A routine's run reaches the founder on its own: when it ends Completed or Failed, Studio files its
headline and summary in the inbox as the run report, and it counts among what waits. A plain run
is read on Studio → Runs. Neither is sent as a message.

## The menu

Seven lines, in the order a founder meets the work. Each line's words are the first words of the
named skill's own description, so the two cannot disagree: the build refuses a line that names no
skill or whose skill's description does not start with its words.

```
What else I can do:
 1. Pick a niche                       — benevox-niche
 2. Read or write the niche by hand    — benevox-studio
 3. Find what we decided or know       — benevox-search
 4. Distil the insights                — benevox-distiller
 5. Type the links                     — benevox-linker
 6. Routines: switch on, run now       — benevox-routines
 7. Update the plugin                  — benevox-update
Or just say what you want written or read on the channel.
```

Every line goes through `benevox-agent`, which boots Producer and invokes the named skill inside
its session. `benevox-inbox` is not a line: it is how an unattended run reaches the founder, never a
thing a founder picks.
