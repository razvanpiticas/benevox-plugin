# The instruments, with examples

Load this when the rule in the skill leaves a doubt about which instrument a question wants, or
when writing the answer.

## Exact — the row is known

| Asked | Do |
| --- | --- |
| "What is on the draft niche?" | `get_niche` on the draft the channel names |
| "Which segment is the beachhead?" | `get_niche`, the segment with the beachhead mark |
| "What did that run do?" | `get_run(id)` |
| "What did last night's linker run change?" | `get_history` on the run |

## Search by meaning — the subject is known, the place is not

| Asked | `search` question | Limit |
| --- | --- | --- |
| "When did we decide the niche statement?" | "the decision on the niche statement" | 5 |
| "What do we know about developers with a day job?" | "developers with a day job: their jobs, pains and gains" | 5 |
| "Is there already a value proposition about agents building at night?" | "a value proposition that agents build while the founder is at work" | 5 |
| "Find every mention of the AI factory direction" | "AI factory in public" | 20 |

One question, one sentence, the glossary's words. A duplicate check answers yes or no with the hit
quoted: a similarity above 0.85 with the same subject is a duplicate, below 0.5 is not, in between
the quoted passage decides and the answer says so.

A decision is answered from the run whose summary carries a `Decided:` line on it: quote the line,
give the run's date, name "search by meaning".

## Search by connection — a row is known

| Asked | Do |
| --- | --- |
| "What hangs on this segment?" | `get_neighbours("customer_segments", id)` |
| "What is this value proposition linked to?" | `get_neighbours("value_propositions", id)` |
| "Which value propositions of the beachhead have no demand evidence?" | the shape in shapes.md |

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
