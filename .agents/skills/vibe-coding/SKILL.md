---
name: vibe-coding
description: Operating rules, architecture constraints, coding style, AI workflow, Git workflow, deployment workflow, and verification process for the AI DevFest 2026 AI Vibe-Coding Contest (Solo).
---
# AI DevFest Vibe-Coding Contest â€” Build Skill

> **Purpose:** This skill defines the exact operating rules, architecture constraints, coding style, AI workflow, Git workflow, deployment workflow, and verification process to use when building a project for the **AI DevFest 2026 AI Vibe-Coding Contest (Solo)**.
>
> **Source:** Official `AI DevFest Vibe Coding Rulebook.pdf` supplied for this task.
>
> **How to invoke:** When the user says **â€œuse this skillâ€**, **â€œuse skills.mdâ€**, or otherwise asks to build the contest project under these rules, follow this file as the controlling project workflow unless the organizer announces an updated rule during the event.

---

## 1. Core Objective

Build a **working, useful, organization-oriented web application** in **90 minutes**, using AI freely, while satisfying every contest constraint.

The application must:

- Be **frontend-only**.
- Run completely in the browser.
- Support **Bangla and English**.
- Be useful for an organization.
- Be publicly deployed over **HTTPS** by **T+90**.
- Be accessible to judges without login or installation.
- Be stored in a **new public GitHub repository** created for the contest.
- Be released under the **MIT License**.
- Match the final eligible Git commit at the live deployment.

The main objective is **functional completeness first, polish second, bonus features last**.

---

# 2. NON-NEGOTIABLE CONTEST RULES

Treat every rule in this section as a hard constraint.

## 2.1 Allowed

- Any AI tool, free or paid.
- AI coding agents.
- React, Vue, Angular, Svelte, plain HTML/CSS/JS, or another frontend framework.
- Vite and other official starter tools.
- Open-source npm packages and CDN libraries.
- Browser storage such as:
  - `localStorage`
  - `sessionStorage`
  - `IndexedDB`
- Normal browser APIs.
- Static hosting.
- External/public HTTPS APIs that work directly from the browser using CORS and do not become the participant's persistent backend/database/storage layer.
- A personal laptop, provided the participant also has a backup internet connection.
- Phone only for authentication or backup hotspot when needed.

## 2.2 Forbidden

NEVER use or create:

- Participant-controlled backend servers.
- Server-side application code.
- Serverless functions.
- Firebase as the app's persistent backend/database.
- Supabase as the app's persistent backend/database.
- Appwrite as the app's persistent backend/database.
- Any other participant-controlled persistent database.
- Any participant-controlled online storage service used as the application's persistent backend/storage layer.
- Code from previous projects.
- Previously written personal templates.
- Old components or copied application code prepared before the contest.
- Other participants' code.
- Code sharing with other participants.
- Force-pushing or rewriting Git history.
- Rebase of already-pushed commits.
- Deleting the contest repository.
- Secrets in source code, repository history, or live deployment.
- Coding or other contest work on the phone.
- Communication with other participants or people outside the contest during the contest.
- Post-T+90 coding, committing, pushing, or deployment changes.

## 2.3 Start From Zero

The contest project code must be written during the contest, by the participant or AI.

Allowed during setup:

- Create the new repository.
- Add `README.md`.
- Add `LICENSE` containing MIT License.
- Log into GitHub and AI tools.
- Verify Git push access.

Not allowed during setup:

- Any project code before T+0.
- Prebuilt personal starter projects.
- Previous application source code.

---

# 3. DEFAULT TECH STACK

Use the fastest reliable frontend stack unless the problem strongly suggests another approach.

## Default stack

```text
React
Vite
TypeScript
Tailwind CSS
Lucide React icons
Browser local state + localStorage when persistence is useful
```

Optional only when it saves time or materially improves the result:

```text
Framer Motion
Recharts
Other lightweight open-source npm libraries
```

Do not introduce a library merely for decoration. Every dependency must earn its time and complexity cost.

---

# 4. ARCHITECTURE RULES

## 4.1 Frontend-only architecture

Use a browser-only architecture:

```text
User
  â†“
React UI
  â†“
Client-side state
  â†“
localStorage / sessionStorage / IndexedDB (optional)
  â†“
External HTTPS API (optional)
```

Never create:

```text
Browser â†’ Node/Express server â†’ Database
Browser â†’ FastAPI/Django server â†’ Database
Browser â†’ Firebase/Supabase persistent database
Browser â†’ participant-controlled serverless function
```

## 4.2 Data strategy

Prefer one of these depending on the problem:

1. **In-memory state** for purely interactive demonstrations.
2. **localStorage** for simple persistent demo data.
3. **sessionStorage** for temporary session state.
4. **IndexedDB** only if the problem genuinely needs larger client-side data.
5. **External API** only when it is allowed, browser-accessible, HTTPS, CORS-compatible, and not acting as the participant's persistent backend.

For organization-oriented demo apps, seed the app with **contest-provided sample data** or clearly synthetic in-browser demo data when appropriate.

Never use real personal or private company data.

---

# 5. AI USAGE POLICY

## 5.1 AI is allowed for everything permitted by the contest

Use AI aggressively for speed:

- Architecture suggestions.
- Component generation.
- Styling.
- Refactoring.
- Debugging.
- Accessibility improvements.
- Responsive fixes.
- Translation generation.
- Test-case generation.
- README generation.
- Git commit message drafting.

## 5.2 The agent remains responsible for the result

Do not blindly accept generated code.

After AI creates a feature:

1. Read the relevant implementation.
2. Run or inspect the app.
3. Verify the feature against the problem statement.
4. Remove unnecessary complexity.
5. Make sure the participant can explain the implementation.

## 5.3 AI inside the submitted app

AI-powered features inside the app are optional.

If included:

- The main application features must still work without AI.
- The user must enter their own API key into the app.
- Never hardcode an API key.
- Never commit an API key.
- Never place an API key in the live site.

---

# 6. CONTEST EXECUTION FLOW

Use this exact flow when building the contest project.

## PHASE 0 â€” PRE-CONTEST SETUP (30 minutes before T+0)

### Goal
Eliminate setup failures before the actual timer starts.

### Actions

1. Open the newly created contest repository.
2. Repository name must be:

```text
devfest-<registration-number>
```

3. Make the repository public.
4. Confirm Git authentication and push access.
5. Log into the AI tools that will be used.
6. Confirm the deployment account/tool is accessible.
7. Confirm internet access.
8. Add:
   - `README.md`
   - `LICENSE` with MIT License
9. Do **not** add project code.

### Do not spend setup time

- Designing the unknown app.
- Writing prebuilt components.
- Creating a template application.
- Preparing application source code for later reuse.

---

# 7. T+0 â€” PROBLEM INTAKE

When the problem is revealed, immediately extract:

## Required information

- Main objective.
- Target organization/user.
- Inputs.
- Outputs.
- Must-have features.
- Bonus features.
- Sample data.
- Any explicit UI/UX requirements.
- Any required calculations or business rules.
- Any output files required.
- Any constraints that alter the architecture.

## Prioritization

Create this internal priority order:

```text
P0 = Must work for the basic submission
P1 = Important quality/usability
P2 = Bonus features
P3 = Cosmetic extras
```

Never implement P2/P3 before P0 is working.

---

# 8. T+0 TO T+15 â€” QUESTIONS

The organizers allow questions during the first 15 minutes.

Only ask questions when the answer materially affects implementation or interpretation.

Ask concise questions such as:

- â€œDoes this requirement mean X or Y?â€
- â€œIs this field mandatory?â€
- â€œIs this sample output format required exactly?â€

Do not waste the question window on implementation questions that can be solved independently.

If an answer affects everyone, expect the organizers to communicate it to everyone.

---

# 9. T+5 TO T+15 â€” ARCHITECTURE LOCK

Before heavy coding, decide:

```text
Pages/routes
Core components
State model
Data model
Language model
Storage approach
External APIs (if any)
Deployment target
```

Keep architecture deliberately small.

## Preferred structure

```text
src/
  components/
  pages/
  data/
  hooks/
  lib/
  types/
  i18n/
  App.tsx
  main.tsx
```

Do not create folders that do not materially help the project.

---

# 10. BILINGUAL IMPLEMENTATION â€” REQUIRED

Every main user-facing element must work in both languages.

## Required bilingual coverage

- Page titles.
- Navigation labels.
- Buttons.
- Forms.
- Field labels.
- Validation messages.
- Empty states.
- Error messages.
- Instructions.
- Important status text.

## Preferred implementation

Use a lightweight translation object rather than a heavy i18n system unless the app needs one.

Example pattern:

```ts
const translations = {
  en: {
    dashboard: 'Dashboard',
    save: 'Save',
  },
  bn: {
    dashboard: 'à¦¡à§à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§à¦¡',
    save: 'à¦¸à¦‚à¦°à¦•à§à¦·à¦£',
  },
};
```

Add a visible language switcher:

```text
English | à¦¬à¦¾à¦‚à¦²à¦¾
```

Do not leave half of the interface untranslated.

---

# 11. UI/UX IMPLEMENTATION STRATEGY

The app should look polished but must remain fast to build.

## Prioritize

1. Clear information hierarchy.
2. Fast navigation.
3. Obvious primary action.
4. Responsive layout.
5. Readable typography.
6. Useful empty/loading/error states.
7. Consistent spacing and components.
8. Professional organization-oriented visual design.

## Avoid

- Huge animation systems.
- Over-engineered component abstractions.
- Complex theme engines.
- Excessive gradients or effects that reduce readability.
- Features that consume time without improving the required workflow.

Default style should be modern and clean. If the problem context suggests a specific visual identity, adapt to it.

---

# 12. FEATURE BUILD ORDER

Always build in this sequence:

## Stage A â€” Skeleton

- Vite/React boot.
- Main layout.
- Routing/navigation if needed.
- Core styling.

## Stage B â€” Must-have functionality

Implement every required primary workflow.

Example:

```text
Input
â†’ validation
â†’ processing
â†’ result
â†’ action/save
```

## Stage C â€” Data persistence

Add localStorage/sessionStorage/IndexedDB only after the main workflow works.

## Stage D â€” Bilingual support

Complete the language system before final polish.

## Stage E â€” Error/empty/loading states

Add enough resilience for judges to operate the app smoothly.

## Stage F â€” Bonus features

Only after all P0 requirements are complete.

## Stage G â€” Visual polish

Only use remaining time for polish that does not threaten core functionality.

---

# 13. GIT WORKFLOW â€” MANDATORY

Minimum contest requirement:

- At least **3 commits total**.
- At least one commit during each 30-minute period.
- Commit history must remain intact.
- No force-push.
- No history rewriting.

## Recommended commit schedule

```text
~T+20  â†’ Commit 1
~T+50  â†’ Commit 2
~T+75  â†’ Commit 3
~T+88  â†’ Final commit
```

The exact timing can shift with the problem, but never risk finishing with fewer than 3 commits.

## Commit message rule

Every commit message must include:

1. What changed.
2. The AI prompt used for that change, or `Manual edit` if the change was manual.

Recommended format:

```text
feat: build organization dashboard | Prompt: Create a responsive dashboard showing the required metrics and actions
```

Manual change:

```text
fix: correct form validation | Manual edit
```

Keep messages concise but informative.

---

# 14. SAFE GIT CHECKLIST BEFORE EVERY COMMIT

Run/check:

```bash
git status
git diff
```

Verify:

- No API keys.
- No passwords.
- No tokens.
- No accidental personal data.
- No unrelated files.
- No old project code.
- Changes match the current contest work.

Then:

```bash
git add .
git commit -m "..."
git push
```

Never use:

```bash
git push --force
```

Do not rewrite already-pushed history.

---

# 15. SECRETS & SECURITY

Before every push, inspect the project for:

```text
API keys
Tokens
Passwords
Private URLs
Credentials
.env values containing secrets
Authentication codes
```

Never commit them.

Do not assume `.gitignore` alone is sufficient: check the repository and staged diff.

If an external API is optional and can be used without a secret, prefer that design.

---

# 16. EXTERNAL API CHECK

Before using an external API, verify:

```text
HTTPS?                  â†’ YES
Browser/CORS usable?    â†’ YES
Persistent backend?     â†’ NO
Persistent database?    â†’ NO
Online storage layer?   â†’ NO
Main app survives API failure? â†’ YES
```

If any required condition fails, do not use the API.

Build the main functionality so an API outage does not destroy the entire application.

---

# 17. SAMPLE DATA & PRIVACY

Use only contest-provided sample data for testing.

Do not use or upload:

- Real people's personal information.
- Private company information.
- Private credentials.
- Other sensitive/private data.

Synthetic data is acceptable when it is appropriate and does not replace required organizer-provided sample data.

---

# 18. DEPLOYMENT â€” MANDATORY BY T+90

Use a static hosting platform such as:

```text
Vercel
Netlify
GitHub Pages
Cloudflare Pages
```

Choose the fastest reliable option available in the environment.

## Deployment requirements

The public site must:

- Use HTTPS.
- Be openable by the judges.
- Require no login.
- Require no installation.
- Run in the latest Google Chrome.
- Provide the main application features.
- Contain no secrets.
- Match the final eligible commit.

## Deployment rule

The deployment must be completed **by T+90**.

After T+90:

```text
NO coding
NO commit
NO push
NO deployment changes
```

---

# 19. FINAL 10-MINUTE RELEASE PROCEDURE

Use the final minutes only for release safety.

## T+80-ish

Freeze feature scope.

Do not start a large new feature.

## T+80â€“85

Test:

```text
Home/load
Navigation
Main workflow
Forms
Required calculations
Bilingual switch
Persistence if used
Responsive layout
External API fallback if used
```

## T+85â€“88

Prepare final commit.

Check:

```text
README complete
MIT LICENSE present
No secrets
Git clean enough to submit
```

## T+88â€“89

Push final eligible commit.

Record the exact commit ID.

## T+89â€“90

Verify the public URL.

Confirm it matches the final commit.

Prepare submission details.

---

# 20. SUBMISSION PACKAGE

The official submission requires:

- Full name.
- Registration number.
- Public GitHub repository URL.
- Final commit ID.
- Public HTTPS live website URL.

The repository must contain:

```text
README.md
LICENSE (MIT)
Source code
Required output files
```

---

# 21. README REQUIREMENTS

The README must contain:

```text
1. Name
2. Registration number
3. Public live URL
4. How to run
5. Main features completed
6. Bonus features completed
7. Known problems
8. AI tools used
9. Most useful prompt
```

Keep it readable and truthful.

Do not claim a feature is complete unless it actually works.

---

# 22. FINAL ELIGIBLE COMMIT RULE

The contest judges evaluate the **final eligible commit** and the matching live deployment.

Therefore:

```text
Final code
   â†“
Final commit
   â†“
Push
   â†“
Deployment matching that commit
   â†“
Submit exact commit ID + live URL
   â†“
FREEZE
```

Do not make a â€œtiny fixâ€ after submitting.

Do not update the deployment after T+90.

---

# 23. TIME MANAGEMENT PRINCIPLE

The correct mindset is:

```text
WORKING > COMPLETE > POLISHED > BONUS
```

Do not sacrifice a required feature for visual polish.

Do not sacrifice deployment time for another feature.

Do not sacrifice Git compliance for speed.

Do not sacrifice bilingual compliance until the end.

A smaller application that satisfies the full requirement is safer than a large unfinished application.

---

# 24. AGENT BEHAVIOR WHEN USER SAYS â€œUSE THIS SKILLâ€

When instructed to use this skill for a contest project, follow this behavior exactly.

## Step 1 â€” Confirm the active problem

Use the problem statement supplied by the user/organizer as the source of truth.

If the problem is not provided yet, do not invent it and do not start application coding.

## Step 2 â€” Parse requirements

Extract:

```text
Must-have
Bonus
Inputs
Outputs
Constraints
Sample data
```

## Step 3 â€” Lock architecture

Select the simplest compliant frontend-only architecture.

Do not introduce a backend or prohibited persistent service.

## Step 4 â€” Create from zero

Use an officially permitted starter tool such as Vite if useful.

Do not import an old personal starter/template/application.

## Step 5 â€” Build P0 first

Implement the smallest complete working version of every required task.

## Step 6 â€” Test continuously

Do not wait until the final minute to discover broken core functionality.

## Step 7 â€” Maintain Git compliance

Track commit count and timing.

Every commit must include the required change description + AI prompt or `Manual edit`.

## Step 8 â€” Maintain bilingual coverage

Add/verify English and Bangla for all main user-facing content.

## Step 9 â€” Deploy early enough

Do not leave first deployment until the final seconds.

Use a static host and verify the real public URL.

## Step 10 â€” Freeze at T+90

At T+90, stop all code/Git/deployment work immediately.

## Step 11 â€” Submit

Provide the exact:

```text
Repository URL
Final commit ID
Live HTTPS URL
```

## Step 12 â€” Be able to explain

Prepare a concise explanation of:

- Architecture.
- Main components.
- State/data flow.
- Storage choice.
- API usage, if any.
- Language system.
- Important business logic.

---

# 25. RECOMMENDED AI PROMPTING PATTERN

Use short, targeted prompts instead of one enormous prompt whenever possible.

## Prompt 1 â€” Architecture

```text
Analyze this contest problem and design the smallest compliant frontend-only architecture.
No backend, no Firebase/Supabase/Appwrite database, and no persistent participant-controlled
online storage. Prioritize must-have features, bilingual Bangla/English support, and a 90-minute build.
Return the pages, components, state model, data model, and implementation order.
```

## Prompt 2 â€” Core implementation

```text
Implement only the highest-priority required feature from the current contest problem.
Use React + Vite + TypeScript + Tailwind. Keep the architecture simple and browser-only.
Do not add unnecessary dependencies or backend code.
```

## Prompt 3 â€” Bilingual pass

```text
Audit the current UI for Bangla and English compliance. Add a language switcher and make all
main labels, buttons, instructions, messages, validation, empty states, and important status text
available in both languages. Do not change the core business logic.
```

## Prompt 4 â€” Quality pass

```text
Test the current implementation against the stated requirements. Identify only concrete bugs,
missing required features, broken flows, responsiveness problems, and bilingual gaps. Fix the
highest-impact issues without introducing backend services or unnecessary complexity.
```

## Prompt 5 â€” Final compliance audit

```text
Perform a final contest compliance audit. Check for prohibited backend/database/storage,
pre-existing project code patterns, secrets, missing Bangla/English UI, missing required features,
Git/deployment risks, and any post-deadline concerns. Report issues with exact files/locations and
fix only issues that can be safely fixed before T+90.
```

---

# 26. CONTEST COMPLIANCE CHECKLIST

Before T+90, all applicable boxes must be true.

## App

- [ ] Runs in the browser.
- [ ] Frontend-only.
- [ ] No participant-controlled backend.
- [ ] No prohibited persistent database/storage service.
- [ ] Main features work without optional AI.
- [ ] Bangla support works.
- [ ] English support works.
- [ ] Main labels/buttons/messages/instructions are bilingual.
- [ ] Required sample/output behavior works.
- [ ] Main workflow works in Chrome.

## Code

- [ ] Project started from zero at T+0.
- [ ] No old project code.
- [ ] No copied participant code.
- [ ] No real/private data.
- [ ] No secrets.
- [ ] No API keys in source or history.

## GitHub

- [ ] Repository is public.
- [ ] Repository name follows `devfest-<registration-number>`.
- [ ] At least 3 commits.
- [ ] Commit cadence satisfies the rule.
- [ ] Every commit has change note + AI prompt / `Manual edit`.
- [ ] No force push.
- [ ] No rewritten history.
- [ ] Final eligible commit pushed by T+90.

## Deployment

- [ ] Public HTTPS URL exists.
- [ ] No login required.
- [ ] No installation required.
- [ ] Judges can access it.
- [ ] Main features work on live site.
- [ ] Live site matches final eligible commit.
- [ ] No secrets on live site.

## Submission

- [ ] Name ready.
- [ ] Registration number ready.
- [ ] Repository URL ready.
- [ ] Final commit ID recorded.
- [ ] Live HTTPS URL recorded.
- [ ] README complete.
- [ ] MIT LICENSE present.

---

# 27. DISQUALIFICATION SAFETY CHECK

Immediately stop and correct the process if any of these appears:

```text
Old code
Old template
Other participant code
Participant communication
Unauthorized storage
Backend/server code
Persistent prohibited database
Git history rewrite
Post-T+90 code/commit/push/deployment
Secrets
False information
Interference with lab/network
```

When there is a conflict between a convenience and a contest rule, **the contest rule wins**.

---

# 28. SIMPLE DECISION TREE

```text
Does this require a backend?
    â”œâ”€ YES â†’ Redesign as browser-only.
    â””â”€ NO â†’ Continue.

Does this require persistent online participant-controlled storage?
    â”œâ”€ YES â†’ Not allowed. Redesign.
    â””â”€ NO â†’ Continue.

Can browser storage solve it?
    â”œâ”€ YES â†’ Use localStorage/sessionStorage/IndexedDB as appropriate.
    â””â”€ NO â†’ Consider an allowed external HTTPS browser-accessible API.

Is it a required feature?
    â”œâ”€ YES â†’ Build it before bonus work.
    â””â”€ NO â†’ Defer.

Is English + Bangla coverage complete?
    â”œâ”€ NO â†’ Fix before final release.
    â””â”€ YES â†’ Continue.

Is deployment working publicly over HTTPS?
    â”œâ”€ NO â†’ Deploy immediately.
    â””â”€ YES â†’ Verify final commit match.

Is the clock at T+90?
    â”œâ”€ YES â†’ STOP coding/Git/deployment changes.
    â””â”€ NO â†’ Continue only with safe, high-value work.
```

---

# 29. FINAL OPERATING PRINCIPLE

When this skill is active, optimize for **contest compliance + functional completeness + speed + explainability**.

The preferred result is:

```text
Small
Correct
Bilingual
Frontend-only
Useful
Tested
Publicly deployed
Git-compliant
Easy to explain
```

Never optimize for complexity merely to make the project look bigger.

**Build the smallest app that fully satisfies the revealed problem, then improve it only with time that remains.**

