/**
 * Flag mappings between contextaider custom flags and aider flags
 */

/**
 * Interface for flag mapping configuration
 */
export interface FlagMapping {
  /** The contextaider flag name */
  contextaiderFlag: string;
  /** The corresponding aider flag name */
  aiderFlag: string;
  /** Whether the flag takes a value */
  takesValue: boolean;
  /** Description of the flag for help text */
  description: string;
}

/**
 * Mapping of contextaider flags to aider flags
 */
export const flagMappings: FlagMapping[] = [
  {
    contextaiderFlag: "--exec",
    aiderFlag: "--message-file",
    takesValue: true,
    description: "Execute mode with specified file",
  },
  // Add more flag mappings as needed
];

/**
 * Translates contextaider flags to aider flags
 * @param args The command line arguments to translate
 * @returns Translated arguments for aider
 */
export function translateFlags(args: string[]): string[] {
  const result: string[] = [];
  let skipNext = false;

  for (let i = 0; i < args.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }

    const arg = args[i];
    const mapping = flagMappings.find(
      (m) =>
        arg === m.contextaiderFlag || arg.startsWith(`${m.contextaiderFlag}=`),
    );

    if (!mapping) {
      // Pass through arguments that don't have mappings
      result.push(arg);
      continue;
    }

    // Handle flags with values
    if (mapping.takesValue) {
      let value: string | undefined;

      // Check if value is provided with equals sign
      if (arg.includes("=")) {
        const [, val] = arg.split("=", 2);
        value = val;
      }
      // Otherwise, take the next argument as the value
      else if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
        value = args[i + 1];
        skipNext = true;
      }

      if (value) {
        result.push(`${mapping.aiderFlag}=${value}`);
      } else {
        result.push(mapping.aiderFlag);
      }
    }
    // Handle boolean flags
    else {
      result.push(mapping.aiderFlag);
    }
  }

  return result;
}

/**
 * Gets all available flag mappings for help text
 * @returns Array of flag mappings
 */
export function getAvailableFlagMappings(): FlagMapping[] {
  return [...flagMappings];
}
