# "Implement Exec Mode With Frontmatter" Task 🎟️

<Description>
Implement the exec mode functionality that detects and processes YAML frontmatter in markdown files, enabling enhanced file processing before passing to aider.
</Description>

<Details>
Create modules to handle exec mode operation:
- Implement YAML frontmatter detection between `---` markers
- Parse frontmatter content from files
- Create utilities to validate the frontmatter structure
- Implement frontmatter extraction logic
- Create diagnostic output when frontmatter is detected
- Set up structure for passing processed files to aider

The exec mode should detect when a file has frontmatter and handle it appropriately. It should print "exec frontmatter detected" when frontmatter is found and prepare the file to be passed to aider as a message file.
</Details>

<Files>
- packages/contextaider/src/exec-mode/index.ts
- packages/contextaider/src/exec-mode/index.spec.ts
- packages/contextaider/src/exec-mode/frontmatter.ts
- packages/contextaider/src/exec-mode/frontmatter.spec.ts
</Files>

<Tests>
- Test frontmatter detection with various file formats
- Verify frontmatter extraction functions correctly
- Test edge cases like malformed frontmatter
- Ensure proper diagnostic output is generated
- Verify frontmatter content is appropriately processed
</Tests>
