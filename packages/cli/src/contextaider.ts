#!/usr/bin/env node
/**
 * Command-line interface for ContextAider
 */

import { Command } from "commander";
import { getVersion } from "./index.js";

export function createContextAiderCli(): Command {
  const program = new Command();

  program
    .name("contextaider")
    .description("ContextAider CLI tool for Context as Code")
    .version(getVersion());

  return program;
}

// Execute CLI when run directly
if (
  import.meta.url.endsWith("/contextaider.js") ||
  process.argv[1]?.endsWith("/contextaider.js")
) {
  const program = createContextAiderCli();
  program.parse(process.argv);
}
