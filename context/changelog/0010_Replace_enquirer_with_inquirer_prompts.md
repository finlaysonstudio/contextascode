<Files>
packages/cli/src/codex/commands/new.ts
packages/cli/src/codex/commands/new.spec.ts
</Files>

enquirer was replaced with @inquirer/prompts.
Update code and tests.

Usage
```
import { input } from '@inquirer/prompts';

const answer = await input({ message: 'Enter your name' });
```
From https://www.npmjs.com/package/@inquirer/prompts
