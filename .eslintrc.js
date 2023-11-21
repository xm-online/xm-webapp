module.exports = {
    root: true,
    overrides: [
        {
            files: ['*.js'],
            env: {
                browser: true,
                node: true,
                'es6': true,
            },
            parserOptions: {
                ecmaVersion: 2020,
            },
            extends: 'eslint:recommended',
            rules: {
                indent: ['error', 4, {
                    SwitchCase: 1,
                    FunctionDeclaration: {
                        'parameters': 'first',
                    },
                }],
                quotes: ['error', 'single', {
                    avoidEscape: true,
                }],
                'no-console': ['error', {
                    allow: ['warn', 'info'],
                }],
                'no-multi-spaces': 'error',
                'consistent-return': 'error',
                'no-else-return': 'error',
                semi: 'error',
                'space-unary-ops': 'error',
                'comma-dangle': ['warn', 'always-multiline'],
            },
        },
        {
            files: ['*.ts'],
            plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc', '@xm-ngx/eslint-plugin'],
            parserOptions: {
                project: ['tsconfig.json'],
                createDefaultProgram: true,
            },
            extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended-requiring-type-checking', 'plugin:@angular-eslint/recommended', 'plugin:@angular-eslint/template/process-inline-templates'],
            rules: {
                indent: ['error', 4, {
                    SwitchCase: 1,
                    FunctionDeclaration: {
                        'parameters': 'first',
                    },
                }],
                quotes: ['error', 'single', {
                    avoidEscape: true,
                }],
                'no-console': ['error', {
                    allow: ['warn', 'info'],
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
                '@typescript-eslint/type-annotation-spacing': 'error',
                '@typescript-eslint/explicit-member-accessibility': ['error', {
                    overrides: {
                        constructors: 'off',
                        accessors: 'off',
                    },
                }],
                '@typescript-eslint/no-empty-interface': ['error', {
                    'allowSingleExtends': true,
                }],
                '@angular-eslint/component-class-suffix': ['warn', {
                    'suffixes': ['Component', 'Widget', 'Control'],
                }],
                // Off
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
                // Waiting for the fixed
                '@angular-eslint/no-host-metadata-property': 'warn',
                // Blocked by https://github.com/angular/angular/milestone/103
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
                '@typescript-eslint/ban-types': 'warn',
                '@typescript-eslint/prefer-regexp-exec': 'warn',
                '@typescript-eslint/no-misused-promises': 'warn',
                '@typescript-eslint/no-var-requires': 'warn',
                '@typescript-eslint/unbound-method': ['warn', {
                    ignoreStatic: true,
                }],
            },
        },
        {
            files: ['*.stories.ts'],
            extends: ['plugin:storybook/recommended'],
            rules: {},
        },
        {
            files: ['*.html'],
            extends: ['plugin:@angular-eslint/template/recommended'],
            rules: {},
        },
    ],
};
