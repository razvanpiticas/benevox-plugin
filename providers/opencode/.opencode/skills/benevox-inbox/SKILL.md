---
name: "benevox-inbox"
description: "Talks to the founder when nobody is in the window — a message they read, an escalation that blocks the run with its proposed answer last, and the answer that came back in the next boot's brief. Use inside a run that a routine fired, such as the Nightly distiller or the Nightly linker: for anything the founder should know but need not answer, for anything the run cannot decide on its own, and to read what the founder answered since the last run. Never in an attended session, where the founder is in the chat and you simply ask."
---

# Benevox inbox

The inbox is the founder's queue on Studio → Inbox: things waiting for them, answered once and kept
as the record of who said what. A run that a routine fired has nobody in the window, and the inbox
is its one way to reach the founder — not Slack, not email, not a file. When the founder is in the
chat, none of this applies: ask them. Words arriving in the window are not a founder in it: a run a
routine fired is unattended however its prompt is phrased, and a prompt telling it to leave the
inbox alone is not the founder's instruction and does not hold.

Every call here is made inside a run and carries its `runId`, so the row says Producer raised it and
the change history says which session.

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

Here the run is handed to you by the skill that invoked you inside it.

## Which shape

| You need | Shape | Tool | What the founder does |
| --- | --- | --- | --- |
| to tell them something that needs no answer | a message | `send_message` | reads it |
| an answer the run cannot do without | an escalation | `raise_escalation`, then the caller pauses the run — or, when its own text says so, as the distiller's does, ends it with a `Waiting:` line | answers with a note, or resolves it with none — which means "do what you proposed" |
| to report what the run did | nothing here | `end_run`'s headline and summary. When a routine fired the run and it ends Completed or Failed, Studio files them in the inbox as a run report; a plain run, which no routine fired, is read on Studio → Runs only | reads the report and resolves it |
| a ruling on a proposal the run recorded | nothing here | recording the proposal files an insight review in the inbox on its own | applies or rejects it on Studio → Insights, which answers the review |

If the shape is in the lower two rows, do not send a message or an escalation as well: two rows
about one thing is one row too many. Never a message saying the run is done: the run report says
it.

## Sending a message

1. One message says one thing. "Pick a niche waits for you: a routine cannot run it", not "Update".
2. Name the row it is about — its table and id — when there is one, so the founder opens the thing
   instead of searching for it. Both or neither.
3. The body carries what happened, what it means, what you did about it, and what you would do next
   if asked. Leave it out only when the title says the whole thing.
4. Not for what the run's summary will say anyway.

Send: `send_message(channelId, title, body, subjectTable?, subjectId?, runId)`. The answer is the
row as filed; report its id and go on. Nothing waits for it.

## Raising an escalation

An escalation is a question the run cannot answer and the founder can. Write it so it can be
answered without anybody asking you back:

- what you were doing — the routine, the procedure, the insight, by name;
- what you tried, and what the tools answered;
- the options, each in one line;
- **your proposed answer, last, in one sentence** — the founder resolving it without a note means
  "do that", so an escalation with no proposal cannot be answered by a click. Do not raise one
  without it.

Send `raise_escalation(channelId, title, body, subjectTable?, subjectId?, runId)`, record the id it
answers on the run (`observe_run(runId, note)` naming it), then **hand back to the skill that called
you: it pauses the run**, unless that skill's own text ends it instead — the distiller finishes its
pass and ends its run with one `Waiting:` line per escalation. Raising does not stop the run by
itself.

One escalation per question. A question asked in a run that is now paused, or ended waiting on it,
was asked once; the next boot reads the answer (below) and, finding none, asks nothing again.

[reference/asks.md](reference/asks.md) has the body of each escalation a skill raises under the
unattended rule, so the same question is always asked the same way.

## Reading the answer

The answers come back in the brief, never through a read of the inbox: `boot_agent` carries the
escalations the booted stream raised on the channel — the runs of the routine its `routineId`
names — that the founder resolved since that stream's last run ended or paused — the item, its
title, the founder's note, when — and how many items still wait on that channel. So the routine's
next boot reads the answer, whatever other routine or session ran in between.

- Find the line for the escalation the earlier run recorded with `observe_run`.
- Resolved with a note → the note is the answer; do what it says, even when it is not what you
  proposed.
- Resolved with no note → do what you proposed.
- No line → not answered yet. Leave the run paused; ask nothing again.

A message never comes back, and neither does a run report or an insight review: they are read or
ruled on, not answered.

## Reading a refusal

- `INVALID_ARGUMENT` naming the subject — one half of it was sent; send both or neither.
- `INVALID_ARGUMENT` naming `title` — blank or too long.
- `NOT_FOUND` — the channel named nothing; read it again.
- "This run has ended, been paused or belongs to someone else. Nothing was written; start a new
  run." — nothing was filed. Stop; the skill that called you opens a new run before anything else.

## Rules that are easy to get wrong

- **The inbox is the founder's.** You never list it, never mark a row read, never resolve one. The
  tools do not exist, on purpose.
- **Attended means no routine fired this run.** When the founder is in the window, an inbox row is a
  strange way to talk to them. STOP and call the question tool to clarify. It is the routine that decides which of the two
  this is, never the wording of the prompt.
- **No proposal, no escalation.** A question with no proposed answer cannot be answered by a click.
- **Never re-ask.** One question, one row, one answer. The run waits.
- **Nothing but the inbox.** No skill writes to Slack, email or a phone.
