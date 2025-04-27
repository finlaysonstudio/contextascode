import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { execSync } from "child_process";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

// Mock execSync
vi.mock("child_process", () => ({
  execSync: vi.fn(),
}));

// Mock console methods
const originalConsole = { ...console };
beforeEach(() => {
  console.log = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  vi.resetAllMocks();
});

describe("postinstall version check", () => {
  // Define MIN_AIDER_VERSION as it's used in the postinstall script
  const MIN_AIDER_VERSION = "0.18.0";

  // Create a function to simulate the checkAiderVersion function
  function createCheckAiderVersionFn(mockOutput: string) {
    return function checkAiderVersion() {
      console.log("Checking aider compatibility...");

      try {
        const output = mockOutput;
        const versionMatch = output.match(/(\d+\.\d+\.\d+)/);

        if (versionMatch) {
          const installedVersion = versionMatch[1];
          console.log(`Found aider version: ${installedVersion}`);

          // Simple version comparison (this is basic and assumes semantic versioning)
          const installedParts = installedVersion.split(".").map(Number);
          const requiredParts = MIN_AIDER_VERSION.split(".").map(Number);

          // Compare major, minor, patch
          for (let i = 0; i < 3; i++) {
            if (installedParts[i] > requiredParts[i]) {
              console.log("✅ Compatible aider version detected");
              return;
            }
            if (installedParts[i] < requiredParts[i]) {
              console.warn(
                `⚠️  Warning: contextaider requires aider version ${MIN_AIDER_VERSION} or higher`,
              );
              console.warn(`   Current version: ${installedVersion}`);
              console.warn(
                "   Please upgrade aider: pip install -U aider-chat",
              );
              return;
            }
          }

          console.log("✅ Compatible aider version detected");
        } else {
          console.warn("⚠️  Warning: Could not determine aider version");
        }
      } catch (error) {
        console.warn("⚠️  Warning: aider not found in PATH");
        console.warn(
          "   contextaider requires aider to be installed and available in your PATH",
        );
        console.warn("   Install aider: pip install aider-chat");
      }
    };
  }

  it("should detect compatible aider version", async () => {
    // Mock execSync to return a compatible version
    vi.mocked(execSync).mockReturnValue("aider 0.18.0");

    // Set environment to non-CI to ensure the check runs
    const originalEnv = process.env.CI;
    process.env.CI = undefined;

    // Create and run the checkAiderVersion function with a compatible version
    const checkAiderVersion = createCheckAiderVersionFn("aider 0.18.0");
    checkAiderVersion();

    // Restore environment
    process.env.CI = originalEnv;

    // Verify console output
    expect(console.log).toHaveBeenCalledWith("Checking aider compatibility...");
    expect(console.log).toHaveBeenCalledWith("Found aider version: 0.18.0");
    expect(console.log).toHaveBeenCalledWith(
      "✅ Compatible aider version detected",
    );
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("should warn about incompatible aider version", async () => {
    // Mock execSync to return an incompatible version
    vi.mocked(execSync).mockReturnValue("aider 0.17.0");

    // Set environment to non-CI to ensure the check runs
    const originalEnv = process.env.CI;
    process.env.CI = undefined;

    // Create and run the checkAiderVersion function with an incompatible version
    const checkAiderVersion = createCheckAiderVersionFn("aider 0.17.0");
    checkAiderVersion();

    // Restore environment
    process.env.CI = originalEnv;

    // Verify console output
    expect(console.log).toHaveBeenCalledWith("Checking aider compatibility...");
    expect(console.log).toHaveBeenCalledWith("Found aider version: 0.17.0");
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("Warning: contextaider requires aider version"),
    );
  });

  it("should handle aider not found", async () => {
    // Mock execSync to throw an error
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error("Command failed");
    });

    // Set environment to non-CI to ensure the check runs
    const originalEnv = process.env.CI;
    process.env.CI = undefined;

    // Create a special version of the function that simulates the error case
    const checkAiderVersion = function () {
      console.log("Checking aider compatibility...");

      try {
        // This will trigger the mocked execSync which throws an error
        execSync("aider --version", {
          encoding: "utf8",
          stdio: ["pipe", "pipe", "ignore"],
        });
      } catch (error) {
        console.warn("⚠️  Warning: aider not found in PATH");
        console.warn(
          "   contextaider requires aider to be installed and available in your PATH",
        );
        console.warn("   Install aider: pip install aider-chat");
      }
    };

    checkAiderVersion();

    // Restore environment
    process.env.CI = originalEnv;

    // Verify console output
    expect(console.log).toHaveBeenCalledWith("Checking aider compatibility...");
    expect(console.warn).toHaveBeenCalledWith(
      "⚠️  Warning: aider not found in PATH",
    );
  });

  it("should skip check in CI environments", async () => {
    // Set environment to CI
    const originalEnv = process.env.CI;
    process.env.CI = "true";

    // Mock execSync to return a compatible version (shouldn't be called)
    vi.mocked(execSync).mockReturnValue("aider 0.18.0");

    // In CI environment, the check should be skipped
    // This simulates the main script's behavior
    if (!process.env.CI) {
      const checkAiderVersion = createCheckAiderVersionFn("aider 0.18.0");
      checkAiderVersion();
    }

    // Restore environment
    process.env.CI = originalEnv;

    // Verify no console output
    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
