---
name: benevox-studio
description: Reads and writes a Benevox channel's niche through the Benevox MCP tools — the draft, current and past niches, their directions, customer segments with jobs, pains and gains, value propositions with their products, pain relievers and gain creators, demand evidence, the channel's brand decision, a video's strategy and the YouTube library search — and the mechanics of runs. The low-level skill every other Benevox skill reads and writes the niche through: it knows the write loop, the niche version, the run id and the refusals, and nothing of the method. Use it for any read or write on a channel, a niche, a video's strategy or the library, whoever asks for it.
---

# Benevox studio

A channel's **niche** is what its videos aim at: a statement of who the channel serves and with
what, the directions considered, the customer segments with their jobs, pains and gains, the value
propositions written for them, and the demand evidence — outlier videos — that proves somebody
watches. A channel holds at most one **draft**, at most one **current** niche, and any number of
**past** (superseded) ones. Every call is made as the signed-in founder inside their own
organisation — the connection is the `benevox` skill's job; this skill is about what to write and
how.

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
2. **Read before you write.** `get_niche` answers the niche whole: its fields, its directions, its
   segments with their items, its value propositions with their items, its demand evidence with the
   verdict per value proposition, its readiness, and its **version**. Reading first is how you
   avoid writing a duplicate and how you learn the ids to address.
3. **Write with the version you read.** Every write on a niche — the niche's own fields and every
   part of it — takes `expectedVersion`, the niche's version, and answers the whole niche with the
   new version. Carry the answered version into the next write. Two writes in a row against the
   same version means the second is refused as stale: re-read, decide again from what the niche
   says now, and send once more.
4. **Report what the tool answered**, by name — the segment "Developers with a day job", the value
   proposition "Your agents build while you're at work" — never what you intended. A refusal
   changed nothing unless its message says otherwise.

**`runId` on every write.** Inside a run, send the id `start_run` answered on every write until that
run ends, so the change history records the write against Producer and that run. A write without it
is recorded as the founder's own, so it is never left out. A write refused with "This run has ended,
been paused or belongs to someone else. Nothing was written; start a new run." is not retried
without a run: the calling skill opens a new one.

## Addressing

Writes take the ids a read answered: the channel's, the niche's, a direction's, a segment's, a
segment item's, a value proposition's, a proposition item's, an evidence row's. People speak in
names and Studio answers ids; find the id by the name in `get_niche`, never guess one and never ask
the founder for one.

## The parts, and what each takes

What each part is **for** is its part description: `list_part_descriptions`, then
`get_part_description` on the one you are about to write. Read it before the first write of that
part in a session; the organisation may have customised it.

| Part | Write | Fields |
| --- | --- | --- |
| The niche | `create_niche` (a new empty draft on the channel), `update_niche`, `delete_niche` | sources note, statement, audience, problem, method, keywords, TAM low and high viewers, TAM evidence, adjacent niches, confidence note — all optional while it is a draft |
| A direction | `add_direction`, `update_direction`, `remove_direction`, `pick_direction` | who it serves, the problem, how it makes money, the advantage, a skill score 1–5. One direction is picked; picking another moves the mark |
| A customer segment | `add_segment`, `update_segment`, `retire_segment`, `set_beachhead` | name, description, market type (`MassMarket`, `NicheMarket`, `Segmented`, `Diversified`, `MultiSidedPlatform`), status. One segment is the beachhead; setting another moves the badge |
| A segment item | `add_segment_item`, `update_segment_item`, `retire_segment_item` | kind `Job`, `Pain` or `Gain`; text; a job's kind (`Functional`, `Social`, `Emotional`, `Supporting`); a rating `VeryLow` to `VeryHigh` — a job's importance, a pain's severity, a gain's relevance; status |
| A value proposition | `add_value_proposition`, `update_value_proposition`, `retire_value_proposition` | the segment it is for, the statement, status |
| A proposition item | `add_proposition_item`, `update_proposition_item`, `retire_proposition_item` | kind `ProductOrService`, `PainReliever`, `GainCreator`, `DreamOutcome`, `Enhancer` or `Name`; text; a pain reliever names the pain it relieves, a gain creator the gain it creates — each **of the proposition's own segment** |
| Demand evidence | `add_demand_evidence`, `remove_demand_evidence` | the library video, the keyword that found it, its outlier observation — all three from `search_youtube_videos`' answer |
| The brand | `set_channel_brand` | `OnPerson` (the screen says "On me"), `Hybrid` or `Faceless`; the channel's version |
| A video's strategy | `set_video_strategy` | the value propositions and the segments the video serves — at least one of each, all of one niche — no version: the library video's strategy is the organisation's own. The set is replaced whole |

A choice word is spelled exactly as above; a misspelt one is refused naming the field and the words
that would have worked.

## Status says how true a part is, so choose it honestly

`Confirmed` means evidence is in hand. `Inferred` means you reasoned it from other parts.
`Hypothesis` means it is a guess to be tested. A part written from your own reasoning is
`Inferred`, not `Confirmed`; the founder judges the niche by these statuses.

Retire what was once believed (`retire_segment`, `retire_segment_item`,
`retire_value_proposition`, `retire_proposition_item`); remove only what should never have been
written (`remove_direction`, `remove_demand_evidence`, `delete_niche` on a draft).

## The YouTube library search

`search_youtube_videos` reads YouTube and writes every video it read into the library, with its
outlier scores. Send keywords, channel ids, or both — one of them at least, or it answers "Send
keywords, channel ids, or both." — and the criteria: max and min subscribers, min views, min
views-to-subscribers, min multiple of the channel's average views, published within so many days or
after a date, format (`LongForm`, `Short`, `Any`), duration bounds, results per keyword (default 50,
at most 200). It answers each passing video — its library id, its outlier observation, title,
channel, subscribers, views, age, duration, the two ratios, and the keyword that found it — a count
rejected per criterion, and the pages read per keyword. Bounds are inclusive.

It is not idempotent: each call reads YouTube again. When YouTube refuses — a bot check, a 403 or
429, a page it cannot read — it answers "YouTube refused the search. Nothing was written; try again
in a few minutes." Nothing reached the library; retrying a few minutes later is worth it, retrying
at once is not.

## Runs, as this skill sees them

Opening and ending runs is `benevox-agent`'s and `benevox-niche`'s. From here: `get_run` reads one
run whole — its events, its checkpoints, how many procedures of how many are done — and `list_runs`
lists a channel's runs by status with the headline each left. `observe_run` records a line on the
run you are in. `cancel_run` is the founder's call, not yours.

## Make current is the founder's

`get_niche` answers the draft's readiness: the first blocker of "Write the niche statement.", "Pick
a beachhead segment.", "Write a value proposition for the beachhead segment.", "Demand evidence
from {n} or more channels for the beachhead VP: {m} so far", "Size the TAM with evidence." — or none.
With none, the founder presses "Make current" on the channel screen; the current niche moves to
Past niches. No tool does it, and you never say it was done.

## Reading a refusal

A refused call names its code, what happened, the arguments at fault, and what to do next. Do what
the recovery says rather than resending.

- `INVALID_ARGUMENT` — fix the named arguments. Nothing was read or changed.
- `NOT_FOUND` — an id named nothing; read again rather than guessing another.
- `CONFLICT` naming a version — the niche, the channel or the video moved: re-read it, decide again,
  send with the version the read answered.
- `CONFLICT` naming `runId` — "This run has ended, been paused or belongs to someone else. Nothing
  was written; start a new run." Hand back; the calling skill opens a new run.
- `CONFLICT` quoting a rule — the call is not allowed in the niche's current state. Change what you
  asked for:
  - "This channel already has a draft niche. Finish or delete it first."
  - "A pain reliever points at a pain of its proposition's segment."
  - "A gain creator points at a gain of its proposition's segment."
  - "Pick at least one value proposition and one segment."
- `UPSTREAM_UNAVAILABLE` — Studio or YouTube could not answer; the recovery says when to retry.
- `FORBIDDEN` `read-only` — the organisation's subscription is read-only; say so and stop.

## Rules that are easy to get wrong

- Never invent a tenant, a channel or a niche. Lists answer what exists.
- Read the niche before writing it, every time: the founder may have written on the screen since.
- One write per changed thing; each takes the version the previous answered.
- A pain reliever or gain creator points at an item of the proposition's own segment, never of
  another.
- `search_youtube_videos` writes into the library even when nothing passes; report the passing
  videos and the rejected counts as it answered them.
