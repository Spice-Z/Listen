const base = require.resolve('@listen/eslint-config/base');

module.exports = {
  root: true,
  extends: [base, 'plugin:react-hooks/recommended'],
  plugins: ['react', 'react-native', 'unused-imports'],
  env: {
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};
