# "Add Postinstall Version Check" Task 🎟️

<Description>
Implement a postinstall script that checks for aider version compatibility and provides warnings or instructions if the installed version is incompatible.
</Description>

<Details>
Create a postinstall version check mechanism:
- Implement a postinstall.sh script to run after package installation
- Add version detection for the installed aider
- Implement compatibility checking logic
- Create user-friendly warning messages for incompatible versions
- Provide instructions for upgrading or downgrading if needed
- Make sure the script works across different environments (Linux, macOS, Windows)
- Add proper error handling for the version check process

The postinstall script should provide clear guidance to users when an incompatible version of aider is detected, ensuring they can easily resolve compatibility issues.
</Details>

<Files>
- packages/contextaider/postinstall.sh
- packages/contextaider/package.json (postinstall script entry)
</Files>

<Tests>
- Test the postinstall script with various aider versions
- Verify warning messages are displayed for incompatible versions
- Test the script on different operating systems
- Ensure proper exit codes are returned
- Verify the script doesn't fail the installation process
</Tests>
