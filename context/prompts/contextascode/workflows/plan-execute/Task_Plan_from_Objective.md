# Task Plan from Objective 📋

Divide a complex objective into a plan or sequence of tasks.

## 📥 Expected Input Context

```
<Sources>

</Sources>
<Output>./context/changelog/plans/${name}</Output>
```

An idea or change requested, described or tagged with `<Sources>`.

A directory to output the plan, described or tagged with `<Directory>`, `<Output>`, etc; otherwise create a new directory `./context/changelog/plans/${name}`.
If no name is provided and the request is following a numeric sequence to begin its filename (e.g., 012_Feature.md or 2025_01_02_Fix.md), begin name with that same numeric sequence.

## 📤 Expected Output Artifacts

* Create the output directory if needed
* `observations.md`
* `plan.md` with `<Pending>`, `<Processing>`, `<Complete>`
* `01_pending/`
* `${NNNN}_${TaskName}.md` change request detailing each task
* `02_processing/`
* `03_complete/`
* As needed `04_incomplete/`, `00_backlog/`, `context.md`

## 💡 Definitions

* "Objective" - outcome described as user input
* "Outcome" - some _outcome_ is desired, be that an exploration, feature, fix, operation, or update.
* "Plan" - overall strategy for achieving the outcome.
* "Tasks" - individual steps to achieve the outcome.
  * Each task should have enough definition that, when presented with the plan, can be executed without knowledge of a previous or future task
  * Each task should apply a change resulting in a predictable outcome with a verifiable result

## ☑ Process

### 1. Write Plan Guidance

Guidance should include any context needed for the execution of any given task.
Assume audience, most likely a code generation agent, can understand technical domain terminology and execute instructions but has literally zero experience with this repository.

Guidance template (below) includes suggested topics as bulleted list.
Only include guidance valuable to the audience; pro-forma guidance like "always consider performance" distracts from the main goal.

Create Task Board to update the workflow progresses.

### 2. Write Plan Tasks

Carefully consider the order tasks must be completed.
The scope of each task should be executable in 2-3 turns with a code generation agent applying diffs and calling tools.
Omit task details, those should be placed in task files.

### Seek Clarification ONLY IF NECESSARY ⏸️

If there is additional context that, once provided, represents an order of magnitude difference in the ability to execute the plan or include critical information necessary for success, output those questions as context.md following the sample.

### STOP ⏹️

Ensure the previous steps are applied and saved.
Record observations.
If the previous steps were not applied, exit.
Before exiting report to the user, "plan.md phase complete; awaiting instruction."
Continue if previous steps were completed previously.

### 3. Create Task Files

For each task create a file named `${NNNN}_${TaskName}.md` inside `01_pending/`.
Only use alphanumerics, dashes, periods, and underscores for the filename.
Omit non-alphanumerics or convert them to underscores.
Prefer underscore as the non-alphanumeric of choice.

Each task file should include a description.
Task files may include additional details.
Task files should include a test to verify the task was complete.
Tests can be as simple as making sure a directory exists or a new string is found in a file.

## ℹ️ Guidance

### Out of Scope
<Forbidden>
* Do not execute the plan without clear user intent and explicit instruction
</Forbidden>

### Related Context

* Execute_Task_from_Plan.md describes the workflow process for execution steps iff the user expressly authorizes execution intent

### Recording Observations in observations.md

* Record unexpected errors as they arise; unexpected crashes prevent opportunities to record
* Do not record rote details of things proceeding as expected
* Record grue encounters, sightings, and warnings
* At the end of creating the plan, record any context that will be helpful to future agents. Only record context if it will be helpful. Unnecessary context burdens optimal performance

## 📎 Resources

### Sample context.md

* Question details assumed optional, include iff needed
* Leave `>` for use to supply the answer

```markdown
"{name}" Context 🖇️

## 💡 Clarifications

### 1. {Question}

_{(details)}_

> 

### 2. {Question}

> 

### 3. {…}
```

### Sample observations.md

Markdown with semantic xml tagging.
Oldest at top, append newest.

```markdown
# Observations 🗒️
<Entry>
## {heading}
{description}
<Entry>
```

### Sample plan.md

Markdown with semantic xml tagging.

```markdown
# "{name}" Plan 📋
<Description>
{description}
</Description>

## ↔️ Guidance

* Architecture
* Assumptions
* Considerations
* Dependencies
* Development
* Performance
* Security
* Specifications
* Testing
* User Flow

## 🗂️ Task Board

<Pending>
### Pending
* {items}
</Pending>

<Processing>
### Processing
N/A
</Processing>

<Complete>
### Complete
N/A
</Complete>
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

## 📋 Instructions

* Read context.md if available, ignore if only a heading
* If context.md has answers, incorporate those answers into the plan or tasks
* Once incorporated, delete the questions and answers leaving only the heading
* If incorporated, STOP, report to user "context.md incorporated; awaiting instruction"
* If context.md is unanswered questions warn the user, "Proceeding with unanswered questions in context.md"

* Follow this guide until a stopping point
* Report to the user and optionally records observations at stopping points
* When resuming work, skip step sections and begin at the first incomplete step
* Continue work until the next stopping point