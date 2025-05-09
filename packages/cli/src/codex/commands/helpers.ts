import * as fs from "fs/promises";
import { FileSystemError } from "../../utils/errors";
import { CONFIG } from "../config";
import { createSanitizedFilename } from "../../utils/string";

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
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch (error) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (mkdirError) {
      throw new FileSystemError(
        `Failed to create directory: ${mkdirError instanceof Error ? mkdirError.message : String(mkdirError)}`,
        dirPath,
        mkdirError instanceof Error ? mkdirError : undefined,
      );
    }
  }
}

/**
 * Loads a template file and replaces placeholders with content
 * @param templatePath Path to the template file
 * @param replacements Object with key-value pairs for replacements
 * @param defaultContent Default content if template doesn't exist
 * @returns Processed template content
 */
export async function loadTemplate(
  templatePath: string,
  replacements: Record<string, string>,
  defaultContent: string,
): Promise<string> {
  try {
    await fs.access(templatePath);
    try {
      let content = await fs.readFile(templatePath, "utf8");

      // Replace all placeholders in the template
      Object.entries(replacements).forEach(([key, value]) => {
        // Determine which template type we're using
        const isChangelogTemplate =
          templatePath === CONFIG.paths.templates.changelog;
        const isPromptTemplate = templatePath === CONFIG.paths.templates.prompt;

        if (
          isChangelogTemplate &&
          key === "message" &&
          CONFIG.patterns.templateVariables.changelog.message
        ) {
          content = content.replace(
            CONFIG.patterns.templateVariables.changelog.message,
            value,
          );
        } else if (
          isPromptTemplate &&
          key === "title" &&
          CONFIG.patterns.templateVariables.prompt.title
        ) {
          content = content.replace(
            CONFIG.patterns.templateVariables.prompt.title,
            value,
          );
        } else {
          // Fallback to generic replacement for other cases
          content = content
            .replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"), value)
            .replace(new RegExp(`\\$\\{${key}\\}`, "g"), value);
        }
      });

      return content;
    } catch (readError) {
      throw new FileSystemError(
        `Failed to read template file: ${readError instanceof Error ? readError.message : String(readError)}`,
        templatePath,
        readError instanceof Error ? readError : undefined,
      );
    }
  } catch {
    // Template doesn't exist, return default content
    return defaultContent;
  }
}

/**
 * Creates a file with the given content
 * @param filePath Path where the file should be created
 * @param content Content to write to the file
 * @returns The path to the created file
 */
export async function createFile(
  filePath: string,
  content: string,
): Promise<string> {
  try {
    await fs.writeFile(filePath, content);
    return filePath;
  } catch (error) {
    throw new FileSystemError(
      `Error creating file: ${error instanceof Error ? error.message : String(error)}`,
      filePath,
      error instanceof Error ? error : undefined,
    );
  }
}
