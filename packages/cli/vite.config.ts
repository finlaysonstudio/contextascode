import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        codex: resolve(__dirname, "src/codex/index.ts"),
        contextaider: resolve(__dirname, "src/contextaider/index.ts"),
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ["@inquirer/prompts", "commander", "fs", "path"],
    },
  },
});
