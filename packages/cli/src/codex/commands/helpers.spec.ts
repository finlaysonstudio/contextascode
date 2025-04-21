import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import {
  createSanitizedFilename,
  generateTimestamp,
  ensureDirectoryExists,
  loadTemplate,
  createFile,
} from "./helpers";

// Mock fs
vi.mock("fs");

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
    it("should create directory if it doesn't exist", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      
      ensureDirectoryExists("./test-dir");
      
      expect(fs.existsSync).toHaveBeenCalledWith("./test-dir");
      expect(fs.mkdirSync).toHaveBeenCalledWith("./test-dir", { recursive: true });
    });

    it("should not create directory if it already exists", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      
      ensureDirectoryExists("./test-dir");
      
      expect(fs.existsSync).toHaveBeenCalledWith("./test-dir");
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe("loadTemplate", () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue("Hello {{name}}, ${title}!");
    });

    it("should load template and replace placeholders", () => {
      const result = loadTemplate(
        "template.md",
        { name: "World", title: "Test" },
        "Default"
      );
      
      expect(result).toBe("Hello World, Test!");
      expect(fs.existsSync).toHaveBeenCalledWith("template.md");
      expect(fs.readFileSync).toHaveBeenCalledWith("template.md", "utf8");
    });

    it("should return default content if template doesn't exist", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      
      const result = loadTemplate(
        "non-existent.md",
        { name: "World" },
        "Default Content"
      );
      
      expect(result).toBe("Default Content");
    });

    it("should return default content if there's an error", () => {
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error("Read error");
      });
      
      const result = loadTemplate(
        "error.md",
        { name: "World" },
        "Default Content"
      );
      
      expect(result).toBe("Default Content");
    });
  });

  describe("createFile", () => {
    it("should create a file with the given content", () => {
      const result = createFile("test.md", "Test content");
      
      expect(result).toBe("test.md");
      expect(fs.writeFileSync).toHaveBeenCalledWith("test.md", "Test content");
    });

    it("should throw an error if file creation fails", () => {
      vi.mocked(fs.writeFileSync).mockImplementation(() => {
        throw new Error("Write error");
      });
      
      expect(() => createFile("error.md", "Content")).toThrow(
        "Error creating file error.md: Error: Write error"
      );
    });
  });
});
