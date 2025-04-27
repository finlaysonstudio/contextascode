import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { MockInstance } from "vitest";
import * as fs from "fs/promises";
import * as path from "path";
import * as executables from "./executables";

// Mock fs module
vi.mock("fs/promises", () => ({
  stat: vi.fn(),
  access: vi.fn(),
}));

// Mock path module
vi.mock("path", () => ({
  join: vi.fn(),
}));

describe("executables", () => {
  let originalPath: string | undefined;
  let originalEchoMode: string | undefined;
  let originalPlatform: string | undefined;

  beforeEach(() => {
    vi.clearAllMocks();

    // Save original environment variables and properties
    originalPath = process.env.PATH;
    originalEchoMode = process.env.CONTEXT_AIDER_ECHO_MODE;
    originalPlatform = process.platform;

    // Mock PATH for testing
    process.env.PATH = "/usr/bin:/usr/local/bin";

    // Mock fs.stat to simulate executable exists
    (fs.stat as unknown as MockInstance).mockResolvedValue({
      isFile: () => true,
      mode: 0o755, // Executable
    });

    // Mock path.join to return predictable paths
    (path.join as unknown as MockInstance).mockImplementation((...args) =>
      args.join("/"),
    );
  });

  afterEach(() => {
    // Restore original environment variables
    process.env.PATH = originalPath;

    if (originalEchoMode === undefined) {
      delete process.env.CONTEXT_AIDER_ECHO_MODE;
    } else {
      process.env.CONTEXT_AIDER_ECHO_MODE = originalEchoMode;
    }

    // Restore original properties
    Object.defineProperty(process, "platform", {
      value: originalPlatform,
    });

    vi.resetAllMocks();
  });

  describe("isEchoModeEnabled", () => {
    it("should return false by default", () => {
      delete process.env.CONTEXT_AIDER_ECHO_MODE;
      expect(executables.isEchoModeEnabled()).toBe(false);
    });

    it("should return true when env var is 'true'", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "true";
      expect(executables.isEchoModeEnabled()).toBe(true);
    });

    it("should return true when env var is '1'", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "1";
      expect(executables.isEchoModeEnabled()).toBe(true);
    });

    it("should return false for any other value", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "false";
      expect(executables.isEchoModeEnabled()).toBe(false);

      process.env.CONTEXT_AIDER_ECHO_MODE = "0";
      expect(executables.isEchoModeEnabled()).toBe(false);

      process.env.CONTEXT_AIDER_ECHO_MODE = "yes";
      expect(executables.isEchoModeEnabled()).toBe(false);
    });
  });

  describe("isDryRunEnabled", () => {
    it("should return false when --dry-run flag is not present", () => {
      expect(executables.isDryRunEnabled([])).toBe(false);
      expect(executables.isDryRunEnabled(["--other-flag"])).toBe(false);
    });

    it("should return true when --dry-run flag is present", () => {
      expect(executables.isDryRunEnabled(["--dry-run"])).toBe(true);
      expect(executables.isDryRunEnabled(["--other-flag", "--dry-run"])).toBe(
        true,
      );
    });
  });

  describe("findExecutable", () => {
    it("should find aider in PATH when echo mode is disabled", async () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "false";

      // Mock fs.stat to simulate aider executable exists at /usr/bin/aider
      (fs.stat as unknown as MockInstance).mockImplementation(async (path) => {
        if (path === "/usr/bin/aider") {
          return {
            isFile: () => true,
            mode: 0o755, // Executable
          };
        }
        throw new Error("ENOENT");
      });

      const result = await executables.findExecutable([]);

      expect(fs.stat).toHaveBeenCalled();
      expect(result).toBe("/usr/bin/aider");
    });

    it("should find echo in PATH when dry run mode is enabled", async () => {
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

      process.env.CONTEXT_AIDER_ECHO_MODE = "false";
      const result = await executables.findExecutable(["--dry-run"]);

      expect(fs.stat).toHaveBeenCalled();
      expect(result).toBe("/bin/echo");
    });

    it("should find echo in PATH when echo mode is enabled via env var", async () => {
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

      process.env.CONTEXT_AIDER_ECHO_MODE = "true";
      const result = await executables.findExecutable([]);

      expect(fs.stat).toHaveBeenCalled();
      expect(result).toBe("/bin/echo");
    });

    it("should return null if executable is not found", async () => {
      // Mock fs.stat to simulate executable not found
      (fs.stat as unknown as MockInstance).mockRejectedValue(
        new Error("ENOENT"),
      );

      const result = await executables.findExecutable([]);

      expect(result).toBeNull();
    });

    it("should handle Windows platform correctly", async () => {
      // Mock platform to be Windows
      Object.defineProperty(process, "platform", {
        value: "win32",
      });

      process.env.CONTEXT_AIDER_ECHO_MODE = "false";
      process.env.PATH = "C:\\Windows;C:\\Program Files";

      // Mock path.join for Windows paths
      (path.join as unknown as MockInstance).mockImplementation((...args) =>
        args.join("\\"),
      );

      // Mock fs.stat to simulate aider.exe exists
      (fs.stat as unknown as MockInstance).mockImplementation(async (path) => {
        if (path === "C:\\Windows\\aider.exe") {
          return {
            isFile: () => true,
            mode: 0o755,
          };
        }
        throw new Error("ENOENT");
      });

      const result = await executables.findExecutable([]);

      expect(fs.stat).toHaveBeenCalled();
      expect(result).toBe("C:\\Windows\\aider.exe");
    });

    it("should handle empty PATH environment variable", async () => {
      process.env.PATH = "";
      const result = await executables.findExecutable([]);
      expect(result).toBeNull();
    });
  });

  describe("getCommandName", () => {
    it("should return 'echo' when echo mode is enabled", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "true";
      expect(executables.getCommandName([])).toBe("echo");
    });

    it("should return 'aider' when echo mode is disabled", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "false";
      expect(executables.getCommandName([])).toBe("aider");
    });

    it("should return 'echo' when dry run flag is present", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "false";
      expect(executables.getCommandName(["--dry-run"])).toBe("echo");
    });

    it("should return 'echo' when both echo mode and dry run are enabled", () => {
      process.env.CONTEXT_AIDER_ECHO_MODE = "true";
      expect(executables.getCommandName(["--dry-run"])).toBe("echo");
    });
  });

  describe("ExecutableNotFoundError", () => {
    it("should create an error with the correct properties", () => {
      const error = new executables.ExecutableNotFoundError(
        "Test error",
        "test-command",
      );

      expect(error.message).toBe("Test error");
      expect(error.commandName).toBe("test-command");
      expect(error.name).toBe("ExecutableNotFoundError");
    });
  });
});
