/**
 * Custom error classes for the CLI application
 */

/**
 * Base error class for CLI application errors
 */
export class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // This is necessary for proper stack traces in TypeScript
    Object.setPrototypeOf(this, CliError.prototype);
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends CliError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when file system operations fail
 */
export class FileSystemError extends CliError {
  constructor(
    message: string,
    public readonly path?: string,
    public readonly cause?: Error,
  ) {
    super(message + (path ? ` (path: ${path})` : ""));
    Object.setPrototypeOf(this, FileSystemError.prototype);
  }
}

/**
 * Error thrown when a user cancels an operation
 */
export class UserCancellationError extends CliError {
  constructor(message = "Operation cancelled by user") {
    super(message);
    Object.setPrototypeOf(this, UserCancellationError.prototype);
  }
}

/**
 * Maps error types to exit codes for the CLI
 * @param error The error to map
 * @returns The appropriate exit code
 */
export function getExitCodeForError(error: Error): number {
  if (error instanceof ValidationError) {
    return 1;
  } else if (error instanceof FileSystemError) {
    return 2;
  } else if (error instanceof UserCancellationError) {
    return 130; // Standard exit code for user cancellation (SIGINT)
  } else {
    return 1; // Generic error
  }
}
