# Frontend Design Rules

Follow these guidelines for distinctive, intentional visual design when building new UI or reshaping existing interfaces:

## Grounding in Subject Matter
- Identify the product's industry, domain, audience, and primary job before designing.
- Use the subject's industry materials and vernacular to inform distinctive visual choices.
- Avoid generic filler or cliché aesthetic defaults.

## Typography & Structure
- Pick typefaces deliberately (1-2 families max) and establish a clear type scale.
- Default to line lengths under 80 characters.
- Avoid common generated tells:
  - Accenting a single word/phrase in headlines with italic/bold/color
  - Unnecessary uppercase labels
  - Decorative numbered markers (01 / 02 / 03) when content is not a sequence
- Use motion sparingly and purposefully (one orchestrated moment beats scattered hover transitions).

## Two-Pass Design Process
1. Plan: Brainstorm a token system (4-6 base palette hex values, type hierarchy, ASCII layout/alignment concept, and core principles).
2. Critique: Check against generic AI tropes (e.g. #F4F1EA warm cream + terracotta #D97757; near-black + acid green; generic SaaS rounded cards with rgba(0,0,0,.1) shadows). Revise anything that feels like a generic default before coding.

## Copywriting in Design
- Use active voice ("Save changes", not "Submit").
- Name things from the user's perspective in simple, natural language.
- Keep tone conversational with sentence case and zero filler.
