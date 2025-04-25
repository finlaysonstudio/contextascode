# "Move Slug Generation Utility" Task 🎟️

<Description>
Move slug generation function to a separate utilities directory for better code organization and reusability.
</Description>

<Details>
The current implementation has the description sanitization logic embedded in the handleNewCommand function. This task involves:

1. Create a new utility function in the utils directory:
   ```typescript
   // packages/cli/src/utils/slug.ts
   export function generateSlug(text: string): string {
     return text
       .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove non-alphanumeric chars (except spaces and dashes)
       .replace(/\s+/g, "_"); // Replace spaces with underscores
   }
   ```

2. Add tests for the slug generation function:
   ```typescript
   // packages/cli/src/utils/slug.spec.ts
   import { describe, it, expect } from "vitest";
   import { generateSlug } from "./slug";
   
   describe("generateSlug", () => {
     it("should replace spaces with underscores", () => {
       expect(generateSlug("hello world")).toBe("hello_world");
     });
     
     it("should remove special characters", () => {
       expect(generateSlug("hello@world!")).toBe("helloworld");
     });
     
     // Add more test cases
   });
   ```

3. Update the handleNewCommand function to use this utility.

4. Consider adding more options to the slug generator for flexibility.

This will improve code organization and make the slug generation logic reusable across the codebase.
</Details>

<Tests>
1. Verify that the new utility function has comprehensive test coverage.
2. Confirm that both "change" and "prompt" commands still generate the same filenames.
3. Check that the slug generation logic is consistent across the application.
4. Ensure the utility can be imported and used in other parts of the codebase.
</Tests>

---

<Results>
Successfully moved the `createSanitizedFilename` function from `helpers.ts` to a new `string.ts` utility file.

Changes made:
1. Created new file `packages/cli/src/utils/string.ts` with the function
2. Removed the function from `helpers.ts`
3. Updated imports in `helpers.ts` and `new.ts`
4. Created a new test file `packages/cli/src/utils/string.spec.ts` with comprehensive tests

All existing functionality should be preserved with improved code organization. The function was renamed from the proposed `generateSlug` to maintain the existing `createSanitizedFilename` name for consistency with current code.
</Results>
