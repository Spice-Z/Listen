module.exports = {
  root: true,
  extends: ['@listen/eslint-config/base'],
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
