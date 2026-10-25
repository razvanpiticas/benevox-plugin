# The three subjects

Load this when reading a subject's text or recording a distillate. One row per subject an insight
can be about.

| Subject | Read its current text with | Record with | A proposal replaces | The founder rules on |
| --- | --- | --- | --- | --- |
| A procedure of the operation, for one channel | `get_procedure(code, channelId)` — the channel's copy when customised, the shipped text otherwise; note its version (0 while still shipped) | `record_procedure_insight(procedure, channelId, title, body, proposedText?, runId)` | the whole instructions | Studio → Insights; the text shows on Studio → Method |
| A part description, for the organisation | `get_part_description(code)` — the organisation's copy when customised, the shipped text otherwise; note its version | `record_part_description_insight(part, title, body, proposedText?, runId)` | the whole description | Studio → Insights; the text shows on Studio → Method → Parts |
| The operation, for one channel | `get_operation("youtube-niche", channelId)` — description, validated-when, its thresholds, if-not | `record_operation_insight(operation, channelId, title, body, pitfall?, appliesWhenNiche?, runId)` — no proposal; text to change is a procedure's | nothing: a distilled statement, a pitfall or a niche | Studio → Insights |

`supersede_insight` and `contradict_insight` take the insight and, for supersede, the newer one, and
`runId`.

`list_insights` reads a procedure's and the operation's insights with the channel's `channelId`,
and a part description's with none: a part description belongs to the organisation, and a channel
filter leaves its insights out.

A proposal recorded inside the run files its own insight review in the founder's inbox; the
founder answers it by applying or rejecting the proposal on Studio → Insights. Nothing else is sent
about it.

A proposal is written against the version the subject's read answered. If the founder edits the
text before ruling, "Apply" refuses the proposal as moved and says so; the next pass writes a new one
against the new text. Do not pre-empt it.
