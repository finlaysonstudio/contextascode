/**
 * Frontmatter detection and handling for exec mode
 */
import fs from "fs/promises";
import path from "path";

/**
 * Represents the structure of frontmatter data
 */
export interface Frontmatter {
  [key: string]: unknown;
}

/**
 * Result of parsing a file with frontmatter
 */
export interface FrontmatterParseResult {
  /** The parsed frontmatter data if present */
  frontmatter: Frontmatter | null;
  /** The content of the file without the frontmatter */
  content: string;
  /** Whether frontmatter was detected in the file */
  hasFrontmatter: boolean;
}

/**
 * Checks if a string content has frontmatter (content between --- markers)
 * @param content The string content to check
 * @returns True if frontmatter is detected, false otherwise
 */
export const hasFrontmatter = (content: string): boolean => {
  const lines = content.split("\n");
  return (
    lines[0]?.trim() === "---" &&
    lines.slice(1).findIndex((line) => line.trim() === "---") >= 0
  );
};

/**
 * Parses frontmatter from a string content
 * @param content The string content to parse
 * @returns An object containing the parsed frontmatter and the content without frontmatter
 */
export const parseFrontmatter = (content: string): FrontmatterParseResult => {
  if (!hasFrontmatter(content)) {
    return {
      frontmatter: null,
      content,
      hasFrontmatter: false,
    };
  }

  const lines = content.split("\n");
  const endMarkerIndex =
    lines.slice(1).findIndex((line) => line.trim() === "---") + 1;

  if (endMarkerIndex <= 0) {
    return {
      frontmatter: null,
      content,
      hasFrontmatter: false,
    };
  }

  const frontmatterLines = lines.slice(1, endMarkerIndex);
  const remainingContent = lines.slice(endMarkerIndex + 1).join("\n");

  // Simple YAML-like parsing (for basic key-value pairs)
  const frontmatter: Frontmatter = {};
  for (const line of frontmatterLines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const colonIndex = trimmedLine.indexOf(":");
    if (colonIndex > 0) {
      const key = trimmedLine.slice(0, colonIndex).trim();
      const value = trimmedLine.slice(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }

  return {
    frontmatter,
    content: remainingContent,
    hasFrontmatter: true,
  };
};

/**
 * Reads a file and parses its frontmatter if present
 * @param filePath Path to the file to read
 * @returns Promise resolving to the parse result
 */
export const readFileWithFrontmatter = async (
  filePath: string,
): Promise<FrontmatterParseResult> => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return parseFrontmatter(content);
  } catch (error) {
    throw new Error(
      `Failed to read file with frontmatter: ${(error as Error).message}`,
    );
  }
};
