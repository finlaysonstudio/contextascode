# ContextAider

A CLI wrapper for the [aider](https://github.com/paul-gauthier/aider) tool with enhanced file handling and execution capabilities.

## Features

- **Exec Mode**: Execute files with YAML frontmatter as aider commands
- **Enhanced File Handling**: Smart detection and processing of input files
- **Flag Translation**: Translate contextaider-specific flags to aider flags
- **Process Handoff**: Seamlessly hand off to aider while preserving TTY

## Installation

```bash
npm install -g contextaider
```

Make sure you have [aider](https://github.com/paul-gauthier/aider) installed:

```bash
pip install aider-chat
```

## Usage

```bash
# Basic usage (passes arguments directly to aider)
contextaider file1.js file2.js

# Execute a file with frontmatter
contextaider --exec task.md

# Use contextaider-specific flags
contextaider --some-flag value

# Provide a message
contextaider file.js "Fix the bug in this file"
```

## Exec Mode

Exec mode allows you to execute files with YAML frontmatter as aider commands:

```markdown
---
model: gpt-4
files:
  - src/index.js
  - src/utils.js
---

# Task: Fix the bug in the utils.js file

The function `parseData` is not handling null values correctly.
Please fix it to handle null values gracefully.
```

Run with:

```bash
contextaider --exec task.md
```

## Development

```bash
# Clone the repository
git clone https://github.com/your-org/contextaider.git

# Install dependencies
cd contextaider
npm install

# Build
npm run build

# Test
npm run test

# Development mode (watch for changes)
npm run dev
```

## License

MIT
