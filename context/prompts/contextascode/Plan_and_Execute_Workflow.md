# "Plan and Execute" Workflow 🔂

## ⌨ Commands

<Guides>
* Verbs "create" or "task" with nouns "feature," "objective," "plan," "project," implies workflows/plan-execute/Task_Plan_from_Objective.md
* Verbs "complete", "continue," "do," "execute," "finish," "go," "run," alone or with nouns like "feature," "objective," "plan," "project," implies workflows/plan-execute/Complete_Single_Task_from_Plan.md
* Verbs "check," "confirm," "verify," with nouns "output," "result," "task" implies workflows/plan-execute/Verify_Results_of_Task.md
</Guides>

Accept synonyms that match intent.

## 📥 Expected Input Context

```xml
<Request></Request>
<Plan></Plan>
<Task></Task>
```

At least one attribute is required.

A change request may describe the objective.
An objective is required to create a plan.

Alone a request means to create the plan.
Alone a plan means to run the next step in the plan.
Alone an incomplete task means to run or resume that task.
Alone a complete task means to verify that task.

## 📝 Guidance

* Consult guides only as needed
* Determine the needed guide before reading any guide
* Only one guide should be needed for any task
* Orchestration of the entire process is possible with all guides but not described in this document
