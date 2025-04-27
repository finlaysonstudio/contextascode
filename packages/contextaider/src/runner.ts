import {
  SpawnProcessOptions,
  SpawnProcessResult,
  spawnCommand,
} from "./process-utils";

/**
 * Options for spawning the aider process
 * @extends SpawnProcessOptions
 */
export interface SpawnAiderOptions extends SpawnProcessOptions {
  /** Maximum number of retry attempts if the process fails */
  maxRetries?: number;
}

/**
 * Result of the aider process execution
 * @extends SpawnProcessResult
 */
export interface SpawnAiderResult extends SpawnProcessResult {
  /** Number of retry attempts made */
  retryCount?: number;
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
  const { maxRetries = 0, ...spawnOptions } = options;
  let retryCount = 0;
  let lastError: unknown;

  while (retryCount <= maxRetries) {
    try {
      // Explicitly call spawnCommand to make it easier to mock in tests
      const result = await spawnCommand(args, spawnOptions);

      // Return result with retry information
      return {
        ...result,
        retryCount,
      };
    } catch (error) {
      lastError = error;
      retryCount++;

      // Always log debug info
      console.log(
        `[DEBUG] Attempt ${retryCount}/${maxRetries + 1} failed, ${retryCount <= maxRetries ? "retrying..." : "giving up."}`,
      );

      // If we've reached max retries, rethrow the error
      if (retryCount > maxRetries) {
        throw error;
      }

      // Wait a bit before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // This should never be reached due to the throw in the loop,
  // but TypeScript needs it for type safety
  throw lastError;
}
