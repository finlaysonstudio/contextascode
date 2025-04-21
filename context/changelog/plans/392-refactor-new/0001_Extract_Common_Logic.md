# "Extract Common Logic" Task 🎟️

<Description>
Extract common logic from the new command implementation into helper functions to reduce duplication between "change" and "prompt" handling.
</Description>

<Details>
The current implementation has significant duplication between the "change" and "prompt" handling code paths. This task involves:

1. Identify common operations:
   - Template loading
   - Directory creation
   - File writing
   - Description sanitization

2. Create helper functions for these operations:
   - `loadTemplate(templatePath: string, replacements: Record<string, string>): string`
   - `ensureDirectoryExists(dirPath: string): void`
   - `writeContentToFile(filePath: string, content: string): void`

3. Refactor the handleNewCommand function to use these helper functions for both "change" and "prompt" types.

This will make the code more maintainable and easier to extend with new types in the future.
</Details>

<Tests>
1. Verify that all tests in `new.spec.ts` still pass after refactoring.
2. Confirm that both "change" and "prompt" commands still work as expected.
3. Check that the code size has been reduced by removing duplication.
4. Verify that helper functions are properly exported and can be reused.
</Tests>
