// @ts-check
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import astroPlugin from "eslint-plugin-astro";
import globals from "globals";

export default /** @type {any} */ ([
  js.configs.recommended,
  // Astro files
  ...astroPlugin.configs.recommended,
  // TypeScript files (src — Node + browser globals for Astro/Vite env)
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Disable base rule — TypeScript plugin handles unused vars
      "no-unused-vars": "off",
      // Allow unused function-type parameter names (common in callback signatures)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // No default React import — named imports only
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react"],
              importNames: ["default"],
              message:
                "Use named imports from 'react' only. No default React import.",
            },
          ],
        },
      ],
      // No useMemo or useCallback
      "no-restricted-properties": [
        "error",
        {
          object: "React",
          property: "useMemo",
          message: "useMemo is forbidden. Remove it.",
        },
        {
          object: "React",
          property: "useCallback",
          message: "useCallback is forbidden. Remove it.",
        },
      ],
    },
  },
  // Playwright test files — Node + browser globals (tests run in Node but evaluate() runs in browser)
  {
    files: ["tests/**/*.ts", "playwright.config.ts"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Allow unused vars in test files (common pattern with reassignment in expect blocks)
      "no-unused-vars": "off",
    },
  },
  // Declaration files — allow interface augmentation patterns
  {
    files: ["**/*.d.ts"],
    rules: {
      "no-unused-vars": "off",
    },
  },
  // Block arbitrary Tailwind values in class/className — custom rule via no-restricted-syntax
  {
    files: ["**/*.astro", "**/*.tsx", "**/*.ts", "**/*.jsx", "**/*.js"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'JSXAttribute[name.name="className"] Literal[value=/(?:text|bg|p|m|w|h|gap|px|py|mx|my|pt|pb|pl|pr|mt|mb|ml|mr)-\\[/]',
          message:
            "Arbitrary Tailwind values are forbidden. Add a token to @theme in global.css instead.",
        },
        {
          selector:
            'Property[key.name="class"] Literal[value=/(?:text|bg|p|m|w|h|gap|px|py|mx|my|pt|pb|pl|pr|mt|mb|ml|mr)-\\[/]',
          message:
            "Arbitrary Tailwind values are forbidden. Add a token to @theme in global.css instead.",
        },
      ],
    },
  },
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**"],
  },
]);
