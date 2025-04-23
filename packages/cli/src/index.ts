/**
 * Main entry point for the Context as Code CLI library
 */
import { CliError, getExitCodeForError } from "./utils/errors";

export const version = "0.0.1";

export function getVersion(): string {
  return version;
}

/**
 * Centralized error handler for CLI commands
 * @param error The error that occurred
 */
export function handleCliError(error: unknown): never {
  if (error instanceof CliError) {
    console.error(`Error: ${error.message}`);
    process.exit(getExitCodeForError(error));
  } else if (error instanceof Error) {
    console.error(`Unexpected error: ${error.message}`);
    if (error.stack) {
      // Only show stack trace in debug mode or if NODE_ENV is development
      if (process.env.DEBUG || process.env.NODE_ENV === "development") {
        console.error(error.stack);
      }
    }
    process.exit(1);
  } else {
    console.error(`Unknown error occurred: ${String(error)}`);
    process.exit(1);
  }
}
