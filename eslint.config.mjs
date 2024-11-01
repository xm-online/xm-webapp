import globals from "globals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsdoc from "eslint-plugin-tsdoc";
import xmNgxEslintPlugin from "@xm-ngx/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import stylistic from '@stylistic/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
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
    ],
}, ...compat.extends("eslint:recommended").map(config => ({
    ...config,
    files: ["**/*.js"],
})), {
    files: ["**/*.js"],

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        ecmaVersion: 2020,
        sourceType: "module",
    },

    rules: {
        indent: "off",
        quotes: ["error", "single", {
            avoidEscape: true,
        }],
        "no-console": ["warn", { allow: ["warn", "info", "error", "log"] }],
        "no-multi-spaces": "error",
        "consistent-return": "off",
        "no-else-return": "error",
        semi: ["warn", "never"],
        "space-unary-ops": "error",
        "comma-dangle": ["warn", "always-multiline"],
        "no-unused-vars": ["warn", {
            vars: "all",
            args: "after-used",
            argsIgnorePattern: "^e$",
            varsIgnorePattern: "^e$",
        }],
        "@typescript-eslint/only-throw-error": "off",
        "@typescript-eslint/no-unsafe-function-type": "off",
        "@angular-eslint/template/no-negated-async": "off",
        "no-undef": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-wrapper-object-types": "off",
        "@typescript-eslint/prefer-promise-reject-errors": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@angular-eslint/no-output-native": "off",
        "@typescript-eslint/no-duplicate-type-constituents": "off",
        "no-useless-escape": "off",
        "no-cond-assign": "off",
        "no-prototype-builtins": "off",
        "@typescript-eslint/no-for-in-array": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/require-await": "off",
        "no-empty": "off",
    },
}, ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@angular-eslint/recommended",
    "plugin:@angular-eslint/template/process-inline-templates",
).map(config => ({
    ...config,
    files: ["**/*.ts"],
})), {
    files: ["**/*.ts", "**/*.*.ts"],

    plugins: {
        "@typescript-eslint": typescriptEslint,
        tsdoc,
        "@xm-ngx": xmNgxEslintPlugin,
        "@stylistic": stylistic,
    },

    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: ["tsconfig.json"],
            createDefaultProgram: true,
        },
    },

    rules: {
        indent: "off",
        quotes: ["error", "single", {
            avoidEscape: true,
        }],
        "no-console": ["warn", { allow: ["warn", "info", "error", "log"] }],
        "no-multi-spaces": "error",
        "consistent-return": "off",
        "no-else-return": "error",
        semi: ["warn", "never"],
        "space-unary-ops": "error",
        "comma-dangle": ["warn", "always-multiline"],
        "tsdoc/syntax": "error",
        "@typescript-eslint/explicit-module-boundary-types": ["error", {
            allowArgumentsExplicitlyTypedAsAny: true,
        }],
        "@typescript-eslint/typedef": ["error", {
            arrayDestructuring: false,
            arrowParameter: false,
        }],
        "@typescript-eslint/no-inferrable-types": ["error", {
            ignoreParameters: true,
            ignoreProperties: true,
        }],
        "@typescript-eslint/no-unsafe-argument": "warn",
        "@stylistic/type-annotation-spacing": "error",
        "@typescript-eslint/explicit-member-accessibility": ["error", {
            overrides: {
                constructors: "off",
                accessors: "off",
            },
        }],
        "@typescript-eslint/no-empty-interface": ["error", {
            allowSingleExtends: true,
        }],
        "@angular-eslint/component-class-suffix": ["warn", {
            suffixes: ["Component", "Widget", "Control"],
        }],
        "@angular-eslint/component-selector": ["off", {
            prefix: "xm",
            style: "kebab-case",
            type: "element",
        }],
        "@angular-eslint/directive-selector": ["off", {
            prefix: "xm",
            style: "camelCase",
            type: "attribute",
        }],
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
        "@typescript-eslint/no-restricted-types": "warn",
        "@typescript-eslint/prefer-regexp-exec": "warn",
        "@typescript-eslint/no-misused-promises": "warn",
        "@typescript-eslint/no-var-requires": "warn",
        "@typescript-eslint/unbound-method": ["warn", {
            ignoreStatic: true,
        }],
        "@typescript-eslint/only-throw-error": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-wrapper-object-types": "off",
        "@typescript-eslint/prefer-promise-reject-errors": "off",
        "@angular-eslint/template/no-negated-async": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@angular-eslint/no-output-native": "off",
        "@typescript-eslint/no-duplicate-type-constituents": "off",
        "no-useless-escape": "off",
        "no-cond-assign": "off",
        "@typescript-eslint/no-for-in-array": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/require-await": "off",
        "no-empty": "off",
        "@typescript-eslint/no-unsafe-function-type": "off",
    },
}, ...compat.extends("plugin:storybook/recommended").map(config => ({
    ...config,
    files: ["**/*.stories.ts"],
})), {
    files: ["**/*.stories.ts"],
    rules: {},
}, ...compat.extends("plugin:@angular-eslint/template/recommended").map(config => ({
    ...config,
    files: ["**/*.html"],
})), {
    files: ["**/*.html"],
    rules: {
        "@angular-eslint/template/eqeqeq": "off",
        "@angular-eslint/template/no-negated-async": "off",
    },
}];
