# The tools, in full

Every tool publishes its own input schema. Read it there rather than guessing at field names —
this file carries what the schema cannot say: which permission each tool demands, whether it
changes anything, and whether it takes a version or a run.

Every tool that reads needs `mcp:tools.read`; every tool that writes needs `mcp:tools.write`.
None of them is anonymous: every one requires a signed-in caller who belongs to a tenant.

**`runId`** is the run the call is made from inside. Every write takes it except `start_run`, which
opens the run, and the routine tools, which are the person's own act. Inside a run, send it on every
write until the run ends; the change history then records the write against Producer and the run.
A write without it is recorded as the signed-in person's own.

**`expectedVersion`** is the version a read answered. Every write on a niche — the niche itself,
its directions, segments, items, value propositions and demand evidence — takes the niche's
version and answers the whole niche with the new one. `update_agent`, `set_agent_status`,
`update_routine` and `set_channel_brand` take the version of what they change. `set_video_strategy`
takes none.

## Server and health

| Tool | Changes state | Reaches |
| --- | --- | --- |
| `server_info` | No | Nothing. Answers from the process itself: deployment, route, the tools it publishes |
| `ads_health`, `growth_health`, `publishing_health`, `seo_health`, `studio_health` | No | That service, over HTTP: whether this server reached it and was accepted |

## Runs

| Tool | Changes state | Takes |
| --- | --- | --- |
| `start_run` | **Yes** | `agentId`, `channelId`, `operationCode` for an operation run, `routineId` when a routine fired the session, `resumedFromRunId` to continue a paused run |
| `checkpoint_run` | **Yes** | `runId`, the `procedureCode` the run just finished, a note |
| `observe_run` | **Yes** | `runId`, a note |
| `pause_run` | **Yes** | `runId`, `headline` (1–120 characters), `summary` |
| `end_run` | **Yes** | `runId`, `outcome` `Completed` or `Failed`, `headline` (1–120 characters), `summary`, `reason` on a failure |
| `cancel_run` | **Yes** | `runId` — a person's call, never an agent's |
| `get_run`, `list_runs` | No | a run's events, checkpoints and progress; a channel's runs by status |

## Agent

| Tool | Changes state | Takes |
| --- | --- | --- |
| `list_agents`, `get_agent` | No | — |
| `boot_agent` | No | `agentId`, `channelId`. Answers the brief: instructions, the channel and its niches, videos by stage, the inbox count, answers resolved since the last run, where we left off, changes since |
| `update_agent` | **Yes** | the agent's title and instructions, `expectedVersion` — on the person's word |
| `set_agent_status` | **Yes** | `Active`, `Paused` or `Archived`, `expectedVersion` — on the person's word |

## Method

| Tool | Changes state | Takes |
| --- | --- | --- |
| `list_operations`, `get_operation` | No | `channelId`. The operation as this channel has it: text, thresholds, procedures in order with their source and version, a resumable run |
| `get_procedure` | No | the procedure's code, `channelId` |
| `list_part_descriptions`, `get_part_description` | No | the part's code. What a niche part is for, as the organisation has it |

## Insights

| Tool | Changes state | Takes |
| --- | --- | --- |
| `record_procedure_insight` | **Yes** | the procedure, `channelId`, title, body, `proposedText` for a whole new text |
| `record_operation_insight` | **Yes** | the operation, `channelId`, title, body, pitfall, the niche it applies to — never a text |
| `record_part_description_insight` | **Yes** | the part, title, body, `proposedText` for a whole new description |
| `supersede_insight`, `contradict_insight` | **Yes** | the insight, and for supersede the newer one |
| `list_insights`, `get_insight` | No | channel, subject and state filters; at most 50 rows and a count of the rest |

Applying or rejecting a proposal is the founder's, on Studio → Insights. No tool does it.

## Inbox

| Tool | Changes state | Takes |
| --- | --- | --- |
| `send_message` | **Yes** | `channelId`, title, body, the subject it is about, `runId` |
| `raise_escalation` | **Yes** | the same; the body ends with the proposed answer |

Reading, marking and resolving the inbox are the founder's, on Studio → Inbox.

## Routines

| Tool | Changes state | Takes |
| --- | --- | --- |
| `list_routines`, `get_routine` | No | `channelId`; one routine whole |
| `update_routine` | **Yes** | schedule, zone and instructions together, `expectedVersion` — no `runId` |
| `enable_routine`, `disable_routine` | **Yes** | the routine — no `runId` |

## Finding things

| Tool | Changes state | Takes |
| --- | --- | --- |
| `search` | No | a question of at most 1,000 characters, a limit of 1 to 20 (5 by default). Search by meaning |
| `get_neighbours` | No | a row's table and id. Search by connection |
| `run_analytical_query` | No | one `SELECT` over the property graph `studio`, at most 4,000 characters. Search by query; read-only, timed, capped. Sent as a write request, so a read-only organisation cannot run it |
| `get_history` | No | a run, or a subject's table and id. Who changed what, person or agent, in which run |

## Links

| Tool | Changes state | Takes |
| --- | --- | --- |
| `list_untyped_links` | No | `runId` to narrow to one run's rows, a cursor. Answers the words that may be typed with |
| `type_link` | **Yes** | the link, the word, the direction, a magnitude and unit, a new word, `runId` |

Confirming and rejecting a link are the founder's, on Studio → Links.

## Channels and the niche

| Tool | Changes state | Takes |
| --- | --- | --- |
| `list_channels`, `get_channel` | No | — |
| `get_niche` | No | the niche: directions, segments with their items, value propositions with their items, demand evidence with the verdict per value proposition, readiness |
| `set_channel_brand` | **Yes** | `OnPerson`, `Hybrid` or `Faceless`, `expectedVersion`, `runId` |
| `create_niche`, `update_niche`, `delete_niche` | **Yes** | the channel for a new draft; the niche's fields and version |
| `add_direction`, `update_direction`, `remove_direction`, `pick_direction` | **Yes** | the niche's version |
| `add_segment`, `update_segment`, `retire_segment`, `set_beachhead` | **Yes** | the niche's version |
| `add_segment_item`, `update_segment_item`, `retire_segment_item` | **Yes** | a job, pain or gain; the niche's version |
| `add_value_proposition`, `update_value_proposition`, `retire_value_proposition` | **Yes** | the segment it is for; the niche's version |
| `add_proposition_item`, `update_proposition_item`, `retire_proposition_item` | **Yes** | a product, pain reliever, gain creator, dream outcome, enhancer or name; the niche's version |
| `add_demand_evidence`, `remove_demand_evidence` | **Yes** | the library video, the keyword that found it, its outlier observation; the niche's version |
| `set_video_strategy` | **Yes** | a video's value propositions and segments, at least one of each, all of one niche |

Making a draft current is the founder's, on the channel screen. No tool does it.

## YouTube

| Tool | Changes state | Takes |
| --- | --- | --- |
| `search_youtube_videos` | **Yes** — writes every video it read into the library | keywords, channel ids, or both, and the criteria: subscribers, views, views-to-subscribers, multiple of the channel's average, published window, format, duration, results per keyword (at most 200) |

Not idempotent and open-world: it reads YouTube. When YouTube answers with a bot check it answers
UPSTREAM_UNAVAILABLE, "YouTube refused the search. Nothing was written; try again in a few
minutes."

## The second enforcement point

For any tool that reaches Studio, Studio then enforces **its own** permissions on the forwarded
token when the call arrives. So a caller needs both, and being refused by Studio rather than by
this server is the ordinary, correct outcome for somebody who may use this server and may not use
that data. A refusal that names a downstream is not a bug in this server.
