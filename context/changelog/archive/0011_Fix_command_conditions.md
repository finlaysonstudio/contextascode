<Files>
packages/cli/vite.config.ts
packages/cli/src/codex/index.ts
packages/cli/src/contextaider/index.ts
</Files>

Both have this:

```
if (
  import.meta.url.endsWith("/index.js") ||
  process.argv[1]?.endsWith("/index.js")
) {
  const program = createCodexCli();
  program.parse(process.argv);
}
```

But build to codex.js and contextaider.js.
Allow these others.
Ideally a separate function, `executedAs(["index.js", "codex.js"])`.