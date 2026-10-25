# The tools, in full

Every tool publishes its own input schema. Read it there rather than guessing at field names —
this file carries what the schema cannot say: which permission each tool demands, whether it
changes anything, and whether it takes a version or a run.

Every tool that reads needs `mcp:tools.read`; every tool that writes needs `mcp:tools.write`.
None of them is anonymous: every one requires a signed-in caller who belongs to a tenant.

**`runId`** is the run the call is made from inside. Every write takes it except `start_run`, which
opens the run, and the routine tools, which are the person's own act. Inside a run, send it on every
write until the run ends; the change history then records the write against Producer and the run.
A write without it is recorded as the signed-in person's own. `cancel_run` takes it and is refused
with it: a cancel is made on the founder's word, with no run.

**`expectedVersion`** is the version a read answered. Every write on a niche — the niche itself,
its potential niches, the shortlist, combinations, TAMs and the pick, promise statements, promise
groups and their outliers, segments, items and value propositions — takes the niche's version and
answers the whole niche with the new one. Every write on a watch channel — what was typed about it,
its role, its monitoring, its offers and its links — takes the watch channel's version and answers
the whole watch channel; `add_watch_channel` and `profile_watch_channel` take none. `update_agent`,
`set_agent_status`, `update_routine` and `set_channel_brand` take the version of what they change.
`set_video_strategy` takes none.

## Server and health

| Tool | Changes state | Reaches |
| --- | --- | --- |
| `server_info` | No | Nothing. Answers from the process itself: deployment, route, the tools it publishes |
| `ads_health`, `growth_health`, `publishing_health`, `seo_health`, `studio_health` | No | That service, over HTTP: whether this server reached it and was accepted |

## Runs

| Tool | Changes state | Takes |
| --- | --- | --- |
| `start_run` | **Yes** | `agentId`, `channelId`, `operationCode` for an operation run, `routineId` when a routine fired the session, `resumedFromRunId` to continue a paused run |
| `checkpoint_run` | **Yes** | `runId`, the `procedureCode` the run just finished, a note. Refused while the subject lacks what the procedure must leave on it, with the sentence saying what is missing — "Shortlist exactly three potential niches before checkpointing Potential niches shortlist (2 shortlisted).", "Every shortlisted niche needs 3 promise statements with 10 keywords each (8 of 9 complete)." |
| `reopen_procedure` | **Yes** | `runId` (required: the operation run going back), the `procedureCode` to go back to. That procedure and every finished one after it are unfinished again; the subject keeps everything written on it; checkpoint each again as it is finished again. Refused for a procedure the run has not completed: "<procedure name> is not checkpointed." |
| `observe_run` | **Yes** | `runId`, a note |
| `pause_run` | **Yes** | `runId`, `headline` (1–120 characters), `summary` |
| `end_run` | **Yes** | `runId`, `outcome` `Completed` or `Failed`, `headline` (1–120 characters), `summary`, `reason` on a failure |
| `cancel_run` | **Yes** | `targetRunId`, the run to stop; `runId` as on every write. A person's act: send it on the founder's word with no `runId`, and the call is theirs. Sent with one, Studio refuses it with "Only a person cancels a run. End or pause the run you are in, and cancel a run only on the founder's word, with no run: that call is the founder's own act." The founder also cancels on Studio → Runs — Cancel, on a running or paused run |
| `get_run`, `list_runs` | No | a run's events, checkpoints (each `Finished` or `Reopened`) and progress; a channel's runs by status |

## Agent

| Tool | Changes state | Takes |
| --- | --- | --- |
| `list_agents`, `get_agent` | No | — |
| `boot_agent` | No | `agentId`, `channelId`, `routineId` when a routine fired the session. Answers the brief: instructions, the channel and its niches, videos by stage, how many inbox items wait on this channel, the escalations this session's stream raised on the channel — that routine's runs, or the founder's own sessions with no `routineId` — resolved since that stream's last run, with the founder's note, where we left off, changes since |
| `update_agent` | **Yes** | the agent's title and instructions, `expectedVersion` — on the person's word |
| `set_agent_status` | **Yes** | `Active`, `Paused` or `Archived`, `expectedVersion` — on the person's word |

## Method

| Tool | Changes state | Takes |
| --- | --- | --- |
| `list_operations`, `get_operation` | No | `channelId`. The operation as this channel has it: description, validated-when and if-not, thresholds, the procedures in order — each by code, name, source and version, never its text — and a resumable run |
| `get_procedure` | No | the procedure's code, `channelId`. Its instructions, the only read that carries them |
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

Reading, marking and resolving the inbox are the founder's, on Studio → Inbox. Studio files two
kinds itself: an insight review for each proposal an agent records, and a run report — the
headline and summary — when a run a routine fired ends Completed or Failed.

## Routines

| Tool | Changes state | Takes |
| --- | --- | --- |
| `list_routines`, `get_routine` | No | `channelId`; one routine whole |
| `update_routine` | **Yes** | schedule, zone and instructions together, `expectedVersion` — no `runId` |
| `enable_routine`, `disable_routine` | **Yes** | the routine — no `runId` |

Made inside a run, each is refused with "Only a person changes a routine. Call the routine tools
with no run: they are the founder's own act." A run carrying a routine's id starts only while that
routine is on.

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
| `list_untyped_links` | No | `runId` for the links touching one run's rows, the session's own; or `channelId` for one channel's backlog, the nightly pass's, with no `runId`; a cursor. Answers the words that may be typed with |
| `type_link` | **Yes** | the link, the word, the direction, a magnitude and unit, a new word, `runId` |

Confirming and rejecting a link are the founder's, on Studio → Links.

## Channels and the niche

| Tool | Changes state | Takes |
| --- | --- | --- |
| `list_channels`, `get_channel` | No | — |
| `get_niche` | No | the niche whole: its own fields; `minDemandChannels`; the procedures of the operation run on it, each done or not; potential niches best rank first, each with its skill score, like, shortlist and pick marks, TAM, outliers, distinct channels, proven promises, promise statements with their counts, promise groups with their outliers and whether each is proven, and its watch channels' offers; segments with their items; value propositions with their items, distinct channels and the watch channels behind them; readiness, every blocker in order |
| `set_channel_brand` | **Yes** | `OnPerson`, `Hybrid` or `Faceless`, `expectedVersion`, `runId` |
| `create_niche`, `update_niche`, `delete_niche` | **Yes** | the channel for a new draft, which keeps the current niche's founder's skills and likes; the niche's fields whole — founder's skills and likes, promise statement, audience, problem, method, keywords, TAM, adjacent niches, confidence note — and version |
| `add_potential_niche`, `update_potential_niche`, `remove_potential_niche` | **Yes** | a potential niche whole — name, rank, who it serves, problem, how it makes money, advantage, skill score 1–5, liked — for an add or an update; at most ten, ranks 1 to n; removing one is refused once one is picked; the niche's version |
| `shortlist_potential_niche` | **Yes** | `isShortlisted`; only one the founder likes, three at most, the picked one stays; the niche's version |
| `combine_potential_niches` | **Yes** | two potential niches and the combination whole, with its rank and skill score; it carries both parts' statements, groups and findings, and has no TAM; the niche's version |
| `set_potential_niche_tam` | **Yes** | a shortlisted potential niche's TAM whole: low and high views per video, evidence note, adjacent niches, the watch channels and library videos it rests on (at least one); the niche's version |
| `pick_potential_niche` | **Yes** | a shortlisted potential niche whose TAM is written and one of its promise statements; copies the statement, audience, problem, method, keywords, TAM and adjacent niches onto the niche; picking another moves it; the niche's version |
| `add_promise_statement`, `update_promise_statement` | **Yes** | under a shortlisted potential niche: sentence, audience, problem, method, up to ten keywords (complete with ten); at most three per potential niche; the niche's version |
| `add_promise_group` | **Yes** | under a shortlisted potential niche: its promise, in a line; the niche's version |
| `add_promise_group_outlier` | **Yes** | a promise group, the library video, the promise statement and keyword of it that found the video; one group per video per potential niche; the niche's version |
| `add_segment`, `update_segment`, `retire_segment`, `set_beachhead` | **Yes** | the niche's version |
| `add_segment_item`, `update_segment_item`, `retire_segment_item` | **Yes** | a job, pain or gain; the niche's version |
| `add_value_proposition_from_promise_group`, `update_value_proposition`, `retire_value_proposition` | **Yes** | for an add, the promise group of the picked potential niche it is made from and the segment it is for, one live per group; its demand is the group's outliers; the niche's version |
| `add_proposition_item`, `update_proposition_item`, `retire_proposition_item` | **Yes** | a product, pain reliever, gain creator, dream outcome, enhancer or name; the niche's version |
| `set_video_strategy` | **Yes** | a video's value propositions and segments, at least one of each, all of one niche |

Making a draft current is the founder's, on the channel screen. No tool does it.

## Watch channels

| Tool | Changes state | Takes |
| --- | --- | --- |
| `list_watch_channels` | No | `channelId`. Each watch channel with its version, YouTube channel id, title, handle, page, role, monitored, its latest profile only, its outlier count and linked value propositions |
| `get_watch_channel` | No | the watch channel whole: what found it, its offers, its links, its profiles newest first, the library's videos of its channel, its outliers in the promise groups |
| `add_watch_channel` | **Yes** | the own `channelId`, the YouTube channel id and handle (as `search_youtube_videos` answered them, `youTubeChannelId` and `channelHandle`), title, page, language, created date, and what found it: a shortlisted potential niche, the promise statement (none for the main term), the keyword. No version. A channel kept already only files the finding |
| `update_watch_channel` | **Yes** | its page, language and created date whole; the watch channel's version |
| `set_watch_channel_role` | **Yes** | `Competitor`, `Inspiration` or `Adjacent`, or none to clear it; the watch channel's version |
| `set_watch_channel_monitoring` | **Yes** | `isMonitored`; stopping keeps everything it holds, and no tool deletes one; the watch channel's version |
| `profile_watch_channel` | **Yes** — writes a new dated snapshot of the YouTube channel | the watch channel. No version. Reads YouTube through the platform's fact source on the long-call budget, so it is slow and not idempotent: once per channel |
| `add_watch_channel_offer`, `update_watch_channel_offer`, `remove_watch_channel_offer` | **Yes** | what it sells, price, members, the source page (required) and the day read; the watch channel's version |
| `link_watch_channel`, `unlink_watch_channel` | **Yes** | a value proposition or a segment of the channel's niche, not both; the watch channel's version |

## YouTube

| Tool | Changes state | Takes |
| --- | --- | --- |
| `search_youtube_videos` | **Yes** — writes every video it read into the library | keywords, channel ids, or both; `sort` (`Relevance` or `MostViewed`) and `longFormOnly` on every search; and the criteria: subscribers, views, views-to-subscribers, multiple of the channel's average, published window, duration, results per keyword (at most 200) |

Not idempotent and open-world: it reads YouTube. Each passing video carries `factsReadFrom`, the
source that read its facts (`Website` or `DataApi`); the answer carries `factSource`, the platform's
setting (`Website`, `DataApi`, `DataApiThenWebsite` or `WebsiteThenDataApi`), and `fallbackUsed`.
Keyword search always reads the YouTube website.

`MostViewed` answers the passing videos by their exact views, highest first; `longFormOnly: true`
keeps no Short and no video of 3 minutes or less.

When YouTube refuses — a bot check, the Data API's daily quota spent — it answers
UPSTREAM_UNAVAILABLE, "YouTube refused the search. Nothing was written; try again in a few
minutes." Retry a few minutes later, not at once. `profile_watch_channel` answers the same way, and
NOT_FOUND, "YouTube has no channel UC…. It answered "…"; nothing was written.", for a YouTube channel
id YouTube does not have.

When YouTube answers in a shape Studio cannot read, it also answers UPSTREAM_UNAVAILABLE, with
Studio's sentence naming the source and the call and ending "Nothing was written." Do not retry:
it fails the same way until Studio is updated. Tell the person.

## The second enforcement point

For any tool that reaches Studio, Studio then enforces **its own** permissions on the forwarded
token when the call arrives. So a caller needs both, and being refused by Studio rather than by
this server is the ordinary, correct outcome for somebody who may use this server and may not use
that data. A refusal that names a downstream is not a bug in this server.
