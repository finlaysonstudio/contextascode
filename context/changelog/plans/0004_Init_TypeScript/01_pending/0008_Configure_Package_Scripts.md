# "Configure Package Scripts" Task 🎟️

<Description>
Configure package scripts according to the ideal project structure.
</Description>

<Details>
1. Configure root package.json scripts:
   - build: "npm run build --workspaces"
   - clean: "npm run clean --workspaces && npm run clean:root"
   - clean:root: "rimraf node_modules"
   - format: "eslint --fix"
   - format:package: "sort-package-json ./package.json ./packages/*/package.json"
   - lint: "eslint"
   - test: "vitest run"
   - test:watch: "vitest watch"
   - typecheck: "npm run typecheck --workspaces"

2. Configure CLI package.json scripts:
   - build: "vite build && tsc --emitDeclarationOnly"
   - clean: "rimraf dist"
   - format: "eslint --fix"
   - lint: "eslint ."
   - test: "vitest run"
   - test:watch: "vitest watch"
   - typecheck: "tsc --noEmit"
</Details>

<Tests>
- Verify scripts are properly configured in both package.json files
- Test each script to ensure it works as expected
</Tests>

---

<Results>
Successfully updated package scripts in both root package.json and packages/cli/package.json:

1. Root package.json:
   - Added clean and clean:root scripts
   - Updated format script to include target path
   - Added format:package script
   - Added typecheck script
   - Updated lint script to include target path

2. CLI package.json:
   - Updated build script to use Vite and TypeScript declaration files
   - Added clean script
   - Updated format script to use ESLint
   - Added typecheck script

All scripts are now properly configured according to the task requirements.
</Results>
