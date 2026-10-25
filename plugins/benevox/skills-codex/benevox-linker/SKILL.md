---
name: "benevox-linker"
description: "Type the links — gives the related links the server drew between Studio rows that read alike their meaning, with the word that fits, its direction, and for increases and decreases how much. Use it before end_run on the rows a run wrote, over the channel's backlog when the Nightly linker routine fires, and when the founder says \"type the links\" or asks what the related links mean. It never confirms or rejects a link and never merges two rows: those are the founder's, on Studio → Links."
---

# Benevox linker

The server embeds the text of runs, niches, segments and value propositions, and draws a `related`
link between two pieces that read alike. That link is a distance, not a meaning: it says the two
rows are near, not that one depends on the other. Giving it a word needs a language model, and the
server runs none — so the word is yours to give, through this skill, and through nothing else in the
plugin.

Every `type_link` carries the `runId` you were handed, so Studio → Links shows "Typed by Producer"
and the change history says which session gave the link its word.

## Two triggers, one loop

| Trigger | Who invokes you | What you list | What you hand back |
| --- | --- | --- | --- |
| A run is ending | the skill that opened it, before its `end_run` or `pause_run` | `list_untyped_links(runId)` — only the links touching rows that run wrote | one line per link typed, for that skill's summary |
| The Nightly linker routine fired | `benevox-agent`, inside the run it opened naming the routine | `list_untyped_links(channelId)` — the channel the routine fired on, no `runId`: that channel's backlog, page by page | the digest, for the summary `benevox-agent` writes at `end_run`; Studio files it in the founder's inbox as the run report |

You open no run and end none. The nightly pass is how text the founder typed on the screens during
the day, where no model was present, gets its meaning.

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

Here the run `benevox-agent` opens carries the routine's id when a routine is named, and a run opened
for this pass is the nightly shape: list the backlog of the channel the routine fired on, with its
`channelId` and without `runId`, and hand the digest back. Step 1 never starts without a run id,
and `start_run` and `end_run` are never called from here.

## The loop

1. **List.** `list_untyped_links(runId)` in session, with the run you were handed;
   `list_untyped_links(channelId)` nightly, with the channel the routine fired on and no `runId`.
   Each item: the link's id, its confidence (0 to 1), whether it is a possible duplicate, and both
   ends — their table, id, title, and the passage that matched. Every page also carries the
   **words** you may type with, shipped and this organisation's own, each with the sentence that
   says what it means. Read the meanings once per session.
2. **Skip a possible duplicate.** Two rows that may be one thing written twice — two value
   propositions saying the same — are not typed and nothing is merged: put the pair in the report.
   The founder decides it on Studio → Links, where it shows "Possible duplicate" with "Confirm" and
   "Reject".
3. **Read the two passages.** Most links are settled by them. Decide what one row does to the other
   in one sentence with the two titles in it.
4. **Read whole when the passages are not enough** — a part of the niche: `get_niche` and find the
   row by its id; a run: `get_run`; anything else: `get_neighbours(table, id)`.
5. **Choose the word** by the test in [reference/choosing.md](reference/choosing.md): the word whose
   meaning your sentence is, from the page's words; reuse before inventing; a new word only when
   none fits, sent with `newWord` and a description written the way the shipped ones are.
6. **Direction.** The word's meaning names a first row and a second. When the listed `from` is the
   first, send `FromTo`; when the listed `to` is, send `ToFrom`. An undirected word takes `FromTo`.
7. **Magnitude** only on a word whose meaning says it may carry one (`increases`, `decreases`) and
   only when the text states the size: `magnitude` and `unit` together, or neither.
8. **`type_link(linkId, word, direction, magnitude?, unit?, newWord?, runId)`.** The answer is the
   link with its word.
9. **One line per link**: the two titles, the arrow as typed, the word, the confidence, then your
   sentence — `"Developers with a day job" → "Only 5–10 hours a week": depends_on (0.91) — the
   segment's whole case rests on the time it lacks`.
10. **Next page** with the cursor the answer gave, until there is none. Nightly, after each page,
    `observe_run` with one line: how many typed, how many left alone and why.

Then hand back: in session the lines; nightly the digest — counts first (typed, duplicates reported,
left untyped and why), then the lines. Nightly, the digest is the run's summary, and Studio files
it in the founder's inbox as the run report when the run ends: send no message about it.

## What you never do

- Confirm or reject a link. Those are the founder's, on Studio → Links; they are not in your tools.
- Merge two rows a duplicate flag names, or retire one. Report the pair.
- Invent a word when one on the page fits.
- Try words until one goes through. A link a person confirmed or rejected takes no word at all: it
  keeps the one it was ruled on. Leave it and report it.
- Wait for the embedder. A short or empty list before `end_run` is normal: the last writes of a
  session may not be embedded yet, and the night catches them.
- Ask. Nobody is asked per link, in session or nightly.

## Reading a refusal

- `NOT_FOUND` naming the word — no word of that code exists. Send it again with `newWord` when it is
  worth adding, or choose one from the page.
- `INVALID_ARGUMENT` saying the word already exists — send the code alone. Saying the word has no
  direction — send `FromTo`. Naming the unit — send magnitude and unit together, or neither.
- `CONFLICT` saying the link is a possible duplicate — you missed the flag; leave it and report it.
- `CONFLICT` saying "A person already confirmed this link" or "rejected this link; it keeps the word
  it was ruled on." — the founder ruled on it while you read; no other word is taken. Leave it and
  report it.
- "This run has ended, been paused or belongs to someone else. Nothing was written; start a new
  run." — stop and hand back: the calling skill opens a new run before anything else.
- `FORBIDDEN` — the founder's role cannot write, or the organisation is read-only; say so and stop.

## Rules that are easy to get wrong

- The words' meanings are on the page; read them before choosing, every session. Nothing in this
  skill lists the words, because an organisation may add its own.
- `ToFrom` is relative to the pair **as listed**, not to any order you read the ends in.
- Report what `type_link` answered, never what you meant to send.
- A new word exists for the whole organisation the moment you type with it. That is why its
  description has to be good enough for the next session, and why reuse comes first.
