# Lesson promotion — the gate that keeps self-improvement from becoming self-degradation

A skill that edits itself can get better or can rot. The difference is a filter: most of what a
run teaches belongs in the journal, and only some of it belongs in the references. These are the
tests a lesson must pass to graduate from `LESSONS.md` into an actual reference or checklist.

## The five gates

A lesson is promoted only if it clears all five.

1. **General.** It is a fact about react-three-fiber / Three.js / the rendering model — not about
   one scene. "R3F doesn't dispose `<primitive>` resources" promotes. "This project's tendril
   effect leaks" does not (it's an *instance* of the general rule — promote the rule, journal the
   instance).

2. **Evidenced.** It is backed by primary source (a documented behavior, a path into library
   source, a spec) or a reproduction — not a hunch or a single passing test. Source-verified
   rules promote as fact; reproduced-but-unexplained rules promote marked *provisional*; hunches
   stay in the journal.

3. **Catches a class.** Promotion is justified when the rule would catch a recurring *category* of
   problem, not a single quirk. A near-false-positive promotes when encoding it stops a whole
   family of bad findings; a one-off oddity does not.

4. **Within budget.** References have an altitude and a size ceiling — they are checklists and
   doctrine, not encyclopedias. If adding the rule pushes a file past readable, promotion means
   *editing*: tighten an existing item, merge two, or replace a vaguer rule with the sharper one.
   Growth-only is a smell.

5. **No project leakage.** The promoted text names no private codebase, file, product, or person.
   (The journal entry may cite the run that taught it; the reference may not.) This keeps the
   public suite genuinely general and portable.

## Where a lesson lands

- **A missed finding** → a new or sharpened item in the owning skill's `references/checklists/…`,
  and usually a paragraph of "why" in the matching `references/…` doctrine file.
- **A near false-positive** → a "Common failure mode" or an explicit *don't-flag-this* note next
  to the related checklist item, so the discriminating knowledge travels with the rule.
- **A source-verified rule** → the doctrine file, quoting/paraphrasing the source, plus a checklist
  item that operationalizes it.
- **Anything failing a gate** → stays in `LESSONS.md` only.

## The human gate

Self-improvement is **suggest-then-apply**, never silent overwrite:

- The skill *proposes* concrete diffs with evidence; a human approves before they land.
- Every applied change is a git commit and links back to a `LESSONS.md` entry — so the suite's
  evolution is auditable and any regression is one `git revert` away.
- Fully-autonomous promotion is possible (a post-run hook, or a scheduled pass over accumulated
  lessons) but should only run against the *journaling* step by default; graduating a lesson into
  a reference stays gated until you trust the filter on your own corpus.

## The journal — `LESSONS.md`

Append-only, newest first. One entry per lesson:

```
## <date> — <one-line lesson>
- **Skill / phase:** which skill was running, in what phase.
- **Signal:** missed-finding | near-false-positive | source-verified | provisional.
- **Evidence:** file:line, a primary-source path, or a repro.
- **Promoted?:** yes -> <target file> | no -> <which gate it failed>.
```

The journal is the memory; the references are the curated subset that earned a place in the
always-loaded checklist. Keep them distinct: a fat journal is healthy, a fat checklist is not.

## Watch for

- **Over-fitting.** If several lessons all come from one codebase, your filter may be encoding that
  codebase's habits as universal rules. Pressure-test a promotion against a *different* mental scene
  before it lands.
- **Contradiction drift.** A new rule that quietly contradicts an existing one means one of them is
  wrong or under-scoped. Reconcile, don't stack.
- **Stale provisionals.** Provisional rules that never get source-confirmed should be revisited, not
  left to harden by inertia.
