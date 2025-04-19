# Complete Single Task from Plan ☑️

Complete a single task from `plan.md`. Only one task should be processed per execution.

## 📥 Expected Input Context

```
<Plan>./context/plans/${name}/plan.md</Plan>
```

A directory path to the prepared plan file. If not provided, prompt for the plan path or exit with an error.

## 📤 Expected Output Artifacts

* Moved task file from `01_pending/` → `02_processing/` → `03_complete/`
* Each task file updated with added `---` and `<Results>` section at bottom of file
* Tasks with unresolved errors moved to `04_incomplete/` with issues documented
* Task metadata updated in `plan.md` to reflect new status
* Any helpful context recorded in `observations.md`

## ☑ Process

### 1. Identify the Next Task

Read `plan.md`. Locate the first task listed under `<Pending>`.
Verify the corresponding task file exists in `01_pending/`. If missing, record in `observations.md` and exit.

Move the file to `02_processing/`.

### 2. Apply the Task

Read and understand the `<Description>` and `<Details>` of the task.

Apply the change described using tools or commands.
If guidance or clarification is insufficient to proceed, copy task to `04_incomplete/` and record the issue in `observations.md`.

### 3. Test and Record Results

Run the `<Tests>` provided in the task file.

If tests pass, move the task file to `03_complete/`. Update `plan.md` to reflect completion.

If tests fail, add a `<Results>` section detailing the failure, move the task file to `04_incomplete/`, and update `plan.md`.

### 4. Update Task Board

Modify `plan.md` to reflect new status for the task:
* Remove from `<Pending>`
* Add to `<Processing>` or `<Complete>` as appropriate

Only one task may be in `<Processing>` at a time.

### STOP ⏹️

<Forbidden>
Do not complete more than one task.
</Forbidden>

Make sure to move the completed task from
`<Processing>` to `<Complete>` in the plan
and
`02_processing` to `03_complete` in the directory

## 📝 Guidance

* Do not reorder tasks unless directed
* Preserve task file contents as they evolve with results
* Make minimal necessary changes to complete the task
* Record any deviation, issue, or unexpected outcome in `observations.md`
* Only mark a task as complete if its outcome is verifiably correct

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
<Pending>
### Pending
- * Create test harness
+ * Setup GitHub Actions
</Pending>

<Processing>
### Processing
+ * Create test harness
</Processing>
```
