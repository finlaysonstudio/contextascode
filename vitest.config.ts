import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["packages/*/{bin,src}/**/*.{ts,tsx}"],
    },
    // Configure a longer timeout for tests
    testTimeout: 10000,
  },
});
