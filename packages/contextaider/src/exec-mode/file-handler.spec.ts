import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fileHandlerModule from "./file-handler";
import {
  fileExists,
  readFile,
  processFileArgs,
  processArgs,
  FileHandlerError,
} from "./file-handler";
import * as fs from "fs/promises";
import * as path from "path";

// Mock fs module
vi.mock("fs/promises", () => {
  return {
    access: vi.fn(),
    readFile: vi.fn(),
    constants: { R_OK: 4 },
  };
});

// Mock path module
vi.mock("path", () => {
  return {
    resolve: vi.fn((p) => `/resolved/${p}`),
  };
});

describe("file-handler", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("fileExists", () => {
    it("should return true when file exists and is readable", async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);

      const result = await fileExists("existing-file.md");

      expect(result).toBe(true);
      expect(fs.access).toHaveBeenCalled();
      expect(fs.access).toHaveBeenCalledWith(
        "existing-file.md",
        expect.any(Number),
      );
    });

    it("should return false when file does not exist", async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error("ENOENT"));

      const result = await fileExists("non-existent-file.md");

      expect(result).toBe(false);
      expect(fs.access).toHaveBeenCalledWith(
        "non-existent-file.md",
        expect.any(Number),
      );
    });
  });

  describe("readFile", () => {
    it("should return file contents when file can be read", async () => {
      vi.mocked(fs.readFile).mockResolvedValue("file contents");

      const result = await readFile("readable-file.md");

      expect(result).toBe("file contents");
      expect(fs.readFile).toHaveBeenCalledWith("readable-file.md", "utf-8");
    });

    it("should throw FileHandlerError when file cannot be read", async () => {
      vi.mocked(fs.readFile).mockRejectedValue(
        new Error("EACCES: permission denied"),
      );

      await expect(readFile("unreadable-file.md")).rejects.toThrow(
        FileHandlerError,
      );
      expect(fs.readFile).toHaveBeenCalledWith("unreadable-file.md", "utf-8");
    });
  });

  describe("processFileArgs", () => {
    it("should separate valid files from invalid paths", async () => {
      vi.mocked(fs.access).mockImplementation(async (filePath) => {
        if (filePath === "valid1.md" || filePath === "valid2.md") {
          return Promise.resolve(undefined);
        }
        return Promise.reject(new Error("ENOENT"));
      });

      vi.mocked(path.resolve).mockImplementation((p) => `/resolved/${p}`);

      const args = [
        "valid1.md",
        "invalid1.md",
        "valid2.md",
        "invalid2.md",
        "--flag",
      ];
      const result = await processFileArgs(args);

      expect(result.validFiles).toEqual([
        "/resolved/valid1.md",
        "/resolved/valid2.md",
      ]);
      expect(result.invalidPaths).toEqual(["invalid1.md", "invalid2.md"]);
    });

    it("should skip arguments that look like flags", async () => {
      const args = ["--flag1", "-f", "valid.md"];
      vi.mocked(fs.access).mockResolvedValue(undefined);

      const result = await processFileArgs(args);

      expect(result.validFiles).toEqual(["/resolved/valid.md"]);
      expect(result.invalidPaths).toEqual([]);
      expect(fs.access).toHaveBeenCalledTimes(1);
    });
  });

  describe("processArgs", () => {
    beforeEach(() => {
      // Reset mocks before each test
      vi.restoreAllMocks();
    });

    it("should extract exec file, additional files, and message", async () => {
      // Mock the processFileArgs function
      vi.spyOn(fileHandlerModule, "processFileArgs").mockImplementation(
        async () => ({
          validFiles: [
            "/resolved/exec.md",
            "/resolved/additional1.md",
            "/resolved/additional2.md",
          ],
          invalidPaths: ["message text"],
        }),
      );

      vi.mocked(fs.access).mockImplementation(async (filePath) => {
        if (
          filePath === "exec.md" ||
          filePath === "additional1.md" ||
          filePath === "additional2.md"
        ) {
          return Promise.resolve(undefined);
        }
        return Promise.reject(new Error("ENOENT"));
      });

      const args = [
        "exec.md",
        "additional1.md",
        "additional2.md",
        "message text",
      ];
      const result = await processArgs(args);

      expect(result.execFile).toBe("/resolved/exec.md");
      expect(result.additionalFiles).toEqual([
        "/resolved/additional1.md",
        "/resolved/additional2.md",
      ]);
      expect(result.message).toBe("message text");
    });

    it("should handle case with only exec file", async () => {
      // Mock the processFileArgs function
      vi.spyOn(fileHandlerModule, "processFileArgs").mockImplementation(
        async () => ({
          validFiles: ["/resolved/exec.md"],
          invalidPaths: [],
        }),
      );

      const args = ["exec.md"];
      const result = await processArgs(args);

      expect(result.execFile).toBe("/resolved/exec.md");
      expect(result.additionalFiles).toEqual([]);
      expect(result.message).toBeUndefined();
    });

    it("should handle case with only message", async () => {
      // Mock the processFileArgs function
      vi.spyOn(fileHandlerModule, "processFileArgs").mockImplementation(
        async () => ({
          validFiles: [],
          invalidPaths: ["message text"],
        }),
      );

      vi.mocked(fs.access).mockImplementation(async (filePath) => {
        if (filePath === "message text") {
          return Promise.reject(new Error("ENOENT"));
        }
        return Promise.resolve(undefined);
      });

      const args = ["message text"];
      const result = await processArgs(args);

      expect(result.execFile).toBeUndefined();
      expect(result.additionalFiles).toEqual([]);
      expect(result.message).toBe("message text");
    });

    it("should not treat flag-like arguments as messages", async () => {
      // Mock the processFileArgs function
      vi.spyOn(fileHandlerModule, "processFileArgs").mockImplementation(
        async () => ({
          validFiles: ["/resolved/exec.md"],
          invalidPaths: ["--flag"],
        }),
      );

      const args = ["exec.md", "--flag"];
      const result = await processArgs(args);

      expect(result.execFile).toBe("/resolved/exec.md");
      expect(result.additionalFiles).toEqual([]);
      expect(result.message).toBeUndefined();
    });
  });
});
