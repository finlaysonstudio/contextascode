import jaypie from "@jaypie/eslint";
import { configs as tseslintConfigs } from "typescript-eslint";

export default [
  ...jaypie,
  ...tseslintConfigs.recommended,
  {
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
