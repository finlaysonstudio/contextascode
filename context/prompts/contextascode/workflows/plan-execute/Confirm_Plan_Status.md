# Confirm Plan Status 📋 🔍

Inspects a plan file and makes sure everything is in order.

## 📥 Expected Input Context

```xml
<Plan></Plan>
```

A plan file, usually markdown

## 📤 Expected Output Artifacts

Printed text.
One of:
* `<Okay />`
* `<Issues>${issues}</Issues>`

Where `${issues}` describes what needs to be fixed in the file

## ☑ Process

* Make sure all items are in Pending or Complete
* Items in Processing are "stuck"

## 📝 Guidance

### Plan Composition

A plan should have the following components:
* An overview with description, guidance, etc
* A task board with Pending, Processing, and Complete
