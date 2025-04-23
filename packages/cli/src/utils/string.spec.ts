import { describe, it, expect } from "vitest";
import { createSanitizedFilename } from "./string";

describe("string utilities", () => {
  describe("createSanitizedFilename", () => {
    it("should replace spaces with underscores", () => {
      expect(createSanitizedFilename("hello world")).toBe("hello_world");
    });

    it("should remove special characters", () => {
      expect(createSanitizedFilename("hello@world!")).toBe("helloworld");
    });

    it("should keep alphanumeric characters and dashes", () => {
      expect(createSanitizedFilename("hello-world123")).toBe("hello-world123");
    });

    it("should handle multiple spaces", () => {
      expect(createSanitizedFilename("hello  world")).toBe("hello_world");
    });

    it("should handle empty strings", () => {
      expect(createSanitizedFilename("")).toBe("");
    });
  });
});
