import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'jest.config.js',
            '*.config.js',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },
];
