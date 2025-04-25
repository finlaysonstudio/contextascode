# "Switch to Async FS APIs" Task 🎟️

<Description>
Replace synchronous fs operations with fs/promises for non-blocking I/O and better scalability.
</Description>

<Details>
The current implementation uses synchronous file system operations which can block the event loop. This task involves:

1. Import fs/promises instead of fs:
   ```typescript
   import { promises as fs } from "fs";
   ```

2. Replace synchronous fs methods with their async equivalents:
   - `fs.existsSync()` → `await fs.access().catch(() => false)`
   - `fs.readFileSync()` → `await fs.readFile()`
   - `fs.writeFileSync()` → `await fs.writeFile()`
   - `fs.mkdirSync()` → `await fs.mkdir()`

3. Update function signatures and add async/await where needed.

4. Ensure proper error handling with try/catch blocks.

This change will improve performance for file operations, especially in high-throughput scenarios.
</Details>

<Tests>
1. Verify that all tests in `new.spec.ts` still pass after refactoring.
2. Update tests to handle async operations correctly.
3. Confirm that both "change" and "prompt" commands still work as expected.
4. Test with large files to ensure non-blocking behavior.
</Tests>

---

<Verified>
All synchronous fs operations have been replaced with their fs/promises equivalents (using fs.access for existence checks, fs.readFile, fs.writeFile, and fs.mkdir). Function signatures have been updated to async/await, and tests in `new.spec.ts` have been refactored to handle the async operations. All Vitest tests now pass successfully.
</Verified>
