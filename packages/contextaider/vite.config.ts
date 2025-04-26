import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "node18",
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        contextaider: resolve(__dirname, "bin/contextaider.ts"),
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ["commander", "fs/promises", "path", "child_process", "fs"],
    },
  },
  test: {
    environment: "node",
    include: ["**/*.spec.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
