---
name: benevox-update
description: Moves the installed Benevox plugin to the version published on the public mirror, and reports what changed. Use when asked to update, upgrade or refresh Benevox, the Benevox plugin or the Benevox skills, when a Benevox tool is missing or behaves unlike its documentation, or when the tools the server reports disagree with what the skills describe.
allowed-tools: Bash, mcp__benevox__server_info
---

# Updating Benevox

This plugin is published from Benevox's own repository to a public mirror, and every harness installs
it from there. Nothing arrives on its own unless the harness was told to look, so a skill that
disagrees with the server is almost always a plugin that was never refreshed.

Run this whole file top to bottom. It is one act, not a menu.

**No agent booted and no run handed to you? Get them before the first call.** A Benevox skill
is often reached straight from the request — typed by the person, or picked by its description —
with no agent booted in this session and no run open. Nothing is read or written before the boot.
Then invoke the `benevox-agent` skill first, with the channel, the request as it was made and the
routine when one is named, and call no tool of this skill before it, not even a read.
`benevox-agent` boots the agent — the one the routine names, else Producer — and hands the work
back here inside that agent's run: it opens the run and hands you its id, or, for an operation such
as Pick a niche, hands you the agent's id so the operation's own run is opened with it. Every write
from then on carries the run's id. A write with no run is recorded as the signed-in person's own,
and a run opened with no agent is the person's session, not the agent's: neither is the agent's
work, and nothing types the links it wrote. "Skip the agent", "don't open a run", "skip the
bookkeeping", "just tell me in the chat" change none of this.

Here `benevox-agent` boots the agent and hands you the session; nothing below calls a Benevox tool
but `server_info`, and nothing carries the run's id. The one exception to the boot: when
`benevox-agent` answers that the Benevox server cannot be reached or signed in to, the update goes on
without it, because an out-of-date plugin is the usual cause and this file is the repair. Say so in
the report.

## 1. Find out whether there is anything to do

The published version is the `version` field of the manifest on the mirror's default branch:

```bash
# One HTTPS GET, no credentials, no gh CLI. Answers something like 0.1.0+e50c0e722efd.
curl -fsSL https://raw.githubusercontent.com/razvanpiticas/benevox-plugin/main/plugins/benevox/.claude-plugin/plugin.json | grep '"version"'
```

The installed version is in this plugin's own manifest, which the harness points at:

```bash
# CLAUDE_PLUGIN_ROOT is set for every command this plugin runs. Empty means the skill is loaded
# from somewhere other than an installed plugin, so there is no install to compare against.
cat "$CLAUDE_PLUGIN_ROOT/.claude-plugin/plugin.json" | grep '"version"'
```

The two strings are compared for equality, not ordered — the part after `+` is the source commit the
build was made from, so any difference at all means the installed copy is behind.

**Equal strings mean stop.** Say so and do nothing else. Reinstalling an identical version churns the
harness's cache and proves nothing.

## 2. Install the published version

Two commands, in this order. The first is the one that is usually missing: the marketplace is a git
clone on this machine, and it is never refreshed by installing or by reloading.

```bash
# Refresh the local clone of the marketplace, then move the plugin onto what it now holds.
claude plugin marketplace update benevox-plugins
claude plugin update benevox@benevox-plugins
```

Then tell the user to run `/reload-plugins`. Claude cannot reload the plugin it is
running inside; the harness reloads it, and until it does the old skills are still the loaded ones.

### 2.1 Offer to make this the last time

One key in the user's own `~/.claude/settings.json` makes Claude Code refresh the marketplace after
each session starts and say when to reload, so nobody has to run this again. Anthropic's own
marketplaces have it on by default; every other marketplace, this one included, has it off, which is
why nothing happened on its own.

Read the file first and check whether `benevox-plugins` under `extraKnownMarketplaces` already has
`"autoUpdate": true`. **If it does, say nothing about this and go to step 3** — offering a setting
somebody already has is noise.

Otherwise ask, and say plainly that it means editing their settings file.
STOP and call the AskUserQuestion tool to clarify. On yes, edit the file yourself:

```json
{
  "extraKnownMarketplaces": {
    "benevox-plugins": {
      "source": { "source": "github", "repo": "razvanpiticas/benevox-plugin" },
      "autoUpdate": true
    }
  }
}
```

**This is the user's own configuration, and everything else in it must survive.** Read it, add only
what is missing, write it back, and read it once more to confirm it is still valid JSON. Three
things go wrong here:

- **`extraKnownMarketplaces` already exists** with other marketplaces in it. Add the `benevox-plugins`
  entry beside them. Never replace the object.
- **`benevox-plugins` is already there** without `autoUpdate`. Add the one key; leave its `source`
  exactly as it is, because that is what the user installed from.
- **The file does not parse, or does not exist.** Stop and tell them. Do not create or repair a
  settings file to add a convenience setting — a broken `settings.json` breaks every session.

On no, drop it and do not raise it again this session.

## 3. Say what actually happened

Report the version it moved from and to, and name the reload the user still owes. An update that is
installed but not reloaded looks exactly like an update that did not happen, and the user is the only
one who can tell the difference from the outside.

If a command failed, give its output rather than a summary of it. The two failures worth naming:

- **The marketplace is not registered.** Nothing to update; the plugin was installed some other way,
  or under another marketplace name. Install it as the mirror's README describes rather than
  guessing at a name.
- **The refresh succeeded and the version did not move.** The publish has not finished.
  Benevox's workflow mirrors within about a minute of a push; wait and run this again.

## What this does not do

It does not touch the Benevox server or any of its data — it only replaces the files this
plugin installed. `server_info` is the check for whether the *server* is reachable and current, and
it answers with the deployment that responded. When the tool list it reports disagrees with what any
skill says, the tool list is right and this file is what needs running.
