# "Context as Code" Repository Guide

Context as Code considers change requests, conventions, prompt libraries, and tooling for code generation agent workflows

## 💿 Technology Stack

* ESLint + Prettier
* Jaypie project opinions and tooling
* NPM with Workspaces ("monorepo")
* TypeScript
* Vite
* Vitest

## 🗂️ Organization

* ./context/ - Context library
* ./packages/ - Workspaces
* ./package.json - NPM monorepo management layer

## 🗣️ Prompts and Context

* ./context/changelog/*.md - change requests
* ./context/prompts/*.md - prompt library
* ./context/prompts/jaypie/*.md - Jaypie guides

## 📙 Conventions

### Context as Code 🩶

### Finlayson Studio Style 🏞️

#### Technology

* Jaypie project opinions and tooling
* Vitest .spec sibling to implementation

#### Writing

* Crisp, punchy answers
* Direct and to the point
* Avoid flowery language
* Emoji at start of level-two headings, optional at end-of-line on level one or three; multiple allowed at end of level one
* Focus on clarity using terse and pithy language
* Avoid the second-person pronoun; instructions may imply the reader without using “you”
* Reference abstract third persons when a party must be mentioned
* Place each sentence on its own line to enhance version control diffs
