module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  };