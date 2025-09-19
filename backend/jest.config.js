module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
