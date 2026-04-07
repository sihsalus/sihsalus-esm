const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const reactHooks = require("eslint-plugin-react-hooks");
const importPlugin = require("eslint-plugin-import");
const jestDom = require("eslint-plugin-jest-dom");
const testingLibrary = require("eslint-plugin-testing-library");
const playwright = require("eslint-plugin-playwright");

module.exports = [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.rspack/**",
      "**/.cache/**",
      "**/.turbo/**",
      "**/coverage/**",
      "packages/apps/esm-stock-management-app/**/*.d.ts",
      "packages/apps/esm-patient-imaging-app/**/*.d.tsx"
    ]
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["packages/apps/**/*.{ts,tsx}"],

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: "module"
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react-hooks": reactHooks,
      import: importPlugin
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-empty-pattern": "off",
      "no-unsafe-optional-chaining": "off",
      "no-useless-escape": "off",
      "prefer-const": "off",

      "react-hooks/exhaustive-deps": "warn",

      "import/order": "off",

      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  },

  {
    files: ["packages/apps/**/*.{test,spec}.{ts,tsx}"],
    plugins: {
      "jest-dom": jestDom,
      "testing-library": testingLibrary,
      "react-hooks": reactHooks
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "@typescript-eslint/no-require-imports": "off",
      "no-console": "off"
    }
  },

  {
    files: ["packages/apps/**/e2e/**/*.{ts,tsx}", "packages/apps/**/*e2e*.{ts,tsx}"],
    plugins: {
      playwright
    },
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "testing-library/prefer-screen-queries": "off",
      "no-console": "off"
    }
  },

  {
    files: ["packages/libs/**/*.ts"],

    languageOptions: {
      parser: tseslint.parser,
      sourceType: "module"
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error"]
    }
  },

  // App-level overrides migrated from deleted .eslintrc files
  {
    files: ["packages/apps/esm-ward-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-unsafe-optional-chaining": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-console": "off"
    }
  },

  {
    files: ["packages/apps/esm-primary-navigation-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-console": "off"
    }
  },

  {
    files: ["packages/apps/esm-maternal-and-child-health/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-console": "off"
    }
  },

  {
    files: ["packages/apps/esm-patient-registration-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-console": "off"
    }
  },

  {
    files: ["packages/apps/esm-patient-search-app/**/*.{ts,tsx}", "packages/apps/esm-patient-list-management-app/**/*.{ts,tsx}", "packages/apps/esm-patient-tests-app/**/*.{ts,tsx}", "packages/apps/esm-patient-forms-app/**/*.{ts,tsx}", "packages/apps/esm-patient-orders-app/**/*.{ts,tsx}", "packages/apps/esm-vacunacion-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-console": "off",
      "no-unsafe-optional-chaining": "off"
    }
  },

  {
    files: ["packages/apps/esm-patient-chart-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-prototype-builtins": "off",
      "prefer-const": "off",
      "no-useless-escape": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-console": "off"
    }
  },

  {
    files: ["packages/apps/esm-consulta-externa-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-console": "off"
    }
  },

  {
    files: ["packages/apps/esm-dispensing-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["error", { allow: ["warn", "error"] }]
    }
  },

  {
    files: ["packages/apps/esm-form-builder-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-optional-chaining": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-prototype-builtins": "off",
      "no-useless-escape": "off",
      "prefer-const": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["error", { allow: ["warn", "error"] }]
    }
  },

  {
    files: ["packages/apps/esm-service-queues-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-optional-chaining": "off",
      "import/order": "off",
      "no-prototype-builtins": "off",
      "prefer-const": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-console": "off"
    }
  },

  {
    files: ["packages/apps/esm-cohort-builder-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["error", { allow: ["warn", "error"] }]
    }
  },

  {
    files: ["packages/apps/esm-laboratory-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["error", { allow: ["warn", "error"] }]
    }
  },

  {
    files: ["packages/apps/esm-user-onboarding-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-optional-chaining": "off",
      "import/order": "off",
      "no-prototype-builtins": "off",
      "no-useless-escape": "off",
      "prefer-const": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["error", { allow: ["warn", "error"] }]
    }
  },

  {
    // form-entry wraps an external form engine that requires dynamic typing
    files: ["packages/apps/esm-form-entry-react-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["error", { allow: ["warn", "error"] }]
    }
  },

  {
    files: ["packages/apps/esm-billing-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["error", { allow: ["warn", "error"] }]
    }
  },

  {
    files: ["packages/apps/esm-patient-imaging-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unsafe-optional-chaining": "off",
      "import/order": "off",
      "no-prototype-builtins": "off",
      "no-useless-escape": "off",
      "prefer-const": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["error", { allow: ["warn", "error"] }]
    }
  },

  {
    files: ["packages/apps/esm-odontogram-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-case-declarations": "off",
      "no-empty": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-console": "off"
    }
  },

  {
    files: ["packages/apps/esm-stock-management-app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unsafe-optional-chaining": "off",
      "@typescript-eslint/no-require-imports": "off",
      "import/order": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": "off"
    }
  },

  {
    files: ["packages/apps/**/e2e/**/*.{ts,tsx}", "packages/apps/**/*e2e*.{ts,tsx}"],
    rules: {
      "no-console": "off"
    }
  },

  {
    files: ["**/*.{js,mjs}"],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "readonly",
        console: "readonly",
        process: "readonly"
      }
    },

    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-console": "off"
    }
  }
];