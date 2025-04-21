/* eslint-disable no-console */
import { Command } from "commander";
import { input } from "@inquirer/prompts";
import path from "path";
import {
  createSanitizedFilename,
  generateTimestamp,
  ensureDirectoryExists,
  loadTemplate,
  createFile,
} from "./helpers";

type NewCommandType = "change" | "prompt";

export async function handleNewCommand(
  type: NewCommandType,
  description?: string,
): Promise<void> {
  // Validate type
  if (type !== "change" && type !== "prompt") {
    console.error(
      `Error: Type must be 'change' or 'prompt', received '${type}'`,
    );
    process.exit(1);
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
      console.error("Operation cancelled");
      process.exit(1);
    }
  }

  // Create sanitized filename from description
  const sanitizedDescription = createSanitizedFilename(finalDescription);
  
  try {
    if (type === "change") {
      await handleChangeFile(sanitizedDescription, finalDescription);
    } else if (type === "prompt") {
      await handlePromptFile(sanitizedDescription, finalDescription);
    }
  } catch (error) {
    console.error(`Error creating ${type} file: ${error}`);
    process.exit(1);
  }
}

/**
 * Handles the creation of a change file
 */
async function handleChangeFile(
  sanitizedDescription: string,
  finalDescription: string
): Promise<void> {
  const timestamp = generateTimestamp();
  const filename = `${timestamp}_${sanitizedDescription}.md`;
  const changelogDir = "./context/changelog";
  const filePath = path.join(changelogDir, filename);
  const templatePath = "./context/prompts/contextascode/templates/changelog.md";
  
  // Default content if template doesn't exist
  const defaultContent = `# ${finalDescription}\n\n`;
  
  // Load template with replacements
  const content = loadTemplate(
    templatePath,
    { message: finalDescription },
    defaultContent
  );
  
  // Ensure directory exists
  ensureDirectoryExists(changelogDir);
  
  // Create the file
  createFile(filePath, content);
  console.log(`Created changelog file: ${filePath}`);
}

/**
 * Handles the creation of a prompt file
 */
async function handlePromptFile(
  sanitizedDescription: string,
  finalDescription: string
): Promise<void> {
  const filename = `${sanitizedDescription}.md`;
  const promptsDir = "./context/prompts";
  const filePath = path.join(promptsDir, filename);
  const templatePath = "./context/prompts/contextascode/templates/prompt.md";
  
  // Default content if template doesn't exist
  const defaultContent = `# ${finalDescription}\n\n`;
  
  // Load template with replacements
  const content = loadTemplate(
    templatePath,
    { title: finalDescription },
    defaultContent
  );
  
  // Ensure directory exists
  ensureDirectoryExists(promptsDir);
  
  // Create the file
  createFile(filePath, content);
  console.log(`Created prompt file: ${filePath}`);
}

export function newCommand(program: Command): void {
  program
    .command("new")
    .description("Create a new item (change or prompt)")
    .argument("<type>", "Type of item to create (change or prompt)")
    .argument("[description]", "Description of the item")
    .action(async (type: NewCommandType, description?: string) => {
      await handleNewCommand(type, description);
    });
}
