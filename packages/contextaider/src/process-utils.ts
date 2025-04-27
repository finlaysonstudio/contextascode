import { spawn, SpawnOptions } from "child_process";
import {
  ExecutableNotFoundError,
  findExecutable,
  getCommandName,
} from "./executables";

/**
 * Options for spawning a process
 */
export interface SpawnProcessOptions {
  /** Whether to print debug information */
  debug?: boolean;
  /** Working directory for the spawned process */
  cwd?: string;
  /** Environment variables to pass to the spawned process */
  env?: NodeJS.ProcessEnv;
  /** Whether to inherit stdio from the parent process */
  inheritStdio?: boolean;
  /** Timeout in milliseconds after which the process will be killed */
  timeout?: number;
}

/**
 * Result of the process execution
 */
export interface SpawnProcessResult {
  /** Exit code of the process */
  exitCode: number;
  /** Signal that terminated the process, if any */
  signal: NodeJS.Signals | null;
}

/**
 * Error thrown when a process fails to spawn or execute
 */
export class ProcessExecutionError extends Error {
  constructor(
    message: string,
    public readonly command: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = "ProcessExecutionError";
    Object.setPrototypeOf(this, ProcessExecutionError.prototype);
  }
}

/**
 * Spawn a process with the given arguments
 * @param args Arguments to pass to the executable
 * @param options Options for spawning the process
 * @returns A promise that resolves when the process exits
 */
export async function spawnCommand(
  args: string[],
  options: SpawnProcessOptions = {},
): Promise<SpawnProcessResult> {
  const {
    debug = false,
    cwd = process.cwd(),
    env = process.env,
    inheritStdio = true,
    timeout,
  } = options;

  const commandName = getCommandName();

  // Find executable
  const execPath = await findExecutable();

  if (!execPath) {
    throw new ExecutableNotFoundError(
      `Could not find ${commandName} executable in PATH. Please make sure ${commandName} is installed and available in your PATH.`,
      commandName,
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
    let timeoutId: NodeJS.Timeout | undefined;

    try {
      const childProcess = spawn(execPath, args, spawnOptions);

      // We don't want to keep the parent process alive if the child is still running
      if (inheritStdio) {
        childProcess.unref();
      }

      // Set timeout if specified
      if (timeout) {
        timeoutId = setTimeout(() => {
          if (debug) {
            console.log(
              `[DEBUG] Process timed out after ${timeout}ms, killing...`,
            );
          }
          childProcess.kill("SIGTERM");
          // Give it a moment to terminate gracefully, then force kill
          setTimeout(() => {
            childProcess.kill("SIGKILL");
          }, 2000);
        }, timeout);
      }

      childProcess.on("error", (error) => {
        if (timeoutId) clearTimeout(timeoutId);

        if (debug) {
          console.error(
            `[DEBUG] Error spawning ${commandName}: ${error.message}`,
          );
        }
        reject(
          new ProcessExecutionError(
            `Failed to spawn ${commandName}: ${error.message}`,
            commandName,
            error,
          ),
        );
      });

      childProcess.on("exit", (code, signal) => {
        if (timeoutId) clearTimeout(timeoutId);

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
      if (timeoutId) clearTimeout(timeoutId);

      reject(
        new ProcessExecutionError(
          `Failed to execute ${commandName}: ${error instanceof Error ? error.message : String(error)}`,
          commandName,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  });
}
