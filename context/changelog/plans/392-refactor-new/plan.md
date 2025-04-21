# "Refactor New Command" Plan 📋
<Description>
Refactor the new command implementation to improve code quality, maintainability, and performance based on consensus analysis from multiple evaluators.
</Description>

## 💻 Development Priorities

### High 🔴

1. Reduce Duplication: Extract common logic (template loading, directory creation, file writing) into reusable helper functions to avoid repetition between "change" and "prompt" handling.
2. Switch to Async FS APIs: Replace synchronous fs operations (existsSync, readFileSync, writeFileSync) with fs/promises for non-blocking I/O and better scalability.
3. Improve Error Handling: Enhance error reporting with more contextual information and reconsider the use of process.exit() in library code.

### Medium 🟠

1. Externalize Configuration: Move directory paths, template paths, and filename rules into constants or a config object to make them configurable and easier to maintain.
2. Enhance Testability: Decouple file system operations to improve unit testing capabilities.

### Low 🔵

1. Add robust slug generation using a dedicated library
2. Guard against overwriting existing files
3. Provide clearer user feedback via structured logging
4. Type narrowing and validation improvements
5. Allow template paths and output directories to be overridden via CLI options
