---
plan: context/changelog/plans/0014_Aider_Wrapper/plan.md
---

# quote message to aider

Read the plan to find the correct files.

When I pass a message to aider it need to be quoted.
For example,

contextaider exec.md "take option 2"

Is being echoed as

`--message-file exec.md --message take option 2`

It needs to be echoed as

`--message-file exec.md --message "take option 2"`

echo mode simply means the params are going to echo, not aider