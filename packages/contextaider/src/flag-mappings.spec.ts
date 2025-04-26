import { describe, it, expect } from "vitest";
import { translateFlags, getAvailableFlagMappings } from "./flag-mappings";

describe("flag-mappings", () => {
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
      // This test will be more useful when we add more flag mappings
      const args = ["--exec", "file.md", "--other-mapped-flag"];
      expect(translateFlags(args)).toEqual([
        "--message-file=file.md",
        "--other-mapped-flag",
      ]);
    });

    it("should handle flags without values correctly", () => {
      // This will be more useful when we add boolean flags
      const args = ["--boolean-flag"];
      expect(translateFlags(args)).toEqual(args);
    });
  });

  describe("getAvailableFlagMappings", () => {
    it("should return all flag mappings", () => {
      const mappings = getAvailableFlagMappings();
      expect(mappings.length).toBeGreaterThan(0);
      expect(mappings[0]).toHaveProperty("contextaiderFlag");
      expect(mappings[0]).toHaveProperty("aiderFlag");
      expect(mappings[0]).toHaveProperty("description");
    });
  });
});
