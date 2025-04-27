import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { MockInstance } from "vitest";
import { spawn } from "child_process";
import * as executables from "./executables";
import * as processUtils from "./process-utils";

// Mock child_process module
vi.mock("child_process", () => ({
  spawn: vi.fn(),
}));

// Mock executables module
vi.mock("./executables", () => ({
  findExecutable: vi.fn(),
  getCommandName: vi.fn(),
  ExecutableNotFoundError: class ExecutableNotFoundError extends Error {
    constructor(
      message: string,
      public readonly commandName: string,
    ) {
      super(message);
      this.name = "ExecutableNotFoundError";
    }
  },
}));

describe("process-utils", () => {
  const mockSpawn = spawn as unknown as MockInstance;
  const mockEventEmitter = {
    on: vi.fn((event, callback) => {
      if (event === "exit") {
        setTimeout(() => callback(0, null), 10);
      }
      return mockEventEmitter;
    }),
    unref: vi.fn(),
    kill: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock behavior
    mockSpawn.mockReturnValue(mockEventEmitter);
    (executables.findExecutable as unknown as MockInstance).mockResolvedValue(
      "/usr/bin/command",
    );
    (executables.getCommandName as unknown as MockInstance).mockReturnValue(
      "echo",
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
    // Ensure we reset any fake timers
    vi.useRealTimers();
  });

  describe("spawnCommand", () => {
    it("should spawn process with correct arguments", async () => {
      // Setup mock to trigger exit event
      mockEventEmitter.on.mockImplementation((event, callback) => {
        if (event === "exit") {
          setTimeout(() => callback(0, null), 10);
        }
        return mockEventEmitter;
      });

      const args = ["Hello", "World"];
      const result = await processUtils.spawnCommand(args, { debug: true });

      expect(mockSpawn).toHaveBeenCalled();
      expect(mockSpawn).toHaveBeenCalledWith(
        "/usr/bin/command",
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

    it("should throw ExecutableNotFoundError if executable is not found", async () => {
      // Mock findExecutable to return null
      (executables.findExecutable as unknown as MockInstance).mockResolvedValue(
        null,
      );

      await expect(processUtils.spawnCommand([])).rejects.toThrow(
        executables.ExecutableNotFoundError,
      );
    });

    it("should handle spawn errors", async () => {
      // Setup mock to trigger error event
      mockEventEmitter.on.mockImplementation((event, callback) => {
        if (event === "error") {
          setTimeout(() => callback(new Error("Spawn error")), 10);
        }
        return mockEventEmitter;
      });

      await expect(processUtils.spawnCommand([])).rejects.toThrow(
        processUtils.ProcessExecutionError,
      );
    });

    it("should use custom options when provided", async () => {
      // Setup mock to trigger exit event
      mockEventEmitter.on.mockImplementation((event, callback) => {
        if (event === "exit") {
          setTimeout(() => callback(0, null), 10);
        }
        return mockEventEmitter;
      });

      const customOptions = {
        cwd: "/custom/path",
        env: { CUSTOM_ENV: "value" } as NodeJS.ProcessEnv,
        inheritStdio: false,
        debug: true,
      };

      await processUtils.spawnCommand([], customOptions);

      expect(mockSpawn).toHaveBeenCalledWith(
        "/usr/bin/command",
        [],
        expect.objectContaining({
          cwd: "/custom/path",
          env: { CUSTOM_ENV: "value" },
          stdio: "pipe",
        }),
      );
    });

    it("should handle timeout and kill the process", async () => {
      // Setup fake timers
      vi.useFakeTimers();

      // Setup mock to never trigger exit event
      mockEventEmitter.on.mockImplementation((event) => {
        return mockEventEmitter;
      });

      const promise = processUtils.spawnCommand([], { timeout: 5000 });

      // Fast-forward timers to trigger the timeout
      await vi.advanceTimersByTimeAsync(5000);

      // Manually trigger exit after kill
      const exitCallbackCall = mockEventEmitter.on.mock.calls.find(
        (call) => call[0] === "exit",
      );
      if (!exitCallbackCall) {
        throw new Error("Exit callback not found");
      }
      const exitCallback = exitCallbackCall[1];
      exitCallback(143, "SIGTERM");

      const result = await promise;

      expect(mockEventEmitter.kill).toHaveBeenCalledWith("SIGTERM");
      expect(result).toEqual({
        exitCode: 143,
        signal: "SIGTERM",
      });

      // Restore real timers
      vi.useRealTimers();
    });
  });
});
