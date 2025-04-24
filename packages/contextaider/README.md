# ContextAider

A TypeScript-based CLI wrapper for the aider tool that preprocesses custom flags and seamlessly hands off to the original aider, preserving its interactive UI.

## Features

- Enhanced file handling and message passing capabilities
- YAML frontmatter detection for exec mode
- Smart CLI flag parsing and translation
- Seamless process handoff

## Installation

```bash
npm install -g contextaider
```

## Usage

```bash
# Basic usage
contextaider [files...]

# Execute mode with a file containing instructions
contextaider --exec file.md [additional files...]

# Help
contextaider --help
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Typecheck
npm run typecheck
```

## License

MIT
