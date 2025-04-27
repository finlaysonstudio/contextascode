# Context as Code Manifesto

In the era of code generators, we embrace these principles:

We should curate prompt libraries in versioned code repositories.
We should preserve generation contexts with outputs to honor provenance.
We should make context conventions open, documented, and improvable.
We should design context modules to be small, reusable, and composable.
We should enable transparent evolution of contexts through standard workflows.
We may adopt any tools or implementations that suit our projects.
We acknowledge that external forces, like markets, will determine adoption and success.

## ContextAider

ContextAider is a CLI wrapper for the aider tool with enhanced file handling capabilities. It provides:

- Exec mode with frontmatter detection
- Smart file and message handling
- CLI flag translation
- Process handoff with TTY preservation

### Requirements

- Node.js 18 or higher
- Aider 0.18.0 or higher

A compatibility check runs during installation to verify your aider version.

Generated with 🩶 under the MIT License.
