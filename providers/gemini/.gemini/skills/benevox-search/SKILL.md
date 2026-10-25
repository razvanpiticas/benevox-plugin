---
name: "benevox-search"
description: "Find what we decided or know — finds what was decided or is known on a Benevox channel when nobody knows where it is written, and says how it found it. Three instruments and one rule — exact reads when the row is known, search by meaning through the embeddings when only the subject is known or a duplicate is being checked, search by connection when a row is known and what hangs on it is wanted, and search by query for a question with more than one hop; plus the change history for who changed what. Use when a skill or the founder asks \"when did we decide …\", what is known about something, whether a segment or value proposition like this already exists, or what a row is tied to. Reads only; every answer names its instrument and quotes the query it ran."
---

# Benevox search

Reads of a row Studio already named are `benevox-studio`'s: a niche by its id, a watch channel by
its id, a run by its id.
This skill is for every other read — the ones where nobody holds the row, or holds one and wants
what is tied to it. It chooses the instrument, runs it once, and answers with the rows found and the
query it ran, so the founder and the calling skill can see what was asked. It writes nothing.

A search by meaning embeds the question, and a query runs with a timeout. The exact read is free.
That is why the rule below is applied in this order.

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

Here the session is booted when `benevox-agent` or the skill that invoked you inside its run hands
you the question. You write nothing, so no call of yours carries the run's id.

## The steps

Every question, whoever asks it, goes through these four steps in this order.

1. **Read the glossary — first, before any instrument is chosen.** The product's words — run,
   checkpoint, draft, current, potential niche, promise statement, promise group, proven, watch
   channel, beachhead, value proposition, outlier, related and the rest — are one short file on the server, the resource `benevox://glossary`. Read it once per
   session so a question is asked in the product's words and an answer is read in them. Already read
   in this session: go to step 2. If this harness does not list the `benevox` server's resources,
   skip it: the tool descriptions carry the words the instruments need.
2. **Choose the instrument** by [the rule](#the-rule): the first row that fits.
3. **Run it once**, as its own section below says.
4. **Answer** in [the answer's shape](#the-answer): the instrument, the query, the rows.

## The rule

| The question | Instrument | Call |
| --- | --- | --- |
| names a part of the niche, or a row whose id you hold; or asks about segment or proposition items, potential niches, promise statements, promise groups, outliers or watch channels — "which value propositions are not proven yet?", "what do our competitors sell?" | **exact** | `get_niche`; `list_watch_channels` and `get_watch_channel`; `get_run` by id; `get_channel` |
| names a subject and no row — "when did we decide the promise statement?", "what do we know about developers with a day job?"; or is a duplicate check before a write — "is there already a value proposition like this?" | **search by meaning** | `search(question, limit)` |
| holds a row and asks what is tied to it — "what hangs on this segment?" | **search by connection** | `get_neighbours(table, id)` |
| has a shape with more than one hop — "which runs are linked to the beachhead?", "what did each of our niches promise its beachhead?" | **search by query** | `run_analytical_query` with a shape from [reference/shapes.md](reference/shapes.md) |
| asks who changed what, or what a run wrote | **history** | `get_history` on the run, or on the subject's table and id |
| has two halves — "what is tied to whatever we know about pricing" | **both** | by meaning to find the rows, then by connection from each |

Never by meaning when the row is in hand. Never more than one `search` per question: one call, the
question written once as a sentence. [reference/instruments.md](reference/instruments.md) has the
rule with examples.

## Search by meaning

`search(question, limit)`: the server embeds the question once, finds the nearest passages of this
organisation, and answers their rows — each by table, id and title, with the passage that matched
quoted, a similarity from 0 to 1, and when it happened. Passages come from completed and paused
runs (their headline and summary, the `Decided:` lines among them), niches, segments (name and
description) and value propositions (statement). Segment and proposition items, potential niches,
promise statements, promise groups and watch channels have none: `get_niche` and
`get_watch_channel` read them. Write the question as one sentence about the
subject. Five rows by default, up to twenty. A hit below 0.5 is named as weak.

"When did we decide …" is answered from the run whose `Decided:` line says it: quote that line and
give the run's date, and name "search by meaning" as the tool used.

For a duplicate check, the answer says whether any hit says the same thing as what is about to be
written, and quotes it.

## Search by connection

`get_neighbours(table, id)`: everything one hop from the row — its structural neighbours over
`of_niche`, `for_segment` and `worked_on` (a segment's or a value proposition's niche and the
segments and value propositions of a niche, a value proposition's segment and the value
propositions written for a segment, the niche a Pick a niche run worked on and the runs that worked
on a niche) and every accepted link, each with its word, direction, origin and confidence. A
rejected link is never one. The table is one of `runs`, `niches`, `customer_segments` or
`value_propositions`; items, potential niches, promise statements, promise groups and watch
channels are not rows it walks — read them with `get_niche` and `get_watch_channel`.

A walk of more than one hop is bounded: `get_neighbours` on the row named, then at most two more
calls. When a shaped query is refused or fails twice, answer from what the calls found and say the
query did not run. Never walk on row by row until the question feels covered.

## Search by query

`run_analytical_query(query)`: one `SELECT` over the property graph `studio`, run on a read-only
connection with a timeout and a row cap, the query echoed with the answer. The graph holds runs,
niches, segments, value propositions, their passages and the accepted links — nothing else. Take
the shape from [reference/shapes.md](reference/shapes.md) and fill its placeholders; it also says
what the graph cannot answer. It is sent as a write request, so a read-only organisation is refused
it: answer by meaning and by connection instead and say so.

## The answer

Always in this shape, whoever asked:

```
Search by meaning — search("when did we decide the promise statement?", 5):
  runs 0192… "Pick a niche: niche picked, beachhead written" (run, ended 26 September) 0.88 — "Decided: promise statement: I help developers with a day job ship a product"
  niches 0192… draft niche of Pete Builds 0.71 — "I help developers with a day job …"
```

The instrument, the query as sent, then the rows with kind, the number and the passage quoted. For a
query, the query echoed as the server returned it, then the rows. Say "nothing found" when the
answer is empty, and say which instrument said so.

## Reading a refusal

- `INVALID_ARGUMENT` on `search` — the question is empty or over 1,000 characters, or the limit is
  outside 1–20.
- `INVALID_ARGUMENT` on `run_analytical_query` — the guard: one `SELECT`, over `GRAPH_TABLE
  (studio …)`, one statement, under 4,000 characters. Fix what the message names and send once more.
- `CONFLICT` saying the query ran too long — narrow it: start from one row, fewer hops.
- `CONFLICT` saying PostgreSQL refused the query at a position — fix it there. Two failures on one
  question: answer by `get_neighbours` and say the query did not run.
- `CONFLICT` naming a subquery, a `WITH` or a `UNION`, a table outside the graph, a function the
  query may not call, or too many combinations of the graph's tables — rewrite what it names, as
  [reference/shapes.md](reference/shapes.md) says, and send once more.
- `FORBIDDEN` on `run_analytical_query` only — the organisation is read-only; use the other two.
- `INVALID_ARGUMENT` on `get_neighbours` naming the table — it is not one of `runs`, `niches`,
  `customer_segments`, `value_propositions`.
- `NOT_FOUND` on `get_neighbours` — no row of that table carries that id; read it again from a list.

## Rules that are easy to get wrong

- The exact read is always first. A row in hand and a `search` sent is an embedding spent on
  something a free read answers.
- One search per question. Two phrasings are two embeddings for one answer.
- Name the instrument and quote the query in every answer, including the empty ones. An answer that
  hides how it was found cannot be checked.
- This skill writes nothing. A duplicate it finds is reported to the calling skill, which decides
  what to write.
