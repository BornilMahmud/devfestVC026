# Project Guidelines & Integrated Capabilities

This workspace operates with integrated skills for **Frontend Design**, **Headroom Context Optimization**, **MemPalace Semantic Memory**, and **Playwright Browser Automation**.

---

## 1. Frontend Design Excellence
- **Design Lead Mindset**: Approach every UI task with a distinctive visual identity specific to the product domain. Never use generic AI templates.
- **Bespoke Color & Typography**:
  - Define a tight token palette (4–6 curated hex values).
  - Use 1–2 intentional typefaces with disciplined type scales.
  - Avoid AI tells: no warm cream `#F4F1EA` + terracotta `#D97757` defaults; no dark mode + neon acid green defaults; no repetitive SaaS cards with generic soft shadows (`rgba(0,0,0,0.1)`).
- **Disciplined Motion & Copy**:
  - Use motion only when answering user actions or for one orchestrated reveal.
  - Write clear, active-voice copy ("Save changes", not "Submit").

---

## 2. Headroom Context & Token Optimization
- **Targeted Tool Output**: Do not dump thousands of lines into the context when targeted slices or ripgrep queries suffice.
- **CCR (Compress-Cache-Retrieve)**: Always maintain complete error stacks, line numbers, and root causes. Expand compressed summaries when performing precise code edits.
- **Failure Learning**: When a debugging workflow or multi-step fix is completed, capture lessons learned into project rules to prevent recurrence.

---

## 3. MemPalace Semantic Memory & Recall
- **Search-Before-Answer Protocol**: For past decisions, project history, architectural agreements, or entity facts, search memory before answering rather than guessing from model memory.
- **Verbatim Accuracy**: Stored facts and quotes from the palace must remain verbatim—never summarize or lossy-compress historical context.
- **Structured Coordination**: Manage inter-agent handoffs and tasks with immutable base commits and clear definitions of done.

---

## 4. Playwright Browser Automation & UI Testing
- **Snapshot-Driven Inspection**: Use `playwright-cli` snapshots with node refs (`e1`, `e2`) to drive browser interactions cleanly.
- **Component & Trace Verification**: Inspect Playwright traces and component test mounts to validate UI rendering, layout responsiveness, and user flows.
- **Visual Confidence**: Verify interactive states, dialogs, forms, and responsive viewports before closing tasks.

---

## 5. Repository Synchronization & Auto-Commit Protocol
- **Target Repository**: `https://github.com/BornilMahmud/devfestVC026.git` (branch: `main`).
- **Committer Identity**: `Bornil Mahmud <bornilprof@gmail.com>`.
- **Mandatory Workflow**:
  - After completing every task, implementation phase, bug fix, or workspace modification, inspect changes with `git status`.
  - Stage all relevant changes (`git add .`).
  - Commit with a clear, descriptive message (`git commit -m "..."`).
  - Push directly to `origin main` using the authenticated token URL.
  - Verify working tree is clean and push is successful before concluding any response.

