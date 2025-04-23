/**
 * Configuration for the Codex CLI
 */
export const CONFIG = {
  paths: {
    changelogDir: "./context/changelog",
    promptsDir: "./context/prompts",
    templates: {
      changelog: "./context/prompts/contextascode/templates/changelog.md",
      prompt: "./context/prompts/contextascode/templates/prompt.md",
    },
  },
  patterns: {
    templateVariables: {
      changelog: {
        message: /\{\{\s*message\s*\}\}/g,
      },
      prompt: {
        title: /\$\{title\}/g,
      },
    },
  },
};
