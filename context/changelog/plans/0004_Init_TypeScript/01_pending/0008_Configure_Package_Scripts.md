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
