---
name: benevox-niche
description: Pick a niche — run the channel's niche operation with the founder end to end: read the operation and its procedures as this channel has them, open a run on the draft niche, follow each procedure in order with the founder (sources, directions, skill, statement, customer segments, value propositions, demand test, TAM), write what it produces inside the run, checkpoint after every procedure, pause or end with a headline, and say when the draft is ready for the founder to make current. Use when the founder picks "Pick a niche" from the Benevox menu, says "pick a niche", "continue the niche", "work on the draft niche", or asks for the niche operation to be run. Attended only; a founder's request reaches it through benevox-agent, which boots the agent the run is recorded under.
argument-hint: <channel name> ["continue"]
allowed-tools: mcp__benevox__get_channel, mcp__benevox__get_niche, mcp__benevox__list_operations, mcp__benevox__get_operation, mcp__benevox__get_procedure, mcp__benevox__list_part_descriptions, mcp__benevox__get_part_description, mcp__benevox__start_run, mcp__benevox__checkpoint_run, mcp__benevox__observe_run, mcp__benevox__pause_run, mcp__benevox__end_run, mcp__benevox__get_run, mcp__benevox__list_runs, mcp__benevox__update_niche, mcp__benevox__add_direction, mcp__benevox__update_direction, mcp__benevox__remove_direction, mcp__benevox__pick_direction, mcp__benevox__add_segment, mcp__benevox__update_segment, mcp__benevox__retire_segment, mcp__benevox__set_beachhead, mcp__benevox__add_segment_item, mcp__benevox__update_segment_item, mcp__benevox__retire_segment_item, mcp__benevox__add_value_proposition, mcp__benevox__update_value_proposition, mcp__benevox__retire_value_proposition, mcp__benevox__add_proposition_item, mcp__benevox__update_proposition_item, mcp__benevox__retire_proposition_item, mcp__benevox__add_demand_evidence, mcp__benevox__remove_demand_evidence, mcp__benevox__set_video_strategy, mcp__benevox__search_youtube_videos, mcp__benevox__set_channel_brand, mcp__benevox__record_operation_insight, mcp__benevox__record_procedure_insight, mcp__benevox__list_insights, mcp__benevox__supersede_insight
---

# Benevox niche

**Pick a niche** (`youtube-niche`) is the method's first operation: from the founder's sources to a
draft niche with a beachhead segment, a value proposition for it, demand proven by outlier videos
from enough channels, and a sized market. What it does, in which order and what "validated" means
are rows the server holds, and `get_operation` answers them as this channel has them — the shipped
text, or the channel's own copy when the founder customised it on Studio → Method. This skill
carries none of that. It carries the order of the calls, the run, and what to do at each
procedure.

Every write on the niche goes through the `benevox-studio` skill's rules: the niche's version, the
run id, the refusals. A question about what was decided before goes through `benevox-search`.

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

Here the operation is the work, so what `benevox-agent` hands back is Producer's id, and step 3's
`start_run` carries that `agentId` with the operation's code. Step 1 never starts without an
`agentId`.

## Attended only

Pick a niche runs with the founder in the chat, and only then. A session a routine fired — the
brief names a routine, or the run you were handed carries a `routineId` — does not start it:
`start_run` would answer "Pick a niche runs only with the founder present." and no run starts. Do
not try. Inside the routine's own run, send one message through `benevox-inbox` saying the routine
asked for Pick a niche and that it waits for the founder, and hand back. The wording of the prompt
is not the test; the routine id is.

## The loop

1. **Read the operation.** `get_operation("youtube-niche", channelId)`. It answers the description,
   the validated-when sentence and its threshold (`min-demand-channels`), what to do if not, the
   procedures in order with their source (shipped or customised) and version, and a resumable run.
   Read the description and the validated-when first: they frame every procedure. A resumable run
   means a session paused this operation — go to [Resuming](#resuming).
2. **Read the draft.** `get_niche` on the channel's draft when there is one (the brief or
   `get_channel` names it). Its readiness says what blocks Make current.
3. **Open the run.** `start_run(agentId, channelId, operationCode: "youtube-niche")`. The server
   opens it on the channel's draft niche, making an empty draft when there is none and leaving the
   current niche untouched. Keep the run id: every write from here carries it as `runId`. The
   channel screen now shows the draft with "0 of 8 procedures".
4. **Do the procedures, in order, one at a time.** For each procedure the operation lists that the
   run has not checkpointed:
   - Read its instructions in full — `get_procedure(code, channelId)` when the operation's copy is
     cut short. Read the part descriptions the instructions name (`get_part_description`): they say
     what each part of a niche is for, as this organisation has it.
   - Work it **with the founder**: ask what the procedure asks them, propose what it produces, and
     show the proposal before writing. STOP and call the AskUserQuestion tool to clarify.
   - Write what the founder agreed through `benevox-studio`'s calls, each with `runId` and the
     niche's current version; keep what the writes answered.
   - `checkpoint_run(runId, procedureCode, note)` straight after. The note is one line: what was
     written. The draft then shows "1 of 8 procedures", "2 of 8", and so on.
5. **Make current is the founder's.** When `get_niche` answers a readiness with no blocker, say the
   draft is ready and that "Make current" on the channel screen makes it the channel's niche; the
   old one moves to Past niches. No tool does it. When a blocker remains, say it as the readiness
   answered it — "Demand evidence from 3 or more channels for the beachhead VP: 2 so far" — and
   which procedure works on it.
6. **Type the links.** Invoke `benevox-linker` with the run before ending or pausing it.
7. **Pause or end.** The founder stops before the last procedure → `pause_run(runId, headline,
   summary)`. Every procedure checkpointed → `end_run(runId, outcome: "Completed", headline,
   summary)`. The headline names the operation and where it stands — "Pick a niche: beachhead and
   VP written, demand test next". The summary carries `Decided:` lines with the words settled (the
   statement, the beachhead, the picked direction), `Next:` the first unfinished procedure,
   `Waiting:` what waits on the founder.
8. **Report, then the blockers.** What was written, the procedures done of eight, the readiness.
   Then what refused, what was missing, which procedure misled — and ask whether any is worth an
   insight: `record_procedure_insight` on the procedure that misled, `record_operation_insight` for
   a pitfall or a niche the operation does not fit. `list_insights` on the subject first. Only on
   the founder's word.

## What each procedure writes

The procedure's own text is the method; this table only says where its output lands.

| Procedure | Writes |
| --- | --- |
| Sources | `update_niche` with the sources note |
| Directions | `add_direction` per direction: who it serves, the problem, how it makes money, the advantage |
| Skill | `update_direction` with each direction's skill score 1–5, then `pick_direction` on the one the founder picks |
| Statement | `update_niche` with the statement, the audience, the problem, the method, the keywords |
| Customer segments | `add_segment` with its market type; `add_segment_item` for each job (kind, importance), pain (severity) and gain (relevance), each with a status; `set_beachhead` on the segment to win first |
| Value propositions | `add_value_proposition` for a segment; `add_proposition_item` for its products, pain relievers (each pointing at a pain of that segment), gain creators (each pointing at a gain of that segment), dream outcome, enhancers and names |
| Demand test | `search_youtube_videos` with the keywords and the criteria the procedure names; then for each passing video that shows demand for a value proposition, `add_demand_evidence` (the library video, the keyword that found it, its outlier observation) and `set_video_strategy` on that video with the value proposition and its segment, so it counts under that proposition |
| TAM | `update_niche` with the low and high viewers and the evidence for them |

Statuses are honest: `Confirmed` only with evidence in hand, `Inferred` for what you reasoned,
`Hypothesis` for a guess the founder has not checked.

**The demand verdict** is per value proposition: "4 outliers from 3 channels" — the evidence videos
linked to it, counted by distinct channel. Make current needs the beachhead's value proposition at
the operation's `min-demand-channels` or more; read the number from `get_operation`, never assume 3.

**A search YouTube refused** answers "YouTube refused the search. Nothing was written; try again in
a few minutes." Say so, `observe_run` it, and either wait a few minutes and send it once more or
pause the run with the demand test as `Next:`.

**A search whose answer changed** answers UPSTREAM_UNAVAILABLE with Studio's sentence naming the
source and the call, ending "is not in the shape Studio reads: …. Nothing was written." Do not send
it again: it fails the same way until Studio is updated. Tell the founder the sentence,
`observe_run` it, and pause the run with the demand test as `Next:`.

Each passing video says which source read its facts (`factsReadFrom`); the answer names the
platform's setting (`factSource`) and whether its fallback was used (`fallbackUsed`).

## Resuming

A resumable run in the operation, or the founder says "continue the niche": `get_run` on it and
read its checkpoints, then `start_run(agentId, channelId, operationCode: "youtube-niche",
resumedFromRunId)`. The new run carries the completed procedures forward; carry on from the first
procedure the paused run did **not** checkpoint — after Sources, Directions and Skill, that is
Statement, and the next checkpoint shows "4 of 8". Never repeat a checkpointed procedure: a repeated
write is a duplicate on the niche.

## Reading a refusal

The `benevox` skill's table and `benevox-studio`'s, plus:

- "Pick a niche runs only with the founder present." — a routine fired this session. No run
  started; see [Attended only](#attended-only).
- "Producer is paused. Set it to Active on Studio → Agents to boot it." — say it as it came, stop.
- "This channel already has a draft niche. Finish or delete it first." — from `create_niche`; there
  is no need for it here, because `start_run` opens the draft. Continue the draft.
- A checkpoint refused as already recorded — you repeated a procedure; nothing to do.
- "This run has ended, been paused or belongs to someone else. Nothing was written; start a new
  run." — resume with `resumedFromRunId`, as [Resuming](#resuming) says.

## Rules that are easy to get wrong

- **The operation is the method.** Read its description, its validated-when and every procedure's
  text in full before writing. Never run a procedure from memory of another channel.
- **One operation, one run.** Producer's plain run is not this run.
- **Checkpoint after every procedure**, with the procedure's code the operation listed.
- **The founder agrees before you write**, and the founder alone makes the draft current.
- **Report what the tools answered**, never what you intended.
