# ContextAider Implementation Plan

## 🗂️ Lifecycle Board

List and remove tickets in the order they should be processed.
Processing order takes precedent over ticket numbers.
Ticket numbers may or may not reflect creation order.

<Queued>
### Queued
* Configure build and workspace scripts #0007
* Add postinstall version check script #0008
</Queued>

<Dequeued>
### Dequeued
* Initialize ContextAider package structure #0001
* Implement exec mode with frontmatter detection #0002
* Implement file and message handling logic #0003
* Implement CLI flag parsing and translation #0004
* Implement process handoff runner preserving TTY #0005
* Add unit and integration tests #0006
</Dequeued>

<Verified>
### Verified
N/A
</Verified>

## Overview
A TypeScript-based CLI wrapper for the aider tool that preprocesses custom flags and seamlessly hands off to the original aider, preserving its interactive UI. Built with ESM modules, Commander for CLI parsing, and Vitest for testing, packaged as `contextaider`. Provides enhanced file handling and message passing capabilities through a modular exec mode.

## Repo Tour
- `/packages/contextaider` - Main package directory
- `/packages/contextaider/bin` - CLI entrypoint and executable scripts
- `/packages/contextaider/src` - Core wrapper implementation and utilities
- `/packages/contextaider/tests` - Integration test suites
- `/packages/contextaider/package.json` - ESM build config and global bin entry
- `/packages/contextaider/tsconfig.json` - TypeScript configuration
- `/packages/contextaider/vite.config.ts` - Vite build configuration
- `/packages/contextaider/vitest.config.ts` - Vitest test configuration

## Architecture
- `packages/contextaider/bin/contextaider.ts` - CLI entrypoint using Commander
- `packages/contextaider/src/flag-mappings.ts` - Custom flag to aider flag translation logic
- `packages/contextaider/src/flag-mappings.spec.ts` - Unit tests for flag mapping
- `packages/contextaider/src/handler.ts` - Preflight operations (file reads, API calls)
- `packages/contextaider/src/handler.spec.ts` - Unit tests for preflight operations
- `packages/contextaider/src/runner.ts` - Process handoff implementation
- `packages/contextaider/src/runner.spec.ts` - Unit tests for process handoff
- `packages/contextaider/src/exec-mode/` - Modular exec mode implementation
  - `index.ts` - Exec mode orchestration
  - `index.spec.ts` - Unit tests for exec mode orchestration
  - `frontmatter.ts` - YAML frontmatter detection and handling
  - `frontmatter.spec.ts` - Unit tests for frontmatter detection
  - `file-handler.ts` - File existence and path validation
  - `file-handler.spec.ts` - Unit tests for file handling
- `packages/contextaider/tests/` - Integration test suites
  - `cli.spec.ts` - Full CLI execution tests
  - `integration.spec.ts` - End-to-end workflow tests

## Package Configuration

### Root package.json
```json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "clean": "npm run clean --workspaces && npm run clean:root",
    "clean:root": "rimraf dist",
    "format": "eslint --fix",
    "format:package": "sort-package-json ./package.json ./packages/*/package.json",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:contextaider:watch": "npm run test:watch --workspace packages/contextaider",
    "typecheck": "npm run typecheck --workspaces"
  },
  "devDependencies": {
    "@jaypie/eslint": "latest",
    "@jaypie/testkit": "latest",
    "eslint": "latest",
    "rimraf": "latest",
    "sort-package-json": "latest",
    "tsx": "latest",
    "vitest": "latest"
  }
}
```

### ContextAider package.json
```json
{
  "name": "contextaider",
  "version": "0.0.1",
  "description": "CLI wrapper for the aider tool with enhanced file handling",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "contextaider": "./dist/contextaider.js"
  },
  "scripts": {
    "build": "vite build && tsc --emitDeclarationOnly",
    "postbuild": "chmod +x dist/contextaider.js",
    "clean": "rimraf dist",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "typecheck": "tsc --noEmit"
  },
  "files": [
    "dist"
  ],
  "keywords": [
    "cli",
    "aider",
    "ai",
    "coding",
    "assistant"
  ],
  "dependencies": {
    "commander": "^13.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "latest"
  }
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", "bin/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

### Vite Configuration
```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'node18',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        contextaider: resolve(__dirname, 'bin/contextaider.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['commander', 'fs/promises', 'path'],
    },
  },
  test: {
    environment: 'node',
    include: ['**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

## Testing Strategy
- Co-locate unit test files with implementation files (`.spec.ts` suffix)
- Use separate `/tests` directory for integration tests
- Use Vitest for testing framework with coverage reporting
- Test each module in isolation with unit tests
- Mock file system operations for file handling tests
- Test edge cases for flag parsing and file handling
- Include integration tests for full CLI execution and end-to-end workflows
- Use Vite's test environment for consistent build and test environment

## Flag Specifications

### Exec Mode
- Primary flag: `--exec <file>`
- Only one exec command allowed per invocation
- Error if multiple `--exec` flags are provided
- Implicit exec mode: First non-flag argument treated as exec file if it's a filepath

### File Handling
- Multiple files supported: `contextaider --exec 1.md 2.md`
- Files after exec file passed directly to aider
- Example: `contextaider 1.md 2.md` → `aider --message-file 1.md 2.md`

### Message Handling
- Last non-flag argument treated as message if not a filepath
- Example: `contextaider 1.md "Make tests pass"` → `aider --message-file 1.md --message "Make tests pass"`

### YAML Frontmatter
- Detect YAML frontmatter between `---` markers
- Print "exec frontmatter detected" when found
- Pass file to aider as `--message-file`

## Code Samples
```typescript
// Example flag parsing with Commander
import { Command } from 'commander';

const program = new Command();

program
  .option('--exec <file>', 'Execute mode with specified file')
  .argument('[files...]', 'Additional files or message')
  .action(async (files, options) => {
    if (options.exec && files.some(f => f.startsWith('--exec'))) {
      throw new Error('Multiple --exec flags not allowed');
    }
    // Handle exec mode and file processing
  });

// Example frontmatter detection
export const hasFrontmatter = (content: string): boolean => {
  const lines = content.split('\n');
  return lines[0]?.trim() === '---' && 
         lines.slice(1).findIndex(line => line.trim() === '---') > 0;
};

// Example file handling
export const processFiles = (args: string[]): {
  execFile?: string;
  additionalFiles: string[];
  message?: string;
} => {
  const result = {
    additionalFiles: [] as string[],
  };

  // Process first non-flag argument as potential exec file
  const firstFile = args.find(arg => !arg.startsWith('-'));
  if (firstFile && fs.existsSync(firstFile)) {
    result.execFile = firstFile;
    args = args.filter(arg => arg !== firstFile);
  }

  // Check last argument for message
  const lastArg = args[args.length - 1];
  if (lastArg && !lastArg.startsWith('-') && !fs.existsSync(lastArg)) {
    result.message = lastArg;
    args = args.slice(0, -1);
  }

  result.additionalFiles = args;
  return result;
};
```

## Files
- `packages/contextaider/bin/contextaider.ts`
- `packages/contextaider/src/flag-mappings.ts`
- `packages/contextaider/src/flag-mappings.spec.ts`
- `packages/contextaider/src/handler.ts`
- `packages/contextaider/src/handler.spec.ts`
- `packages/contextaider/src/runner.ts`
- `packages/contextaider/src/runner.spec.ts`
- `packages/contextaider/src/exec-mode/index.ts`
- `packages/contextaider/src/exec-mode/index.spec.ts`
- `packages/contextaider/src/exec-mode/frontmatter.ts`
- `packages/contextaider/src/exec-mode/frontmatter.spec.ts`
- `packages/contextaider/src/exec-mode/file-handler.ts`
- `packages/contextaider/src/exec-mode/file-handler.spec.ts`
- `packages/contextaider/tests/cli.spec.ts`
- `packages/contextaider/tests/integration.spec.ts`
- `packages/contextaider/package.json`
- `packages/contextaider/tsconfig.json`
- `packages/contextaider/vite.config.ts`
- `packages/contextaider/vitest.config.ts`
- `packages/contextaider/README.md`
- `packages/contextaider/postinstall.sh`

## Development Priorities

- Initial TypeScript project setup in `/packages/contextaider`
- Implement exec mode with frontmatter detection
- Implement smart file and message handling
- CLI parsing and flag translation implementation with Commander
- Process handoff with TTY preservation
- Core test coverage
- Spawn-based process handling with stdio inheritance
- Project structure scaffolding
- Test suite implementation
- Workspace configuration
- Package management setup
- Version check warning system
- Postinstall script

## Concerns
- 🔍 VERIFY: Confirm exact flag mapping requirements between custom and aider flags
- 🔍 VERIFY: Determine if detached process handling is required for all use cases
- Ensure TTY preservation works across different terminal environments
- Consider error handling strategy for failed process handoffs
- Ensure proper monorepo package configuration in `/packages/contextaider`
- Test edge cases for file existence checks and path handling
- Consider Windows path compatibility for file existence checks
- Ensure build pipeline produces correct output for both library and CLI usage

## 🖇️ Context
<Sources>
<!-- Add any relevant sources here -->
</Sources>
<Changes>
- ./context/changelog/plans/0014_Aider_Wrapper/0001_Initialize_Contextaider_Package.md
- ./context/changelog/plans/0014_Aider_Wrapper/0002_Implement_Exec_Mode_With_Frontmatter.md
- ./context/changelog/plans/0014_Aider_Wrapper/0003_Implement_File_and_Message_Handling.md
- ./context/changelog/plans/0014_Aider_Wrapper/0004_Implement_CLI_Flag_Parsing_and_Translation.md
- ./context/changelog/plans/0014_Aider_Wrapper/0005_Implement_Process_Handoff_Runner.md
- ./context/changelog/plans/0014_Aider_Wrapper/0006_Add_Test_Coverage.md
- ./context/changelog/plans/0014_Aider_Wrapper/0007_Configure_Build_and_Workspace_Scripts.md
- ./context/changelog/plans/0014_Aider_Wrapper/0008_Add_Postinstall_Version_Check.md
</Changes>
