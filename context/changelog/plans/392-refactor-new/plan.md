# "Refactor New Command" Plan 📋
<Description>
Refactor the new command implementation to improve code quality, maintainability, and performance based on consensus analysis from multiple evaluators.
</Description>

## 🗂️ Lifecycle Board

<Queued>
### Queued
* Externalize configuration into constants or config object #0004
* Enhance testability by decoupling file system operations #0005
* Move slug generation function to separate utilities directory #0006
</Queued>

<Dequeued>
### Dequeued
N/A
</Dequeued>

<Verified>
### Verified
* Extract common logic into helper functions #0001
* Switch to async FS APIs #0002
* Improve error handling #0003
</Verified>

## 💻 Development Priorities

1. Reduce Duplication: Extract common logic (template loading, directory creation, file writing) into reusable helper functions to avoid repetition between "change" and "prompt" handling.
2. Switch to Async FS APIs: Replace synchronous fs operations (existsSync, readFileSync, writeFileSync) with fs/promises for non-blocking I/O and better scalability.
3. Improve Error Handling: Enhance error reporting with more contextual information and reconsider the use of process.exit() in library code.
4. Externalize Configuration: Move directory paths, template paths, and filename rules into constants or a config object to make them configurable and easier to maintain.
5. Enhance Testability: Decouple file system operations to improve unit testing capabilities.
6. Move slug generation function to separate utilities directory

## ↔️ Guidance

N/A

## 🖇️ Context

<Sources>
  <Files>
    - packages/cli/src/codex/commands/new.ts
    - packages/cli/src/codex/commands/new.spec.ts
    - packages/cli/src/codex/commands/helpers.ts
    - packages/cli/src/codex/commands/helpers.spec.ts
  </Files>
  <Directories>
    - packages/cli/src/utils
  </Directories>
</Sources>
<Changes>
- ./context/changelog/plans/392-refactor-new/0001_Extract_Common_Logic.md
- ./context/changelog/plans/392-refactor-new/0002_Switch_to_Async_FS_APIs.md
- ./context/changelog/plans/392-refactor-new/0003_Improve_Error_Handling.md
- ./context/changelog/plans/392-refactor-new/0004_Externalize_Configuration.md
- ./context/changelog/plans/392-refactor-new/0005_Enhance_Testability.md
- ./context/changelog/plans/392-refactor-new/0006_Move_Slug_Generation_Utility.md
</Changes>

