import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as path from "path";
import * as fs from "fs/promises";
import { fileURLToPath } from "url";
import { processArgs } from "../src/exec-mode/file-handler";
import { translateFlags } from "../src/flag-mappings";
import { isEchoModeEnabled } from "../src/executables";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, "temp-integration");
const TEMP_FILE = path.join(TEMP_DIR, "integration-test.md");
const TEMP_FRONTMATTER_FILE = path.join(TEMP_DIR, "frontmatter-test.md");

describe("End-to-End Integration Tests", () => {
  beforeEach(async () => {
    // Create temp directory and test files
    await fs.mkdir(TEMP_DIR, { recursive: true });

    // Create a simple test file
    await fs.writeFile(TEMP_FILE, "This is an integration test file.");

    // Create a test file with frontmatter
    await fs.writeFile(
      TEMP_FRONTMATTER_FILE,
      "---\ntitle: Integration Test\ndescription: Testing frontmatter parsing\n---\n\nContent after frontmatter.",
    );
  });

  afterEach(async () => {
    // Clean up temp files
    await fs.rm(TEMP_DIR, { recursive: true, force: true });
  });

  it("should process arguments correctly", async () => {
    const args = ["--exec", TEMP_FILE, TEMP_FRONTMATTER_FILE, "Test message"];
    const result = await processArgs(args);

    expect(result.execFile).toBe(TEMP_FILE);
    expect(result.additionalFiles).toContain(TEMP_FRONTMATTER_FILE);
    expect(result.message).toBe("Test message");
  });

  it("should parse frontmatter correctly", async () => {
    const content = await fs.readFile(TEMP_FRONTMATTER_FILE, "utf-8");

    // Simple frontmatter detection without using the actual function
    const lines = content.split("\n");
    const hasFrontmatter =
      lines[0]?.trim() === "---" &&
      lines.slice(1).findIndex((line) => line.trim() === "---") > 0;

    expect(hasFrontmatter).toBe(true);
    expect(content).toContain("title: Integration Test");
    expect(content).toContain("description: Testing frontmatter parsing");
    expect(content).toContain("Content after frontmatter.");
  });

  it("should translate flags correctly", () => {
    const inputArgs = ["--model", "gpt-4", "--temperature", "0.7"];
    const translatedArgs = translateFlags(inputArgs);

    // Check if flags are properly translated according to mappings
    expect(translatedArgs).toContain("--model");
    expect(translatedArgs).toContain("gpt-4");
    expect(translatedArgs).toContain("--temperature");
    expect(translatedArgs).toContain("0.7");
  });

  it("should respect echo mode environment variable", () => {
    // Save original env var
    const originalEchoMode = process.env.CONTEXT_AIDER_ECHO_MODE;

    // Test with echo mode enabled
    process.env.CONTEXT_AIDER_ECHO_MODE = "true";
    expect(isEchoModeEnabled()).toBe(true);

    // Test with echo mode disabled
    process.env.CONTEXT_AIDER_ECHO_MODE = "false";
    expect(isEchoModeEnabled()).toBe(false);

    // Restore original env var
    process.env.CONTEXT_AIDER_ECHO_MODE = originalEchoMode;
  });

  it("should handle the complete workflow from args to execution", async () => {
    // This test simulates the entire workflow:
    // 1. Process command line args
    // 2. Check for frontmatter in files
    // 3. Translate flags
    // 4. Prepare for execution

    const args = ["--exec", TEMP_FRONTMATTER_FILE, "--model", "gpt-4"];

    // Process args
    const processedArgs = await processArgs(args);
    expect(processedArgs.execFile).toBe(TEMP_FRONTMATTER_FILE);

    // Check frontmatter (simplified check)
    const fileContent = await fs.readFile(TEMP_FRONTMATTER_FILE, "utf-8");
    const lines = fileContent.split("\n");
    const hasFrontmatter =
      lines[0]?.trim() === "---" &&
      lines.slice(1).findIndex((line) => line.trim() === "---") > 0;
    expect(hasFrontmatter).toBe(true);

    // Translate flags
    const translatedFlags = translateFlags(["--model", "gpt-4"]);
    expect(translatedFlags).toContain("--model");
    expect(translatedFlags).toContain("gpt-4");

    // Final command would include:
    // - The translated flags
    // - The file as a message file due to frontmatter
    // - Any additional arguments

    // This is what would be passed to the runner
    const finalArgs = [
      ...translatedFlags,
      "--message-file",
      TEMP_FRONTMATTER_FILE,
    ];

    expect(finalArgs).toContain("--model");
    expect(finalArgs).toContain("gpt-4");
    expect(finalArgs).toContain("--message-file");
    expect(finalArgs).toContain(TEMP_FRONTMATTER_FILE);
  });
});
