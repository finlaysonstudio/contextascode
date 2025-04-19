# "Initialize Project Structure" Task 🎟️

<Description>
Initialize the project structure and root package.json for the TypeScript monorepo.
</Description>

<Details>
1. Create the project directory structure:
   - packages/
   - packages/cli/
   - packages/cli/src/

2. Initialize the root package.json with:
   - name: "@contextascode/monorepo"
   - private: true
   - workspaces: ["packages/*"]
   - type: "module"
   - Add scripts according to the ideal project structure

3. Initialize the CLI package.json with:
   - name: "@contextascode/cli"
   - type: "module"
   - Add scripts according to the ideal project structure
</Details>

<Tests>
- Verify the directory structure exists
- Verify package.json files contain the correct configuration
- Verify workspaces are properly configured
</Tests>
