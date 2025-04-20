#!/usr/bin/env node
/**
 * Command-line interface for ContextAider
 */

import { Command } from "commander";
import { getVersion } from "../index.js";
import { executedAs } from "../utils/execution.js";

export function createContextAiderCli(): Command {
  const program = new Command();

  program
    .name("contextaider")
    .description("ContextAider CLI tool for Context as Code")
    .version(getVersion());

  return program;
}

// Execute CLI when run directly
if (executedAs(["index.js", "contextaider.js"])) {
  const program = createContextAiderCli();
  program.parse(process.argv);
}
