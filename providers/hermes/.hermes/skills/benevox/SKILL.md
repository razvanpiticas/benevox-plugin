---
name: "benevox"
description: "The front door to Benevox Studio and the connection under every other Benevox skill. Invoked with nothing, it signs in, picks the channel, boots the Producer agent, says where the channel stands and what happened last, proposes the one thing that should happen next, and offers everything else the plugin can do — Pick a niche first among them. Use when the person types the Benevox command alone, asks \"where do we stand\", \"what's next\", \"what can you do\", or for a menu; when a Benevox tool refuses a call; or when connecting a harness to the Benevox server."
---

# Benevox

Benevox's MCP server fronts the product's Studio service: the founder's channels, each channel's
niche (draft, current and past), the method the Producer agent follows, its runs, its inbox, its
routines, and the library of studied YouTube videos. It holds no database of its own: every tool
call is an HTTP call to a service that already enforces the product's own rules, made **as the
person using the model** rather than as a service account.

That is the fact everything else follows from. The server never sees more than the caller does, so
a tool that refuses is usually reporting the caller's own access rather than a fault.

**A task typed after the command is routed before anything else is done**, as
[The front door](#the-front-door) says: every task goes through `benevox-agent`, a question as much
as a write, and nothing goes straight to another skill — not even when that skill's description
names the task, as `benevox-niche`'s names Pick a niche. The first skill invoked for any task is
`benevox-agent`; the skill that does the work is invoked from inside it, after the boot, never from
here. Nothing is read or written in a session before Producer is booted.

## Connecting

The server is declared under `mcp_servers` in `~/.hermes/config.yaml`.

Sign-in is OAuth against the Keycloak realm at `keycloak.quantarcane.io`, using the public client
`benevox-public-client` and the loopback callback on port `8125`. Both halves are fixed: a different
port is a redirect-uri mismatch, not a preference.

**Call `server_info` first when anything is wrong.** It answers without touching any downstream
service, so it separates "the server is unreachable or I am not signed in" from "the server is fine
and the call was refused".

## The front door

`the benevox skill` with nothing after it is the way in for somebody who does not know what to
ask. Named with a task instead — after the command, or as the answer to step 2 or step 6 — the task
skips the status and the menu and goes one way, whatever it is: through `benevox-agent`. Pick the
channel as step 2 says when it is not known, boot Producer as step 3 says, and hand it the task as
it was made. A skill whose description seems to match the task is not the route: that skill is
reached from inside `benevox-agent`.

- **A question** — "when did we decide the promise statement", "what do we know about the beachhead",
  "is there already a value proposition like this" — `benevox-agent` hands to `benevox-search`
  inside the booted session. Do not answer it here from `get_niche` or the brief: which instrument
  answers is that skill's rule, and its answer names the one it used.
- **Work that writes** — Pick a niche, the linker, the distiller, a write on the niche, a watch
  channel or a video's strategy — `benevox-agent` invokes the skill that does the work; the run
  carries Producer's id, every write carries the run's id, and the run ends with its links typed.
- **The routines menu and the plugin update** — `benevox-agent` hands to `benevox-routines` or
  `benevox-update`; the routine tools take no run id, so switching a routine on stays the person's
  act.

Six steps, in this order, and every one of them reads before it says anything.

1. **Sign in.** Call `list_channels`. A 401 means sign in again, as [Connecting](#connecting) says;
   a 403 is explained, not retried; any other refusal — `server_info` first, then
   [Reading a refusal](#reading-a-refusal). Nothing else is called until this answers.
2. **Pick the channel.** One own channel: take it, say which. More than one: list them by name and
   ask. Ask the user directly to clarify what you cannot infer. Never pick for the person; a status of the wrong channel is worse than
   a question. No channel at all: say so — channels are added on Studio → Channels — and stop.
3. **Boot.** Boot Producer on that channel through the `benevox-agent` skill, which calls
   `list_agents` and `boot_agent` and reads the brief in its order.
4. **Status.** Five lines, each read from the brief or from one more call, never invented — the
   fields are in [reference/front-door.md](reference/front-door.md).
5. **The next action.** One sentence, from the next-action rule in
   [reference/front-door.md](reference/front-door.md), naming the skill that does it and asking
   whether to do it now.
6. **The menu.** The lines in [reference/front-door.md](reference/front-door.md), verbatim, then do
   what the person picks the way a named task goes, above: through Producer booted in step 3, a
   question as much as a write. "Pick a niche" goes to `benevox-niche` through `benevox-agent`,
   which hands it Producer's id so the niche run is opened under the agent.

The whole thing is read-only. Nothing is written, no run is opened, until the person picks
something; then the run is opened through `benevox-agent` or the skill it routes to, never by a
skill invoked from here.

## What access means here

Two permissions gate everything:

| Permission | Covers |
| --- | --- |
| `mcp:tools.read` | Every tool that only reads |
| `mcp:tools.write` | Every tool that changes something |

They are granted through Benevox's own roles screen, per tenant, like every other permission in the
product. A session where reads succeed and writes answer 403 is a role problem, not a connection
problem — and re-authenticating does not fix it, because the token has to be minted again *after*
the role is granted. Studio then checks its own permissions on the forwarded token, and an
organisation whose subscription is read-only answers every write with 403 `read-only`.

Every call is also tenant-scoped from the caller's token. A caller who belongs to no tenant gets
403 on everything, which is correct rather than broken.

## The tools

Ninety tools. Eighty-four over Studio — runs, with checkpointing a procedure and going back to one,
the agent and its boot brief, the method (the operation, its procedures, the part descriptions),
insights, the inbox, routines, search by meaning, by connection and by query, the change history,
links, channels, the niche with its potential niches, shortlist, TAMs and pick, its promise
statements and promise groups, segments and value propositions, the channel's watch channels with
their profiles, offers, roles and links, a video's strategy, and `search_youtube_videos` — plus
`server_info` and five `*_health` checks. The full table with permissions and which tools take a
version or a run is in [reference/tools.md](reference/tools.md). **How to read and write a
channel's niche and watch channels — which part, which fields, which version — is the
`benevox-studio` skill; load it for any read or write on a niche, a watch channel, a video's
strategy or the library.** Pick a niche, its five procedures and going back to one are the
`benevox-niche` skill. Being Producer is the `benevox-agent` skill.

The server's own words — run, checkpoint, draft, founder's skills and likes, potential niche,
shortlist, pick, promise statement, promise group, outlier, proven, TAM, watch channel, beachhead,
value proposition, related — are the resource `benevox://glossary`. Read it once in a session
before the first search.

`server_info` reports the tool list; when it disagrees with this file or any document, it is right.

## Reading a refusal

A refused call names the arguments at fault and says whether retrying is worth anything. Read it
rather than resending the same call.

- **The refusal names an argument** — fix the argument and retry once.
- **The refusal is a 403** — a permission, tenant or read-only problem. Retrying cannot fix it.
  Tell the user which permission is missing.
- **The refusal is a 401** — the token expired or was never minted. Sign in again.
- **The refusal is a CONFLICT naming a version** — the niche, a watch channel, the procedure, the
  agent or the routine moved since you read it. Re-read and decide again from what it says now;
  never resend the same call with the newer number alone.
- **The refusal is a CONFLICT naming `runId`** — "This run has ended, been paused or belongs to
  someone else. Nothing was written; start a new run." Every other call carrying that run is refused
  the same way. Stop working it, say so, and start a new run before writing anything else.
- **The refusal is a CONFLICT quoting a rule** — "This channel already has a draft niche. Finish or
  delete it first.", "A pain reliever points at a pain of its proposition's segment." — the call is
  not allowed in the niche's current state. Change what you asked for; do not resend.
- **The refusal is UPSTREAM_UNAVAILABLE** — a downstream could not answer: Studio, or YouTube
  refusing a search. Its recovery says whether retrying later is worth it; nothing was written.
- **The refusal says a downstream holds nothing at that address** — an id named nothing. Read what
  exists and address it by what the read answered.

A refusal that fits none of these is worth a question rather than a second attempt.
Ask the user directly to clarify what you cannot infer.

For symptoms that survive a retry, read
[reference/troubleshooting.md](reference/troubleshooting.md).

## Rules that are easy to get wrong

**Never invent a tenant.** No tool takes a tenant argument, and none should — the tenant comes from
the token. A call that appears to need one is a sign the wrong tool was chosen.

**Never invent an id.** Channels, niches, potential niches, promise statements, segments, value
propositions, watch channels, runs and agents are addressed by the ids a read answered. People
speak in names; find the id, never ask for it.

**Do not cache what a read returns across turns.** It is live state the founder can change on the
screens between calls, and every niche write is checked against the version you last read.

**A write is not confirmed until the tool says so.** Every write returns what it wrote; if the call
refused, nothing was written unless the message says otherwise, and reporting otherwise to the user
is worse than reporting the failure.
