# Repomix — Quick-Reference for Code-Generation Agents

## 1 · CLI Essentials

| Task                | Bash command (defaults in *italics*)                                             |
|---------------------|----------------------------------------------------------------------------------|
| Pack whole repo     | `repomix`                                                                        |
| Pack a sub-folder   | `repomix path/to/dir`                                                            |
| Add files by glob   | `repomix --include "src/**/*.ts,**/*.md"`                                        |
| Ignore patterns     | `repomix --ignore "**/*.log,tmp/"`                                               |
| Remote repo         | `repomix --remote user/repo [--remote-branch main]`                              |
| Compress output     | `repomix --compress` (works with `--remote`)                                     |
| Style formats       | `--style xml` *⟨default⟩*, `--style markdown`, `--style plain`                    |
| Misc. switches      | `--remove-comments`, `--output-show-line-numbers`, `--copy`, `--no-security-check`, `--instruction-file-path`, `--header-text` |

---

## 2 · Configuration File (`repomix.config.json`)

```jsonc
{
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",             // xml | markdown | plain
    "parsableStyle": true,      // add <file> tags etc.
    "compress": false,          // token-saving structural extraction
    "headerText": "Custom header text",
    "instructionFilePath": "repomix-instruction.md", // included in the output file
    "fileSummary": true,        // per-file TL;DR
    "directoryStructure": true, // prepend tree view
    "removeComments": false,
    "removeEmptyLines": false,
    "topFilesLength": 5,        // longest files summarised first
    "showLineNumbers": false,
    "copyToClipboard": false,
    "includeEmptyDirectories": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100
    }
  },
  "include": ["**/*"],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": ["tmp/", "*.log"]
  },
  "security": { "enableSecurityCheck": true }
}