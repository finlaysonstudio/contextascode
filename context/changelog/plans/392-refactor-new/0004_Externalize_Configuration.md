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
