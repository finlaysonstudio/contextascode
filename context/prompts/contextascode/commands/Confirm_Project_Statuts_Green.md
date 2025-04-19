```sh
npm install
npm out
npm run build
npm run lint
npm run test
npm run type-check
ls ./context/changelog/plans/*/02_processing
#draider foreach ./context/changelog/plans/*/02_processing run COMPLETE_TASK_PROCESSING.MD
#draider foreach ./context/changelog/plans/*/plan.md run CONFIRM_PLAN_STATUS.MD
```
# Confirm Project Status Green 💚

* If npm is not installing, debug
* If a package is out of date, update it or document the reason
* Fix lint issues
* Fix or skip broken tests
* Resolve steps marked in progress
