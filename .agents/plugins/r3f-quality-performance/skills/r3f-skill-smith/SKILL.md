---
name: r3f-skill-smith
description: "Improve the r3f skills themselves from real runs. Use at the end of a scene job to turn what was learned — a finding the checklist missed, a near false-positive, a rule proven against source — into durable edits to the right skill's references/checklists. Use when a review keeps re-deriving the same rule, when a skill gave a wrong or noisy finding, or when you want the suite to get smarter over time instead of staying static. The retrospective half of the loop the other skills open."
---

# r3f-skill-smith

## Purpose

Close the feedback loop. Every time a skill is applied to real code, the run produces three
kinds of signal worth keeping: a **rule the checklist should have had** (a real finding it
missed or re-derived from scratch), a **near false-positive** (something it almost flagged but
shouldn't have — the discriminating knowledge that keeps findings trustworthy), and a **rule
proven against source** (an assumption replaced by a primary-source fact). This skill turns that
signal into durable improvements to the right skill's references — so the suite gets sharper with
use instead of staying frozen at however smart it was the day it was written.

It is the retrospective half of the loop the other skills open. They find and fix; this one asks
"what did that teach us, and where does it belong?"

## Use when

- A scene job just finished and produced findings, near-misses, or a source-verified rule.
- A review keeps re-deriving the same rule by hand — that rule wants to be a checklist item.
- A skill produced a wrong or noisy finding — the correction is itself a lesson worth banking.
- You want the suite self-improving on a schedule (a periodic pass over accumulated lessons).

## Workflow

1. **Load the promotion rules first:** `references/lesson-promotion.md`. The guardrails there are
   what keep self-improvement from becoming self-degradation. Do not skip them — an unfiltered
   "append everything I learned" pass bloats and over-fits the skills.
2. **Gather the run's signal.** From the just-finished job, list: findings the checklist caught,
   findings it *missed*, things it almost false-flagged, and any rule you had to verify against
   source mid-run. Each item needs its evidence (file/line, a primary-source path, or a repro).
3. **Journal everything to `LESSONS.md`.** Append a dated, evidenced entry per lesson — *before*
   deciding what to promote. The journal is the audit trail; not every lesson graduates to a
   reference, but every lesson is recorded.
4. **Decide promotions against the gate** (`lesson-promotion.md`): generality, evidence,
   severity/recurrence, budget, and the no-project-leakage rule. A lesson that passes becomes an
   edit to a specific reference or checklist in a specific sibling skill. A lesson that fails
   stays in the journal only.
5. **Propose the diffs — do not silently rewrite.** Present each promotion as a concrete edit to
   a named file with the motivating evidence, for human approval. Self-editing skills are
   suggest-then-apply, not autonomous overwrite (see `lesson-promotion.md` on the human gate).
6. **On approval, apply and attribute.** Make the edit, and link the `LESSONS.md` entry so the
   reference change is traceable back to the run that motivated it.

## Common failure modes

- **Appending without curating.** Promotion sometimes means tightening or merging an existing
  rule, not adding a new bullet. Growth-only references rot into unreadable walls.
- **Promoting a one-off.** A quirk of one scene is journal material, not a checklist item. Only
  rules that catch a *class* of problems graduate.
- **Leaking project specifics.** A promoted rule must be framework-level and name no private
  codebase, file, or product. The journal may reference a run; the references never do.
- **Banking an assumption as a fact.** A lesson "proven" by a passing self-test isn't proven.
  Promote source-verified or reproduced rules; mark anything softer as provisional.
- **Silent self-rewrite.** Editing skills without surfacing the diff removes the human gate and
  makes drift invisible. Always propose first.

## Final response

1. **Lessons journaled** — the entries appended to `LESSONS.md`, with evidence.
2. **Promotions proposed** — per promotion: the target skill/file, the exact edit, the gate it
   passed, and the motivating evidence.
3. **Held back** — lessons that stayed in the journal only, and which gate they didn't clear.
4. **Applied** — once approved: the reference edits made and their `LESSONS.md` backlinks.
