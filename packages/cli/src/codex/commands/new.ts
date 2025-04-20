/* eslint-disable no-console */
import { Command } from "commander";
import { input } from "@inquirer/prompts";
import fs from "fs";
import path from "path";

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

  // Only implement 'change' for now
  if (type === "prompt") {
    console.log("The 'prompt' type is not yet implemented.");
    process.exit(0);
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

  // Create filename from description
  const sanitizedDescription = finalDescription
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove non-alphanumeric chars (except spaces and dashes)
    .replace(/\s+/g, "_"); // Replace spaces with underscores

  // Create timestamp
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "_",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    "_",
    String(now.getSeconds()).padStart(2, "0"),
    String(now.getMilliseconds()).padStart(3, "0"),
  ].join("");

  // Create filename
  const filename = `${timestamp}_${sanitizedDescription}.md`;
  const changelogDir = "./context/changelog";
  const filePath = path.join(changelogDir, filename);

  // Check if template exists
  const templatePath = "./context/prompts/contextascode/templates/changelog.md";
  let content = `# ${finalDescription}\n\n`;

  try {
    if (fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, "utf8");
      content = template.replace(/\{\{\s*message\s*\}\}/g, finalDescription);
    }

    // Ensure the changelog directory exists
    if (!fs.existsSync(changelogDir)) {
      fs.mkdirSync(changelogDir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(filePath, content);
    console.log(`Created changelog file: ${filePath}`);
  } catch (error) {
    console.error(`Error creating changelog file: ${error}`);
    process.exit(1);
  }
}

export function newCommand(program: Command): void {
  program
    .command("new <type>")
    .description("Create a new item (change or prompt)")
    .argument("<type>", "Type of item to create (change or prompt)")
    .argument("[description]", "Description of the item")
    .action(async (type: NewCommandType, description?: string) => {
      await handleNewCommand(type, description);
    });
}
