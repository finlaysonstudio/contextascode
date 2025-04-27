import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  translateFlags,
  getAvailableFlagMappings,
  flagMappings,
} from "./flag-mappings";

describe("flag-mappings", () => {
  // Save original flagMappings
  const originalFlagMappings = [...flagMappings];

  beforeEach(() => {
    // Reset flagMappings to original state before each test
    while (flagMappings.length > 0) {
      flagMappings.pop();
    }
    originalFlagMappings.forEach((mapping) =>
      flagMappings.push({ ...mapping }),
    );
  });

  describe("translateFlags", () => {
    it("should pass through unmapped flags", () => {
      const args = ["--unknown-flag", "value"];
      expect(translateFlags(args)).toEqual(args);
    });

    it("should translate exec flag with value after flag", () => {
      const args = ["--exec", "file.md"];
      expect(translateFlags(args)).toEqual(["--message-file=file.md"]);
    });

    it("should translate exec flag with value using equals syntax", () => {
      const args = ["--exec=file.md"];
      expect(translateFlags(args)).toEqual(["--message-file=file.md"]);
    });

    it("should handle mixed mapped and unmapped flags", () => {
      const args = ["--exec", "file.md", "--unknown", "value"];
      expect(translateFlags(args)).toEqual([
        "--message-file=file.md",
        "--unknown",
        "value",
      ]);
    });

    it("should handle multiple mapped flags", () => {
      // Add a test mapping for this test
      flagMappings.push({
        contextaiderFlag: "--test-flag",
        aiderFlag: "--aider-test-flag",
        takesValue: true,
        description: "Test flag for multiple mappings",
      });

      const args = ["--exec", "file.md", "--test-flag", "test-value"];
      expect(translateFlags(args)).toEqual([
        "--message-file=file.md",
        "--aider-test-flag=test-value",
      ]);
    });

    it("should handle flags without values correctly", () => {
      // Add a boolean flag mapping for this test
      flagMappings.push({
        contextaiderFlag: "--boolean-flag",
        aiderFlag: "--aider-boolean",
        takesValue: false,
        description: "Boolean flag test",
      });

      const args = ["--boolean-flag"];
      expect(translateFlags(args)).toEqual(["--aider-boolean"]);
    });

    it("should handle empty args array", () => {
      const args: string[] = [];
      expect(translateFlags(args)).toEqual([]);
    });

    it("should handle flags with missing values", () => {
      const args = ["--exec"];
      expect(translateFlags(args)).toEqual(["--message-file"]);
    });

    it("should handle multiple consecutive flags", () => {
      const args = ["--exec", "--unknown"];
      expect(translateFlags(args)).toEqual(["--message-file", "--unknown"]);
    });
  });

  describe("getAvailableFlagMappings", () => {
    it("should return all flag mappings", () => {
      const mappings = getAvailableFlagMappings();
      expect(mappings.length).toBeGreaterThan(0);
      expect(mappings[0]).toHaveProperty("contextaiderFlag");
      expect(mappings[0]).toHaveProperty("aiderFlag");
      expect(mappings[0]).toHaveProperty("takesValue");
      expect(mappings[0]).toHaveProperty("description");
    });

    it("should return a copy of the mappings, not the original", () => {
      const mappings = getAvailableFlagMappings();
      // Modify the returned array
      mappings.push({
        contextaiderFlag: "--test-flag",
        aiderFlag: "--test-aider",
        takesValue: true,
        description: "Test flag",
      });

      // Get mappings again and verify the original wasn't modified
      const newMappings = getAvailableFlagMappings();
      expect(newMappings.length).toBe(originalFlagMappings.length);
    });
  });
});
