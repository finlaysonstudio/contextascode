import { describe, it, expect, vi, beforeEach } from "vitest";
import { executedAs } from "./execution.js";

describe("executedAs", () => {
  // Base Cases
  describe("Base Cases", () => {
    it("is a function", () => {
      expect(typeof executedAs).toBe("function");
    });

    it("works with default options", () => {
      const result = executedAs(["non-matching-file.js"]);
      expect(result).toBe(false);
    });
  });

  // Happy Paths
  describe("Happy Paths", () => {
    it("returns true when filename matches import.meta.url", () => {
      const result = executedAs(["test-file.js"], {
        search: ["path/to/test-file.js"]
      });
      expect(result).toBe(true);
    });

    it("returns true when filename matches process.argv[1]", () => {
      const result = executedAs(["cli.js"], {
        search: ["path/to/cli.js"]
      });
      expect(result).toBe(true);
    });

    it("returns false when no filenames match", () => {
      const result = executedAs(["file1.js", "file2.js"], {
        search: ["path/to/other-file.js"]
      });
      expect(result).toBe(false);
    });

    it("checks multiple filenames", () => {
      const result = executedAs(["file1.js", "file2.js", "match.js"], {
        search: ["path/to/match.js"]
      });
      expect(result).toBe(true);
    });
  });

  // Features
  describe("Features", () => {
    it("handles empty filename array", () => {
      const result = executedAs([]);
      expect(result).toBe(false);
    });

    it("handles empty search locations", () => {
      const result = executedAs(["file.js"], { search: [] });
      expect(result).toBe(false);
    });

    it("handles undefined search locations", () => {
      const result = executedAs(["file.js"], { search: [undefined, null] as unknown as string[] });
      expect(result).toBe(false);
    });
  });

  // Specific Scenarios
  describe("Specific Scenarios", () => {
    it("handles paths with similar endings", () => {
      const result = executedAs(["file.js"], {
        search: ["path/to/prefix-file.js"]
      });
      expect(result).toBe(true);
    });

    it("handles multiple search locations", () => {
      const result = executedAs(["target.js"], {
        search: ["path/to/file1.js", "path/to/file2.js", "path/to/target.js"]
      });
      expect(result).toBe(true);
    });
  });
});
