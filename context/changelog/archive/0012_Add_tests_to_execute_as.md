Add tests to execution.ts per Add_Vitest_Tests.md

<Files>
packages/cli/src/utils/execution.ts
context/prompts/jaypie/Add_Vitest_Tests.md
</Files>

This is a challenging problem because mocking `import` and `process` is not simple.

Accept a second options param in executedAs, { search: [import.meta.url, process.argv[1]] }

Instead of duplicating the for (const fileName of fileNames) twice, make an outer loop for search.

From that starting point write tests following the guide