/**
 * Exec mode orchestration for ContextAider
 */
import fs from "fs/promises";
import path from "path";
import { readFileWithFrontmatter, FrontmatterParseResult } from "./frontmatter";

/**
 * Options for exec mode processing
 */
export interface ExecModeOptions {
  /** Path to the exec file */
  execFile: string;
  /** Whether to print debug information */
  debug?: boolean;
}

/**
 * Result of processing an exec file
 */
export interface ExecModeResult {
  /** The file path that was processed */
  filePath: string;
  /** Whether frontmatter was detected */
  hasFrontmatter: boolean;
  /** The parsed frontmatter if present */
  frontmatter: Record<string, unknown> | null;
  /** Arguments to pass to aider */
  aiderArgs: string[];
  /** Any error that occurred during processing */
  error?: Error;
}

/**
 * Process a file in exec mode
 * @param options Options for exec mode
 * @returns Promise resolving to the exec mode result
 */
export const processExecMode = async (
  options: ExecModeOptions,
): Promise<ExecModeResult> => {
  const { execFile, debug = true } = options; // Always enable debug mode

  try {
    // Check if file exists
    try {
      await fs.access(execFile);
    } catch (error) {
      throw new Error(`Exec file not found: ${execFile}`);
    }

    // Read file with frontmatter
    const parseResult = await readFileWithFrontmatter(execFile);

    // Always log when frontmatter is detected
    if (parseResult.hasFrontmatter) {
      console.log("Exec frontmatter detected");
    }

    // Prepare aider arguments
    const aiderArgs = ["--message-file", execFile];

    return {
      filePath: execFile,
      hasFrontmatter: parseResult.hasFrontmatter,
      frontmatter: parseResult.frontmatter,
      aiderArgs,
    };
  } catch (error) {
    // Always log debug errors
    console.error(`Error processing exec file: ${(error as Error).message}`);

    return {
      filePath: execFile,
      hasFrontmatter: false,
      frontmatter: null,
      aiderArgs: [],
      error: error as Error,
    };
  }
};
