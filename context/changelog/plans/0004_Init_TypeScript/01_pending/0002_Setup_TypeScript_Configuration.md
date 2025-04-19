# "Setup TypeScript Configuration" Task 🎟️

<Description>
Set up TypeScript configuration for the monorepo and CLI package.
</Description>

<Details>
1. Create root tsconfig.json with:
   - Modern TypeScript settings (ES2020+)
   - ESM modules
   - Strict type checking
   - Appropriate include/exclude paths

2. Create package-specific tsconfig.json in packages/cli that:
   - Extends the root configuration
   - Specifies appropriate outDir and rootDir
   - Includes only the package's source files
</Details>

<Tests>
- Verify tsconfig.json exists in the root and CLI package
- Verify the CLI package's tsconfig.json extends the root configuration
- Run `tsc --noEmit` to verify the TypeScript configuration is valid
</Tests>
