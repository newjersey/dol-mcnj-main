module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Add timeout to prevent hanging tests
  testTimeout: 10000,
  // Force exit after tests complete
  forceExit: true,
  // Clear cache between test runs
  clearMocks: true,
  // Reset modules between test runs
  resetModules: true,
};
