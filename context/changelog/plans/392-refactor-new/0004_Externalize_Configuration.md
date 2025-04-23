# "Externalize Configuration" Task 🎟️

<Description>
Move directory paths, template paths, and filename rules into constants or a config object to make them configurable and easier to maintain.
</Description>

<Details>
The current implementation has hardcoded paths and rules scattered throughout the code. This task involves:

1. Create a configuration object or constants for:
   - Base directories (`CHANGELOG_DIR`, `PROMPTS_DIR`)
   - Template paths (`CHANGELOG_TEMPLATE_PATH`, `PROMPT_TEMPLATE_PATH`)
   - Filename patterns and rules
   - Template variable patterns (e.g., `{{ message }}`, `${title}`)

2. Centralize the configuration in a dedicated file or module:
   ```typescript
   // Example configuration structure
   export const CONFIG = {
     paths: {
       changelogDir: "./context/changelog",
       promptsDir: "./context/prompts",
       templates: {
         changelog: "./context/prompts/contextascode/templates/changelog.md",
         prompt: "./context/prompts/contextascode/templates/prompt.md"
       }
     },
     patterns: {
       changelogFilename: "${timestamp}_${description}.md",
       promptFilename: "${description}.md",
       templateVariables: {
         changelog: /\{\{\s*message\s*\}\}/g,
         prompt: /\$\{title\}/g
       }
     }
   };
   ```

3. Update the code to use these configuration values.

4. Consider making the configuration extensible or overridable.

This will make the code more maintainable and easier to adapt to different project structures.
</Details>

<Tests>
1. Verify that all tests in `new.spec.ts` still pass after refactoring.
2. Confirm that both "change" and "prompt" commands still work as expected.
3. Test that changing configuration values affects the behavior appropriately.
4. Ensure no hardcoded paths remain in the implementation.
</Tests>

---

<Results>
Created a new configuration file at `packages/cli/src/codex/config.ts` with the following structure:
- Paths section with changelogDir, promptsDir, and templates
- Patterns section with templateVariables for both changelog and prompt templates

Updated the code in:
1. `packages/cli/src/codex/commands/new.ts` to import and use the CONFIG object
2. `packages/cli/src/codex/commands/helpers.ts` to use the template variable patterns from CONFIG
3. `packages/cli/src/codex/commands/new.spec.ts` to mock the CONFIG object

All hardcoded paths have been replaced with references to the configuration object, making the code more maintainable and configurable. The implementation now allows for easier changes to directory structures and template formats without modifying the core logic.

The template variable replacement logic has been enhanced to use the patterns from the configuration when available, with a fallback to the previous generic replacement approach.

Tests have been updated to work with the new configuration structure and all tests pass successfully.
</Results>

---

<Verified>
The task has been successfully completed. The configuration has been properly externalized into a dedicated config.ts file, making the codebase more maintainable and configurable.

Key achievements:
1. Created a centralized CONFIG object with paths and patterns
2. Removed all hardcoded paths from the implementation
3. Updated the code to use the configuration values
4. Tests have been updated and all pass successfully

The implementation matches the requirements specified in the task description. The code is now more adaptable to different project structures and easier to maintain as configuration changes only need to be made in one place.
</Verified>
