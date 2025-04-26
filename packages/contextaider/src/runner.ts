import { spawn } from "child_process";

/**
 * Options for spawning aider
 */
export interface SpawnAiderOptions {
  /** Whether to print debug information */
  debug?: boolean;
}

/**
 * Spawns aider with the given arguments
 * @param args Arguments to pass to aider
 * @param options Options for spawning aider
 * @returns Promise that resolves when aider exits
 */
export async function spawnAider(
  args: string[],
  options: SpawnAiderOptions = {},
): Promise<number> {
  return new Promise((resolve, reject) => {
    if (options.debug) {
      console.log("Debug: Spawning aider with args:", args);
    }

    // Spawn aider with stdio inheritance to preserve TTY
    const aiderProcess = spawn("aider", args, {
      stdio: "inherit",
      shell: true,
    });

    // Handle process exit
    aiderProcess.on("close", (code) => {
      if (code === 0 || code === null) {
        resolve(code ?? 0);
      } else {
        reject(new Error(`Aider exited with code ${code}`));
      }
    });

    // Handle process error
    aiderProcess.on("error", (error) => {
      reject(new Error(`Failed to spawn aider: ${error.message}`));
    });
  });
}
