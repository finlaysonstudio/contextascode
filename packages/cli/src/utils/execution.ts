/**
 * Options for executedAs function
 */
export interface ExecutedAsOptions {
  /**
   * Array of locations to search for the filename
   * @default [import.meta.url, process.argv[1]]
   */
  search?: string[];
}

/**
 * Checks if the current file is being executed directly
 * @param fileNames Array of possible filenames that could be executing this code
 * @param options Configuration options
 * @returns boolean indicating if the file is being executed directly
 */
export function executedAs(
  fileNames: string[],
  options?: ExecutedAsOptions,
): boolean {
  const searchLocations = options?.search || [import.meta.url, process.argv[1]];

  for (const location of searchLocations) {
    if (!location) continue;

    for (const fileName of fileNames) {
      if (location.endsWith(`${fileName}`)) {
        return true;
      }
    }
  }

  return false;
}
