// Main entry point for the contextaider package
export const version = "0.0.1";

export { translateFlags, getAvailableFlagMappings } from "./flag-mappings";
export { spawnAider } from "./runner";
export { processExecMode } from "./exec-mode";

/**
 * Main entry point for the contextaider library
 */
export function runContextAider(): void {
  console.log(
    "ContextAider initialization - use the CLI or import specific functions",
  );
}
