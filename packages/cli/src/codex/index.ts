#!/usr/bin/env node
/**
 * Command-line interface for Codex
 */

import { Command } from "commander";
import { getVersion } from "../index.js";
import { newCommand } from "./commands/new.js";
import { executedAs } from "../utils/execution.js";

export function createCodexCli(): Command {
  const program = new Command();

  program
    .name("codex")
    .description("Codex CLI tool for Context as Code")
    .version(getVersion());

  // Add commands
  newCommand(program);

  return program;
}

// Execute CLI when run directly
if (executedAs(["index.js", "codex.js"])) {
  const program = createCodexCli();
  program.parse(process.argv);
}
