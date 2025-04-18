# Ideal Project Structure 🏆

Specification for an ideal project structure

## ✈️ Overview

* ESLint + Prettier
* Jaypie project opinions and tooling
* NPM with Workspaces ("monorepo")
* TypeScript
* Vite
* Vitest .spec sibling to implementation

## 📦 NPM

### Dev Dependencies

#### Top-Level

* @jaypie/eslint
* @jaypie/testkit
* eslint
* rimraf
* sort-package-json
* tsx
* vitest

#### Package-Level

Anything particular to that package outside aforementioned.

### Scripts

| Script | Top-level | Sub-packages | Root-level |
| ------ | --------- | ------------ | ---------- |
| `build` | `npm run build --workspaces` | `vite build && tsc --emitDeclarationOnly` | N/A |
| `clean` | `npm run clean --workspaces && npm run clean:root` | `rimfaf dist` | `clean:root` |
| `format` | `eslint --fix` | `eslint --fix` | N/A |
| `format:package` | `sort-package-json ./package.json ./packages/*/package.json` | `sort-package-json` | N/A |
| `lint` | `eslint` | `eslint .` | N/A |
| `test` | `vitest run` | `vitest run` | N/A |
| `test:watch` | `vitest watch` | `vitest watch` | N/A |
| `test:<package>:watch` | `npm run test:watch --workspace packages/<package>` |  | N/A |
| `typecheck` | `npm run typecheck --workspaces` |  | N/A |

## 🖇️ Context

### Default Instructions

Evaluate the current project structure.
Report what ways it deviates from the stated ideal.

### Possible Commands

* For example, if the user says "Add clean scripts for aider" that implies the user wants `clean:aider` to `rimraf .aider.*.history .aider.*.history.* .aider.*.cache.* .aider.*.cache` (do not do this by default)
