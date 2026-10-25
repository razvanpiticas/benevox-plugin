# Analysing a subject's insights

Load this before writing anything. The reading is done; this is what to make of it.

Two words, both read off the rows `list_insights` answers. A **confirmed** insight is `Open` with
`reviewState` `Approved`: a person wrote it, and it was approved as it was written. A **draft** is
`Open` with `reviewState` `Draft`: an agent recorded it in a run, and nobody has ruled on it.

## Group

Within one subject, put insights together when they are about the same thing: the same step of a
procedure, the same sentence of a part description, the same pitfall of the operation. An insight
may be about two things; then it is in two groups, and the digest says so.

## Recurring

A group with two or more insights from different runs or from the founder and a run, saying the
same thing in different words, **recurs**. One insight, however strongly worded, does not: it is
left where it is, unless it already carries a proposal the founder can rule on.

## Contradicting

Two insights that cannot both hold contradict. Two **drafts** that contradict are both left
standing and named in the digest — the founder has not looked at either. A draft that contradicts a
**confirmed** one is left standing, and the digest says which confirmed insight it challenges. Two
**confirmed** insights that contradict are the one case that is escalated: neither can be folded
away, and only the founder may say which survives.

## What the text should say instead

A recurring group on a procedure or a part description yields a proposal when the insights say the
text misled, omitted or contradicted what happened. The proposal is the whole current text with the
change in place — read it once more as the agent that will follow it on the next run. It keeps the
subject's voice (a procedure's numbered steps; a part description's plain sentences), quotes no
source text word for word, and changes nothing the insights do not support.

A recurring group on the operation yields a distilled statement: one insight whose title is the
finding and whose body says what recurred, in which runs, and what to watch for; `pitfall` and
`appliesWhenNiche` when they fit.

Every distillate's body ends with a line "Distilled from: " followed by the titles of the insights
it folds in and the runs it read.

## Stale

A confirmed insight whose `updatedAtUtc` is older than a month, with no run in the window naming
it, is stale. Read them with `list_insights(state: "Open")` — the channel's, and the part
descriptions' with no `channelId` — and keep the rows whose `reviewState` is `Approved`. Stale is a
question for the founder, not a verdict: list every stale insight of the pass in one escalation, by
subject and title, asking which still hold.

## The digest

Handed to `benevox-agent` for the run's summary. In this order, plain lines, counts first:

- the window or the subject, and how many insights were read, of which how many drafts and how
  many confirmed;
- how many were folded together, and into what: each distillate by subject and title, and what it
  superseded;
- every proposal, by subject, with one sentence on what changes and why;
- every escalation raised: the contradictions, the stale list with its count;
- every confirmed insight contradicted on the founder's word;
- what was left alone and why: single insights, drafts that contradict, subjects with nothing to
  fold;
- what the pass could not read: a refusal, a run it could not open, a subject it could not resolve.

The summary also carries `Next:`, and one `Waiting:` line per proposal — "Waiting: founder applies
or rejects the Potential niches shortlist proposal on Studio → Insights" — and per escalation, so
the next boot names them. The run is ended, never paused; when a routine fired it, Studio files the headline and
this summary in the founder's inbox as the run's report.

No recommendation the founder did not ask for, and no insight of the pass's own.
