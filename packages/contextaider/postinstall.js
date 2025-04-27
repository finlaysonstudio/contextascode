#!/usr/bin/env node

/**
 * Postinstall script to check aider version compatibility
 * This runs after npm install to verify the installed aider version
 */

import { execSync } from "child_process";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

// Minimum required aider version
const MIN_AIDER_VERSION = "0.18.0";

function checkAiderVersion() {
  console.log("Checking aider compatibility...");

  try {
    // Try to run aider --version
    const output = execSync("aider --version", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    const versionMatch = output.match(/(\d+\.\d+\.\d+)/);

    if (versionMatch) {
      const installedVersion = versionMatch[1];
      console.log(`Found aider version: ${installedVersion}`);

      // Simple version comparison (this is basic and assumes semantic versioning)
      const installedParts = installedVersion.split(".").map(Number);
      const requiredParts = MIN_AIDER_VERSION.split(".").map(Number);

      // Compare major, minor, patch
      for (let i = 0; i < 3; i++) {
        if (installedParts[i] > requiredParts[i]) {
          console.log("✅ Compatible aider version detected");
          return;
        }
        if (installedParts[i] < requiredParts[i]) {
          console.warn(
            `⚠️  Warning: contextaider requires aider version ${MIN_AIDER_VERSION} or higher`,
          );
          console.warn(`   Current version: ${installedVersion}`);
          console.warn("   Please upgrade aider: pip install -U aider-chat");
          return;
        }
      }

      console.log("✅ Compatible aider version detected");
    } else {
      console.warn("⚠️  Warning: Could not determine aider version");
    }
  } catch (error) {
    console.warn("⚠️  Warning: aider not found in PATH");
    console.warn(
      "   contextaider requires aider to be installed and available in your PATH",
    );
    console.warn("   Install aider: pip install aider-chat");
  }
}

// Only run in non-CI environments
if (!process.env.CI) {
  checkAiderVersion();
}
