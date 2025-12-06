/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const integrationTestPattern = '.(integration.test).(ts|tsx|js|jsx)$';
const integrationRunFlag = process.env.RUN_INTEGRATION_TESTS?.toLowerCase();
const isIntegrationRun = integrationRunFlag === 'true' || integrationRunFlag === '1';
const baseTestPathIgnorePatterns = ['<rootDir>/.open-next/', '<rootDir>/node_modules/'];
const resolvedTestPathIgnorePatterns = [
  ...baseTestPathIgnorePatterns,
  ...(isIntegrationRun ? [] : [integrationTestPattern]),
];

/**
 * Custom Jest configuration for RideShareTahoe that reuses Next.js helpers and
 * only suppresses integration test files when `RUN_INTEGRATION_TESTS` is unset.
 * @type {import('jest').Config}
 */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!daisyui)/'],
  testPathIgnorePatterns: resolvedTestPathIgnorePatterns,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
