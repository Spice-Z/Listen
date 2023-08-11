/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ["@typescript-eslint", "import", "unused-imports", "prettier"],
  parser: "@typescript-eslint/parser",
  rules: {
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",
    "no-use-before-define": "off",
  },
};
