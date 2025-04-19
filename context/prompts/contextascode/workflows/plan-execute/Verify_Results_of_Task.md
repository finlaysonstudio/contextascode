# Verify Results of Task

## 📥 Expected Input Context

```xml
<Plan></Plan>
<Task></Task>
```

<Plan>context/changelog/plans/${plan}/plan.md</Plan>
<Task>context/changelog/plans/${plan}/03_complete/${task}.md</Task>

## 📤 Expected Output Artifacts

* Append verification block to task (see sample)

## ☑ Process

1. Read the plan and task
2. Use reasoning to confirm the test proposed in the task validates the work outlined was complete
3. Confirm expected results are reported in results
4. Independently reproduce the tests and re-run them
5. Report the results in the verification block
6. Report any concerns from previous steps in the optional concerns statement

## 📝 Guidance

### Example "Concerns"

Report anything likely to cause problems or confusion.

* Task file not coherent
* No proposed test in task
* Proposed test does not fully exercise the change
* Described results include errors
* Describe results do not reflect test cases
* Do NOT output "no concerns" or alike; skip statement if there are no concerns

## 📎 Resources

### Sample Verification Block

Appended to the end of the task file.

```markdown
---

<Verified>
${output}
</Verified>
```

### Sample Concern Statement

Appended to the end of the verification block.

```markdown
<Concerns>
${output}
</Concerns>
```
