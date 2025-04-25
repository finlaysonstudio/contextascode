import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { processExecMode } from "./index";
import * as frontmatter from "./frontmatter";
import fs from "fs/promises";

// Mock dependencies
vi.mock("fs/promises");
vi.mock("./frontmatter");

describe("exec-mode/index", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("processExecMode", () => {
    it("should process a file with frontmatter", async () => {
      // Mock file existence check
      vi.mocked(fs.access).mockResolvedValue(undefined);

      // Mock frontmatter parsing
      vi.mocked(frontmatter.readFileWithFrontmatter).mockResolvedValue({
        frontmatter: { title: "Test" },
        content: "# Content",
        hasFrontmatter: true,
      });

      // Mock console.log for debug output
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const result = await processExecMode({
        execFile: "test.md",
        debug: true,
      });

      expect(result).toEqual({
        filePath: "test.md",
        hasFrontmatter: true,
        frontmatter: { title: "Test" },
        aiderArgs: ["--message-file", "test.md"],
      });

      expect(consoleSpy).toHaveBeenCalledWith("Exec frontmatter detected");
      expect(fs.access).toHaveBeenCalledWith("test.md");
      expect(frontmatter.readFileWithFrontmatter).toHaveBeenCalledWith(
        "test.md",
      );
    });

    it("should process a file without frontmatter", async () => {
      // Mock file existence check
      vi.mocked(fs.access).mockResolvedValue(undefined);

      // Mock frontmatter parsing
      vi.mocked(frontmatter.readFileWithFrontmatter).mockResolvedValue({
        frontmatter: null,
        content: "# Content without frontmatter",
        hasFrontmatter: false,
      });

      const result = await processExecMode({
        execFile: "test.md",
      });

      expect(result).toEqual({
        filePath: "test.md",
        hasFrontmatter: false,
        frontmatter: null,
        aiderArgs: ["--message-file", "test.md"],
      });

      expect(fs.access).toHaveBeenCalledWith("test.md");
      expect(frontmatter.readFileWithFrontmatter).toHaveBeenCalledWith(
        "test.md",
      );
    });

    it("should handle file not found error", async () => {
      // Mock file existence check to fail
      vi.mocked(fs.access).mockRejectedValue(new Error("File not found"));

      // Mock console.error for debug output
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await processExecMode({
        execFile: "nonexistent.md",
        debug: true,
      });

      expect(result.filePath).toBe("nonexistent.md");
      expect(result.hasFrontmatter).toBe(false);
      expect(result.frontmatter).toBeNull();
      expect(result.aiderArgs).toEqual([]);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe("Exec file not found: nonexistent.md");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error processing exec file: Exec file not found: nonexistent.md",
      );
      expect(fs.access).toHaveBeenCalledWith("nonexistent.md");
      expect(frontmatter.readFileWithFrontmatter).not.toHaveBeenCalled();
    });

    it("should handle frontmatter parsing error", async () => {
      // Mock file existence check
      vi.mocked(fs.access).mockResolvedValue(undefined);

      // Mock frontmatter parsing to fail
      vi.mocked(frontmatter.readFileWithFrontmatter).mockRejectedValue(
        new Error("Failed to parse frontmatter"),
      );

      const result = await processExecMode({
        execFile: "test.md",
      });

      expect(result.filePath).toBe("test.md");
      expect(result.hasFrontmatter).toBe(false);
      expect(result.frontmatter).toBeNull();
      expect(result.aiderArgs).toEqual([]);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe("Failed to parse frontmatter");

      expect(fs.access).toHaveBeenCalledWith("test.md");
      expect(frontmatter.readFileWithFrontmatter).toHaveBeenCalledWith(
        "test.md",
      );
    });
  });
});
