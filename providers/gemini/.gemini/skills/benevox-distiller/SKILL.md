---
name: "benevox-distiller"
description: "Distil the insights recorded on the method — the drafts runs left behind and the confirmed learnings on the niche operation, its procedures and the part descriptions — into one proposal per subject whose text should change, folding repeats together, escalating contradictions and never applying or rejecting anything. Use when the founder says \"distil the insights\", \"what did we learn about the Demand test\", \"clean up the insights\", when the Nightly distiller routine fires, or when a run's blockers were recorded and the founder asks what the method should say instead."
---

# Benevox distiller

Insights are the raw record of what went wrong with the method: a draft a run left after its
blockers, the founder's note, a confirmed learning. No skill reads them on its own. This skill is
the one that reads them on purpose, all together, and turns what they say into the one thing that
changes the method: a proposal — the whole new text of a procedure or a part description — that the
founder applies on Studio → Insights.

**Confirmed** means an insight whose `state` is `Open` and whose `reviewState` is `Approved`. A
person's insight is `Approved` as it is written; an agent's is `Draft` until the founder applies
its proposal, and an applied one is `Applied`, no longer `Open`. So a run's insight is never
confirmed: it is a **draft**. `list_insights` filters by state, not by review state: read the
`Open` rows and check `reviewState` on each.

It runs inside a run `benevox-agent` opened — the Nightly distiller's, or Producer's run when the
founder asked for it — and it works the same way whether or not anybody is watching, because nothing
it writes needs an answer in the chat. What needs the founder goes through `benevox-inbox`.

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

Here the run `benevox-agent` opens carries the routine's id when a routine is named, and step 1
never starts without its id: the pass is its record.

**Attended or not is a fact about the run**, never about how the prompt is worded: a routine id on
the run, or in the brief, means nobody is reading the reply. Then every question goes through
`benevox-inbox` — `raise_escalation`, recorded on the run with `observe_run` — and the pass does not
pause: it finishes its remaining subjects and hands its digest back, and the run is ended, never
paused. With no routine id, the founder is in the chat and reads the digest there as well.

## What it writes and what it never does

| It writes | It never does |
| --- | --- |
| a **proposal**: an insight carrying the whole new text of a procedure or a part description, written against its current version | apply, approve or reject a proposal — the founder's, on Studio → Insights |
| a **distilled statement**: one sharper insight on the operation, which carries no text — a pitfall, a niche it does not fit | change a procedure's or a part's text directly |
| `supersede_insight` on each insight a proposal or statement folds in | delete anything; superseding keeps the row and marks it |
| `contradict_insight` on a confirmed insight the founder said no longer holds | contradict on its own judgement, or because an insight is old |
| one escalation per pair of confirmed insights that cannot both hold; one listing the stale, per night | ask a question into the chat during the analysis, unattended |
| `observe_run` after each subject, and the digest it hands back | open or end a run; `benevox-agent` does both |
| a `Waiting:` line per proposal in the digest | escalate or message about a proposal: recording it files the founder's review in the inbox |

## The loop

1. **Scope.** A subject named → that subject only. "Since the last run" → the moment: unattended,
   the routine's previous firing — the start of the newest run in `list_runs(channelId)` carrying
   the routine's id, other than the one you are in (`get_routine`'s last firing is this run's own
   start); the first night, seven days ago, and say so in the digest. By hand, the founder's window;
   "since the last run" is the last Completed run of the Nightly distiller in `list_runs`, else
   seven days.
2. **Read.** `list_insights(channelId, subjectKind?, subjectCode?, state?)` for the operation's and
   the procedures' insights; `list_insights(subjectKind: "PartDescription")`, with no `channelId`,
   for the part descriptions', which belong to the organisation and never to a channel. The list has
   no date filter: a row is in the window when its `createdAtUtc` is. Read open ones and the rest
   alike — applied, superseded, rejected and contradicted are context, never input; among the open
   ones, `reviewState` tells a confirmed insight from a draft. `get_insight` for a body the list cut
   short. **An answer that says more matched has not read the window**: the list carries at most 50
   and counts the rest. Read again in narrower pieces — one subject at a time, one state at a time —
   and name in the digest what the pass could not read.
3. **Read the subject's current text**, once per subject with insights:
   [reference/subjects.md](reference/subjects.md) says which tool. A proposal is written against the
   text as it is now, and against its current version.
4. **Read the runs behind an insight** when its body names one: `get_run`, or `get_history` on the
   run for what it wrote. Do not read every run: read the ones an insight points at.
5. **Analyse**, per subject, by [reference/analysis.md](reference/analysis.md): what recurs, what
   contradicts, whether the subject's text should say something else, and what.
6. **Write**, per subject, in this order, every call carrying `runId`:
   - the proposal or the distilled statement, through the subject's own record tool, its body
     naming every insight and run it drew on;
   - then `supersede_insight` for each insight it folds in — the newer one must exist first, and of
     the same subject; an insight the founder rejected is left alone;
   - then `contradict_insight` on every confirmed insight the founder's answer to an earlier
     escalation named as no longer holding (the brief's resolved escalations carry it; `benevox-agent`
     hands it over).
7. **Escalate**, through `benevox-inbox`, unattended: one escalation per pair of confirmed insights
   that cannot both hold; one per night listing every stale confirmed insight. Never one for a
   proposal: recording it already filed its review in the founder's inbox, and a second item about
   one proposal is one too many. Record each escalation on the run with `observe_run`. Attended, say
   the same in the chat instead.
8. **Observe and hand back.** `observe_run(note)` after each subject: what was read, what was
   written. At the end, the digest (analysis reference), handed to `benevox-agent` for `end_run`'s
   summary, with one `Waiting:` line per proposal and per escalation that waits on the founder.
   The run this pass works in is ended, never paused, before you stop; "leave it open in case I
   want more" is refused — more is the next run. When a routine fired it, Studio files its headline
   and summary in the founder's inbox as the run's report: send no message about it.

## Where the proposal lands

A proposal is an insight with the proposed text and the version it was written against. Recording
it inside the run files an insight review in the founder's inbox in the same save — a procedure's
on its channel, a part description's on the channel of the run that proposed it — so you send
nothing about it. The founder opens it on Studio → Insights, reads the before and after, and
presses "Apply": the procedure becomes the channel's own copy at the next version, and the proposal
and every insight it superseded show "Applied in version n". When the founder has saved the text
by hand since, "Apply" refuses with "The procedure changed since this was proposed. Ask the
distiller for a new proposal." — the next pass writes a new one against the new text. Until the
founder applies it, nothing has changed, and you never say it has.

## Reading a refusal

The `benevox` skill's table, plus:

- A proposal refused on the operation — the operation carries no text; write a distilled statement
  with a pitfall or a niche instead.
- `supersede_insight` refused because the newer insight is not on the same subject — record it again
  where the older one is, then supersede.
- `CONFLICT` on `contradict_insight` — already contradicted or superseded; leave it.
- "This run has ended, been paused or belongs to someone else. Nothing was written; start a new
  run." — stop, and let `benevox-agent` open a new one. Never write outside a run.

## Rules that are easy to get wrong

- **A proposal is the whole text**, with the change in place, not a diff and not the paragraph that
  changes. A fragment applied is a procedure with a hole in it.
- **One proposal per subject per pass.** Two insights on the Demand test become one proposal on the
  Demand test.
- **Never invent an insight.** Every statement in a distillate traces to an insight or a run you
  read, named in its body. A pass that finds nothing to fold says so.
- **The founder's word on a contradiction is read, not guessed.** Until it arrives, both stand.
- **A subject you cannot resolve is worth a question — in a session, where somebody is reading.** Put it
  to them and wait for the answer. Ask the user directly to clarify what you cannot infer. Unattended there is nobody to ask: leave that subject, name it in the digest
  under what the pass could not read, and carry on with the rest.
