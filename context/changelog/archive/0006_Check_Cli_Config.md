Check the bin package config in cli package

<Files>
packages/cli/src/cli.ts
packages/cli/src/index.ts
packages/cli/package.json
packages/cli/vite.config.ts
</Files>

```json
"bin": {
  "contextascode": "dist/cli.js"
},
```

After build, there is no cli.js.
