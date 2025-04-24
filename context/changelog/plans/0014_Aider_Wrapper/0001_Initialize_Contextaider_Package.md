# "Initialize ContextAider Package" Task 🎟️

<Description>
Set up the initial package structure for the ContextAider tool in the monorepo, following ESM module patterns and TypeScript configuration.
</Description>

<Details>
Create the package directory structure in `/packages/contextaider` with necessary configuration files:
- Set up package.json with proper dependencies and scripts
- Configure TypeScript (tsconfig.json)
- Set up build configuration (vite.config.ts)
- Create test configuration (vitest.config.ts)
- Initialize basic directory structure (bin, src, tests)
- Create README.md with basic project information

This task lays the foundation for the entire ContextAider project. All files should be configured for ESM modules with Node.js 18+ compatibility.
</Details>

<Files>
- packages/contextaider/package.json
- packages/contextaider/tsconfig.json
- packages/contextaider/vite.config.ts
- packages/contextaider/vitest.config.ts
- packages/contextaider/README.md
- packages/contextaider/bin/contextaider.ts
- packages/contextaider/src/index.ts
</Files>

<Tests>
- Verify package directory structure exists
- Run `npm run build` in the package directory and ensure it builds without errors
- Check that TypeScript compilation works with `npm run typecheck`
- Verify the package.json has correct bin entry for contextaider
</Tests>
