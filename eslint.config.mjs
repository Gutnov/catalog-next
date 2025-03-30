import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginImport from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-hooks": eslintPluginReactHooks,
      import: eslintPluginImport,
    },
    rules: {
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",
      "no-console": "warn",
      "indent": ["error", 4],
      "react/jsx-indent": ["error", 4],
      "react/jsx-indent-props": ["error", 4],
      "quotes": ["error", "single"],
      "react/react-in-jsx-scope": "off"
    }
  },
]

export default config