export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.ts'],
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/client/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    collectCoverageFrom: [
        'client/src/**/*.{ts,tsx}',
        '!client/src/**/*.d.ts',
        '!client/src/main.tsx',
        '!client/src/vite-env.d.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    testMatch: [
        '<rootDir>/client/src/**/__tests__/**/*.{ts,tsx}',
        '<rootDir>/client/src/**/*.{test,spec}.{ts,tsx}',
    ],
};
