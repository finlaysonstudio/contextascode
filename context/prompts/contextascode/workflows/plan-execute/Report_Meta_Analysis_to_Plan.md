---
id: ${slug} || slugify($something)
PlansDirectory: DefaultPlansDirectory
thinking: fast
---
# Report Meta Analysis to Plan ♾️

<ProblemStatement>
Answer these questions:
* Where do the reports represent a consensus?
* Where do the reports represent a majority?
* What are the minority findings?
</ProblemStatement>

Output a ${NewPlanOutputFile}

## 📥 Input Context

The following <Material> was given to three evaluators.
The evaluators provided the following reports.

<Material>
</Material>

<Report_1>
</Report_1>

<Report_2>
</Report_2>

<Report_3>
</Report_3>

## 📤 Expected Output Artifacts

<DefaultPlansDirectory>./context/changelog/plans</DefaultPlansDirectory>
<NewPlanOutputFile>${PlansDirectory}/${id}/plan.md</NewPlanOutputFile>

### Improvement Plan from Analysis

```markdown
# "{name}" Plan 📋
<Description>
{description}
</Description>

## 💻 Development Priorities

### High 🔴

{unanimity}

### Medium 🟠

{majority}

### Low 🔵

{minority}
```

---

## 🔄 Re-Statements

<ProblemRestatement>
Answer these questions:
* Where do the reports represent a consensus?
* Where do the reports represent a majority?
* What are the minority findings?
</ProblemRestatement>

<OutputRestatement>
Output ${NewPlanOutputFile} artifact
</OutputRestatement>