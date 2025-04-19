import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/cli/src/index.ts'),
      name: 'contextascode',
      fileName: 'contextascode'
    },
    rollupOptions: {
      external: ['commander'],
      output: {
        globals: {
          commander: 'commander'
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**']
    }
  }
});
