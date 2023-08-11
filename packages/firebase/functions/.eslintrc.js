const base = require.resolve('@listen/eslint-config/base');

module.exports = {
  root: true,
  extends: [base],
  env: {
    es2021: true,
    node: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};
