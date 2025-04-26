import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { MockInstance } from "vitest";
import * as runnerModule from "./runner";
import { spawn } from "child_process";
import * as fs from "fs/promises";

// Mock child_process and fs modules
vi.mock("child_process", () => ({
  spawn: vi.fn(),
}));

vi.mock("fs/promises", () => ({
  stat: vi.fn(),
}));

describe("runner", () => {
  const mockSpawn = spawn as unknown as MockInstance;
  const mockEventEmitter = {
    on: vi.fn((event, callback) => {
      if (event === "exit") {
        setTimeout(() => callback(0, null), 10);
      }
      return mockEventEmitter;
    }),
    unref: vi.fn(),
  };
  let originalPath: string | undefined;

  beforeEach(() => {
    vi.clearAllMocks();

    // Save original PATH
    originalPath = process.env.PATH;
    // Mock PATH for testing
    process.env.PATH = "/usr/bin:/usr/local/bin";

    // Setup default mock behavior
    mockSpawn.mockReturnValue(mockEventEmitter);

    // Mock fs.stat to simulate aider executable exists
    (fs.stat as unknown as MockInstance).mockResolvedValue({
      isFile: () => true,
      mode: 0o755, // Executable
    });
  });

  afterEach(() => {
    // Restore original PATH
    process.env.PATH = originalPath;
    vi.resetAllMocks();
  });

  describe("findAiderExecutable", () => {
    it("should find aider in PATH", async () => {
      const result = await runnerModule.findAiderExecutable();

      expect(fs.stat).toHaveBeenCalled();
      expect(fs.stat).toHaveBeenCalledWith(expect.stringContaining("aider"));
      expect(result).toMatch(/aider$/);
    });

    it("should return null if aider is not found", async () => {
      // Mock fs.stat to simulate aider not found
      (fs.stat as unknown as MockInstance).mockRejectedValue(
        new Error("ENOENT"),
      );

      const result = await runnerModule.findAiderExecutable();

      expect(result).toBeNull();
    });
  });

  describe("spawnAider", () => {
    it("should spawn aider with correct arguments", async () => {
      // Mock findAiderExecutable
      vi.spyOn(runnerModule, "findAiderExecutable").mockResolvedValue(
        "/usr/bin/aider",
      );

      // Setup mock to trigger exit event
      mockEventEmitter.on.mockImplementation((event, callback) => {
        if (event === "exit") {
          setTimeout(() => callback(0, null), 10);
        }
        return mockEventEmitter;
      });

      const args = ["--flag1", "value1", "--flag2"];
      const result = await runnerModule.spawnAider(args, { debug: true });

      expect(mockSpawn).toHaveBeenCalled();
      expect(mockSpawn).toHaveBeenCalledWith(
        expect.any(String),
        args,
        expect.objectContaining({
          stdio: "inherit",
          detached: false,
        }),
      );
      expect(mockSpawn).toHaveBeenCalledWith(
        "/usr/bin/aider",
        args,
        expect.objectContaining({
          stdio: "inherit",
          detached: false,
        }),
      );

      expect(mockEventEmitter.unref).toHaveBeenCalled();
      expect(result).toEqual({
        exitCode: 0,
        signal: null,
      });
    });

    it("should throw error if aider executable is not found", async () => {
      process.env.PATH = "";

      await expect(runnerModule.spawnAider([])).rejects.toThrow(
        "Could not find aider executable",
      );
    });

    it("should handle spawn errors", async () => {
      // Mock findAiderExecutable
      vi.spyOn(runnerModule, "findAiderExecutable").mockResolvedValue(
        "/usr/bin/aider",
      );

      // Setup mock to trigger error event
      mockEventEmitter.on.mockImplementation((event, callback) => {
        if (event === "error") {
          setTimeout(() => callback(new Error("Spawn error")), 10);
        }
        return mockEventEmitter;
      });

      await expect(runnerModule.spawnAider([])).rejects.toThrow("Spawn error");
    });

    it("should use custom options when provided", async () => {
      // Mock findAiderExecutable
      vi.spyOn(runnerModule, "findAiderExecutable").mockResolvedValue(
        "/usr/bin/aider",
      );

      // Setup mock to trigger exit event
      mockEventEmitter.on.mockImplementation((event, callback) => {
        if (event === "exit") {
          setTimeout(() => callback(0, null), 10);
        }
        return mockEventEmitter;
      });

      const customOptions = {
        cwd: "/custom/path",
        env: { CUSTOM_ENV: "value" },
        inheritStdio: false,
        debug: true,
      };

      await runnerModule.spawnAider([], customOptions);

      expect(mockSpawn).toHaveBeenCalledWith(
        "/usr/bin/aider",
        [],
        expect.objectContaining({
          cwd: "/custom/path",
          env: { CUSTOM_ENV: "value" },
          stdio: "pipe",
        }),
      );
    });
  });
});
