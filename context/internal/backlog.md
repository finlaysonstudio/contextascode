# Backlog 📜

## ☑️ Action Items

### In Progress

1. Get a meta analysis on what should be done
2. Write a plan

### On Deck

💡 Try a process where one changelog writes the next

- `codex new prompt`
- help me think about this: an internal configuration system
- codex internal configuration system (for new change, prompt)
- `codex new` default
- "Help me think about this: I would like codex to open the users editor after the command is run"
- `marxdown` reader
- `contextaider change.md` read markdown and feed it to aider
- `contextaider 737` pickup newest ticket matching
- `contextaider exec --message "Evaluate this code on a scale of 1-10. Do not propose diffs or edits. State a numeric response followed by a two-sentence explanation. The first sentence should summarize the state of the code. The second sentence should indicate the number one priority for improvement, if any." --format "{score:Number,message:String}"`
- Write "Finlayson Studio Style", 
  - Take from what is in ./context/readme.md
  - Apply "Finlayson Studio Style" to ./README.md
- Codex Context packaging system:
  - context.md with frontmatter declaration (name, version, description, exclude, source: url to package, meta: <Any>)

aider  --read packages/cli/src/codex/commands/new.ts

## 🚦 Parking Lot

```
---
change:
file:
files:
guide:
guides:
navigation: # for context.md
plan:
read-only:
read:
ticket:
---
```

* thinking: fast # short,fast,true|long,slow,heavy|none,never,no,false
  * _In fact,_ we should use the openai key to interpret the marxdown frontmatter config when it is outside norms
  * _In fact,_ we should do this on as many error catches as possible everywhere
  * _Therefore,_ we want to prefer CONTEXTAIDER_OPENAI_API_KEY but fall to OPENAI_API_KEY (when former is false) 

* General Jira board manager

* How do I use @vitest/coverage-v8

## 🖇️ Context

### Instructions

* Move completed items to Data > Completed (below)
* When asked to "clean" or "clear" the backlog, remove all the completed items

## 🗃️ Data

### Completed
