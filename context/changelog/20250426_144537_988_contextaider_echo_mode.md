# contextaider echo mode

## 🎯 Goal
<Goal>
Add a new feature, "echo mode," that when enabled searches for and hands off to the echo command instead of aider
</Goal>

## ↔️ Guidance
<Guidance>
Read the plan to understand the context.

Read the source code.

Make echo mode the default mode unless process.env.CONTEXT_AIDER_ECHO_MODE === "false" or false or 0

_Later we will invert this to make it easy to swap and mark it as `// Future: $message`_

Create tests.
</Guidance>

## 🖇️ Context

<Files>
packages/contextaider/src/runner.ts
</Files>

<Tests>
packages/contextaider/src/runner.spec.ts
</Tests>

### Read-Only

<Guides>
context/changelog/plans/0014_Aider_Wrapper/plan.md
</Guides>
