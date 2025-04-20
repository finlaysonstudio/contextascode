# Green: Codebase Status Check 💚

Set of commands to check builds, lint, installation, tests, types, versions

It is good to be green 🐸

## 🙋 Human Process

Right now this is a human-mediated process.

## ✔️ Checks

```bash
npm audit
npm install
npm out
npm run build
npm run format
npm run test
npm run typecheck
ls ./context/changelog/plans/*/02_processing
```
(alphabetical order within `npm`)

## Priority

### High

* `npm install`
* `npm run build`

### Normal

* `npm run format`
* `npm run test`
* `npm run typecheck`

### Low

* `npm audit`
* `npm out`
* `ls ./context/changelog/plans/*/02_processing`
