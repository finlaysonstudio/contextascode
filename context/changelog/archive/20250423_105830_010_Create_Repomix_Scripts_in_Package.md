---
files:
- package.json
guides:
- context/prompts/Repomix_Context_Packing_Tool.md
---
# Create Repomix Scripts in Package

## 🎯 Goal
<Goal>
Add repomix scripts to facilitate packing repository source code context.
</Goal>

## ↔️ Guidance
<Guidance>
Output to ./context/out/repo/

Create NPM scripts like this:
* repomix - runs all the repomix scripts:
1. repomix:packages - packs the first level of `./packages/*/`, `./packages/*/src/*` if applicable, but nothing else in `./packages/*/src/*/*`
2. repomix:packages:cli - packs the entire `./packages/cli/**` folder
3. repomix:context - packs the contents of `./context/**` but skips `changelog` and `internal`
4. repomix:context:changelog - packs only the contents of `./context/changelog/*` without packing subdirectories
5. repomix:context:internal - packs all of `./context/internal/**`
6. repomix:monorepo - packs `./**` including `./context/*` and `./packages/*` but not `./context/*/*` and `./packages/*/*`. Exclude `./config`
* repomix:*:copy - call its peer with `--copy` for the ordered scripts above (do not create `repomix:copy`)

If any of these are not possible, have them echo "not available"

Manage all the configurations in a new `config/repomix` directory
</Guidance>

