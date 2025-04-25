---
exec: 
  model: thinking: fast
  params: id?, plan
id: ${id}
plan: ./context/changelog/plans/${id}/plan.md
notes: |
  Not working as of 4/25/2025
---
# Confirm Plan Status 📋 📮 🔍

Read the plan file.
Read all linked change request files.
Ensure status of each change request file matches plan file status.

## ☑ Process

* A ticket lifecycle board should be present with sections tagged `<Queued>`, `<Dequeued>`, and `<Verified>`.
* Paths to individual change files may be listed in `<Changes>` or elsewhere in the document; report if no change request files are found
* Review each column of the lifecycle board and confirm the each change request status is in sync with its file
* Trust the contents of the file more than the plan board

## ↔️ Guidance

### Queued 📥

Open and read each change request file for each `<Queued>` change:

* Confirm the request file does not have a `<Results>` section
* If the request has a results section the ticket should be moved to `<Dequeued>`

### Dequeued 📤

Open and read each change request file for each `<Dequeued>` change:

* Confirm the request file has a `<Results>` section
* If the request does not have results the ticket should be moved to `<Queued>`
* Confirm the request file does not have a `<Verified>` section
* If the request has a verified section the ticket should be moved to `<Verified>`

### Verified ✔️

Open and read each change request file for each `<Verified>` change:

* Confirm the request file has a `<Verified>` section
* If the request file does not include this section the ticket should be moved to `<Dequeued>` or `<Queued>`

### Report 🧾

* If there is not a "Validation" section heading, append a horizontal rule and section heading to the document (`---\n\n## ✔️ Validation`)
* Create a new `<Validation>` tag block
* Print all the recorded issues and any other observations as the report
* If there are no problems to report, print `Plan status verified.`

```markdown
…(original document)…

## ✔️ Validation

<Validation>
Oldest validation block.
Prior blocks may use custom or no formatting.
</Validation>

<Validation>
### ${isoDateTime}
${report}
</Validation>
```

## 📎 Resources

### Plan Composition

A plan should have the following components:

* Title and description
* A task board with Queued, Dequeued, and Verified
* Guidance and other instructions
* Context (sources, changes) for coding agents
* Validation