module.exports = {
  root: true,
  extends: ['@listen/eslint-config/base'],
  ignorePatterns: ["node_modules", "dist",".eslintrc.cjs"],
  env: {
    es2021: true,
    node: true,
  },
  parserOptions: {
    project: 'tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        "prefer": "type-imports"
      }
    ]
  }
};
