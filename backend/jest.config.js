module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "<rootDir>/src/globalSetup.js",
  globalTeardown: "<rootDir>/src/globalTeardown.js",
};
