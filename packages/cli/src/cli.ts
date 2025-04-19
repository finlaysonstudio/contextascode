#!/usr/bin/env node
/**
 * Command-line interface for Context as Code
 */

import { Command } from 'commander';
import { getVersion } from './index.js';

export function createCli() {
  const program = new Command();

  program
    .name('@contextascode/cli')
    .description('Context as Code CLI tool')
    .version(getVersion());

  return program;
}

// Execute CLI when run directly
if (import.meta.url === import.meta.resolve('./cli.js')) {
  const program = createCli();
  program.parse(process.argv);
}
