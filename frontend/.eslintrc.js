module.exports = {
  env: {
    'amd': true,
    'browser': true,
    es6: true,
    jest: true,
    'node': true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/eslint-recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/quotes': ['error', 'single', {
      'allowTemplateLiterals': true
    }],
    indent: ['error', 2, { SwitchCase: 1 }],
    // 'linebreak-style': ['error', 'unix'],
    'no-unused-vars': 'off',
    // 'no-shadow': ['error', { hoist: 'all' }],
    'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: false }],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    semi: ['error', 'always'],
    //'sort-keys': ['warn', 'asc', { caseSensitive: true, natural: true, minKeys: 2 }]
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
    react: 'detect',
  },
};