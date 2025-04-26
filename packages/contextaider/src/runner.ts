import { spawn, SpawnOptions } from "child_process";
import * as path from "path";
import * as fs from "fs/promises";

/**
 * Check if echo mode is enabled
 * @returns true if echo mode is enabled, false otherwise
 */
export function isEchoModeEnabled(): boolean {
  const echoModeEnv = process.env.CONTEXT_AIDER_ECHO_MODE;
  return echoModeEnv !== "false" && echoModeEnv !== "0";
}

/**
 * Options for spawning the aider process
 */
export interface SpawnAiderOptions {
  /** Whether to print debug information */
  debug?: boolean;
  /** Working directory for the spawned process */
  cwd?: string;
  /** Environment variables to pass to the spawned process */
  env?: NodeJS.ProcessEnv;
  /** Whether to inherit stdio from the parent process */
  inheritStdio?: boolean;
}

/**
 * Result of the aider process execution
 */
export interface SpawnAiderResult {
  /** Exit code of the process */
  exitCode: number;
  /** Signal that terminated the process, if any */
  signal: NodeJS.Signals | null;
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

  if (useEcho && process.platform !== "win32") {
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
          console.log("execPath :>> ", execPath);
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
 * Spawn a process with the given arguments
 * @param args Arguments to pass to the executable
 * @param options Options for spawning the process
 * @returns A promise that resolves when the process exits
 */
export async function spawnCommand(
  args: string[],
  options: SpawnAiderOptions = {},
): Promise<SpawnAiderResult> {
  const {
    debug = false,
    cwd = process.cwd(),
    env = process.env,
    inheritStdio = true,
  } = options;

  const useEcho = isEchoModeEnabled();
  const commandName = useEcho ? "echo" : "aider";

  // Find executable
  const execPath = await findExecutable();

  if (!execPath) {
    // Using Promise.reject ensures this will be properly caught in tests with expect().rejects
    return Promise.reject(
      new Error(
        `Could not find ${commandName} executable in PATH. Please make sure ${commandName} is installed and available in your PATH.`,
      ),
    );
  }

  if (debug) {
    console.log(`[DEBUG] Using ${commandName} executable: ${execPath}`);
    console.log(`[DEBUG] Arguments: ${args.join(" ")}`);
  }

  // Configure spawn options to preserve TTY
  const spawnOptions: SpawnOptions = {
    cwd,
    env,
    stdio: inheritStdio ? "inherit" : "pipe",
    // Ensure we detach properly to allow the child process to take over the TTY
    detached: false,
  };

  return new Promise((resolve, reject) => {
    try {
      const childProcess = spawn(execPath, args, spawnOptions);

      // We don't want to keep the parent process alive if the child is still running
      if (inheritStdio) {
        childProcess.unref();
      }

      childProcess.on("error", (error) => {
        if (debug) {
          console.error(
            `[DEBUG] Error spawning ${commandName}: ${error.message}`,
          );
        }
        reject(error);
      });

      childProcess.on("exit", (code, signal) => {
        if (debug) {
          console.log(
            `[DEBUG] ${commandName} exited with code ${code} and signal ${signal}`,
          );
        }
        resolve({
          exitCode: code ?? 1, // Default to 1 if code is null
          signal,
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Spawn the aider process with the given arguments
 * @param args Arguments to pass to aider
 * @param options Options for spawning the process
 * @returns A promise that resolves when the process exits
 */
export async function spawnAider(
  args: string[],
  options: SpawnAiderOptions = {},
): Promise<SpawnAiderResult> {
  // Explicitly call spawnCommand to make it easier to mock in tests
  const result = await spawnCommand(args, options);
  return result;
}
