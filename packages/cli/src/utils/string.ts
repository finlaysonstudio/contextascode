/**
 * String utility functions
 */

/**
 * Creates a sanitized filename from a description
 * @param description The description to sanitize
 * @returns A sanitized string suitable for filenames
 */
export function createSanitizedFilename(description: string): string {
  return description
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove non-alphanumeric chars (except spaces and dashes)
    .replace(/\s+/g, "_"); // Replace spaces with underscores
}
