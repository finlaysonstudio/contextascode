import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exec } from "child_process";
import { promisify } from "util";
import * as path from "path";
import * as fs from "fs/promises";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(__dirname, "../dist/contextaider.js");

// Mock temporary files for testing
const TEMP_DIR = path.join(__dirname, "temp");
const TEMP_FILE = path.join(TEMP_DIR, "test-file.md");
const TEMP_FILE_WITH_FRONTMATTER = path.join(TEMP_DIR, "test-frontmatter.md");

describe("CLI Integration Tests", () => {
  beforeEach(async () => {
    // Create temp directory and test files
    await fs.mkdir(TEMP_DIR, { recursive: true });

    // Create a simple test file
    await fs.writeFile(
      TEMP_FILE,
      "This is a test file for CLI integration tests.",
    );

    // Create a test file with frontmatter
    await fs.writeFile(
      TEMP_FILE_WITH_FRONTMATTER,
      "---\ntitle: Test Frontmatter\ndescription: This is a test file with frontmatter\n---\n\nContent after frontmatter.",
    );
  });

  afterEach(async () => {
    // Clean up temp files
    await fs.rm(TEMP_DIR, { recursive: true, force: true });
  });

  it("should display help information", async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} --help`);
    expect(stdout).toContain("Usage:");
    expect(stdout).toContain("Options:");
    expect(stdout).toContain("--exec");
  });

  it("should handle version flag", async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} --version`);
    expect(stdout).toMatch(/\d+\.\d+\.\d+/); // Should match semver format
  });

  it("should detect frontmatter in exec mode", async () => {
    // Use echo mode to avoid actually running aider
    process.env.CONTEXT_AIDER_ECHO_MODE = "true";

    const { stdout } = await execAsync(
      `node ${CLI_PATH} --exec ${TEMP_FILE_WITH_FRONTMATTER}`,
    );

    expect(stdout).toContain("--message-file");
    expect(stdout).toContain(TEMP_FILE_WITH_FRONTMATTER);

    // Reset env var
    process.env.CONTEXT_AIDER_ECHO_MODE = "false";
  });

  it("should handle multiple files correctly", async () => {
    // Use echo mode to avoid actually running aider
    process.env.CONTEXT_AIDER_ECHO_MODE = "true";

    const { stdout } = await execAsync(
      `node ${CLI_PATH} ${TEMP_FILE} ${TEMP_FILE_WITH_FRONTMATTER}`,
    );

    expect(stdout).toContain(TEMP_FILE);
    expect(stdout).toContain(TEMP_FILE_WITH_FRONTMATTER);

    // Reset env var
    process.env.CONTEXT_AIDER_ECHO_MODE = "false";
  });

  it("should handle message parameter correctly", async () => {
    // Use echo mode to avoid actually running aider
    process.env.CONTEXT_AIDER_ECHO_MODE = "true";

    const testMessage = "This is a test message";
    const { stdout } = await execAsync(
      `node ${CLI_PATH} ${TEMP_FILE} "${testMessage}"`,
    );

    expect(stdout).toContain("--message");
    expect(stdout).toContain(testMessage);

    // Reset env var
    process.env.CONTEXT_AIDER_ECHO_MODE = "false";
  });
});
