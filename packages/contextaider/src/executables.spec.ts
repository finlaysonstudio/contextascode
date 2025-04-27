import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { MockInstance } from "vitest";
import * as fs from "fs/promises";
import * as executables from "./executables";

// Mock fs module
vi.mock("fs/promises", () => ({
  stat: vi.fn(),
}));

describe("executables", () => {
  let originalPath: string | undefined;
  let originalEchoMode: string | undefined;

  beforeEach(() => {
    vi.clearAllMocks();

    // Save original environment variables
    originalPath = process.env.PATH;
    originalEchoMode = process.env.CONTEXT_AIDER_ECHO_MODE;

    // Mock PATH for testing
    process.env.PATH = "/usr/bin:/usr/local/bin";

    // Mock fs.stat to simulate executable exists
    (fs.stat as unknown as MockInstance).mockResolvedValue({
      isFile: () => true,
      mode: 0o755, // Executable
    });
  });

  afterEach(() => {
    // Restore original environment variables
    process.env.PATH = originalPath;

    if (originalEchoMode === undefined) {
      delete process.env.CONTEXT_AIDER_ECHO_MODE;
    } else {
      process.env.CONTEXT_AIDER_ECHO_MODE = originalEchoMode;
    }

    vi.resetAllMocks();
  });

  describe("isEchoModeEnabled", () => {
    it("should return true by default", () => {
      delete process.env.CONTEXT_AIDER_ECHO_MODE;
      expect(executables.isEchoModeEnabled()).toBe(true);
    });

    it("should return false when env var is 'false'", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "false";
      expect(executables.isEchoModeEnabled()).toBe(false);
    });

    it("should return false when env var is '0'", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "0";
      expect(executables.isEchoModeEnabled()).toBe(false);
    });

    it("should return true for any other value", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "true";
      expect(executables.isEchoModeEnabled()).toBe(true);
    });
  });

  describe("findExecutable", () => {
    it("should find aider in PATH when echo mode is disabled", async () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "false";

      const result = await executables.findExecutable();

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

      const result = await executables.findExecutable();

      expect(fs.stat).toHaveBeenCalled();
      expect(result).toBe("/bin/echo");
    });

    it("should return null if executable is not found", async () => {
      // Mock fs.stat to simulate executable not found
      (fs.stat as unknown as MockInstance).mockRejectedValue(
        new Error("ENOENT"),
      );

      const result = await executables.findExecutable();

      expect(result).toBeNull();
    });
  });

  describe("getCommandName", () => {
    it("should return 'echo' when echo mode is enabled", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "true";
      expect(executables.getCommandName()).toBe("echo");
    });

    it("should return 'aider' when echo mode is disabled", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "false";
      expect(executables.getCommandName()).toBe("aider");
    });
  });
});
