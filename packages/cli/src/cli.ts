/**
 * Common CLI functionality for Context as Code
 * 
 * This file contains shared functionality used by both
 * the codex and contextaider CLI tools.
 */

import { Command } from "commander";
import { getVersion } from "./index.js";

export function createCli(name: string, description: string): Command {
  const program = new Command();

  program
    .name(name)
    .description(description)
    .version(getVersion());

  return program;
}
