# The shapes a query may take

Load this before `run_analytical_query`. Every shape is one `SELECT` over the property graph
`studio`, run on a read-only connection that sees only this organisation's rows; fill the
placeholders. The server refuses anything else: more than one statement, a table outside the graph,
a query over 4,000 characters.

The graph's words: one vertex label per part of the niche — `niche`, `niche_direction`,
`customer_segment`, `segment_item`, `value_proposition`, `proposition_item`, `demand_evidence` —
and `run`, every one also labelled `node` with `id`; structural edges from a part to what owns it
and from a pain reliever or gain creator to the item it points at; every accepted link is an edge
`linked` with `link_type_id`, `origin`, `confidence`, `magnitude`, `unit`. When the server refuses a
label or an edge as unknown, its message names what the graph holds: rewrite the shape with those
words and send once more, never a third time.

Placeholders: `<nicheId>`, `<segmentId>`, `<valuePropositionId>`, `<linkTypeId>` — ids a read
answered; `<status>` a status word as a read answered it.

## Q1 — the value propositions of one segment, and the demand evidence under each

```sql
SELECT * FROM GRAPH_TABLE (studio
  MATCH (s IS customer_segment WHERE s.id = '<segmentId>')
        <-[]- (vp IS value_proposition)
        <-[]- (e IS demand_evidence)
  COLUMNS (vp.id AS value_proposition, vp.statement AS statement, e.keyword AS keyword))
```

A value proposition missing from the answer has no evidence: compare with `get_niche`.

## Q2 — the pains a value proposition relieves

```sql
SELECT * FROM GRAPH_TABLE (studio
  MATCH (vp IS value_proposition WHERE vp.id = '<valuePropositionId>')
        <-[]- (pr IS proposition_item WHERE pr.kind = 'PainReliever')
        -[]-> (pain IS segment_item WHERE pain.kind = 'Pain')
  COLUMNS (pr.text AS reliever, pain.text AS pain, pain.status AS status))
```

## Q3 — everything typed with one word, from one row outwards

```sql
SELECT * FROM GRAPH_TABLE (studio
  MATCH (a IS node WHERE a.id = '<segmentId>')
        -[l IS linked WHERE l.link_type_id = '<linkTypeId>']- (b IS node)
  COLUMNS (b.id AS neighbour, l.confidence AS confidence, l.magnitude AS magnitude, l.unit AS unit))
```

(`linkTypeId` is the `id` of that word on the words list `list_untyped_links` answers.)

## Q4 — the segment items of one niche still at a status

```sql
SELECT * FROM GRAPH_TABLE (studio
  MATCH (n IS niche WHERE n.id = '<nicheId>')
        <-[]- (s IS customer_segment)
        <-[]- (i IS segment_item WHERE i.status = '<status>')
  COLUMNS (s.name AS segment, i.kind AS kind, i.text AS item))
```

More hops than a shape has: run one shape, take the ids it answered, run the next from them. Never
a recursive query, never a table outside the graph, never a second statement.
