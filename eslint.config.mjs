// @ts-check

import js from "@eslint/js";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import angularEslint from "@angular-eslint/eslint-plugin";
import angularTemplateParser from "@angular-eslint/template-parser";
import storybookPlugin from "eslint-plugin-storybook";
import tsdoc from "eslint-plugin-tsdoc";
import xmNgxEslintPlugin from "@xm-ngx/eslint-plugin";
import stylistic from '@stylistic/eslint-plugin';
import globals from "globals";

export default [
  {
    ignores: [
      "**/node_modules",
      "**/.angular",
      "**/dist",
      "**/lib",
      "**/coverage",
      "**/assets",
      "**/test.ts",
      "**/*.d.ts",
      "**/.storybook/**",
      "**/reports",
    ],
  },
  {
    ...js.configs.recommended,
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jasmine
      },
    },
    rules: {
      indent: ["error", 4, {SwitchCase: 1}],
      quotes: ["error", "single", {avoidEscape: true}],
      "no-console": ["error", {allow: ["warn", "info", "error"]}],
      "no-multi-spaces": "error",
      "consistent-return": "error",
      "no-else-return": "error",
      semi: "error",
      "space-unary-ops": "error",
      "comma-dangle": ["warn", "always-multiline"],
      "no-prototype-builtins": "warn",
      "no-useless-escape": "warn",
    },
  },
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": tsEslint,
      "@angular-eslint": angularEslint,
      "@xm-ngx": xmNgxEslintPlugin,
      tsdoc,
      "@stylistic": stylistic,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["tsconfig.json"],
        createDefaultProgram: true,
      },
    },
    rules: {
      ...tsEslint.configs.recommended.rules,
      ...tsEslint.configs["recommended-requiring-type-checking"].rules,
      ...angularEslint.configs.recommended.rules,
      indent: ["error", 4, {SwitchCase: 1}],
      quotes: ["error", "single", {avoidEscape: true}],
      "no-console": ["error", {allow: ["warn", "info", "error"]}],
      "no-multi-spaces": "error",
      "consistent-return": "error",
      "no-else-return": "error",
      semi: "error",
      "space-unary-ops": "error",
      "comma-dangle": ["warn", "always-multiline"],
      "tsdoc/syntax": "error",
      "@typescript-eslint/explicit-module-boundary-types": ["error", {allowArgumentsExplicitlyTypedAsAny: true}],
      "@typescript-eslint/typedef": ["error", {arrayDestructuring: false, arrowParameter: false}],
      "@typescript-eslint/no-inferrable-types": ["error", {ignoreParameters: true, ignoreProperties: true}],
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@stylistic/type-annotation-spacing": "error",
      "@typescript-eslint/explicit-member-accessibility": ["error", {
        overrides: {
          constructors: "off",
          accessors: "off"
        }
      }],
      "@typescript-eslint/no-empty-interface": ["error", {allowSingleExtends: true}],
      "@angular-eslint/component-class-suffix": ["warn", {suffixes: ["Component", "Widget", "Control"]}],
      "@angular-eslint/component-selector": ["off", {prefix: "xm", style: "kebab-case", type: "element"}],
      "@angular-eslint/directive-selector": ["off", {prefix: "xm", style: "camelCase", type: "attribute"}],
      "@angular-eslint/no-host-metadata-property": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-redundant-type-constituents": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",
      "@typescript-eslint/no-base-to-string": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/restrict-plus-operands": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "no-prototype-builtins": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unsafe-enum-comparison": "warn",
      "@typescript-eslint/no-implied-eval": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": ["error", {allowTernary: true, allowShortCircuit: true}],
    },
  },
  {
    files: ["**/*.html"],
    plugins: {
      "@angular-eslint": angularEslint,
    },
    languageOptions: {
      parser: angularTemplateParser,
    },
    rules: {
      ...angularEslint.configs.template.recommended.rules,
      "@angular-eslint/template/eqeqeq": "off",
      "@angular-eslint/template/no-negated-async": "off",
    },
  },
  {
    ...storybookPlugin.configs.recommended,
    files: ["**/*.stories.ts"],
    rules: {
      ...storybookPlugin.configs.recommended.rules,
    },
  },
];
