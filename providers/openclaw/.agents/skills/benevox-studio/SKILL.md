---
name: "benevox-studio"
description: "Read or write the niche by hand. Reads and writes a Benevox channel's niche and watch channels through the Benevox MCP tools — the draft, current and past niches, the founder's skills and likes, potential niches with the shortlist, combinations, their TAMs and the pick, promise statements, promise groups and their outliers, customer segments with jobs, pains and gains, value propositions made from a promise group with their products, pain relievers and gain creators, the channel's watch channels with their profiles, offers, roles and links, the channel's brand decision, a video's strategy and the YouTube library search — and the mechanics of runs. The low-level skill every other Benevox skill reads and writes the niche through: it knows the write loop, the versions, the run id and the refusals, and nothing of the method. Use it for any read or write on a channel, a niche, a watch channel, a video's strategy or the library, whoever asks for it."
---

# Benevox studio

A channel's **niche** is what its videos aim at: the founder's skills and likes, the potential
niches weighed on the way — ranked, three shortlisted, one picked with one of its promise
statements — the promise statements and the promise groups of outlier videos that prove a promise,
the customer segments with their jobs, pains and gains, the value propositions each made from one
promise group, and the TAM. A channel holds at most one **draft**, at most one **current** niche,
and any number of **past** (superseded) ones. Beside its niches, a channel keeps its **watch
channels**: channels of someone else behind the demand, kept to learn from and to monitor, whatever
niche is current. Every call is made as the signed-in founder inside their own organisation — the
connection is the `benevox` skill's job; this skill is about what to write and how.

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

Here the run is handed to you by `benevox-agent` or by the skill that invoked you inside it, and
every write carries its id.

## The loop every write follows

1. **Find the channel.** `list_channels`, or `get_channel` when you hold its id. The channel answers
   its niches by state, its brand decision and its version.
2. **Read before you write.** `get_niche` answers the niche whole: its own fields; the
   `minDemandChannels` a promise group needs to be proven; the procedures of the operation run on
   it, each done or not; its potential niches best rank first, each with its TAM, its outliers,
   distinct channels and proven promises, its promise statements with their counts, its promise
   groups with their outliers and whether each is proven, and what its watch channels sell; its
   segments with their items; its value propositions with their items, their distinct channels and
   the watch channels behind them; its readiness; and its **version**. `list_watch_channels` lists
   the channel's watch channels and `get_watch_channel` reads one whole, with **its** version.
   Reading first is how you avoid writing a duplicate and how you learn the ids to address.
3. **Write with the version you read.** Every write on a niche — the niche's own fields and every
   part of it — takes `expectedVersion`, the niche's version, and answers the whole niche with the
   new version. Every write on a watch channel — what you typed about it, its role, its monitoring,
   its offers, its links — takes the watch channel's version and answers the whole watch channel;
   `add_watch_channel` and `profile_watch_channel` take none. Carry the answered version into the
   next write. Two writes in a row against the same version means the second is refused as stale:
   re-read, decide again from what Studio says now, and send once more.
4. **Report what the tool answered**, by name — the potential niche "AI factory in public", the
   value proposition "Your agents build while you're at work" — never what you intended. A refusal
   changed nothing unless its message says otherwise.

**`runId` on every write.** Inside a run, send the id `start_run` answered on every write until that
run ends, so the change history records the write against Producer and that run. A write without it
is recorded as the founder's own, so it is never left out — except on `cancel_run`, the founder's
own act (below). A write refused with "This run has ended, been paused or belongs to someone else.
Nothing was written; start a new run." is not retried without a run: the calling skill opens a new
one.

## Addressing

Writes take the ids a read answered: the channel's, the niche's, a potential niche's, a promise
statement's, a promise group's, a segment's, a segment item's, a value proposition's, a proposition
item's, a watch channel's, an offer's, and a library video's `libraryPostId` from
`search_youtube_videos`. People speak in names and Studio answers ids; find the id by the name in
`get_niche` or `get_watch_channel`, never guess one and never ask the founder for one.

## The parts of a niche, and what each takes

What each part is **for** is its part description: `list_part_descriptions`, then
`get_part_description` on the one you are about to write. Read it before the first write of that
part in a session; the organisation may have customised it.

| Part | Write | Fields |
| --- | --- | --- |
| The niche | `create_niche` (a new empty draft on the channel; it keeps the current niche's founder's skills and likes), `update_niche`, `delete_niche` | founder's skills and likes, promise statement, audience, problem, method, keywords, TAM low and high viewers, TAM evidence, adjacent niches, confidence note — all optional while it is a draft. `update_niche` replaces them all: send the current value of every field you are not changing. The pick writes the promise statement with its audience, problem, method and keywords, the TAM and the adjacent niches for you |
| A potential niche | `add_potential_niche`, `update_potential_niche`, `remove_potential_niche` | name (its short title), rank (1 the best; ranks stay 1 to n, so adding or re-ranking one moves the others a step), who it serves, the problem, how it makes money, the advantage, a skill score 1–5 and whether the founder likes it — the last two may wait until the founder is asked. Each goes in its own field. At most ten. An update sends it whole. Removing one takes its promise statements, promise groups and TAM with it, and is refused once a potential niche is picked |
| The shortlist | `shortlist_potential_niche` | `isShortlisted`. Only one the founder likes goes on, three at most; the picked one stays on; taking one off keeps its promise statements |
| A combination | `combine_potential_niches` | the two potential niches, and the combination written whole: name, rank, who it serves, the problem, how it makes money, the advantage, skill score. It names both, carries both parts' promise statements, promise groups and their watch channels' findings, is shortlisted when either part was, and has no TAM until one is written. Refused once a potential niche is picked |
| A TAM | `set_potential_niche_tam` | on a shortlisted potential niche: `lowViewers` and `highViewers` (views per video, low never above high), the evidence note, the adjacent niches, and the `watchChannelIds` (this channel's watch channels) and library `videoIds` it rests on — at least one. Writing it again replaces it |
| The pick | `pick_potential_niche` | a shortlisted potential niche whose TAM is written, and one of its own promise statements. It copies the statement with its audience, problem, method and keywords, and the TAM range, its evidence note and the adjacent niches, onto the niche. One pair is picked; picking another moves it; picking the same pair again refreshes what was copied |
| A promise statement | `add_promise_statement`, `update_promise_statement` | under a shortlisted potential niche: the sentence, its audience, its problem, its method (optional) and up to ten keywords — complete with ten. At most three per shortlisted potential niche. An update sends it whole |
| A promise group | `add_promise_group` | under a shortlisted potential niche: the promise its outliers make the viewer, in a line |
| An outlier | `add_promise_group_outlier` | the promise group, the library video's `libraryPostId` as `postId`, the promise statement of the group's potential niche whose keyword found it, and that keyword. A video sits in one promise group per potential niche. A group is proven once its outliers come from `minDemandChannels` distinct YouTube channels; many from one channel count once |
| A customer segment | `add_segment`, `update_segment`, `retire_segment`, `set_beachhead` | name, description, market type (`MassMarket`, `NicheMarket`, `Segmented`, `Diversified`, `MultiSidedPlatform`), status. One segment is the beachhead; setting another moves the badge |
| A segment item | `add_segment_item`, `update_segment_item`, `retire_segment_item` | kind `Job`, `Pain` or `Gain`; text; a job's kind (`Functional`, `Social`, `Emotional`, `Supporting`); a rating `VeryLow` to `VeryHigh` — a job's importance, a pain's severity, a gain's relevance; status |
| A value proposition | `add_value_proposition_from_promise_group`, `update_value_proposition`, `retire_value_proposition` | the promise group of the picked potential niche it is made from, the segment it is for, the statement, status. One live value proposition per promise group. Its demand is that group's outliers, now and as more are added: `get_niche` answers their distinct channels and the watch channels behind them |
| A proposition item | `add_proposition_item`, `update_proposition_item`, `retire_proposition_item` | kind `ProductOrService`, `PainReliever`, `GainCreator`, `DreamOutcome`, `Enhancer` or `Name`; text; a pain reliever names the pain it relieves, a gain creator the gain it creates — each **of the proposition's own segment** |
| The brand | `set_channel_brand` | `OnPerson` (the screen says "On me"), `Hybrid` or `Faceless`; the channel's version |
| A video's strategy | `set_video_strategy` | the value propositions and the segments the video serves — at least one of each, all of one niche — no version: the library video's strategy is the organisation's own. The set is replaced whole. It is not a value proposition's demand: that is its promise group's outliers |

A choice word is spelled exactly as above; a misspelt one is refused naming the field and the words
that would have worked.

## Watch channels, and what each write takes

| Part | Write | Fields |
| --- | --- | --- |
| A watch channel | `add_watch_channel`, `update_watch_channel` | add: the own `channelId`; the found channel's YouTube channel id (`UC` and 22 more characters, never one of the organisation's own), handle, title, page (a full `https://` URL), the language its videos are made in (`en`, `pt-BR`) and its created date (`YYYY-MM-DD`); and what found it — a shortlisted potential niche, the promise statement whose keyword found it (none for the potential niche's main term) and the keyword. No version. A channel the own channel keeps already only files what found it this time; the same finding twice changes nothing. A new one is monitored and has no role. Update: the page, the language and the created date, whole |
| Its role | `set_watch_channel_role` | `Competitor`, `Inspiration` or `Adjacent`; left out clears it. It stays on the channel whatever its role |
| Monitoring | `set_watch_channel_monitoring` | `isMonitored`. Stopping keeps its profiles, offers, links and outliers. No tool deletes a watch channel |
| A profile | `profile_watch_channel` | the watch channel only, no version. Reads its YouTube channel through the platform's fact source and adds one dated snapshot — subscribers (empty when hidden), videos, views, created date, median and highest views of its 15 newest long-form uploads at least 7 days old, uploads in the last 30 and 90 days, long-form and Shorts. Earlier snapshots stay as they were. It reads YouTube: slow, not idempotent, once per channel |
| An offer | `add_watch_channel_offer`, `update_watch_channel_offer`, `remove_watch_channel_offer` | what it sells, its price and members or buyers when the page says, the page it was read on (required, `https://`) and the day. An update sends it whole |
| A link | `link_watch_channel`, `unlink_watch_channel` | `valuePropositionId` or `segmentId`, not both — of this channel's niche. Linking it again changes nothing |

`list_watch_channels(channelId)` answers each watch channel with its version, YouTube channel id,
title, handle, page, role, whether it is monitored, its latest profile only (null until profiled),
its outlier count and the value propositions it is linked to. `get_watch_channel` adds what found
it, its offers, its links, every profile newest first, the library's videos of its YouTube channel
and its outliers in the promise groups. The search answers a video's channel by its YouTube channel
id (`youTubeChannelId`), title and handle (`channelHandle`), never its page, language or created
date: read those on the channel's YouTube page, or ask the founder.

## Status says how true a part is, so choose it honestly

`Confirmed` means evidence is in hand. `Inferred` means you reasoned it from other parts.
`Hypothesis` means it is a guess to be tested. A part written from your own reasoning is
`Inferred`, not `Confirmed`; the founder judges the niche by these statuses.

Retire what was once believed (`retire_segment`, `retire_segment_item`,
`retire_value_proposition`, `retire_proposition_item`); remove only what should never have been
written (`remove_potential_niche`, `remove_watch_channel_offer`, `unlink_watch_channel`,
`delete_niche` on a draft).

## The YouTube library search

`search_youtube_videos` reads YouTube and writes every video it read into the library, with its
outlier scores. Send keywords, channel ids, or both — one of them at least, or it answers "Send
keywords, channel ids, or both." — and on every search `sort` (`Relevance`, YouTube's own order, or
`MostViewed`, the passing videos answered by their exact views, highest first) and `longFormOnly`
(`true` keeps no Short and no video of 3 minutes or less, `false` keeps every video). The other
criteria: max and min subscribers, min views, min views-to-subscribers, min multiple of the
channel's average views, published within so many days or after a date, duration bounds, results
per keyword (default 50, at most 200). It answers each passing video — its `libraryPostId`, its
outlier observation, its YouTube video id, title, its channel's YouTube id (`youTubeChannelId`),
title and handle, subscribers, views, age, duration,
the two ratios, `foundBy` (the keyword that found it), and `factsReadFrom`, the source that read its
facts (`Website` or `DataApi`) — a count rejected per criterion, the pages read per keyword,
`factSource` (the platform's setting: `Website`, `DataApi`, `DataApiThenWebsite` or
`WebsiteThenDataApi`) and `fallbackUsed` (whether the setting's second source read any of it).
Keyword search always reads the YouTube website. Bounds are inclusive.

It is not idempotent: each call reads YouTube again. When YouTube refuses — a bot check, a 403 or
429, the Data API's daily quota spent — it answers "YouTube refused the search. Nothing was written;
try again in a few minutes." Nothing reached the library; retrying a few minutes later is worth it,
retrying at once is not. `profile_watch_channel` answers the same sentence when YouTube refuses it.

When YouTube answers in a shape Studio cannot read, it answers UPSTREAM_UNAVAILABLE with Studio's
sentence naming the source and the call, such as "The YouTube Data API's videos answer for … is not
in the shape Studio reads: …. Nothing was written." Do not retry: the same call fails the same way
until Studio is updated. Tell the person what it said; nothing reached the library.

## Runs, as this skill sees them

Opening and ending runs is `benevox-agent`'s and `benevox-niche`'s; so are checkpointing a
procedure and going back to one (`checkpoint_run`, `reopen_procedure`). From here: `get_run` reads
one run whole — its events, its checkpoints, each `Finished` or `Reopened`, how many procedures of
how many are done — and `list_runs` lists a channel's runs by status with the headline each left.
`observe_run` records a line on the run you are in.

`cancel_run` stops a running or paused run for good, and it is the founder's act, never yours.
Call it only when the founder asked for that run to be cancelled — find it with `list_runs` and
confirm its headline — with the run as `targetRunId` and **no `runId`**, even inside a run: the call
is then the founder's own. Never in a routine's run, where no founder's word arrives. Sent with a
`runId`, Studio refuses it with "Only a person cancels a run. End or pause the run you are in, and
cancel a run only on the founder's word, with no run: that call is the founder's own act." The
founder can also cancel on Studio → Runs — Cancel, on a running or paused run.

## Make current is the founder's

`get_niche` answers the draft's readiness: every blocker standing, in this order — "Shortlist three
potential niches (n of 3)", "Write the promise statements (n of m)" and "Pick a niche and its
promise statement" while nothing is picked; then "Pick a beachhead segment", "Write the beachhead's
value proposition", "Demand from {min} or more channels for the beachhead's value proposition
({best} so far)", "Size the TAM" — or none. With none, the founder presses "Make current" on the
channel screen; the current niche moves to Past niches. With any, it is refused with "This draft
cannot be made current yet: " and the blockers. No tool does it, and you never say it was done.

## Reading a refusal

A refused call names its code, what happened, the arguments at fault, and what to do next. Do what
the recovery says rather than resending.

- `INVALID_ARGUMENT` — fix the named arguments. Nothing was read or changed. Among the sentences:
  "The skill score is a whole number from 1 to 5.", "A promise statement holds at most 10
  keywords.", "TAM low cannot be above TAM high.", "A TAM rests on at least one watch channel or
  video.", "Combine two different potential niches.", "An offer needs its source URL.", "A watch
  channel is a channel of someone else; channel 'UC…' is one of the organisation's own."
- `NOT_FOUND` — an id named nothing; read again rather than guessing another. From
  `profile_watch_channel`, "YouTube has no channel UC…. It answered "…"; nothing was written." — the
  YouTube channel id the watch channel was added with is wrong.
- `CONFLICT` naming a version — the niche, the watch channel, the channel or the video moved:
  re-read it, decide again, send with the version the read answered.
- `CONFLICT` naming `runId` — "This run has ended, been paused or belongs to someone else. Nothing
  was written; start a new run." Hand back; the calling skill opens a new run.
- `CONFLICT` quoting a rule — the call is not allowed in the niche's current state. Change what you
  asked for:
  - "This channel already has a draft niche. Finish or delete it first."
  - "A niche holds at most 10 potential niches."
  - "The rank is a whole number from 1 to n." — n, which the sentence names, is the highest rank
    the potential niche can take there: ranks stay 1 to n with no gap.
  - "Three potential niches are already shortlisted. Remove one from the shortlist first."
  - "The founder does not like this potential niche." or "Ask the founder whether they like this
    potential niche before shortlisting it." — ask, then `update_potential_niche` with their answer.
  - "The picked potential niche stays on the shortlist."
  - "A potential niche cannot be removed once a niche is picked."
  - "Promise statements are written only for a shortlisted niche.", "A shortlisted niche holds at
    most 3 promise statements.", "Promise groups are made only for a shortlisted niche."
  - "The promise statement belongs to another niche." or "\"<keyword>\" is not one of the promise
    statement's keywords." — the outlier or the pick named a statement of another potential niche,
    or a keyword the statement does not hold.
  - "This video is already in promise group <promise>."
  - "A TAM is written only for a shortlisted niche.", "Only a shortlisted potential niche can be
    picked.", "Write the TAM of <name> before picking it."
  - "Value propositions are made only from the picked niche's promise groups.", "Promise group
    <promise> already has a value proposition."
  - "Watch channels are found only by a shortlisted niche."
  - "A pain reliever points at a pain of its proposition's segment."
  - "A gain creator points at a gain of its proposition's segment."
  - "Pick at least one value proposition and one segment."
- "Only a person cancels a run. End or pause the run you are in, and cancel a run only on the
  founder's word, with no run: that call is the founder's own act." — `cancel_run` was sent with a
  `runId`. Nothing was cancelled; send it again with no `runId` only if the founder asked for it.
- `UPSTREAM_UNAVAILABLE` — Studio or YouTube could not answer; the recovery says when to retry.
- `FORBIDDEN` `read-only` — the organisation's subscription is read-only; say so and stop.

## Rules that are easy to get wrong

- Never invent a tenant, a channel, a niche or a YouTube channel id. Lists answer what exists.
- Read the niche or the watch channel before writing it, every time: the founder may have written
  on the screen since.
- One write per changed thing; each takes the version the previous answered — the niche's for a
  niche part, the watch channel's for a watch-channel part.
- An update rewrites its row whole: send the current value of every field you are not changing.
- A pain reliever or gain creator points at an item of the proposition's own segment, never of
  another.
- `search_youtube_videos` writes into the library even when nothing passes; report the passing
  videos and the rejected counts as it answered them.
