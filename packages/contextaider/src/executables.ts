import * as path from "path";
import * as fs from "fs/promises";

/**
 * Error thrown when an executable cannot be found
 */
export class ExecutableNotFoundError extends Error {
  constructor(
    message: string,
    public readonly commandName: string,
  ) {
    super(message);
    this.name = "ExecutableNotFoundError";
    Object.setPrototypeOf(this, ExecutableNotFoundError.prototype);
  }
}

/**
 * Check if echo mode is enabled
 * @returns true if echo mode is enabled, false otherwise
 */
export function isEchoModeEnabled(): boolean {
  const echoModeEnv = process.env.CONTEXT_AIDER_ECHO_MODE;
  return echoModeEnv !== "false" && echoModeEnv !== "0";
}

/**
 * Find the appropriate executable in the PATH
 * @returns The path to the executable or null if not found
 */
export async function findExecutable(): Promise<string | null> {
  const useEcho = isEchoModeEnabled();
  const commandName = useEcho ? "echo" : "aider";

  // Check if command is in PATH
  const envPath = process.env.PATH || "";
  const pathSeparator = process.platform === "win32" ? ";" : ":";
  const pathDirs = envPath.split(pathSeparator);

  // Only check for builtin echo if PATH is not empty
  if (useEcho && process.platform !== "win32" && envPath.trim() !== "") {
    // On Unix systems, echo is a shell builtin, so we'll default to /bin/echo
    try {
      const builtinPath = "/bin/echo";
      const stats = await fs.stat(builtinPath);
      if (stats.isFile() && stats.mode & 0o111) {
        return builtinPath;
      }
    } catch (error) {
      // Continue to search in PATH
    }
  }

  // Possible executable names based on platform
  const execNames =
    process.platform === "win32"
      ? useEcho
        ? ["echo.exe", "echo.cmd", "echo.bat", "echo"]
        : ["aider.exe", "aider.cmd", "aider.bat", "aider"]
      : [commandName];

  for (const dir of pathDirs) {
    if (dir === "") continue;
    for (const execName of execNames) {
      const execPath = path.join(dir, execName);
      try {
        const stats = await fs.stat(execPath);
        if (
          stats.isFile() &&
          (process.platform === "win32" || stats.mode & 0o111)
        ) {
          return execPath;
        }
      } catch (error) {
        // File doesn't exist or can't be accessed, continue to next
      }
    }
  }

  return null;
}

/**
 * Get the current command name based on echo mode
 * @returns The command name (either "echo" or "aider")
 */
export function getCommandName(): string {
  return isEchoModeEnabled() ? "echo" : "aider";
}
