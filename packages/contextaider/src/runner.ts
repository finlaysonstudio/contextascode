import { spawn, SpawnOptions } from "child_process";
import path from "path";
import fs from "fs/promises";

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
 * Find the aider executable in the PATH
 * @returns The path to the aider executable or null if not found
 */
export async function findAiderExecutable(): Promise<string | null> {
  // Check if aider is in PATH
  const envPath = process.env.PATH || "";
  const pathSeparator = process.platform === "win32" ? ";" : ":";
  const pathDirs = envPath.split(pathSeparator);
  
  // Possible executable names based on platform
  const execNames = process.platform === "win32" 
    ? ["aider.exe", "aider.cmd", "aider.bat", "aider"] 
    : ["aider"];
  
  for (const dir of pathDirs) {
    for (const execName of execNames) {
      const execPath = path.join(dir, execName);
      try {
        const stats = await fs.stat(execPath);
        if (stats.isFile() && (process.platform === "win32" || (stats.mode & 0o111))) {
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
 * Spawn the aider process with the given arguments
 * @param args Arguments to pass to aider
 * @param options Options for spawning the process
 * @returns A promise that resolves when the process exits
 */
export async function spawnAider(
  args: string[],
  options: SpawnAiderOptions = {},
): Promise<SpawnAiderResult> {
  const { debug = false, cwd = process.cwd(), env = process.env, inheritStdio = true } = options;
  
  // Find aider executable
  const aiderPath = await findAiderExecutable();
  
  if (!aiderPath) {
    throw new Error(
      "Could not find aider executable in PATH. Please make sure aider is installed and available in your PATH."
    );
  }
  
  if (debug) {
    console.log(`[DEBUG] Using aider executable: ${aiderPath}`);
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
      const childProcess = spawn(aiderPath, args, spawnOptions);
      
      // We don't want to keep the parent process alive if the child is still running
      if (inheritStdio) {
        childProcess.unref();
      }
      
      childProcess.on("error", (error) => {
        if (debug) {
          console.error(`[DEBUG] Error spawning aider: ${error.message}`);
        }
        reject(error);
      });
      
      childProcess.on("exit", (code, signal) => {
        if (debug) {
          console.log(`[DEBUG] Aider exited with code ${code} and signal ${signal}`);
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
