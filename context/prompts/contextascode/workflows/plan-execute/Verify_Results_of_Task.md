# Verify Results of Task

## 📥 Expected Input Context

```yaml
plan: context/changelog/plans/${plan}/plan.md
```

## 📤 Expected Output Artifacts

* Append verification block to task (see sample)
* Move task from `<Dequeued>` to `<Verified>` 

## ☑ Process

1. Read the plan and task
2. Use reasoning to confirm the test proposed in the task validates the work outlined was complete
3. Confirm expected results are reported in results
4. Independently reproduce the tests and re-run them
5. Report the results in the verification block
6. Move task from `<Dequeued>` to `<Verified>` in lifecycle board in plan.md

Do not execute a new task.

## 📎 Resources

### Sample Verification Block

Appended to the end of the task file.

```markdown
---

<Verified>
${output}
</Verified>
```

### Sample plan.md Update

Move task from one tag block to another:

```diff
<Dequeued>
### Dequeued
- * Setup GitHub Actions
+ N/A
</Dequeued>

<Verified>
### Verified
* Create test harness
+ * Setup GitHub Actions
</Verified>
```
