# Context Optimization & Token Economy Rules

- Keep tool outputs concise and targeted: never read multi-thousand line files in bulk when localized line ranges or search patterns suffice.
- Preserve critical error traces: always inspect the root cause, stack trace, and fatal lines without omitting context.
- Learn from failures: when a multi-step debugging workflow finishes, document the fix or run session learning to prevent recurrence.