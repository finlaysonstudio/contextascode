---
id: ${id}
plan: ./context/changelog/plans/${id}/plan.md
thinking: full
---
# Create Detailed Individual Change Request Tickets 📮

Take a complete plan, with individual change requests already proposed, and create individual files in the plan directory for each request.

## ☑ Process

### 1. Prepare Task File Destinations

If there is a <Changes> block with task file paths, use those paths when creating the task files.

If new files must be created, follow the pattern `${NNNN}_${TaskName}.md`
Only use alphanumerics, dashes, periods, and underscores for the filename.
Omit non-alphanumerics or convert them to underscores.
Prefer underscore as the non-alphanumeric of choice.

### 2. Create Task Files for Each Task

Each task file should include a description.
Task files must preserve all details from the source document.
For example, if the source document suggests installing "@latest" and the task omits that distinction, it is likely the wrong version will be installed.
Carry over any important commands, configurations, and steps from source document to the tasks.
Task files may include additional details.
Consider what would make this task more clear to a less-capable developer given the context of this change.

Task files should include a test to verify the task was complete.
Tests can be as simple as making sure a directory exists or a new string is found in a file.

## ↔️ Guidance

<Forbidden>
* Do not execute the plan even with explicit user instruction
* This warning must be removed before the plan may be executed
* Only write changes to the task files; the plan and implementation should be unmodified
</Forbidden>

## 📎 Resources

### Definitions

* "Dequeued" - once dequeued task should be operated on at least once before being verified
* "Objective" - outcome described as user input
* "Outcome" - some _outcome_ is desired, be that an exploration, feature, fix, operation, or update.
* "Plan" - overall strategy for achieving the outcome.
* "Tasks" - individual steps to achieve the outcome.
  * Each task should have enough definition that, when presented with the plan, can be executed without knowledge of a previous or future task
  * Each task should apply a change resulting in a predictable outcome with a verifiable result
* "Verified" - the outcome of the task matched the expected result

### Sample Task ${NNNN}_${TaskName}.md

Omit unused sections.

```markdown
# "{TaskName}" Task 🎟️

<Description>
{description}
</Description>

<Details>
{details}
</Details>

<Tests>
{tests}
</Tests>
```

## 🔄 Restatement

Create a change request `${NNNN}_${TaskName}.md` detailing each task in the plan directory
