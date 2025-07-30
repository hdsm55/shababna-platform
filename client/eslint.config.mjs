import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.es2020,
                ...globals.node,
            },
            parser: tsparser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            'prefer-const': 'error',
            'no-var': 'error',
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ignores: ['dist', 'node_modules', '*.config.js', '*.config.mjs'],
    },
]