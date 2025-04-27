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
    debug = true, // Always enable debug mode
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
    
    // Format arguments for display, properly quoting message parameters
    const formattedArgs = [...args];
    const messageIndex = formattedArgs.indexOf('--message');
    if (messageIndex !== -1 && messageIndex < formattedArgs.length - 1) {
      // Quote the message parameter if it contains spaces and isn't already quoted
      const message = formattedArgs[messageIndex + 1];
      if (message.includes(' ') && !message.startsWith('"') && !message.endsWith('"')) {
        formattedArgs[messageIndex + 1] = `"${message}"`;
      }
    }
    
    console.log(`[DEBUG] Arguments: ${formattedArgs.join(" ")}`);
  }

  // Process arguments to properly handle message quoting
  const processedArgs = [...args];
  const messageIndex = processedArgs.indexOf('--message');
  if (messageIndex !== -1 && messageIndex < processedArgs.length - 1) {
    // If the message contains spaces and isn't already quoted, we need to handle it specially
    const message = processedArgs[messageIndex + 1];
    if (message.includes(' ') && !message.startsWith('"') && !message.endsWith('"')) {
      // For echo mode, we need to ensure the message is properly quoted in the output
      if (commandName === 'echo') {
        processedArgs[messageIndex + 1] = `"${message}"`;
      }
    }
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
      const childProcess = spawn(execPath, processedArgs, spawnOptions);

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

        // Always log debug info
        console.error(
          `[DEBUG] Error spawning ${commandName}: ${error.message}`,
        );
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

        // Always log debug info
        console.log(
          `[DEBUG] ${commandName} exited with code ${code} and signal ${signal}`,
        );
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
