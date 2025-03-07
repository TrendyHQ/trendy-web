import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

// Custom rule to flag "http://localhost" with a warning
const noLocalhostUrl = {
  meta: {
    type: "problem",
    docs: {
      description: "disallow http://localhost",
    },
    schema: [], // no options for this rule
  },
  create(context) {
    return {
      Literal(node) {
        if (
          typeof node.value === "string" &&
          node.value.includes("http://localhost")
        ) {
          context.report({
            node,
            message: '"http://localhost" should not be used in Prod.',
            severity: 1, // 1 means "warning"
          });
        }
      },
    };
  },
};

const noLocalhostUrlPlugin = {
  rules: {
    "no-localhost-url": noLocalhostUrl,
  },
};

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended, 
      ...tseslint.configs.recommended,
      pluginReact.configs.flat.recommended
    ],
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "no-localhost-url": noLocalhostUrlPlugin,
      "react": pluginReact,
    },
    settings: {
      react: {
        version: '18.3.1'
      }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-console": "warn",
      "no-localhost-url/no-localhost-url": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { 
        "varsIgnorePattern": "React",
        "argsIgnorePattern": "^_" 
      }],
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off"
    },
  }
);
