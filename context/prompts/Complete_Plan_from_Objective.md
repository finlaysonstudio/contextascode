---
id: ${id}
plan: ./context/changelog/plans/${id}/plan.md
thinking: full
---
# Complete Plan from Objective 📃

Take a partial plan with objectives and create a detailed implementation plan.

## 📤 Expected Output Artifacts

* Update `plan.md` with `<Queued>`, `<Dequeued>`, `<Verified>` lifecycle board sections
* Create a change request `${NNNN}_${TaskName}.md` detailing each task in the plan directory

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

Create Lifecycle Board to update the workflow progresses.
Sample board available below.

### 2. Add Plan Tasks

Consider what tasks must be accomplished to achieve the goal.
Tasks are not a 1:1 mapping of objectives.
Some outcomes require multiple sequential tasks to be completed.
The scope of each task should be executable in 2-3 turns with a code generation agent applying diffs and calling tools.
Carefully consider the order of tasks.
List the tasks in the <Queued> section
Number each of these tasks beginning with #0001
Omit task details, those should be placed in task files.

### 3. Create Task Files

For each task create a file named `${NNNN}_${TaskName}.md` in the plan directory 
Only use alphanumerics, dashes, periods, and underscores for the filename.
Omit non-alphanumerics or convert them to underscores.
Prefer underscore as the non-alphanumeric of choice.

Each task file should include a description.
Task files must preserve all details from the source document.
For example, if the source document suggests installing "@latest" and the task omits that distinction, it is likely the wrong version will be installed.
Carry over any important commands, configurations, and steps from source document to the tasks.
Task files may include additional details.
Consider what would make this task more clear to a less-capable developer given the context of this change.

Task files should include a test to verify the task was complete.
Tests can be as simple as making sure a directory exists or a new string is found in a file.

Create a Context section in the plan if there is not one.
Add a <Changes></Changes> tag block to Context.
List in YAML-style the file paths to each change request.

## ↔️ Guidance

<Forbidden>
* Do not execute the plan even with explicit user instruction
* This warning must be removed before the plan may be executed
</Forbidden>

## 📎 Resources

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

* Update the Plan document `plan.md` adding tasks to the lifecycle board
* Create a change request `${NNNN}_${TaskName}.md` detailing each task in the plan directory
