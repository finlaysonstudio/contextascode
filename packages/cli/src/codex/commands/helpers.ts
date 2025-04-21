import fs from "fs";
import path from "path";

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

/**
 * Generates a timestamp string in the format YYYYMMDD_HHMMSS_SSS
 * @returns Formatted timestamp string
 */
export function generateTimestamp(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "_",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
    "_",
    String(now.getMilliseconds()).padStart(3, "0"),
  ].join("");
}

/**
 * Ensures a directory exists, creating it if necessary
 * @param dirPath Path to the directory
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Loads a template file and replaces placeholders with content
 * @param templatePath Path to the template file
 * @param replacements Object with key-value pairs for replacements
 * @param defaultContent Default content if template doesn't exist
 * @returns Processed template content
 */
export function loadTemplate(
  templatePath: string,
  replacements: Record<string, string>,
  defaultContent: string
): string {
  try {
    if (fs.existsSync(templatePath)) {
      let content = fs.readFileSync(templatePath, "utf8");
      
      // Replace all placeholders in the template
      Object.entries(replacements).forEach(([key, value]) => {
        // Support both {{key}} and ${key} formats
        content = content
          .replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"), value)
          .replace(new RegExp(`\\$\\{${key}\\}`, "g"), value);
      });
      
      return content;
    }
  } catch (error) {
    // Fall back to default content if there's an error
  }
  
  return defaultContent;
}

/**
 * Creates a file with the given content
 * @param filePath Path where the file should be created
 * @param content Content to write to the file
 * @returns The path to the created file
 */
export function createFile(filePath: string, content: string): string {
  try {
    fs.writeFileSync(filePath, content);
    return filePath;
  } catch (error) {
    throw new Error(`Error creating file ${filePath}: ${error}`);
  }
}
