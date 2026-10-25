# The instruments, with examples

Load this when the rule in the skill leaves a doubt about which instrument a question wants, or
when writing the answer.

## Exact — the row is known

| Asked | Do |
| --- | --- |
| "What is on the draft niche?" | `get_niche` on the draft the channel names |
| "Which segment is the beachhead?" | `get_niche`, the segment with the beachhead mark |
| "Which value propositions have no demand evidence?" | `get_niche`: the demand evidence and the verdict per value proposition |
| "Which pains does this value proposition relieve?" | `get_niche`: its pain relievers and the pain each points at |
| "What did that run do?" | `get_run(id)` |
| "What did last night's linker run change?" | `get_history` on the run |

## Search by meaning — the subject is known, the place is not

| Asked | `search` question | Limit |
| --- | --- | --- |
| "When did we decide the niche statement?" | "the decision on the niche statement" | 5 |
| "What do we know about developers with a day job?" | "the segment of developers with a day job" | 5 |
| "Is there already a value proposition about agents building at night?" | "a value proposition that agents build while the founder is at work" | 5 |
| "Find every mention of the AI factory direction" | "AI factory in public" | 20 |

One question, one sentence, the glossary's words. A duplicate check answers yes or no with the hit
quoted: a similarity above 0.85 with the same subject is a duplicate, below 0.5 is not, in between
the quoted passage decides and the answer says so.

A decision is answered from the run whose summary carries a `Decided:` line on it: quote the line,
give the run's date, name "search by meaning".

A segment's jobs, pains and gains, a value proposition's items, directions and demand evidence have
no passages of their own. Find the segment or the value proposition by meaning, then read its items
with `get_niche`.

## Search by connection — a row is known

| Asked | Do |
| --- | --- |
| "What hangs on this segment?" | `get_neighbours("customer_segments", id)`: its niche, the value propositions written for it, its links |
| "What is this value proposition linked to?" | `get_neighbours("value_propositions", id)`: its niche, its segment, its links |
| "Which runs worked on this niche?" | `get_neighbours("niches", id)`: the Pick a niche runs over `worked_on`, its segments and value propositions, its links |

## Search by query — a shape with more than one hop

| Asked | Do |
| --- | --- |
| "What did each of our niches promise its beachhead?" | S2 in shapes.md |
| "Which runs are tied to the beachhead?" | S4 in shapes.md |
| "Which value propositions depend on which segments?" | S5 in shapes.md, with `depends_on` |
| "Every decision we recorded on this channel" | S6 in shapes.md |

## Both halves

"What is tied to whatever we know about the beachhead": `search("the beachhead segment …", 5)`,
then `get_neighbours` on each of the five, answered grouped by row.

## History

| Asked | Do |
| --- | --- |
| "Who changed the statement?" | `get_history("niches", id)` |
| "What did Producer write last night?" | `get_history` on that run |

Each change names its actor — the founder by name, or Producer with the run — the property and
"changed", and when.

## The answer's shape

```
<Instrument> — <the call as sent>:
  <table> <id> <title> (<kind>) <number> — "<passage>"
  …
<for a query: the query as the server echoed it, then one row per line>
<for neighbours: the origin row, then one line per neighbour: kind, title — edge, direction, and for a link its word, origin, confidence>
nothing found — <instrument> answered no rows
```
