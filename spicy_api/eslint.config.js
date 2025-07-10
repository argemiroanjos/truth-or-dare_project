const tseslint = require('typescript-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  {
    ignores: [
      "eslint.config.js",
      "src/database/config.js",
      "src/database/migrations/*",
      "src/database/seeders/*"
    ],
  },
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
];
