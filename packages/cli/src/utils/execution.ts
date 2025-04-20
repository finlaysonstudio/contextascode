/**
 * Checks if the current file is being executed directly
 * @param fileNames Array of possible filenames that could be executing this code
 * @returns boolean indicating if the file is being executed directly
 */
export function executedAs(fileNames: string[]): boolean {
  // Check import.meta.url
  if (import.meta.url) {
    for (const fileName of fileNames) {
      if (import.meta.url.endsWith(`/${fileName}`)) {
        return true;
      }
    }
  }
  
  // Check process.argv[1]
  if (process.argv[1]) {
    for (const fileName of fileNames) {
      if (process.argv[1].endsWith(`/${fileName}`)) {
        return true;
      }
    }
  }
  
  return false;
}
