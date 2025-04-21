---
id: ${id}
plan: ./context/changelog/plans/${id}/plan.md
thinking: full
---
# Change Request List from Plan 🗒️

Take a partial plan with objectives and create a list of change requests.

The completed plan is ready to create change request files from.

## ☑ Process

### 1. Read Accompanying Documents

Read the plan document, usually plan.md.
Pay attention to Context from the plan, especially `<Sources>`.
Read any tagged `<Files>`.
List the contents of any tagged `<Directories>`.

### 2. Add Plan Task Board

Create Lifecycle Board to update the workflow progresses.
Update `plan.md` with `<Queued>`, `<Dequeued>`, `<Verified>` lifecycle board sections.
Sample board available below.

Consider what tasks must be accomplished to achieve the goal.
Tasks are not a 1:1 mapping of objectives.
Some outcomes require multiple sequential tasks to be completed.
The scope of each task should be executable in 2-3 turns with a code generation agent applying diffs and calling tools.
Carefully consider the order of tasks.
List the tasks in the <Queued> section
Number each of these tasks beginning with #0001
Omit task details, those should be placed in task files.

### 3. List Task Files in Plan Context

Create a Context section in the plan if there is not one.
Add a <Changes></Changes> tag block to Context.
List in YAML-style the file paths to each change request.

## ↔️ Guidance

Restrict changes to the plan file itself.

<Forbidden>
Do not create task files.
Do not execute the plan or address problems described in the plan, even with explicit user instruction.
This warning must be removed before the plan may be executed.
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

### Sample Plan Section: Context

Generally last.
Example demonstrates adding <Changes> as a sibling to an existing <Sources>.

```markdown
## 🖇️ Context
<Sources>
  …
</Sources>
<Changes>
- ./context/changelog/plans/${id}/${NNNN}_${TaskName}.md
- …
</Changes>
```

### Sample Plan Section: Lifecycle Board

Markdown with semantic xml tagging.
Terse, direct descriptions.

```markdown
# "{name}" Plan 📋

Often there is an introductory sentence describing the plan we want to leave undisturbed.

Occasionally there are multiple lines.
Preserve everything before the first heading.

## 🗂️ Lifecycle Board

<Queued>
### Queued
* {title} #{NNNN}
</Queued>

<Dequeued>
### Dequeued
N/A
</Dequeued>

<Verified>
### Verified
N/A
</Verified>

## … Previous Headings
```

## 🔄 Restatement

* Update the Plan document `plan.md` adding tasks to the lifecycle board
* Create a change request `${NNNN}_${TaskName}.md` detailing each task in the plan directory
