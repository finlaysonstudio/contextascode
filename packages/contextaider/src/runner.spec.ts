import { describe, it, expect, vi, beforeEach } from "vitest";
import { spawnAider } from "./runner";
import { spawn } from "child_process";

// Mock child_process.spawn
vi.mock("child_process", () => ({
  spawn: vi.fn(),
}));

describe("runner", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("spawnAider", () => {
    it("should spawn aider with the given arguments", async () => {
      // Setup mock implementation
      const mockOn = vi.fn();
      (spawn as any).mockReturnValue({
        on: mockOn,
      });

      // Setup event handlers
      mockOn.mockImplementation((event, handler) => {
        if (event === "close") {
          // Simulate successful exit
          setTimeout(() => handler(0), 10);
        }
        return { on: mockOn };
      });

      // Call the function
      const args = ["--message-file=file.md"];
      await spawnAider(args);

      // Verify spawn was called correctly
      expect(spawn).toHaveBeenCalledWith("aider", args, {
        stdio: "inherit",
        shell: true,
      });
    });

    it("should reject if aider exits with non-zero code", async () => {
      // Setup mock implementation
      const mockOn = vi.fn();
      (spawn as any).mockReturnValue({
        on: mockOn,
      });

      // Setup event handlers
      mockOn.mockImplementation((event, handler) => {
        if (event === "close") {
          // Simulate error exit
          setTimeout(() => handler(1), 10);
        }
        return { on: mockOn };
      });

      // Call the function and expect it to reject
      const args = ["--message-file=file.md"];
      await expect(spawnAider(args)).rejects.toThrow(
        "Aider exited with code 1",
      );
    });

    it("should reject if spawn throws an error", async () => {
      // Setup mock implementation
      const mockOn = vi.fn();
      (spawn as any).mockReturnValue({
        on: mockOn,
      });

      // Setup event handlers
      mockOn.mockImplementation((event, handler) => {
        if (event === "error") {
          // Simulate spawn error
          setTimeout(() => handler(new Error("spawn error")), 10);
        }
        return { on: mockOn };
      });

      // Call the function and expect it to reject
      const args = ["--message-file=file.md"];
      await expect(spawnAider(args)).rejects.toThrow(
        "Failed to spawn aider: spawn error",
      );
    });

    it("should log debug information when debug option is true", async () => {
      // Setup mock implementation
      const mockOn = vi.fn();
      (spawn as any).mockReturnValue({
        on: mockOn,
      });

      // Setup event handlers
      mockOn.mockImplementation((event, handler) => {
        if (event === "close") {
          // Simulate successful exit
          setTimeout(() => handler(0), 10);
        }
        return { on: mockOn };
      });

      // Spy on console.log
      const consoleSpy = vi.spyOn(console, "log");
      consoleSpy.mockImplementation(() => {});

      // Call the function with debug option
      const args = ["--message-file=file.md"];
      await spawnAider(args, { debug: true });

      // Verify debug log was called
      expect(consoleSpy).toHaveBeenCalledWith(
        "Debug: Spawning aider with args:",
        args,
      );

      // Restore console.log
      consoleSpy.mockRestore();
    });
  });
});
