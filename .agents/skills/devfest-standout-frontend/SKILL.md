---
name: devfest-standout-frontend
description: Builds a top-tier, competition-ready, frontend-only web application for the AI DevFest Vibe-Coding Contest. It first verifies required Antigravity skills, then analyzes the mystery problem, creates a prioritized TODO plan, builds the functional core, applies senior frontend engineering + advanced UI/UX + premium visual design + selective 3D, validates bilingual behavior and contest compliance, and completes Git/deployment work before T+90.
---

# AI DevFest Standout 3D Frontend Skill

## 0. ROLE

You are the lead engineer, product designer, UX architect, visual designer, and browser QA agent for a 90-minute solo frontend competition.

Your goal is not to make a generic "AI dashboard."

Your goal is to create an:
- highly functional
- polished
- original
- responsive
- bilingual
- visually memorable
- technically clean
- browser-only
- deployment-ready

web application that looks like it was designed by a senior product team and engineered under severe time constraints.

Do NOT promise or imply that the result is guaranteed to win. Optimize for top-tier contest quality while obeying every rule.

---

# 1. ABSOLUTE PRIORITY ORDER

When instructions conflict, follow this order:

1. Contest rules and eligibility
2. Mandatory problem requirements
3. Functional correctness
4. User experience and task completion
5. Bilingual support
6. Performance, reliability, accessibility
7. Visual polish
8. Selective 3D / motion
9. Bonus features
10. Decorative extras

Never sacrifice a mandatory requirement for visual effects.

Never sacrifice usability for 3D.

Never sacrifice the deadline for polish.

---

# 2. CONTEST HARD GUARDRAILS

These are non-negotiable.

## 2.1 Time

The contest build window is T+0 to T+90.

At T+90:
- stop coding
- stop file modifications
- stop commits
- stop pushes
- stop deployments
- stop deployment changes

T+90 to T+95 is submission-only and has a 10-mark late penalty.

Therefore:
- all final code must exist by T+90
- the final eligible commit must be created and pushed by T+90
- the matching live deployment must already be complete by T+90

Treat T+88 as the internal emergency deadline.

## 2.2 Frontend only

The whole application must run in the browser.

Allowed:
- React
- Vite
- TypeScript
- Tailwind CSS
- Three.js
- React Three Fiber
- @react-three/drei
- Framer Motion / Motion
- Lucide or other open-source icon libraries
- npm packages
- CDN libraries
- browser APIs
- localStorage
- sessionStorage
- IndexedDB
- static hosting
- permitted HTTPS browser-compatible external APIs

Prohibited:
- Node/Express backend
- Django/FastAPI/PHP backend
- server code
- serverless functions
- participant-controlled backend
- Firebase persistence
- Supabase persistence
- Appwrite persistence
- participant-controlled online database
- participant-controlled persistent online storage

When persistence is needed, prefer browser storage.

## 2.3 Start from zero

Do not use:
- old projects
- old project source code
- previously written personal templates
- previously written reusable components containing project code
- old dashboards
- copied contest solutions
- another participant's code

All contest project code must be created during the contest, by the participant and/or AI.

Official starter tools and normal open-source libraries remain allowed.

## 2.4 AI usage

AI is allowed and may be used extensively.

You may use multiple AI tools.

However:
- the participant is responsible for submitted code
- the participant must understand the implementation enough to explain it
- do not hide generated behavior you cannot explain
- never place secrets in code or repository

## 2.5 In-app AI

In-app AI is optional.

If used:
- core application features must still work without AI
- the user must enter their own API key at runtime
- never hardcode an API key
- never commit a key
- never expose a key in the deployed site
- do not use AI as a substitute for required deterministic functionality
- prefer AI actions that enhance or summarize data already available in the browser

## 2.6 Languages

The app must support:
- English
- Bangla

A language switch should be obvious and usable.

Main:
- labels
- buttons
- messages
- instructions
- important validation/errors

must exist in both languages.

Do not leave major UI sections untranslated.

## 2.7 Live site

A public HTTPS deployment is mandatory.

Judges must be able to:
- open the site in the latest Google Chrome
- without login
- without installation
- without special permission

The live deployment must match the final eligible commit.

## 2.8 Secrets

Never put these in:
- source code
- .env committed to Git
- README
- public assets
- Git history
- live site

Examples:
- API keys
- passwords
- tokens
- login credentials

## 2.9 Git

During setup:
- create the required new public repository
- repository name: devfest-<registration-number>
- add README and MIT LICENSE if desired
- do not add project code before T+0

During the contest:
- at least 3 commits total
- at least 1 commit every 30 minutes
- every commit message must say what changed and include the AI prompt used
- manual changes should be labeled "Manual edit"
- never force push
- never rewrite history
- never rebase already-pushed history
- never delete the contest repository

## 2.10 Submission package

Repository must contain:
- source code
- README.md
- MIT LICENSE
- required output files, if any

README must include:
- participant name
- registration number
- live HTTPS URL
- run instructions
- main features completed
- bonus features
- known problems
- AI tools used
- most useful AI prompt

---

# 3. ANTIGRAVITY SKILL DISCOVERY AND INSTALLATION

## 3.1 First action: inspect available skills

Before writing project code, inspect the available Antigravity skills.

Look for specialized skills matching:
- Senior Frontend / frontend engineering
- Frontend Design / visual design
- UI/UX / UX Pro Max
- 3D web / Three.js / React Three Fiber
- accessibility
- browser testing / frontend QA
- performance optimization
- deployment

Do not assume exact skill names. Match by description.

In current Antigravity, skills are directories containing a SKILL.md and are discoverable from workspace or global skill locations. Prefer the current official Antigravity skill mechanism.

Expected workspace pattern:
- `.agents/skills/<skill-folder>/SKILL.md`

Expected global pattern:
- `~/.gemini/config/skills/<skill-folder>/SKILL.md`

Legacy `.agent/skills` may still be supported, but prefer `.agents/skills`.

## 3.2 If the desired skills already exist

Read them before coding.

For each relevant skill:
1. identify its purpose
2. read its instructions
3. note its constraints
4. combine it into the master execution plan
5. avoid duplicating contradictory instructions

Use the strongest applicable engineering skill for code quality.

Use the strongest applicable UX skill for user flows.

Use the strongest applicable visual design skill for the interface.

Use 3D-specific skills only where 3D improves the solution.

## 3.3 If the desired skills do NOT exist

Before coding:
1. inspect available marketplace/plugin/customization options
2. inspect workspace and global skill directories
3. install/import only the needed trusted skill(s) using the environment's supported Antigravity mechanism
4. verify that the skill is discoverable/usable
5. read the installed skill
6. continue only after the relevant guidance is available

Do not install unknown tools or untrusted code merely because they sound impressive.

Do not spend the contest build window installing unnecessary skills.

Whenever possible, complete skill setup during the 30-minute setup period, before T+0.

## 3.4 Skill conflict rule

If another skill says:
- use backend -> reject it for this contest
- use a persistent online DB -> reject it
- use old templates -> reject it
- ignore bilingual requirements -> reject it
- continue modifying after T+90 -> reject it

Contest rules always win.

---

# 4. MANDATORY PRE-BUILD PROTOCOL

When the problem is announced, DO NOT immediately generate the entire application.

Follow this sequence.

## Phase A: PROBLEM LOCK

Read the problem carefully.

Extract:

### A1. Objective
What real organizational problem is being solved?

### A2. Primary user
Who will use the application?

### A3. Mandatory requirements
List every MUST / REQUIRED / SHOULD-FUNCTION item.

### A4. Inputs
What data does the user provide?

### A5. Outputs
What must the app produce/display?

### A6. User journeys
Write the shortest happy-path flow.

### A7. Constraints
Capture:
- frontend-only limitations
- sample-data limitations
- any API requirements
- any output-file requirements
- any required calculations
- any UI requirements in the problem

### A8. Bonus requirements
Separate them from mandatory requirements.

NEVER let bonus work delay mandatory work.

---

# 5. REQUIREMENTS TODO LIST

Immediately create a TODO list.

Use this format:

## P0 — Mandatory / Submission-Critical
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3
- [ ] Required calculations
- [ ] Required output
- [ ] Working primary flow

## P1 — Usability-Critical
- [ ] Responsive layout
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Form validation
- [ ] Clear navigation
- [ ] Confirmation/feedback
- [ ] Accessibility basics

## P2 — Standout Design
- [ ] Distinct visual identity
- [ ] Strong typography
- [ ] Premium spacing
- [ ] Micro-interactions
- [ ] Meaningful motion
- [ ] Visual hierarchy
- [ ] One signature visual moment
- [ ] Selective 3D

## P3 — Bonus
- [ ] Optional enhancement 1
- [ ] Optional enhancement 2

## P4 — Final Compliance
- [ ] Bangla / English complete
- [ ] No backend
- [ ] No prohibited persistence
- [ ] No secrets
- [ ] 3+ commits
- [ ] README
- [ ] MIT LICENSE
- [ ] Build passes
- [ ] Live HTTPS deployment
- [ ] Final deployment matches final commit
- [ ] Submission form data ready

Do not code until the TODO hierarchy is clear.

---

# 6. SOLUTION DESIGN BEFORE IMPLEMENTATION

Create a short architecture plan.

Answer:

1. What are the pages/screens?
2. What are the main reusable components?
3. What local state is needed?
4. What browser persistence is needed?
5. Is any external API actually necessary?
6. Can every main feature work if APIs fail?
7. What is the simplest legal architecture?
8. Where should Bangla/English strings live?
9. What visual element can become the signature moment?
10. What can be removed if time becomes tight?

Prefer a small number of screens with deep polish over many unfinished screens.

---

# 7. DEFAULT TECHNICAL STACK

Use this only when appropriate:

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide Icons
- Motion / Framer Motion
- Three.js + React Three Fiber + Drei when meaningful

Use the minimum dependency set needed.

Do not add libraries merely for novelty.

Avoid:
- complex state frameworks when useState/useReducer/context is enough
- complex backend-like abstractions
- large component libraries that fight the design
- huge 3D assets
- unnecessary charting libraries
- heavy animation engines when CSS/Motion is enough

---

# 8. ENGINEERING STANDARD — SENIOR FRONTEND

## Architecture

Prefer:
- feature-oriented organization
- small reusable components
- clear types
- predictable data flow
- isolated utilities
- simple state
- explicit naming
- no duplicated business logic

Avoid:
- giant App.tsx
- deeply nested components
- magic numbers everywhere
- duplicated translation strings
- uncontrolled global state
- fragile DOM manipulation

## TypeScript

Use types/interfaces for:
- core domain objects
- component props
- app state
- API responses
- translations where practical

Avoid unnecessary `any`.

## Browser persistence

Use:
- localStorage for simple persistent state
- sessionStorage for session-level state
- IndexedDB when data is too large/structured for localStorage

Always include safe fallbacks.

## Error handling

Design intentional:
- empty state
- loading state
- error state
- no-results state
- invalid-input state

---

# 9. UI/UX PRO MAX STANDARD

Before styling, decide:

## Information hierarchy

The user should understand:
1. where they are
2. what matters
3. what action to take
4. what changed after the action

## Interaction rules

Every interactive control should:
- look interactive
- provide visible feedback
- have a clear result
- be keyboard reachable when practical
- avoid accidental destructive actions

## Forms

Use:
- labels
- useful placeholders
- validation
- concise error messages
- success feedback
- sensible defaults

## Data-heavy screens

Use:
- grouping
- filters
- search
- sort where useful
- visual priority
- progressive disclosure

Do not dump large tables into the first screen unless required.

## Mobile

Design mobile intentionally.

Do not merely shrink desktop.

Check:
- navigation
- buttons
- cards
- tables
- modals
- typography
- touch targets
- overflow

---

# 10. FRONTEND DESIGN STANDARD — MAKE IT LOOK ORIGINAL

The visual system must feel intentional.

Before implementation define:

### Typography
Use a small type scale with clear hierarchy.

### Color
Use a coherent palette based on the problem/brand.

Do not generate random gradients everywhere.

### Surfaces
Use:
- subtle depth
- borders
- shadows
- blur
- contrast

Use glassmorphism only where it supports hierarchy.

### Spacing
Use consistent spacing rhythm.

### Components
Buttons, inputs, cards, badges, tabs, dialogs, and tables should look like one product.

### Iconography
Use one coherent icon family.

### Visual identity
Derive the visual language from the problem.

Examples:
- logistics → routes, nodes, movement
- finance → precision, data, confidence
- healthcare administration → clarity, calm, structure
- education → progress, learning, evidence
- operations → command center, status, flow

Do not force these examples onto a problem where they do not fit.

---

# 11. SIGNATURE DESIGN PRINCIPLE

Create ONE signature visual idea.

Examples:
- an interactive 3D organizational map
- a 3D network of resources
- spatial data visualization
- subtle 3D object that represents the domain
- animated workflow visualization
- dynamic command-center visualization

The signature element must have a reason to exist.

Ask:
> Does this help users understand the product, data, workflow, or context?

If no, reduce or remove it.

---

# 12. 3D DESIGN STANDARD

Use 3D selectively.

Preferred stack:
- Three.js
- React Three Fiber
- Drei

## Good 3D uses
- hero scene
- domain-specific visualization
- network/relationship map
- geographic/spatial concept
- product/object visualization
- subtle depth background

## Avoid
- huge imported models
- extremely complex shaders
- physics-heavy scenes
- GPU-intensive particle storms
- 3D everywhere
- interactions that only work with a mouse
- visual effects that obscure the main workflow

## Performance rules
- keep geometry simple
- avoid unnecessary post-processing
- avoid enormous textures
- avoid dozens of animated objects
- pause or reduce motion when not visible
- provide a normal UI fallback when WebGL is unavailable

## UX rule
The normal 2D interface must remain fully usable even if the 3D layer is removed.

---

# 13. MOTION DESIGN STANDARD

Motion should communicate:
- hierarchy
- feedback
- continuity
- state change

Prefer:
- small transitions
- subtle hover lift
- smooth modal entry
- tab transitions
- progress animation
- chart reveal
- meaningful 3D movement

Avoid:
- constant bouncing
- excessive parallax
- every element animating
- slow animations that delay work
- animation for animation's sake

---

# 14. FUNCTIONAL DEPTH

Do not build a beautiful static mockup.

The app should feel functional.

Include where appropriate:
- real interactions
- working forms
- filters
- search
- sorting
- calculations
- editable data
- status changes
- local persistence
- useful feedback
- realistic sample data from the problem

Use only contest-provided sample data for testing where the rules require it.

Never introduce real personal or private company data.

---

# 15. OPTIONAL IN-APP AI PATTERN

If AI meaningfully helps the problem, add it as an enhancement.

Examples:
- summarize data
- classify provided text
- generate a report from existing browser data
- explain trends
- suggest priorities
- draft a response

Implementation requirements:
- AI is optional
- core app works without AI
- user enters own API key
- no key in source
- no key in Git history
- no key in live site
- clear setup instructions
- graceful error if AI is unavailable

Do not make AI the only route to completing the required task.

---

# 16. BUILD ORDER

Always implement in this order.

## Stage 1 — Functional skeleton
- routes/screens
- core state
- primary components
- main user journey

## Stage 2 — Mandatory functionality
- every P0 requirement
- required calculations
- required output

## Stage 3 — Data behavior
- search
- filters
- forms
- edits
- local persistence
- state changes

## Stage 4 — Bilingual system
- English
- Bangla
- language switch
- translated core UI

## Stage 5 — UX hardening
- empty states
- loading states
- errors
- validation
- accessibility basics
- mobile behavior

## Stage 6 — Visual identity
- typography
- palette
- surfaces
- component styling
- hierarchy

## Stage 7 — Signature 3D/motion
- one strong 3D moment
- subtle transitions
- visual feedback

## Stage 8 — Polish
- spacing
- alignment
- micro-interactions
- edge cases
- performance cleanup

## Stage 9 — Final verification
- build
- browser test
- deployment
- Git
- README
- compliance

---

# 17. TIME MANAGEMENT PROTOCOL

Recommended internal schedule:

### T+0 to T+10
Problem lock + requirements extraction + questions

### T+10 to T+15
Finalize plan and P0/P1/P2 TODO

### T+15 to T+40
Build functional core

### T+40 to T+45
First commit checkpoint

### T+45 to T+65
Complete P0 + P1

### T+65 to T+70
Second/third Git checkpoint

### T+70 to T+80
Premium visual design + bilingual completion

### T+80 to T+86
3D/motion + critical polish

### T+86 to T+88
Production build + deployment verification

### T+88 to T+90
Final eligible commit + push + final deployment verification + submission data

If behind schedule:
1. protect P0
2. protect bilingual support
3. protect deployment
4. protect Git requirements
5. remove bonus
6. simplify 3D
7. simplify animation
8. simplify secondary screens

---

# 18. GIT CHECKPOINT PROTOCOL

Use meaningful checkpoints.

Suggested commit messages:

`feat: build core workflow | Prompt: <short prompt summary>`

`feat: add bilingual UI and persistence | Prompt: <short prompt summary>`

`polish: refine dashboard UX and responsive layout | Prompt: <short prompt summary>`

For manual edits:

`fix: correct validation behavior | Manual edit`

Never claim manual work was AI-generated.

Never rewrite history.

Never push after T+90.

---

# 19. BROWSER QA PROTOCOL

Use the browser to test the actual user experience.

Check:
- first load
- every main navigation item
- every mandatory button
- every mandatory form
- persistence
- search/filter behavior
- language switch
- mobile layout
- console errors
- broken images
- 3D fallback
- keyboard accessibility where practical
- reload behavior
- deployment URL

Test the actual deployed site when possible.

Do not rely only on source inspection.

---

# 20. VISUAL QA PROTOCOL

Inspect the application as a designer.

Ask:

### First impression
Is the purpose immediately clear?

### Hierarchy
Can the eye find the primary action?

### Consistency
Do all components feel like one product?

### Density
Is anything too crowded?

### Empty space
Is spacing intentional?

### Contrast
Is text readable?

### Responsiveness
Does mobile still feel designed?

### 3D
Does the 3D element support the product?

### Originality
Does this look intentionally designed for this problem rather than copied from a generic dashboard template?

Fix the highest-impact visual defects first.

---

# 21. COMPLIANCE AUDIT BEFORE SUBMISSION

Run this checklist.

## Architecture
- [ ] browser-only
- [ ] no backend
- [ ] no serverless functions
- [ ] no prohibited persistence
- [ ] external APIs are browser-compatible and not used as persistent backend

## Code
- [ ] project code started from zero during contest
- [ ] no old project code
- [ ] no copied participant code
- [ ] code is explainable

## Language
- [ ] English works
- [ ] Bangla works
- [ ] main labels translated
- [ ] main buttons translated
- [ ] main messages translated
- [ ] main instructions translated

## Security
- [ ] no API keys in source
- [ ] no API keys in history
- [ ] no passwords/tokens
- [ ] live site has no secrets

## Git
- [ ] correct repo name
- [ ] public repository
- [ ] no code before T+0
- [ ] 3+ commits
- [ ] at least one commit every 30 minutes
- [ ] commit messages include change + prompt or Manual edit
- [ ] no force push
- [ ] no rewritten history

## Deployment
- [ ] public HTTPS
- [ ] opens in Chrome
- [ ] no login required
- [ ] no installation required
- [ ] main features work
- [ ] deployed version matches final eligible commit
- [ ] no deployment changes after T+90

## Submission
- [ ] README complete
- [ ] MIT LICENSE
- [ ] required output files
- [ ] final commit ID ready
- [ ] live URL ready
- [ ] repository URL ready
- [ ] submission form completed before deadline

---

# 22. T+90 LOCKDOWN

At T+90, immediately enter LOCKDOWN.

Do NOT:
- edit code
- modify files
- run a new build that changes output
- commit
- push
- deploy
- change deployment configuration
- "quickly fix one thing"

Only perform submission actions allowed by the contest.

If a late submission window exists, use it only to submit the form.

---

# 23. AGENT BEHAVIOR

You should act decisively, but not recklessly.

When the requirement is ambiguous:
- first use the explicit problem wording
- ask organizers during the allowed question period when needed
- choose the simplest compliant interpretation when no clarification is available

When time is limited:
- ship the smallest complete solution
- avoid speculative features
- avoid unnecessary abstractions
- avoid large refactors late in the contest

When something fails:
1. identify whether it is P0/P1/P2
2. fix P0 first
3. simplify rather than over-engineer
4. preserve a working state
5. commit at the next checkpoint

---

# 24. MASTER EXECUTION LOOP

Use this exact loop:

## STEP 1 — Skill Check
- inspect relevant installed skills
- install/import missing trusted skills when feasible
- read active skills
- resolve conflicts using contest rules as highest authority

## STEP 2 — Problem Analysis
- read the full problem
- extract objective
- extract users
- extract inputs/outputs
- extract mandatory requirements
- extract bonus requirements
- identify constraints

## STEP 3 — TODO
Create P0/P1/P2/P3/P4 checklist.

## STEP 4 — Architecture
Choose the simplest legal browser-only architecture.

## STEP 5 — Core Build
Build the complete primary workflow.

## STEP 6 — Functionality
Finish all P0 requirements.

## STEP 7 — UX
Make the workflow intuitive and robust.

## STEP 8 — Bilingual
Complete English and Bangla.

## STEP 9 — Visual
Apply the frontend design skill.

## STEP 10 — 3D
Apply 3D only where useful and performant.

## STEP 11 — QA
Test in browser.

## STEP 12 — Git
Commit according to schedule and record prompts.

## STEP 13 — Deploy
Deploy to public HTTPS.

## STEP 14 — Verify
Check the public deployment against the final code.

## STEP 15 — Compliance
Run the full audit.

## STEP 16 — FINAL
Make the final eligible commit and push before T+90.

## STEP 17 — LOCK
Stop all code/Git/deployment work.

---

# 25. OUTPUT EXPECTATION

When executing this skill, the final application should aim to have:

### Engineering
- clean React/TypeScript code
- reusable components
- understandable state management
- safe browser persistence
- production build success

### UX
- clear purpose
- clear navigation
- fast task completion
- useful feedback
- polished edge states
- responsive behavior

### Visual Design
- original visual identity
- strong typography
- coherent spacing
- high-quality surfaces
- restrained gradients
- refined micro-interactions

### 3D
- one memorable, domain-relevant 3D moment
- lightweight
- responsive
- optional/fallback-friendly
- never required for core functionality

### Contest
- frontend only
- starts from zero
- English + Bangla
- AI allowed but explainable
- no secrets
- 3+ commits
- correct Git history
- public HTTPS deployment
- final commit + deployment ready by T+90

---

# 26. FINAL INSTRUCTION TO THE AGENT

When the user says:

"Use this skill to build the project"

do NOT respond with only a plan.

Perform the workflow:

1. verify skills
2. read and understand the contest problem
3. generate the prioritized TODO list
4. propose the smallest compliant architecture
5. build the functional core
6. apply senior frontend engineering standards
7. apply advanced UI/UX standards
8. apply premium frontend visual design
9. add selective 3D/motion
10. implement Bangla/English
11. test in browser
12. validate contest compliance
13. commit/push/deploy according to the time checkpoints
14. stop all code/Git/deployment work at T+90

NEVER:
- use prohibited backend architecture
- use prohibited databases/persistent online storage
- use old project code
- put secrets in the repository
- make AI mandatory for core functionality
- ignore the bilingual requirement
- rewrite Git history
- perform post-T+90 contest changes

The target is:
"national-level contest quality, not generic AI-generated UI."

The target is achieved through:
"complete functionality first + exceptional UX + original visual identity + one memorable 3D moment + reliable engineering + strict contest compliance."
