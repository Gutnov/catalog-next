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
    "next/core-web-vitals", // Базовые правила Next.js
    "next/typescript", // Правила TypeScript для Next.js
    "plugin:react/recommended", // Рекомендуемые правила React
    "plugin:@typescript-eslint/recommended" // Рекомендуемые правила TypeScript
  ),
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // Указываем расширения файлов
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json", // Указываем путь к tsconfig.json
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
      // React и JSX
      "react/react-in-jsx-scope": "off", // Не требуется в Next.js >= 17
      "react/jsx-no-useless-fragment": "warn", // Избегать бесполезных фрагментов
      "react/no-unescaped-entities": "warn", // Проверять экранирование символов в JSX

      // React Hooks
      "react-hooks/rules-of-hooks": "error", // Следовать правилам использования Hooks
      "react-hooks/exhaustive-deps": "warn", // Предупреждать о пропущенных зависимостях в useEffect

      // TypeScript
      "@typescript-eslint/no-explicit-any": "warn", // Запретить использование `any`
      "@typescript-eslint/no-unused-vars": "warn", // Предупреждать о неиспользуемых переменных
      "@typescript-eslint/no-floating-promises": "error", // Обрабатывать промисы

      // Импорты
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
        },
      ], // Упорядочивание импортов
      "import/no-unresolved": "error", // Проверять существование импортов
      "import/no-duplicates": "error", // Запрещать дублирование импортов

      // Общие правила
      "no-console": "warn", // Запретить использование console.log
      "no-debugger": "error", // Запретить использование debugger,
      "indent": [
        "error",
        4, // Размер отступа (например, 2 пробела)
        {
          SwitchCase: 1, // Отступ для `case` внутри `switch`
          VariableDeclarator: "first", // Отступ для переменных
          outerIIFEBody: 0, // Отступ для IIFE
          MemberExpression: 1, // Отступ для цепочек вызовов
          FunctionDeclaration: { body: 1, parameters: 2 }, // Отступ для функций
          FunctionExpression: { body: 1, parameters: 2 }, // Отступ для выражений функций
          CallExpression: { arguments: 1 }, // Отступ для аргументов вызова функций
          ArrayExpression: 1, // Отступ для массивов
          ObjectExpression: 1, // Отступ для объектов
          ImportDeclaration: 1, // Отступ для импортов
          flatTernaryExpressions: false, // Отступ для тернарных выражений
          ignoreComments: false, // Не игнорировать комментарии
        },
      ],
      "react/jsx-indent": ["error", 4], // Проверка отступов в JSX
      "react/jsx-indent-props": ["error", 4], // Проверка отступов для пропсов в JSX,
      "quotes": ["error", "single"]
    },
  },
];

export default config;