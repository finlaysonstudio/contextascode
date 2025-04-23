---
name: ${name} || "Choose ${name} from ${example}"
examples: ${examples}
guides: 
output: ${output} || context/prompts/templates/`slugify(${name})`.md
---
# Make a Template

Read the provided ${examples}.
Read the provided ${guides}, if applicable.

Create a re-usable template from this document structure at ${output}.
Remove all content particular to the example from the template.
In a good template, what to fill in is obvious without instruction.
Markdown headings with vertical whitespace are obvious without instruction (`## One\n\n## Two`).
Markup tags with vertical whitespace are obvious without instruction; place a newline in the input tag to indicate block-style content is allowed (`<One>\n</One>\n\n<Two>\n</Two>), avoid a newline to discourage block content.
An ideal template stands alone without additional modification.
