# The shapes a query may take

Load this before `run_analytical_query`. Every shape is one `SELECT` over the property graph
`studio`, run on a read-only connection that sees only this organisation's rows; fill the
placeholders.

## The graph's words

Vertices, each with the properties it exposes:

- `run` — `id`, `channel_id`, `agent_id`, `status` (`Running`, `Paused`, `Completed`, `Failed`,
  `Cancelled`), `headline`, `started_at_utc`, `ended_at_utc` (set once it paused or ended),
  `subject_id` (the niche a Pick a niche run worked on; empty on a plain run);
- `niche` — `id`, `channel_id`, `state` (`Draft`, `Current`, `Superseded`), `promise_statement`,
  `audience`, `problem`, `method`;
- `segment` — `id`, `niche_id`, `name`, `description`, `market_type`, `status` (`Hypothesis`,
  `Inferred`, `Confirmed`), `is_beachhead`, `retired_at_utc` (empty while it is live);
- `value_proposition` — `id`, `niche_id`, `segment_id`, `statement`, `status`, `retired_at_utc`;
- `passage` — `id`, `parent_table`, `parent_id`, `ordinal`, `passage_text`: a piece of the
  searchable text of a run (its headline and summary, once paused or completed), a niche, a segment
  or a value proposition.

Every vertex is also labelled `node`, with only `id` and `content_table` (`runs`, `niches`,
`customer_segments`, `value_propositions`, `passages`).

Edges: `of_niche` (a segment or a value proposition to its niche), `for_segment` (a value
proposition to the segment it is for), `worked_on` (a Pick a niche run to the niche it worked on),
`passage_of` (a passage to its row), and `linked` — every link nobody rejected, from its `from` row
to its `to` row, with `word` (the word's code: `related` until the linker types it, then
`depends_on`, `enables`, `increases`, `decreases`, `answers` or the organisation's own), `origin`,
`confidence`, `magnitude`, `unit`.

A property not listed is not in the graph, and a query naming one is refused: a run's summary is
read as its passages' `passage_text`, or whole with `get_run`.

## What the graph cannot answer

Segment items (jobs, pains, gains), proposition items (products, pain relievers, gain creators,
dream outcome, enhancers, names) and what each points at, potential niches, the shortlist and the
pick, promise statements, promise groups, their outliers and whether a value proposition is
proven, keywords, the TAM and readiness are not in the graph. Neither are watch channels, videos,
their strategy, the library, insights, the inbox or routines. So "which value propositions are not
proven yet", "the pains a value proposition relieves", "which pain has no reliever", "which
potential niche was picked" are not queries: `get_niche` answers each, in one call that holds the
niche whole. Watch channels are `list_watch_channels` and `get_watch_channel`; insights are
`list_insights`; what a run did is `get_run` and `get_history`.

## What the server refuses

- More than one query: a subquery, a `WITH` or a `UNION` — run one shape, take the ids it answered,
  run the next from them.
- A table, a view or a column outside the graph. Read only through `GRAPH_TABLE (studio MATCH …
  COLUMNS (…))`.
- A walk too wide: `node` stands for five tables and an unlabelled edge for twenty-four, so name
  the label of every vertex and edge, and give each edge its arrow. A walk that could cross more
  than 50,000 combinations of tables is refused before it runs.
- A function off the allowlist — PostgreSQL's own `count`, `sum`, `min`, `max`, `string_agg`,
  `lower`, `strpos`, `left`, `date_trunc`, `to_char` and a few more; the refusal names them all.
- A query over 4,000 characters. It runs for at most five seconds and answers at most 200 rows;
  `truncated` says the cap cut it. Select ids and short columns rather than long text.

Placeholders: `<channelId>`, `<nicheId>` — ids a read answered; `<word>` a word's code from the
words list `list_untyped_links` answers, such as `depends_on`.

## S1 — across a channel's niches, how many value propositions each segment was given (two hops)

```sql
SELECT niche_state, niche_id, segment_name, beachhead, segment_retired, count(*) AS value_propositions
FROM GRAPH_TABLE (studio
  MATCH (vp IS value_proposition WHERE vp.retired_at_utc IS NULL)
        -[IS for_segment]-> (s IS segment)
        -[IS of_niche]-> (n IS niche WHERE n.channel_id = '<channelId>')
  COLUMNS (n.state AS niche_state, n.id AS niche_id, s.name AS segment_name, s.is_beachhead AS beachhead, s.retired_at_utc AS segment_retired))
GROUP BY niche_state, niche_id, segment_name, beachhead, segment_retired
ORDER BY niche_state, segment_name
```

Current, draft and past niches together. A segment missing from the answer has no live value
proposition: `get_niche` on its niche says what it does have.

## S2 — what each niche of a channel promised its beachhead (two hops)

```sql
SELECT niche_state, niche_promise_statement, segment_name, vp_statement, vp_status
FROM GRAPH_TABLE (studio
  MATCH (vp IS value_proposition WHERE vp.retired_at_utc IS NULL)
        -[IS for_segment]-> (s IS segment WHERE s.is_beachhead)
        -[IS of_niche]-> (n IS niche WHERE n.channel_id = '<channelId>')
  COLUMNS (n.state AS niche_state, n.promise_statement AS niche_promise_statement, s.name AS segment_name, vp.statement AS vp_statement, vp.status AS vp_status))
ORDER BY niche_state
```

A niche missing from the answer has no beachhead, or none with a live value proposition.

## S3 — the Pick a niche runs on a channel's niches, newest first, and how each stopped (one hop)

```sql
SELECT run_id, run_status, headline, started, ended, niche_state, niche_promise_statement
FROM GRAPH_TABLE (studio
  MATCH (r IS run) -[IS worked_on]-> (n IS niche WHERE n.channel_id = '<channelId>')
  COLUMNS (r.id AS run_id, r.status AS run_status, r.headline AS headline, r.started_at_utc AS started, r.ended_at_utc AS ended, n.state AS niche_state, n.promise_statement AS niche_promise_statement))
ORDER BY started DESC
```

Only an operation run works on a niche; a plain run has no `worked_on` edge. `list_runs` lists
every run of the channel.

## S4 — the runs linked to the beachhead of one niche, with each link's word (two hops)

```sql
SELECT segment_name, word, origin, confidence, run_id, headline, ended
FROM GRAPH_TABLE (studio
  MATCH (r IS run)
        -[l IS linked]- (s IS segment WHERE s.is_beachhead)
        -[IS of_niche]-> (n IS niche WHERE n.id = '<nicheId>')
  COLUMNS (s.name AS segment_name, l.word AS word, l.origin AS origin, l.confidence AS confidence, r.id AS run_id, r.headline AS headline, r.ended_at_utc AS ended))
ORDER BY ended DESC
```

The `linked` edge carries no arrowhead here: which way a link points is decided by its word, so
the run may be either end.

## S5 — every link typed with one word from a value proposition to a segment (one hop, both ends named)

```sql
SELECT vp_statement, word, segment_name, confidence, magnitude, unit
FROM GRAPH_TABLE (studio
  MATCH (vp IS value_proposition WHERE vp.retired_at_utc IS NULL)
        -[l IS linked WHERE l.word = '<word>']-> (s IS segment WHERE s.retired_at_utc IS NULL)
  COLUMNS (vp.statement AS vp_statement, l.word AS word, s.name AS segment_name, l.confidence AS confidence, l.magnitude AS magnitude, l.unit AS unit))
```

Across the organisation's niches. The arrow runs from the link's `from` row to its `to` row, as
the word's meaning names them; swap the two labels for the other pair, or any two of `run`,
`niche`, `segment`, `value_proposition`. What one row is tied to is `get_neighbours`, not this.

## S6 — every decision a channel's runs recorded, oldest first (one hop)

```sql
SELECT started, headline, passage
FROM GRAPH_TABLE (studio
  MATCH (p IS passage WHERE strpos(p.passage_text, 'Decided:') > 0)
        -[IS passage_of]-> (r IS run WHERE r.channel_id = '<channelId>')
  COLUMNS (r.started_at_utc AS started, r.headline AS headline, p.passage_text AS passage))
ORDER BY started
```

A passage is a piece of the run's headline and summary: quote only its `Decided:` lines. Only
paused and completed runs have passages. One niche's Pick a niche runs only: add
`-[IS worked_on]-> (n IS niche WHERE n.id = '<nicheId>')` after the run, and drop its channel
filter.

More hops than a shape has: run one shape, take the ids it answered, run the next from them. Never
a recursive query, never a table outside the graph, never a second statement. When the server
refuses a label or a property, its message names what the graph holds: rewrite the shape with
those words and send once more, never a third time.
