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
  // Instead of importing the script directly, we'll extract and test the checkAiderVersion function

  it("should detect compatible aider version", async () => {
    // Mock execSync to return a compatible version
    vi.mocked(execSync).mockReturnValue("aider 0.18.0");

    // Set environment to non-CI to ensure the check runs
    const originalEnv = process.env.CI;
    process.env.CI = undefined;

    // Read the postinstall script
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const postinstallPath = path.resolve(__dirname, "..", "postinstall.js");
    const content = await fs.readFile(postinstallPath, "utf-8");

    // Extract and run the checkAiderVersion function
    const fnContent =
      content.match(/function checkAiderVersion\(\) \{([\s\S]*?)\}/)?.[0] || "";
    // Add closing brace to make it a complete function
    const fnCode = `${fnContent}; checkAiderVersion();`;

    // Execute the function
    eval(fnCode);

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

    // Read the postinstall script
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const postinstallPath = path.resolve(__dirname, "..", "postinstall.js");
    const content = await fs.readFile(postinstallPath, "utf-8");

    // Extract and run the checkAiderVersion function
    const fnContent =
      content.match(/function checkAiderVersion\(\) \{([\s\S]*?)\}/)?.[0] || "";
    // Add closing brace to make it a complete function
    const fnCode = `${fnContent}; checkAiderVersion();`;

    // Execute the function
    eval(fnCode);

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

    // Read the postinstall script
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const postinstallPath = path.resolve(__dirname, "..", "postinstall.js");
    const content = await fs.readFile(postinstallPath, "utf-8");

    // Extract and run the checkAiderVersion function
    const fnContent =
      content.match(/function checkAiderVersion\(\) \{([\s\S]*?)\}/)?.[0] || "";
    // Add closing brace to make it a complete function
    const fnCode = `${fnContent}; checkAiderVersion();`;

    // Execute the function
    eval(fnCode);

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

    // Read the postinstall script
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const postinstallPath = path.resolve(__dirname, "..", "postinstall.js");
    const content = await fs.readFile(postinstallPath, "utf-8");

    // Extract the main execution part
    const mainCode =
      content.match(/\/\/ Only run in non-CI environments([\s\S]*?)$/)?.[0] ||
      "";

    // Execute the code
    eval(mainCode);

    // Restore environment
    process.env.CI = originalEnv;

    // Verify no console output
    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
