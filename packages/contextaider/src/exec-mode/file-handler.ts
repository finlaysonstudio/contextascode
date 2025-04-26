import * as fs from "fs/promises";
import { constants } from "fs";
import * as path from "path";

/**
 * Error thrown when a file operation fails
 */
export class FileHandlerError extends Error {
  constructor(
    message: string,
    public readonly path?: string,
  ) {
    super(message + (path ? ` (path: ${path})` : ""));
    this.name = "FileHandlerError";
    Object.setPrototypeOf(this, FileHandlerError.prototype);
  }
}

/**
 * Check if a file exists and is readable
 * @param filePath Path to the file to check
 * @returns Promise that resolves to true if the file exists and is readable
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read a file's contents
 * @param filePath Path to the file to read
 * @returns Promise that resolves to the file's contents
 * @throws FileHandlerError if the file cannot be read
 */
export async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    throw new FileHandlerError(
      `Failed to read file: ${error instanceof Error ? error.message : String(error)}`,
      filePath,
    );
  }
}

/**
 * Process file arguments to determine which are valid files
 * @param args Array of file paths to check
 * @returns Promise that resolves to an object containing valid files and invalid paths
 */
export async function processFileArgs(args: string[]): Promise<{
  validFiles: string[];
  invalidPaths: string[];
}> {
  const result = {
    validFiles: [] as string[],
    invalidPaths: [] as string[],
  };

  for (const arg of args) {
    // Skip arguments that look like flags
    if (arg.startsWith("-")) {
      continue;
    }

    // Check if the argument is a valid file path
    if (await fileExists(arg)) {
      console.log("arg :>> ", arg);
      result.validFiles.push(path.resolve(arg));
    } else {
      result.invalidPaths.push(arg);
    }
  }

  return result;
}

/**
 * Process command line arguments to extract file paths and message
 * @param args Command line arguments
 * @returns Promise that resolves to an object containing exec file, additional files, and message
 */
export async function processArgs(args: string[]): Promise<{
  execFile?: string;
  additionalFiles: string[];
  message?: string;
}> {
  const result: {
    execFile?: string;
    additionalFiles: string[];
    message?: string;
  } = {
    additionalFiles: [] as string[],
  };

  // Process arguments to find valid files and potential message
  const { validFiles, invalidPaths } = await processFileArgs(args);
  console.log("invalidPaths :>> ", invalidPaths);

  // If we have valid files, the first one is the exec file
  if (validFiles.length > 0) {
    result.execFile = validFiles[0];
    result.additionalFiles = validFiles.slice(1);
  }

  // If we have invalid paths, the last one might be a message
  if (invalidPaths.length > 0) {
    const lastInvalidPath = invalidPaths[invalidPaths.length - 1];
    // Only treat as message if it doesn't look like a flag
    if (!lastInvalidPath.startsWith("-")) {
      result.message = lastInvalidPath;
    }
  }

  return result;
}
