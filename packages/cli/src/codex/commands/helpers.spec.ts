import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fs from "fs/promises";
import { FileSystemError } from "../../utils/errors";
import {
  createSanitizedFilename,
  generateTimestamp,
  ensureDirectoryExists,
  loadTemplate,
  createFile,
} from "./helpers";

// Mock fs
vi.mock("fs/promises");

describe("Helper Functions", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createSanitizedFilename", () => {
    it("should remove special characters and replace spaces with underscores", () => {
      const result = createSanitizedFilename("Test with @special# chars!");
      expect(result).toBe("Test_with_special_chars");
    });

    it("should handle empty strings", () => {
      const result = createSanitizedFilename("");
      expect(result).toBe("");
    });
  });

  describe("generateTimestamp", () => {
    it("should generate a timestamp in the correct format", () => {
      // Mock Date
      const mockDate = new Date("2023-01-01T00:30:45.678Z");
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);

      const result = generateTimestamp();
      // Check format instead of exact value to avoid timezone issues
      expect(result).toMatch(/^\d{8}_\d{6}_\d{3}$/);

      vi.useRealTimers();
    });
  });

  describe("ensureDirectoryExists", () => {
    it("should create directory if it doesn't exist", async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error());

      await ensureDirectoryExists("./test-dir");

      expect(fs.access).toHaveBeenCalledWith("./test-dir");
      expect(fs.mkdir).toHaveBeenCalledWith("./test-dir", { recursive: true });
    });

    it("should not create directory if it already exists", async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);

      await ensureDirectoryExists("./test-dir");

      expect(fs.access).toHaveBeenCalledWith("./test-dir");
      expect(fs.mkdir).not.toHaveBeenCalled();
    });
  });

  describe("loadTemplate", () => {
    beforeEach(() => {
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue("Hello {{name}}, ${title}!");
    });

    it("should load template and replace placeholders", async () => {
      const result = await loadTemplate(
        "template.md",
        { name: "World", title: "Test" },
        "Default",
      );

      expect(result).toBe("Hello World, Test!");
      expect(fs.access).toHaveBeenCalledWith("template.md");
      expect(fs.readFile).toHaveBeenCalledWith("template.md", "utf8");
    });

    it("should return default content if template doesn't exist", async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error());

      const result = await loadTemplate(
        "non-existent.md",
        { name: "World" },
        "Default Content",
      );

      expect(result).toBe("Default Content");
    });

    it("should return default content if there's an error", async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("Read error"));

      const result = await loadTemplate(
        "error.md",
        { name: "World" },
        "Default Content",
      );

      expect(result).toBe("Default Content");
    });
  });

  describe("createFile", () => {
    it("should create a file with the given content", async () => {
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      const result = await createFile("test.md", "Test content");

      expect(result).toBe("test.md");
      expect(fs.writeFile).toHaveBeenCalledWith("test.md", "Test content");
    });

    it("should throw an error if file creation fails", async () => {
      vi.mocked(fs.writeFile).mockRejectedValue(new Error("Write error"));

      await expect(createFile("error.md", "Content")).rejects.toThrow(
        FileSystemError,
      );
      await expect(createFile("error.md", "Content")).rejects.toThrow(
        "Error creating file: Write error (path: error.md)",
      );
    });
  });
});
