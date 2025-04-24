# "Implement File and Message Handling" Task 🎟️

<Description>
Create the file handling and message processing logic that manages how files are validated, processed, and prepared for aider, including smart detection of message strings versus file paths.
</Description>

<Details>
Implement file and message handling functionality:
- Create file-handler module for checking file existence and path validation
- Implement logic to determine if arguments are files or messages
- Process multiple files support: `contextaider --exec 1.md 2.md`
- Handle last non-flag argument as message if not a filepath
- Implement file path normalization and validation
- Create error handling for file not found scenarios
- Set up file content reading utilities

The implementation should correctly differentiate between files and message strings, handle multiple files, and properly prepare them for sending to aider.
</Details>

<Files>
- packages/contextaider/src/exec-mode/file-handler.ts
- packages/contextaider/src/exec-mode/file-handler.spec.ts
- packages/contextaider/src/handler.ts
- packages/contextaider/src/handler.spec.ts
</Files>

<Tests>
- Test file existence validation
- Verify correct handling of multiple files
- Test message vs. file path detection
- Verify path normalization works correctly
- Test error handling for non-existent files
- Ensure correct behavior when mixing files and message arguments
</Tests>
