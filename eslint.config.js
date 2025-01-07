import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

// Custom rule to flag "http://localhost" with a warning
const noLocalhostUrl = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow http://localhost',
    },
    schema: [], // no options for this rule
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string' && node.value.includes('http://localhost')) {
          context.report({
            node,
            message: '"http://localhost" should not be used in Prod.',
            severity: 1,  // 1 means "warning"
          });
        }
      }
    };
  }
}

const noLocalhostUrlPlugin = {
  rules: {
    'no-localhost-url': noLocalhostUrl,
  },
};

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'no-localhost-url': noLocalhostUrlPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-console': 'warn',
      'no-localhost-url/no-localhost-url': 'warn', // Apply the rule
    },
  },
)
