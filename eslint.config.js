import { includeIgnoreFile } from "@eslint/compat"
import pluginVue from "eslint-plugin-vue"
import vueTsEslintConfig from "@vue/eslint-config-typescript"
import prettierConfig from "@vue/eslint-config-prettier"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")

export default [
  // Include .gitignore patterns
  includeIgnoreFile(gitignorePath),

  // Base config for all files
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // Add any custom global rules here
      "no-console": "warn",
      "no-debugger": "warn",
    },
  },

  // Vue files
  ...pluginVue.configs["flat/recommended"],

  // TypeScript files
  ...vueTsEslintConfig(),

  // Prettier (must be last to override other formatting rules)
  prettierConfig,

  // Project-specific overrides
  {
    files: ["**/*.vue"],
    rules: {
      // Vue-specific rules
      "vue/multi-word-component-names": "off", // Allow single word component names
      "vue/no-unused-vars": "error",
    },
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },

  // Ignore specific files/directories
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".git/**",
      "*.log",
      ".env*",
      "**/*.tsbuildinfo",
    ],
  },
]
