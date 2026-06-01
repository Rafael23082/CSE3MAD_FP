/** @type {import('jest-expo').Config} */
module.exports = {
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: './coverage',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};
