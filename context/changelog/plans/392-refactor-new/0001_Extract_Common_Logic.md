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

---

<Results>
Successfully extracted common logic into helper functions:

1. Created a new `helpers.ts` file with the following functions:
   - `createSanitizedFilename`: Sanitizes descriptions for filenames
   - `generateTimestamp`: Creates timestamp strings for change files
   - `ensureDirectoryExists`: Ensures directories exist before writing files
   - `loadTemplate`: Loads and processes templates with replacements
   - `createFile`: Creates files with error handling

2. Refactored `handleNewCommand` to use these helper functions and split the implementation into two separate handler functions:
   - `handleChangeFile`: Handles change file creation
   - `handlePromptFile`: Handles prompt file creation

3. Added comprehensive tests for all helper functions in a new `helpers.spec.ts` file

All existing tests continue to pass with the new implementation. The code is now more maintainable and has less duplication. The helper functions are properly exported and can be reused in other parts of the codebase.
</Results>

---

<Verified>
All tests for helper functions (`createSanitizedFilename`, `generateTimestamp`, `ensureDirectoryExists`, `loadTemplate`, `createFile`) and new command handlers (`handleChangeFile`, `handlePromptFile`) passed successfully. The common logic extraction works as expected, and existing tests continue to pass.
</Verified>
