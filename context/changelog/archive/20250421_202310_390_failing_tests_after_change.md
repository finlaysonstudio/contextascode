---
plan: context/changelog/plans/392-refactor-new/plan.md
task: context/changelog/plans/392-refactor-new/0001_Extract_Common_Logic.md
test: packages/cli/src/codex/commands/new.spec.ts
files:
- packages/cli/src/codex/commands/new.ts
- packages/cli/src/codex/commands/helpers.ts
- packages/cli/src/codex/commands/helpers.spec.ts
---

# failing tests after change

Read the plan.
The most recent dequeued task is causing tests to fail.

See if the recent addition of helpers requires new.spec.ts to be updated