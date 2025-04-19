# Start TypeScript Project 🚀

You will assist setting up a new TypeScript project for the user

## 🎯 Goal

* Modern TypeScript
* NPM workspaces within ./packages/
* ESLint and Prettier
* Vite to bundle TypeScript
* Vitest with .spec sibling files

## 📋 Suggested Process

### Clarify

1. Start by clarifying with the user:

* What is the name of the top-level package? (suggest one from the folder name)
* What is the name of the first package's folder? (suggest cli)
* What is the name of the first package? (suggest a logical mashup of top-level and first package; "my-project" and "cli" would be "my-project-cli", but "@orgproject/monorepo" might be "@orgproject/cli")

### Setup 🏗️

2. **Initialize the project structure**:
   ```bash
   # Create the project directory if it doesn't exist
   mkdir -p packages/<package-folder>
   ```

3. **Initialize the root package.json**:
   ```bash
   # Initialize the root package.json with workspaces
   npm init -y
   ```

4. **Configure workspaces in root package.json**:
   - Add `"workspaces": ["packages/*"]` to package.json
   - Set `"private": true` to prevent accidental publishing

5. **Initialize the first package**:
   ```bash
   cd packages/<package-folder>
   npm init -y
   ```

### Install 💿

6. **Install TypeScript and core dependencies**:
   ```bash
   # Return to root directory
   cd ../..
   
   # Install TypeScript and type definitions
   npm install -D typescript @types/node
   
   # Install Vite for bundling
   npm install -D vite@latest
   
   # Install Vitest for testing
   npm install -D vitest@latest
   
   # Install ESLint 9 and Prettier
   npm install -D eslint@9 prettier@latest eslint-config-prettier@latest
   npm install -D @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
   npm install -D eslint-plugin-prettier@latest
   
   # Install additional dev dependencies from Ideal Project Structure
   npm install -D rimraf sort-package-json tsx
   ```

### ⚙️ Configure

7. **Create TypeScript configuration**:
   ```bash
   # Generate root tsconfig.json
   npx tsc --init
   ```

8. **Configure TypeScript for monorepo**:
   ```bash
   # Update root tsconfig.json to be the base configuration
   cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "rootDir": "."
  },
  "exclude": ["node_modules", "dist"]
}
EOF

   # Create package-specific tsconfig.json that extends the root
   cat > packages/<package-folder>/tsconfig.json << EOF
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
EOF
   ```

9. **Set up ESLint and Prettier**:
   ```bash
   # Create ESLint config with Prettier integration using flat config
   echo 'import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      "prettier/prettier": ["error", {
        "semi": true,
        "singleQuote": true,
        "tabWidth": 2,
        "trailingComma": "es5"
      }]
    }
  },
  prettierConfig
);' > eslint.config.js
   ```

10. **Create Vite configuration**:
   ```bash
   # Create vite.config.ts
   cat > vite.config.ts << EOF
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: ['./packages/cli/src/index.ts', './packages/cli/src/cli.ts'],
      formats: ['es'],
    },
    rollupOptions: {
      external: ['commander'],
    },
  },
  test: {
    globals: true,
  },
});
EOF
   ```

11. **Set up package scripts**:
   ```bash
   # Update root package.json scripts
   cat > package.json << EOF
{
  "name": "your-project-name",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "clean": "npm run clean --workspaces && npm run clean:root",
    "clean:root": "rimraf node_modules",
    "format": "eslint --fix",
    "format:package": "sort-package-json ./package.json ./packages/*/package.json",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "typecheck": "npm run typecheck --workspaces"
  }
}
EOF

   # Update package-specific package.json scripts
   cat > packages/<package-folder>/package.json << EOF
{
  "name": "your-package-name",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "type": "module",
  "scripts": {
    "build": "vite build && tsc --emitDeclarationOnly",
    "clean": "rimraf dist",
    "format": "eslint --fix",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "typecheck": "tsc --noEmit"
  }
}
EOF
   ```

   Note: Replace `your-project-name` and `your-package-name` with the actual names.

### Initialize 🚀

12. **Create initial source files**:
    ```bash
    mkdir -p packages/<package-folder>/src
    touch packages/<package-folder>/src/index.ts
    
    # Create CLI entry point
    cat > packages/<package-folder>/src/cli.ts << EOF
#!/usr/bin/env node
import { Command } from 'commander';
import { version } from '../package.json';

const program = new Command();

program
  .name('contextascode')
  .description('Context as Code CLI tool')
  .version(version);

program
  .command('hello')
  .description('Say hello')
  .action(() => {
    console.log('Hello from Context as Code CLI!');
  });

program.parse();
EOF

    # Update index.ts to export main functionality
    cat > packages/<package-folder>/src/index.ts << EOF
// Export main functionality
export const sayHello = (): string => {
  return 'Hello from Context as Code!';
};
EOF
    ```

13. **Create test files**:
    ```bash
    # Create test file as sibling to implementation file
    cat > packages/<package-folder>/src/index.spec.ts << EOF
import { describe, it, expect } from 'vitest';
import { sayHello } from './index';

describe('sayHello', () => {
  it('returns the correct greeting', () => {
    expect(sayHello()).toBe('Hello from Context as Code!');
  });
});
EOF
    ```

14. **Install all dependencies**:
    After setting up the project structure, install all dependencies with:
    ```bash
    npm install
    ```

### Test 🧪

15. **Run build**:
    Ensure the packages build
    ```bash
    npm run build
    ```

16. **Run lint**:
    Ensure the packages lint
    ```bash
    npm run lint
    ```

16. **Run tests**:
    Ensure the tests pass
    ```bash
    npm run test
    ```
