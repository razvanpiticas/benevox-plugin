# Choosing the word

Load this at step 5 of the loop. The words come from the page's words list; this file is how to pick
one, not a list of them.

## The test

Put the two ends into one sentence that a word's meaning describes, with the titles in it:

- "*Your agents build while you're at work* cannot hold unless *Developers with a day job* have a
  job that runs while they are away." — the sentence `depends_on`'s meaning describes, from the
  dependent to what it depends on.
- "*Every session ends with a finished increment* makes *Only 5–10 hours a week* matter less." —
  `decreases`, from the cause to what it lowers; a magnitude only when the text says how much.
- "*The run that settled the statement* answers *what the niche statement is*." — `answers`, from
  the answer to the question.
- "*AI factory in public* enables *Your agents build while you're at work*." — `enables`, from what
  makes it possible to what it makes possible.

The meaning is read whole, not only its verb. Where it says what the first row or the second is,
that end must be one, or the word does not fit, however well the rest of the sentence reads. Go on
to the next word, then to a new word, then to leaving the link untyped.

One sentence, one word. When two words both fit, the narrower one wins. When no sentence comes after
reading both ends whole, the link is already `related`: leave it untyped and report it as "read
both, no relation beyond likeness".

## Direction

Every meaning names a first row and a second. Decide which of the two ends is the first in your
sentence. The page lists the pair as `from` and `to`:

| Your sentence's first row is | Send |
| --- | --- |
| the listed `from` | `FromTo` |
| the listed `to` | `ToFrom` |
| — the word is undirected | `FromTo` |

`ToFrom` on an undirected word is refused; there is no direction to turn.

## Magnitude

Only on a word whose meaning says it may carry one, and only when the text states the size: "cuts
the editing time by 40%" → `magnitude` 40, `unit` %. A guess is not a magnitude. Both fields or
neither.

## A new word

Only when no word on the page makes a sentence, after reading both ends whole. Then send the code
(lower case, letters, digits, underscores: `filmed_for`) with `newWord`:

- its name, what the founder reads: "Filmed for";
- its description: one sentence of meaning naming the first row and the second, one of direction,
  one example — the shape of every shipped word's description on the page;
- whether it is directed: whether A→B differs from B→A.

The word exists for the organisation from then on; say so in the report. A code the product ships
is refused: use the shipped word.

## The duplicate flag

A possible duplicate: the two rows may be one thing written twice. Not typed, not merged, not
retired — reported, with both titles, so the founder rules on Studio → Links.

## A ruled link

A refusal saying a person already confirmed or rejected this link means the founder ruled on it
after the page was listed. It keeps the word it was ruled on, and no other word is taken: leave it
and report "ruled on by the founder". A rejected pair is never drawn again.
