/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["prettier"],
  plugins: ["@typescript-eslint", "import", "unused-imports", "prettier"],
  parser: "@typescript-eslint/parser",
  rules: {
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "unused-imports/no-unused-imports": "warn",
    "no-use-before-define": "off",
    "prettier/prettier": "error",
  },
};
