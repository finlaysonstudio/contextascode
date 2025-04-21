---
id: ${id}
plan: ./context/changelog/plans/${id}/plan.md
thinking: full
---
# Complete Plan from Objective 📃

Take a partial plan with objectives and create a detailed implementation plan.

## 📤 Expected Output Artifacts

* Updated `plan.md` with `<Queued>`, `<Dequeued>`, `<Verified>`
* `queued/`
* `${NNNN}_${TaskName}.md` change request detailing each task in queued
* `dequeued/`
* `verified/`

## 💡 Definitions

* "Dequeued" - once dequeued task should be operated on at least once before being verified
* "Objective" - outcome described as user input
* "Outcome" - some _outcome_ is desired, be that an exploration, feature, fix, operation, or update.
* "Plan" - overall strategy for achieving the outcome.
* "Tasks" - individual steps to achieve the outcome.
  * Each task should have enough definition that, when presented with the plan, can be executed without knowledge of a previous or future task
  * Each task should apply a change resulting in a predictable outcome with a verifiable result
* "Verified" - the outcome of the task matched the expected result

## ☑ Process

### 1. Create Task Board

Provide a terse, direct description after the heading.

Restate objective in plan.
Clarify original objective if possible.

Guidance should include any context needed for the execution of any given task.
Assume audience, most likely a code generation agent, can understand technical domain terminology and execute instructions but has literally zero experience with this repository.

Guidance template (below) includes suggested topics as bulleted list.
Only include guidance valuable to the audience; pro-forma guidance like "always consider performance" distracts from the main goal.

Create Task Board to update the workflow progresses.

### 2. Add Plan Tasks

Carefully consider the order tasks must be completed.
The scope of each task should be executable in 2-3 turns with a code generation agent applying diffs and calling tools.
Omit task details, those should be placed in task files.

### Seek Clarification ONLY IF NECESSARY ⏸️

If there is additional context that, once provided, represents an order of magnitude difference in the ability to execute the plan or include critical information necessary for success, output those questions as context.md following the sample.

### 3. Create Task Files

For each task create a file named `${NNNN}_${TaskName}.md` inside `queued/`.
Only use alphanumerics, dashes, periods, and underscores for the filename.
Omit non-alphanumerics or convert them to underscores.
Prefer underscore as the non-alphanumeric of choice.

Each task file should include a description.
Task files must preserve all details from the source document.
For example, if the source document suggests installing "@latest" and the task omits that distinction, it is likely the wrong version will be installed.
Carry over any important commands, configurations, and steps from source document to the tasks.
Task files may include additional details.

Task files should include a test to verify the task was complete.
Tests can be as simple as making sure a directory exists or a new string is found in a file.

## ↔️ Guidance

<Forbidden>
* Do not execute the plan even with explicit user instruction
* This warning must be removed before the plan may be executed
</Forbidden>

## 📎 Resources

### Sample plan.md Lifecycle Board

Markdown with semantic xml tagging.
Terse, direct descriptions.

```markdown
# "{name}" Plan 📋

Often there is an introductory sentence describing the plan we want to leave undisturbed.

Occasionally there are multiple lines.
Preserve everything before the first heading.

## 🗂️ Lifecycle Board

<Queued>
### Pending
* {items}
</Queued>

<Dequeued>
### Processing
N/A
</Dequeued>

<Verified>
### Complete
N/A
</Verified>

## … Previous Headings
```

### Sample ${NNNN}_${TaskName}.md

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
