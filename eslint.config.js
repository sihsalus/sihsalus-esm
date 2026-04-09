const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const reactHooks = require("eslint-plugin-react-hooks");
const importPlugin = require("eslint-plugin-import");
const testingLibrary = require("eslint-plugin-testing-library");
const jestDom = require("eslint-plugin-jest-dom");
const playwright = require("eslint-plugin-playwright");

module.exports = [
  // 🔹 Ignorados globales
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.rspack/**",
      "**/.cache/**",
      "**/.turbo/**",
      "**/coverage/**"
    ]
  },

  // 🔹 Base JS
  js.configs.recommended,

  // 🔹 TypeScript (con type-checking 🔥)
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true // 🔥 clave para type-aware linting
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      import: importPlugin
    },
    rules: {
      // 🧠 TypeScript
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": "warn",

      // ⚛️ React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // 📦 Temporalmente desactivado por incompatibilidad del plugin con ESLint 10
      "import/order": "off",

      // 🧹 Buenas prácticas
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn"
    }
  },
    {
      files: ["**/*.{js,cjs,mjs}"],
      ...tseslint.configs.disableTypeChecked
    },

  // 🔹 Apps (más flexibles que libs)
  {
    files: ["packages/apps/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },

  // 🔹 Libs (más estrictas 🔥)
  {
    files: ["packages/libs/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn"
    }
  },

  // 🔹 Tests
  {
    files: ["**/*.{test,spec}.{ts,tsx}"],
    plugins: {
      "testing-library": testingLibrary,
      "jest-dom": jestDom
    },
    ...testingLibrary.configs["flat/react"],
    ...jestDom.configs["flat/recommended"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  },

  // 🔹 E2E (Playwright)
  {
    files: ["**/e2e/**/*.{ts,tsx}", "**/*e2e*.{ts,tsx}"],
    plugins: {
      playwright
    },
    rules: {
      ...playwright.configs.recommended.rules,
      "no-console": "off"
    }
  },

  // 🔹 JS puro (config files, scripts, etc.)
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        process: "readonly"
      }
    },
    rules: {
      "no-console": "off"
    }
  }
];