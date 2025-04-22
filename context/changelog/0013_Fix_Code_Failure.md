---
check: npm run typecheck
files:
  - src/codex/commands/new.ts
  - src/codex/commands/new.spec.ts
---

When the check command is run, the following output occurs.

Run the check command to confirm similar.

Edit the files mentioned in the output until the command runs without errors.

<Output>
> @contextascode/monorepo@0.1.0 typecheck
> npm run typecheck --workspaces


> @contextascode/cli@0.1.0 typecheck
> tsc --noEmit

src/codex/commands/new.spec.ts(27,71): error TS2322: Type 'undefined' is not assignable to type 'Promise<void>'.
src/codex/commands/new.spec.ts(28,56): error TS2345: Argument of type '(path: string, replacements: Record<string, string>, defaultContent: string) => string' is not assignable to parameter of type 'NormalizedProcedure<(templatePath: string, replacements: Record<string, string>, defaultContent: string) => Promise<string>>'.
  Type 'string' is not assignable to type 'Promise<string>'.
src/codex/commands/new.spec.ts(36,54): error TS2345: Argument of type '(path: string) => string' is not assignable to parameter of type 'NormalizedProcedure<(filePath: string, content: string) => Promise<string>>'.
  Type 'string' is not assignable to type 'Promise<string>'.
src/codex/commands/new.spec.ts(102,59): error TS2345: Argument of type 'string' is not assignable to parameter of type 'Promise<string>'.
src/codex/commands/new.spec.ts(146,59): error TS2345: Argument of type 'string' is not assignable to parameter of type 'Promise<string>'.
src/codex/commands/new.ts(84,24): error TS2345: Argument of type 'Promise<string>' is not assignable to parameter of type 'string'.
src/codex/commands/new.ts(114,24): error TS2345: Argument of type 'Promise<string>' is not assignable to parameter of type 'string'.
</Output>