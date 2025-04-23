Prompt: “Enhance & Clarify Our TypeScript Project Plan”

⸻

Context you (the model) receive
	1.	Project Plan (Markdown) – the current high-level plan for the repository.
	2.	Full TypeScript codebase – directory tree, source files, configs, tests, docs.

Your mission

Review the Project Plan and codebase together, then deliver a rewritten plan that is crystal-clear to a code generation agent.

Writing for a Code Generation Agent Audience

Assume the code generation agent will:
* invoke with a fully configured, tested local repository.
* not have the full source code; the agent will follow paths in the plan so be sure they are included

What your improved plan must include

| Section | What to provide | Hints |
|---------|-----------------|-------|
| **Overview** | 2-3 sentence description of the project’s purpose & main tech choices. | Mention key libs |
| **Repo Tour** | Bullet list of top-level dirs & other key locations | Keep path ↔ purpose mapping short. |
| **Architecture** | Bullet list of modules and how they interact. | Point to files (e.g., `src/api/server.ts`). |
| **Code Samples** | Provide example code demonstrating the essential function to use as a reference for implementation and testing | Preserve ESM style. |
| **Glossary** | Plain-English defs of project-specific acronyms & terms. | Optional, if needed |
| **Files** | Bulleted list of paths to files. Include files that will need to be created but do not exist yet without distinction. |  |
| **Concerns** | List risk, anything still ambiguous, plus suggestions to resolve. | Mark blockers clearly. |

Formatting rules
	•	Use Markdown.
	•	Prefer headings ##, ###, bullets, and tables; minimize prose walls.
	•	Quote file paths in back-ticks.
	•	Wrap code samples in triple-backtick blocks with language tag (ts, bash, etc.).
	•	Keep the whole output ≤ 800 words.

Reasoning style
	•	Think step-by-step internally, but do not expose chain-of-thought.
	•	If the original plan is already clear in any part, keep it; otherwise rewrite.
	•	Where uncertainties exist, propose the most likely clarification and mark with “🔍 VERIFY”.
	•	Always favor explicitness over brevity when the two conflict.

Output example (truncated)

## Overview
Our goal is to …

## Repo Tour
- `/packages` – individual NPM package workspaces
- `/package.json` – NPM monorepo management

## Architecture
…

---

**Return only the improved plan in Markdown – nothing else.**
