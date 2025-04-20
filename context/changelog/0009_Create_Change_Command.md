<Files>
packages/cli/src/codex/index.ts
</Files>

I want a new command:
`codex new <type=change|prompt> [description]`

In the future I will want `new prompt` but for now just `change`.
Eventually, in addition to `new` I will want `exec`/`run`, `install` and `up`/`update`

Create the new function inside a new file.
Make sure it routes based on type but only implement change.
Create tests.

Import it into the index file similar to:
```
import { newCommand } from "./commands/new.js";

// Add commands
newCommand(program);
```

If description, a string, is not passed, prompt the user for it as input.
enquirer is installed.

Create a new file in ./context/changelog called `YYYY_MM_DD_HHMM_SSMMM_{filename}.md`

Make filename the description with spaces converted to underscore and all non alphanumerics (only allowing space and dash) discarded.

Look for a template in ./context/prompts/contextascode/templates/changelog.md

If one is present use it as the contents for the new file.
Replace `{{ message }}` with the message.

If no file is present use `# {{ message }}\n\n` as the contents
