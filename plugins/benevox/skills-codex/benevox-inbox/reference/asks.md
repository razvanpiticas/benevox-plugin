# The asks a run raises under the unattended rule

Each is one escalation, raised by the skill that is at the point, with `runId`, followed by
`pause_run` in that skill — except the distiller's, whose run ends with a `Waiting:` line for each —
or one message, when there is nothing for the founder to decide. The body's last sentence is always
the proposed answer.

| Ask | Raised by | Shape | Subject | Body, in this order | Proposed answer |
| --- | --- | --- | --- | --- | --- |
| Apply a proposal | nobody: recording the proposal files an insight review in the inbox | not an escalation | — | — | — (the founder applies or rejects it on Studio → Insights; the digest carries a `Waiting:` line for it) |
| Two confirmed insights contradict — each `Open` with `reviewState` `Approved` | `benevox-distiller` | escalation | the newer insight, in its own table: `procedure_insights`, `operation_insights` or `part_description_insights` | both insights by title; what each says; the subject | which one still holds, one sentence why |
| Stale insights | `benevox-distiller`, once per night | escalation | none | every confirmed insight (`Open`, `reviewState` `Approved`) with no fresh evidence for a month, by subject and title | "these still hold: …", or "contradict …" |
| Pick a niche asked of a routine | `benevox-niche` or `benevox-agent`, when a routine's text or prompt asks for it | message | none | what was asked; that Pick a niche runs only with the founder present; that nothing was written | — (a message proposes nothing) |
| A missing key, tool or access | any skill | escalation | the row it concerns, when there is one | what was needed; what was tried; what the run can do without it | "skip it", or "wait for the key" |
| A skill the routine names is not installed | `benevox-agent` | message | none | the routine, the skill it names, that nothing was done | — |

Never an escalation: a write on the niche — done and recorded against the run; the run's record —
`end_run`'s headline and summary, which Studio files as the run report when a routine fired the run;
a proposal — its review is filed when it is recorded; a proposal's ruling when the founder is in the
chat — ask there.
