/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  verbose: true,
  forceExit: true,
  moduleNameMapper: {
    '^@verdade-ou-desafio/common/(.*)$': '<rootDir>/../common/src/$1',
  },
};
