import { config as baseConfig } from '@repo/eslint-config';

export default [
    ...baseConfig,
    {
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' },
            ],
        },
    },
];
