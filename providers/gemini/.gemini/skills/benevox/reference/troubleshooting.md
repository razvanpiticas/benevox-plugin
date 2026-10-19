# When it does not work

Run the checks in order. The first two are cheap and settle most cases.

| # | Check | Proves |
| --- | --- | --- |
| 1 | Call `server_info` | Separates "unreachable or not signed in" from "signed in, call refused" |
| 2 | Open `https://mcp.benevox.dev/health` in a browser | The deployment is up. It answers `{"status":"ok"}` anonymously |
| 3 | Call `studio_health` | This server can reach Studio and be accepted by it |
| 3 | Call `ads_health` | This server can reach Ads and be accepted by it |
| 3 | Call `growth_health` | This server can reach Growth and be accepted by it |
| 3 | Call `publishing_health` | This server can reach Publishing and be accepted by it |
| 3 | Call `seo_health` | This server can reach Seo and be accepted by it |
| 4 | Call `list_channels` | Studio answers this account's own data |

## Symptom index

| Symptom | Cause | Fix |
| --- | --- | --- |
| Browser shows a redirect-uri mismatch during sign-in | The callback port in this harness's config is not one the realm registers | Use port `8125`, or register the port you used on `benevox-public-client` |
| Sign-in never opens a browser, or fails naming client registration | The harness is trying dynamic client registration, which this realm refuses | The harness must be told to use client id `benevox-public-client`. A harness with no field for it cannot sign in to this server |
| Every tool answers 401 | No token, or an expired one | Sign in again. If it recurs immediately, the token's audience does not name this server |
| Every tool answers 403 | The account belongs to no tenant, or has neither permission | Grant a role carrying `mcp:tools.read` on the roles screen, then sign in again |
| Reads work, every write answers 403 | The account has `mcp:tools.read` but not `mcp:tools.write`, or the organisation is read-only | Grant the write permission and sign in again; a read-only organisation writes again once its subscription does |
| A permission was granted but the call still answers 403 | The token was minted before the grant | Sign out fully and back in. Refreshing is not enough |
| Every write answers "This run has ended, been paused or belongs to someone else. Nothing was written; start a new run." | The run the writes carry is no longer running, or another person opened it | Start a new run and carry its id. Never drop `runId` to get the write through |
| `search_youtube_videos` answers "YouTube refused the search. Nothing was written; try again in a few minutes." | YouTube answered with a bot check, a 403 or 429, or the Data API's daily quota is spent | Wait a few minutes and send it again. Nothing reached the library |
| `search_youtube_videos` answers UPSTREAM_UNAVAILABLE, "… is not in the shape Studio reads: …. Nothing was written." | YouTube changed the answer of the call named, from the source named, and Studio cannot read it yet | Do not retry: it fails the same way until Studio is updated. Report the sentence. Nothing reached the library |
| `run_analytical_query` answers 403 while `search` works | The organisation is read-only: the query is sent as a write request | Use `search` and `get_neighbours`, which stay open |
| `studio_health` refuses, naming an address | Studio holds nothing at that path | A server-side routing fault. Report the address it named |
| `ads_health`, `growth_health`, `publishing_health` or `seo_health` refuses, naming an address | That service holds nothing at that path | A server-side routing fault. Report the address it named |
| `server_info` answers but names a different deployment | The harness is pointed at another host | Check the URL in this harness's MCP config |
| Tools are missing entirely from the session | The MCP server is configured but not loaded | Reload the harness. Most do not pick up a new server mid-session |
| A tool a skill names is not in `server_info`'s list | The plugin is older or newer than the server | Run the `benevox-update` skill |

## The one that is not a fault

A caller who belongs to no tenant gets 403 on every tool, including `server_info`. That is the
tenant isolation working, not a broken deployment. The fix is joining a tenant, not changing
anything about the server or the client.

## What this cannot tell you

If `/health` answers and `server_info` still fails for every account in every harness, the problem
is in the deployment rather than in any client — the realm, the ingress route, or the token
audience. That is a change in `src/services/Mcp/`, not here.
