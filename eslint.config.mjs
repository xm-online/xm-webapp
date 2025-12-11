import globals from 'globals';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsdoc from 'eslint-plugin-tsdoc';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';
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
    '**/node_modules',
    '**/.angular',
    '**/dist',
    '**/lib',
    '**/coverage',
    '**/assets',
    '**/test.ts',
    '**/*.d.ts',
    '**/.storybook/**',
    '**/src/app/xm-jsf-ext.module.ts'
  ],
}, ...compat.extends('eslint:recommended').map(config => ({
  ...config,
  files: ['**/*.js'],
})), {
  files: ['**/*.js'],

  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.jasmine
    },

    ecmaVersion: 2020,
    sourceType: 'module',
  },

  rules: {
    indent: ['error', 4, {
      SwitchCase: 1,
      FunctionDeclaration: {
        parameters: 'first',
      },
    }],
    quotes: ['error', 'single', {
      avoidEscape: true,
    }],
    'no-console': ['error', {
      allow: ['warn', 'info', 'error', 'table'],
    }],
    'no-multi-spaces': 'error',
    'consistent-return': 'error',
    'no-else-return': 'error',
    semi: 'error',
    'space-unary-ops': 'error',
    'comma-dangle': ['warn', 'always-multiline'],
    'no-prototype-builtins': 'warn',
    'no-useless-escape': 'warn',
  },
}, ...compat.extends(
  'plugin:@typescript-eslint/recommended',
  'plugin:@typescript-eslint/recommended-requiring-type-checking',
  'plugin:@angular-eslint/recommended',
  'plugin:@angular-eslint/template/process-inline-templates',
).map(config => ({
  ...config,
  files: ['**/*.ts'],
})), {
  files: ['**/*.ts'],
  plugins: {
    '@typescript-eslint': typescriptEslint,
    tsdoc,
    '@stylistic': stylistic,
  },

  languageOptions: {
    ecmaVersion: 5,
    sourceType: 'script',

    parserOptions: {
      project: ['tsconfig.json'],
      createDefaultProgram: true,
    },
  },

  rules: {
    indent: ['error', 4, {
      SwitchCase: 1,
      FunctionDeclaration: {
        parameters: 'first',
      },
    }],
    quotes: ['error', 'single', {
      avoidEscape: true,
    }],
    'no-console': ['error', {
      allow: ['warn', 'info', 'error', 'table'],
    }],
    'no-multi-spaces': 'error',
    'consistent-return': 'error',
    'no-else-return': 'error',
    semi: 'error',
    'space-unary-ops': 'error',
    'comma-dangle': ['warn', 'always-multiline'],
    'tsdoc/syntax': 'error',
    '@typescript-eslint/explicit-module-boundary-types': ['error', {
      allowArgumentsExplicitlyTypedAsAny: true,
    }],
    '@typescript-eslint/typedef': ['error', {
      arrayDestructuring: false,
      arrowParameter: false,
    }],
    '@typescript-eslint/no-inferrable-types': ['error', {
      ignoreParameters: true,
      ignoreProperties: true,
    }],
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@stylistic/type-annotation-spacing': 'error',
    '@typescript-eslint/explicit-member-accessibility': ['error', {
      overrides: {
        constructors: 'off',
        accessors: 'off',
      },
    }],
    '@typescript-eslint/no-empty-interface': ['error', {
      allowSingleExtends: true,
    }],
    '@angular-eslint/prefer-standalone': 'off',
    '@angular-eslint/no-output-native': 'off',
    '@angular-eslint/component-class-suffix': ['warn', {
      suffixes: ['Component', 'Widget', 'Control'],
    }],
    '@angular-eslint/component-selector': ['off', {
      prefix: 'xm',
      style: 'kebab-case',
      type: 'element',
    }],
    '@angular-eslint/directive-selector': ['off', {
      prefix: 'xm',
      style: 'camelCase',
      type: 'attribute',
    }],
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-redundant-type-constituents': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    '@typescript-eslint/no-base-to-string': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/restrict-plus-operands': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    'no-prototype-builtins': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
    '@typescript-eslint/no-implied-eval': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-restricted-types': 'warn',
    '@typescript-eslint/prefer-regexp-exec': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/unbound-method': ['warn', {
      ignoreStatic: true,
    }],
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': ['error', {
      allowTernary: true,
      allowShortCircuit: true,
    }],
    '@typescript-eslint/no-empty-object-type': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/prefer-promise-reject-errors': 'warn',
    '@typescript-eslint/no-unsafe-function-type': 'warn',
    'no-useless-escape': 'warn',
  },
}, ...compat.extends('plugin:storybook/recommended').map(config => ({
  ...config,
  files: ['*.stories.ts'],
})), {
  files: ['*.stories.ts'],
  rules: {},
}, ...compat.extends('plugin:@angular-eslint/template/recommended').map(config => ({
  ...config,
  files: ['*.html'],
})), {
  files: ['*.html'],
  rules: {
    '@angular-eslint/template/eqeqeq': 'off',
    '@angular-eslint/template/no-negated-async': 'off',
  },
}];
