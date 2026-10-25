---
name: "benevox-niche"
description: "Pick a niche — run the channel's niche operation with the founder end to end: read the operation and its procedures as this channel has them, open a run on the draft niche, follow each procedure in order with the founder (founder's skills and likes, the potential niches shortlist, promise statements and keywords, markets' need and pay with the watch channels, the TAM and the pick, subsegments and value propositions), write what it produces inside the run, checkpoint after every procedure, go back to an earlier procedure when the founder wants to, pause or end with a headline, and say when the draft is ready for the founder to make current. Use when the founder picks \"Pick a niche\" from the Benevox menu, says \"pick a niche\", \"continue the niche\", \"work on the draft niche\", \"go back to the shortlist\", or asks for the niche operation to be run. Attended only; a founder's request reaches it through benevox-agent, which boots the agent the run is recorded under."
---

# Benevox niche

**Pick a niche** (`youtube-niche`) is the method's first operation: from the founder's skills and
likes, through potential niches, a shortlist of three, promise statements tested against outlier
videos and a sized market, to one picked niche with a beachhead segment, value propositions whose
promise groups prove the demand, and the channel's watch channels — the channels behind that
demand. What it does, in which order and what "validated" means are rows the server holds, and
`get_operation` answers them as this channel has them — the shipped text, or the channel's own copy
when the founder customised it on Studio → Method. This skill carries none of that. It carries the
order of the calls, the run, and where each procedure's output lands.

Every write on the niche or a watch channel goes through the `benevox-studio` skill's rules: the
version, the run id, the refusals. A question about what was decided before goes through
`benevox-search`.

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
   the validated-when sentences and its threshold (`min-demand-channels`), what to do if not, the
   procedures in order — each by code, name, source (shipped or customised) and version, never its
   text — and a resumable run.
   Read the description and the validated-when first: they frame every procedure. A resumable run
   means a session paused this operation — go to [Resuming](#resuming).
2. **Read the draft.** `get_niche` on the channel's draft when there is one (the brief or
   `get_channel` names it). Its readiness lists every blocker standing before Make current, in
   order; its procedures say which are done.
3. **Open the run.** `start_run(agentId, channelId, operationCode: "youtube-niche")`. The server
   opens it on the channel's draft niche, making an empty draft when there is none — it keeps the
   current niche's founder's skills and likes — and leaving the current niche untouched. Keep the
   run id: every write from here carries it as `runId`. The channel screen now shows the draft's
   progress at "0 of 5 procedures": done of the procedures the operation lists.
4. **Do the procedures, in order, one at a time.** For each procedure the operation lists that the
   run has not checkpointed:
   - Read its instructions in full with `get_procedure(code, channelId)`: `get_operation` lists the
     procedure, it never carries its text. Read the part descriptions the instructions name
     (`get_part_description`: `potential-niche`, `promise-statement`, `promise-group`,
     `watch-channel` and the rest): they say what each part is for, as this organisation has it.
   - Work it **with the founder**: ask what the procedure asks them, propose what it produces, and
     show the proposal before writing. Ask the user directly to clarify what you cannot infer.
   - Write what the founder agreed with the calls in
     [What each procedure writes](#what-each-procedure-writes), each with `runId` and the version
     the last read or write answered; keep what the writes answered.
   - `checkpoint_run(runId, procedureCode, note)` straight after. The note is one line: what was
     written. The progress then reads "1 of 5 procedures", "2 of 5", and so on. A checkpoint is
     refused while the niche lacks what the procedure must leave on it — see
     [Reading a refusal](#reading-a-refusal).
5. **Make current is the founder's.** When `get_niche` answers a readiness with no blocker, say the
   draft is ready and that "Make current" on the channel screen makes it the channel's niche; the
   old one moves to Past niches. No tool does it. While blockers stand, say every one as the
   readiness answered it, in its order — "Pick a beachhead segment; Demand from 3 or more channels
   for the beachhead's value proposition (2 so far)" — and which procedure works on each.
6. **Type the links.** Invoke `benevox-linker` with the run before ending or pausing it.
7. **Pause or end.** The founder stops before the last procedure → `pause_run(runId, headline,
   summary)`. Every procedure checkpointed → `end_run(runId, outcome: "Completed", headline,
   summary)`. The headline names the operation and where it stands — "Pick a niche: shortlist and
   promise statements written, market research next". The summary carries `Decided:` lines with the
   words settled (the shortlist, the picked potential niche and its promise statement, the
   beachhead), `Next:` the first unfinished procedure, `Waiting:` what waits on the founder.
8. **Report, then the blockers.** What was written, the procedures done of the operation's count
   ("4 of 5 procedures"), the readiness. Then what refused, what was missing, which procedure misled
   — and ask whether any is worth an insight: `record_procedure_insight` on the procedure that
   misled, `record_operation_insight` for a pitfall or a niche the operation does not fit.
   `list_insights` on the subject first. Only on the founder's word.

## What each procedure writes

The procedure's own text is the method; this section only says where its output lands, by the
procedure's code. Every niche write takes the niche's version and answers the whole niche; every
watch-channel write but `add_watch_channel` and `profile_watch_channel` takes the watch channel's
version and answers the whole watch channel. `update_niche`, `update_potential_niche`,
`update_promise_statement`, `update_watch_channel` and `update_watch_channel_offer` replace what they
write whole: send the current value of every field you are not changing.

| Procedure | Writes |
| --- | --- |
| `founders-skills-and-likes` | `update_niche` with `foundersSkillsAndLikes`: the founder's answers and the watch-history list, in their words |
| `potential-niches` | `add_potential_niche` per potential niche: name, rank (1 for the most unfair advantage, best first; the others move to make room), who it serves, the problem, how it makes money, the advantage. `update_potential_niche` with its `skillScore` (1–5) and `isLiked` once the founder answers. `shortlist_potential_niche` on each of the three the founder settles on — only one they like. Two the founder wants combined → `combine_potential_niches` with the combination written whole, its rank and its skill score; it is shortlisted when either part was. `remove_potential_niche` only for one that should never have been written |
| `promise-statements` | `add_promise_statement` under each shortlisted potential niche: the sentence, its audience, its problem, its method when there is one, and its ten keywords. `update_promise_statement` to revise one whole. The founder's brand decision → `get_channel`, then `set_channel_brand` (`OnPerson`, `Hybrid` or `Faceless`) with the channel's version |
| `markets-need-and-pay` | The outliers, the groups, the watch channels, their profiles and offers, the TAMs and the pick — [below](#markets-need-and-pay) |
| `niche-subsegments-and-value-propositions` | `add_segment` with its market type; `add_segment_item` for each job (kind, importance), pain (severity) and gain (relevance), each with a status. `add_value_proposition_from_promise_group` for each proven promise group of the picked potential niche, with the segment it serves; `add_proposition_item` for its formats, series and offers (`ProductOrService`), pain relievers (each pointing at a pain of that segment), gain creators (each pointing at a gain of that segment), dream outcome, enhancers and names. `set_beachhead` on the segment to win first. Then the watch channels — [below](#settling-the-watch-channels) |

Statuses are honest: `Confirmed` only with evidence in hand, `Inferred` for what you reasoned,
`Hypothesis` for a guess the founder has not checked.

### Markets' need and pay

In the order the procedure gives:

- **Outliers.** `search_youtube_videos` for each promise statement with its keywords,
  `longFormOnly: true`, and the criteria the procedure names. `sort` is required on every search:
  `MostViewed` when the procedure asks for the most viewed, `Relevance` otherwise. Which passing
  videos to keep, and why one passes for the wrong reason, is yours and the founder's to judge;
  Studio only stores, counts and says proven.
- **Promise groups.** `add_promise_group` under the shortlisted potential niche for each promise its
  keepers make the viewer. `add_promise_group_outlier` for each keeper: the group, the video's
  `libraryPostId` as `postId`, the promise statement whose keyword found it and that keyword (the
  `foundBy` of the search answer, one of the statement's own keywords). That is the keeper saved
  with its statement and keyword. A video sits in one promise group per potential niche.
- **Watch channels.** `add_watch_channel` for each keeper's channel: the own `channelId`, its YouTube
  channel id, handle, title, page, language and created date, and what found it — the shortlisted
  potential niche, the promise statement and the keyword. A channel the own channel already keeps
  only files what found it this time. The search answers each keeper's channel by its YouTube
  channel id (`youTubeChannelId`), title and handle (`channelHandle`), but not its page, language or
  created date: read those on the channel's YouTube page (its About panel shows the created date),
  or ask the founder. Never guess one.
- **The channel landscape.** `profile_watch_channel` once for each channel behind the niche's
  outliers and each of the biggest channels the TAM search turns up: one new dated snapshot of its
  size, performance and cadence; the watch channel's outliers are linked to it already. Studio has
  no field for a channel's cluster: say it to the founder and record it on the run with
  `observe_run`.
- **What they pay for.** `add_watch_channel_offer` for each thing a watch channel sells: what it
  sells, its price and members or buyers when the page says, the page it was read on and the day;
  `update_watch_channel_offer` or `remove_watch_channel_offer` to correct one.
- **How big (TAM).** `search_youtube_videos` with the potential niche's main term, `sort:
  MostViewed`, `longFormOnly: true`. The biggest channels it turns up are watch channels found by the
  potential niche and that term, with no promise statement. Read each one's profile with
  `list_watch_channels`, then `set_potential_niche_tam` on the shortlisted potential niche:
  `lowViewers` and `highViewers` (a range of views per video, never one figure), `evidenceNote`,
  `adjacentNiches`, and the `watchChannelIds` and library `videoIds` it rests on — at least one.
- **The pick.** `get_niche` answers the three side by side: each shortlisted potential niche's
  outliers, distinct channels, proven promises, its watch channels' offers and its TAM, and each
  promise statement's on-topic outliers, distinct channels and proven promises. Show them to the
  founder. `pick_potential_niche` with the potential niche and the promise statement the founder
  picks: it copies the statement with its audience, problem, method and keywords, the TAM range,
  its evidence note and the adjacent niches onto the niche. Then `update_niche` with the short
  confidence note, every other field as the pick answered it. A combination of two at the pick:
  `combine_potential_niches`, then `set_potential_niche_tam` on the combination, then
  `pick_potential_niche` — a combination has no TAM until one is written.

**Proven** is per promise group: its outliers come from `minDemandChannels` distinct YouTube
channels or more. `get_niche` answers the number the channel has, so never assume 3; many outliers
from one channel count once. A value proposition made from a group carries the group's distinct
channels and the watch channels behind them, and an outlier added to the group later joins it.
Make current needs the beachhead's value proposition at `minDemandChannels` or more.

### Settling the watch channels

`list_watch_channels` lists the channel's watch channels, each with its latest profile;
`get_watch_channel` reads one whole, with what found it. For the picked niche:

- `set_watch_channel_role` — `Competitor`, `Inspiration` or `Adjacent`, from the evidence; left out
  clears it.
- `link_watch_channel` to each value proposition or segment its outliers prove — one of the two per
  call; `unlink_watch_channel` takes a link away.
- `set_watch_channel_monitoring(isMonitored: false)` on each one found only by potential niches
  that were not picked. Its profiles, offers and outliers stay; a watch channel is never deleted.
- Show the founder the list: they may change any role or stop monitoring any channel, here or on
  the channel's Watch channels tab.

### When YouTube does not answer

**A search or a profile YouTube refused** answers "YouTube refused the search. Nothing was written;
try again in a few minutes." Say so, `observe_run` it, and either wait a few minutes and send it
once more or pause the run with markets' need and pay as `Next:`.

**An answer in a shape Studio cannot read** is UPSTREAM_UNAVAILABLE with Studio's sentence naming
the source and the call, ending "is not in the shape Studio reads: …. Nothing was written." Do not
send it again: it fails the same way until Studio is updated. Tell the founder the sentence,
`observe_run` it, and pause the run with markets' need and pay as `Next:`.

**A channel YouTube does not have** — `profile_watch_channel` answers NOT_FOUND, "YouTube has no
channel UC…. It answered "…"; nothing was written." The watch channel was added with a wrong
YouTube channel id, and no tool rewrites one. Tell the founder, read the right id on the channel's
page, `add_watch_channel` with it, and `set_watch_channel_monitoring(isMonitored: false)` on the
wrong one.

Each passing video says which source read its facts (`factsReadFrom`); the answer names the
platform's setting (`factSource`) and whether its fallback was used (`fallbackUsed`).

## Going back

The founder may want to go back to an earlier procedure: the operation's "if not" sends a niche
with no proven demand back to the shortlist, or the founder changes their mind. On the founder's
word, `reopen_procedure(runId, procedureCode)` in the same run. That procedure and every finished
one after it are unfinished again; everything written on the niche stays. Four procedures done,
going back to `potential-niches` → the progress reads "1 of 5 procedures".

Then work from that procedure again, in order: change what the founder wants changed — rewrite,
take off the shortlist, add what is new — rather than writing a second copy of what is there, and
checkpoint each procedure again as it is finished again. After the pick, the picked potential niche
cannot be removed or combined and stays on the shortlist; picking another pair later moves the
pick. Never open a second run to go back, and never `reopen_procedure` a procedure this run has not
completed: it is refused, naming it.

## Resuming

A resumable run in the operation, or the founder says "continue the niche": `get_run` on it and
read its checkpoints — each `Finished` or `Reopened` — then `start_run(agentId, channelId,
operationCode: "youtube-niche", resumedFromRunId)`. The new run carries the completed procedures
forward; carry on from the first procedure the paused run had **not** completed — after
`founders-skills-and-likes` and `potential-niches`, that is `promise-statements`, and the next
checkpoint reads "3 of 5 procedures". A procedure it reopened and did not finish again is not
completed. Never repeat a completed procedure: a repeated write is a duplicate on the niche.

## Reading a refusal

The `benevox` skill's table and `benevox-studio`'s, plus:

- "Pick a niche runs only with the founder present." — a routine fired this session. No run
  started; see [Attended only](#attended-only).
- "Producer is paused. Set it to Active on Studio → Agents to boot it." — say it as it came, stop.
- "This channel already has a draft niche. Finish or delete it first." — from `create_niche`; there
  is no need for it here, because `start_run` opens the draft. Continue the draft.
- "Shortlist exactly three potential niches before checkpointing Potential niches shortlist (2
  shortlisted)." — `checkpoint_run` on `potential-niches`: settle the shortlist at three with the
  founder, then checkpoint again.
- "Every shortlisted niche needs 3 promise statements with 10 keywords each (8 of 9 complete)." —
  `checkpoint_run` on `promise-statements`: finish the statements and their keywords first.
- "<procedure name> is not checkpointed." — `reopen_procedure` on a procedure this run has not
  completed; `get_run` says which it has.
- "Write the TAM of <name> before picking it." — `set_potential_niche_tam` on it first.
- A checkpoint refused as already recorded — you repeated a procedure; nothing to do.
- "This run has ended, been paused or belongs to someone else. Nothing was written; start a new
  run." — resume with `resumedFromRunId`, as [Resuming](#resuming) says.

## Rules that are easy to get wrong

- **The operation is the method.** Read its description, its validated-when and every procedure's
  text in full before writing. Never run a procedure from memory of another channel.
- **One operation, one run.** Producer's plain run is not this run, and going back is
  `reopen_procedure` in this run, never a new one.
- **Checkpoint after every procedure**, with the procedure's code the operation listed.
- **Judging is yours and the founder's, counting is Studio's.** Keeping or dropping an outlier and
  judging its execution are yours; Studio counts distinct channels and says which promise is
  proven.
- **The founder agrees before you write**, and the founder alone makes the draft current.
- **Report what the tools answered**, never what you intended.
