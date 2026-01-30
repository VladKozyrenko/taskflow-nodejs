import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
    // Ignore build + deps
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "eslint.config.mjs"
        ],
    },

    // Base JS recommended
    js.configs.recommended,

    // TypeScript recommended (parser + plugin included)
    ...tseslint.configs.recommended,

    // TS (src + tests) with project-aware rules
    {
        files: ["**/*.ts"],
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                project: "./tsconfig.eslint.json",
                tsconfigRootDir: process.cwd(),
            },
        },
    },

    // Allow CommonJS in jest.config.js
    {
        files: ["jest.config.js"],
        languageOptions: {
            globals: globals.node,
            sourceType: "commonjs",
        },
        rules: {
            "@typescript-eslint/no-require-imports": "off",
            "no-undef": "off",
        },
    },
];
