---
name: 
description: 
goal: 
overview: 
package: 
workspaces:
- 
---

# New Project Start Here 🎬

<Init>
🙋 _Humans: save this file as `init.md` in your new repository._
</Init>

<Guide>
I want to start a new project. 
Create a new file, `plan.md`, or overwrite if it exists.
The goal is a TypeScript project, set up as an NPM monorepo with vite and vitest. 
The name of the project, set in the `package.json`, is `${package}`.
Set the description if available.
The workspaces, located in `packages/`, should be:
`${workspaces}`

Write a plan for a code generator to guide development.
Assume the code generator does not have access to reasoning and must be provided thorough context and examples.
Focus on clear instructions.
After writing introductory context, create a list of tasks that need to be performed.
Consider what tasks must be accomplished to achieve the goal.
Tasks are not a 1:1 mapping of objectives.
Some outcomes require multiple sequential tasks to be completed.
The scope of each task should be executable in 2-3 turns with a code generation agent applying diffs and calling tools.
Carefully consider the order of tasks.
Remove tasks only a human can perform.
</Guide>

<Overview>
{{ overview }}
</Overview>

<Usage>
* Run `claude init.md`
* Say `create plan`
</Usage>