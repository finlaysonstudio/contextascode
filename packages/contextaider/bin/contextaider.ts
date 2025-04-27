#!/usr/bin/env node

import { Command } from "commander";
import { version } from "../package.json";
import { translateFlags } from "../src/flag-mappings";
import { processArgs } from "../src/exec-mode/file-handler";
import { processExecMode } from "../src/exec-mode";
import { spawnAider } from "../src/runner";

// Initialize the CLI program
const program = new Command();

program
  .name("contextaider")
  .description("CLI wrapper for the aider tool with enhanced file handling")
  .version(version)
  .option("--exec <file>", "Execute mode with specified file")
  .option("--debug", "Enable debug output")
  .allowUnknownOption(true) // Allow unknown options to pass through to aider
  .argument("[files...]", "Additional files or message")
  .action(async (files, options, command) => {
    try {
      // Get all arguments including unknown ones
      const allArgs = process.argv.slice(2);

      // Process arguments to identify exec file, additional files, and message
      const { execFile, additionalFiles, message } = await processArgs(allArgs);

      // If exec file is specified either via --exec or as first argument
      if (options.exec || execFile) {
        const targetFile = options.exec || execFile;
        if (!targetFile) {
          console.error("Error: No exec file specified");
          process.exit(1);
        }

        // Run in exec mode
        const result = await processExecMode({
          execFile: targetFile,
          debug: true, // Always enable debug mode
        });

        // Prepare arguments for aider
        let aiderArgs = result.aiderArgs;

        // Add additional files
        if (additionalFiles.length > 0) {
          aiderArgs = [...aiderArgs, ...additionalFiles];
        }

        // Add message if provided
        if (message) {
          aiderArgs = [...aiderArgs, "--message", message];
        }

        // Always log debug info
        console.log("Debug: Spawning aider with args:", aiderArgs);

        // Hand off to aider
        await spawnAider(aiderArgs);
      } else {
        // No exec file, just translate flags and pass through to aider
        const translatedArgs = translateFlags(allArgs);

        // Always log debug info
        console.log(
          "Debug: Spawning aider with translated args:",
          translatedArgs,
        );

        // Hand off to aider
        await spawnAider(translatedArgs);
      }
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : String(error),
      );
      process.exit(1);
    }
  });

// Parse arguments and run
program.parse();
