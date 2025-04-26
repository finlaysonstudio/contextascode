---
context: 
  name: plan
  type: template
  attributes:
    Changes
    Description
    Dequeued
    Directories
    Files
    Queued
    Sources
    Validation
    Verified
---
# "{name}" Plan 📋

<Description>
</Description>

## 🗂️ Lifecycle Board

List and remove tickets in the order they should be processed.
Processing order takes precedent over ticket numbers.
Ticket numbers may or may not reflect creation order.

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

## 🖇️ Context
<Sources>
  …
</Sources>
<Changes>
- ./context/changelog/plans/${id}/${NNNN}_${TaskName}.md
- …
</Changes>

---

## ✔️ Validation