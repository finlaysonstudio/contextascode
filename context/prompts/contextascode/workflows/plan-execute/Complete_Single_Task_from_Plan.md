# Complete Single Task from Plan ☑️

Complete a single task from `plan.md`. Only one task should be processed per execution.

## 📥 Expected Input Context

```
<Plan>./context/plans/${name}/plan.md</Plan>
```

A directory path to the prepared plan file. If not provided, prompt for the plan path or exit with an error.

## 📤 Expected Output Artifacts

* Each task file updated with added `---` and `<Results>` section at bottom of file
* Task board updated in `plan.md` to move task from Queued to Dequeued

## ☑ Process

### 1. Identify the Next Task

Read `plan.md`. 

Locate the first task listed under `<Queued>`.
Move the task to `<Dequeued>`.
Read the task file.

### 2. Apply the Task

Read and understand the `<Description>` and `<Details>` of the task.

Apply the change described using tools or commands.

Add any new files created to the plan `<Files>` block if available

### 3. Test and Record Results

Run the `<Tests>` provided in the task file.

If tests fail, detail the failure in the `<Results>` section.

## 📝 Guidance

* It is **forbidden** to complete more than one task.

* Do not reorder tasks unless directed
* Preserve task file contents as they evolve with results
* Make minimal necessary changes to complete the task
* Record any deviation, issue, or unexpected outcome in `<Results>`

## 📎 Resources

### Sample Results Block

```markdown
---

<Results>
Test failed: expected 'foo' but found 'bar'
Attempted fix: reverted to previous version
Notes: May require additional review
</Results>
```

### Sample plan.md Update

Move task from one tag block to another:

```diff
<Queued>
### Queued
- * Create test harness
+ * Setup GitHub Actions
</Queued>

<Dequeued>
### Dequeued
+ * Create test harness
</Dequeued>
```
