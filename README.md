# Benevox agent plugin

Connects your coding agent to the Benevox MCP server at `https://mcp.benevox.dev` — project
data, tenant-scoped, under your own permissions rather than a service account's.

**This repository is generated.** Every file in it is build output from the Benevox monorepo. Edits
here are overwritten by the next publish; open a change against the source instead.

## Install

Claude Code:

```
/plugin marketplace add razvanpiticas/benevox-plugin
/plugin install benevox@benevox-plugins
```

Codex:

```
codex plugin marketplace add razvanpiticas/benevox-plugin
codex plugin add benevox@benevox-plugins
```

Cursor, Gemini CLI, OpenCode, OpenClaw, Hermes — run this in your project:

```
npx github:razvanpiticas/benevox-plugin install
```

It detects which of those harnesses you have, writes the skill and the server declaration, and
prints anything it will not write for you.

Any other MCP client: add `https://mcp.benevox.dev/mcp` and set the OAuth client id to
`benevox-public-client`.

## After installing

Sign in when prompted, then ask your agent to call the `server_info` tool. It answers with the
deployment name and the tools it publishes, and it touches nothing else — so it is the one call
worth making first when something is not working.

Access is granted on Benevox's own roles screen, per tenant: `mcp:tools.read` and `mcp:tools.write`.
Reads working while writes answer 403 means the write permission has not been granted, or the
token predates the grant.

Version 0.1.0+0d997744a543.
