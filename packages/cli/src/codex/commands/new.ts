/* eslint-disable no-console */
import { Command } from "commander";
import { input } from "@inquirer/prompts";
import path from "path";
import { ValidationError, UserCancellationError } from "../../utils/errors";
import {
  createSanitizedFilename,
  generateTimestamp,
  ensureDirectoryExists,
  loadTemplate,
  createFile,
} from "./helpers";
import { CONFIG } from "../config";

export type NewCommandType = "change" | "prompt";

export async function handleNewCommand(
  type: NewCommandType,
  description?: string,
): Promise<void> {
  // Validate type
  if (type !== "change" && type !== "prompt") {
    throw new ValidationError(
      `Type must be 'change' or 'prompt', received '${type}'`,
    );
  }

  // If description is not provided, prompt for it
  let finalDescription = description;
  if (!finalDescription) {
    try {
      finalDescription = await input({
        message: "Enter a description for the change:",
        validate: (value) =>
          value.trim().length > 0 ? true : "Description cannot be empty",
      });
    } catch (error) {
      throw new UserCancellationError();
    }
  }

  // Create sanitized filename from description
  const sanitizedDescription = createSanitizedFilename(finalDescription);

  // Handle the appropriate file type
  if (type === "change") {
    await handleChangeFile(sanitizedDescription, finalDescription);
  } else if (type === "prompt") {
    await handlePromptFile(sanitizedDescription, finalDescription);
  }
}

/**
 * Handles the creation of a change file
 */
async function handleChangeFile(
  sanitizedDescription: string,
  finalDescription: string,
): Promise<void> {
  const timestamp = generateTimestamp();
  const filename = `${timestamp}_${sanitizedDescription}.md`;
  const changelogDir = CONFIG.paths.changelogDir;
  const filePath = path.join(changelogDir, filename);
  const templatePath = CONFIG.paths.templates.changelog;

  // Default content if template doesn't exist
  const defaultContent = `# ${finalDescription}\n\n`;

  // Load template with replacements
  const content = await loadTemplate(
    templatePath,
    { message: finalDescription },
    defaultContent,
  );

  // Ensure directory exists
  await ensureDirectoryExists(changelogDir);

  // Create the file
  await createFile(filePath, content);
  console.log(`Created changelog file: ${filePath}`);
}

/**
 * Handles the creation of a prompt file
 */
async function handlePromptFile(
  sanitizedDescription: string,
  finalDescription: string,
): Promise<void> {
  const filename = `${sanitizedDescription}.md`;
  const promptsDir = CONFIG.paths.promptsDir;
  const filePath = path.join(promptsDir, filename);
  const templatePath = CONFIG.paths.templates.prompt;

  // Default content if template doesn't exist
  const defaultContent = `# ${finalDescription}\n\n`;

  // Load template with replacements
  const content = await loadTemplate(
    templatePath,
    { title: finalDescription },
    defaultContent,
  );

  // Ensure directory exists
  await ensureDirectoryExists(promptsDir);

  // Create the file
  await createFile(filePath, content);
  console.log(`Created prompt file: ${filePath}`);
}

import { handleCliError } from "../../index";

export function newCommand(program: Command): void {
  program
    .command("new")
    .description("Create a new item (change or prompt)")
    .argument("<type>", "Type of item to create (change or prompt)")
    .argument("[description]", "Description of the item")
    .action(async (type: NewCommandType, description?: string) => {
      try {
        await handleNewCommand(type, description);
      } catch (error) {
        handleCliError(error);
      }
    });
}
