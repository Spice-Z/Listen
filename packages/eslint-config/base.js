/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ["@typescript-eslint", "import", "unused-imports", "prettier"],
  extends: ["plugin:react/recommended", "plugin:react/jsx-runtime"],
  parser: "@typescript-eslint/parser",
  rules: {
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    ],
    "no-use-before-define": "off",
    "react/no-array-index-key": "off",
  },
};
