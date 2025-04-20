#!/usr/bin/env node
/**
 * Command-line interface for Codex
 */

import { Command } from "commander";
import { getVersion } from "../index.js";

export function createCodexCli(): Command {
  const program = new Command();

  program
    .name("codex")
    .description("Codex CLI tool for Context as Code")
    .version(getVersion());

  return program;
}

// Execute CLI when run directly
if (
  import.meta.url.endsWith("/index.js") ||
  process.argv[1]?.endsWith("/index.js")
) {
  const program = createCodexCli();
  program.parse(process.argv);
}
