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

  describe("isEchoModeEnabled", () => {
    const originalEnv = process.env.CONTEXT_AIDER_ECHO_MODE;

    afterEach(() => {
      // Restore original env
      if (originalEnv === undefined) {
        delete process.env.CONTEXT_AIDER_ECHO_MODE;
      } else {
        process.env.CONTEXT_AIDER_ECHO_MODE = originalEnv;
      }
    });

    it("should return true by default", () => {
      delete process.env.CONTEXT_AIDER_ECHO_MODE;
      expect(runnerModule.isEchoModeEnabled()).toBe(true);
    });

    it("should return false when env var is 'false'", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "false";
      expect(runnerModule.isEchoModeEnabled()).toBe(false);
    });

    it("should return false when env var is '0'", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "0";
      expect(runnerModule.isEchoModeEnabled()).toBe(false);
    });

    it("should return true for any other value", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "true";
      expect(runnerModule.isEchoModeEnabled()).toBe(true);
    });
  });

  describe("findExecutable", () => {
    const originalEnv = process.env.CONTEXT_AIDER_ECHO_MODE;

    afterEach(() => {
      // Restore original env
      if (originalEnv === undefined) {
        delete process.env.CONTEXT_AIDER_ECHO_MODE;
      } else {
        process.env.CONTEXT_AIDER_ECHO_MODE = originalEnv;
      }
    });

    it("should find aider in PATH when echo mode is disabled", async () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "false";

      const result = await runnerModule.findExecutable();

      expect(fs.stat).toHaveBeenCalled();
      expect(fs.stat).toHaveBeenCalledWith(expect.stringContaining("aider"));
      expect(result).toMatch(/aider$/);
    });

    it("should find echo in PATH when echo mode is enabled", async () => {
      // Mock fs.stat to simulate echo executable exists at /bin/echo
      (fs.stat as unknown as MockInstance).mockImplementation(async (path) => {
        if (path === "/bin/echo") {
          return {
            isFile: () => true,
            mode: 0o755, // Executable
          };
        }
        throw new Error("ENOENT");
      });

      const result = await runnerModule.findExecutable();

      expect(fs.stat).toHaveBeenCalled();
      expect(result).toBe("/bin/echo");
    });

    it("should return null if executable is not found", async () => {
      // Mock fs.stat to simulate executable not found
      (fs.stat as unknown as MockInstance).mockRejectedValue(
        new Error("ENOENT"),
      );

      const result = await runnerModule.findExecutable();

      expect(result).toBeNull();
    });
  });

  describe("spawnCommand", () => {
    const originalEnv = process.env.CONTEXT_AIDER_ECHO_MODE;

    afterEach(() => {
      // Restore original env
      if (originalEnv === undefined) {
        delete process.env.CONTEXT_AIDER_ECHO_MODE;
      } else {
        process.env.CONTEXT_AIDER_ECHO_MODE = originalEnv;
      }
    });

    it("should spawn echo with correct arguments when echo mode is enabled", async () => {
      // Mock findExecutable
      vi.spyOn(runnerModule, "findExecutable").mockResolvedValue("/bin/echo");

      // Setup mock to trigger exit event
      mockEventEmitter.on.mockImplementation((event, callback) => {
        if (event === "exit") {
          setTimeout(() => callback(0, null), 10);
        }
        return mockEventEmitter;
      });

      const args = ["Hello", "World"];
      const result = await runnerModule.spawnCommand(args, { debug: true });

      expect(mockSpawn).toHaveBeenCalled();
      expect(mockSpawn).toHaveBeenCalledWith(
        "/bin/echo",
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

    it("should spawn aider when echo mode is disabled", async () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "false";

      // Mock findExecutable
      vi.spyOn(runnerModule, "findExecutable").mockResolvedValue(
        "/usr/bin/aider",
      );

      // Setup mock to trigger exit event
      mockEventEmitter.on.mockImplementation((event, callback) => {
        if (event === "exit") {
          setTimeout(() => callback(0, null), 10);
        }
        return mockEventEmitter;
      });

      const args = ["--flag1", "value1"];
      await runnerModule.spawnCommand(args, { debug: true });

      expect(mockSpawn).toHaveBeenCalledWith(
        "/usr/bin/aider",
        args,
        expect.any(Object),
      );
    });

    it("should throw error if executable is not found", async () => {
      // Mock findExecutable to return null
      vi.spyOn(runnerModule, "findExecutable").mockResolvedValue(null);

      await expect(runnerModule.spawnCommand([])).rejects.toThrow(
        "Could not find echo executable",
      );
    });

    it("should handle spawn errors", async () => {
      // Mock findExecutable
      vi.spyOn(runnerModule, "findExecutable").mockResolvedValue("/bin/echo");

      // Setup mock to trigger error event
      mockEventEmitter.on.mockImplementation((event, callback) => {
        if (event === "error") {
          setTimeout(() => callback(new Error("Spawn error")), 10);
        }
        return mockEventEmitter;
      });

      await expect(runnerModule.spawnCommand([])).rejects.toThrow(
        "Spawn error",
      );
    });

    it("should use custom options when provided", async () => {
      // Mock findExecutable
      vi.spyOn(runnerModule, "findExecutable").mockResolvedValue("/bin/echo");

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

      await runnerModule.spawnCommand([], customOptions);

      expect(mockSpawn).toHaveBeenCalledWith(
        "/bin/echo",
        [],
        expect.objectContaining({
          cwd: "/custom/path",
          env: { CUSTOM_ENV: "value" },
          stdio: "pipe",
        }),
      );
    });
  });

  describe("spawnAider", () => {
    it("should use spawnCommand internally", async () => {
      // Reset mocks first to ensure a clean slate
      vi.resetAllMocks();

      // Create a mock function that returns a resolved Promise
      const mockSpawnCommandFn = vi.fn().mockResolvedValue({
        exitCode: 0,
        signal: null,
      });

      // Replace the real spawnCommand with our mock function
      vi.spyOn(runnerModule, "spawnCommand").mockImplementation(
        mockSpawnCommandFn,
      );

      // Mock findExecutable to avoid real path lookup
      vi.spyOn(runnerModule, "findExecutable").mockResolvedValue("/bin/echo");

      const args = ["--flag1", "value1"];
      const options = { debug: true };

      await runnerModule.spawnAider(args, options);

      // Check if our mock function was called with the right arguments
      expect(mockSpawnCommandFn).toHaveBeenCalledWith(args, options);
    });
  });
});
