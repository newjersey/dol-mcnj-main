module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(axios)/)'],
  globalSetup: "<rootDir>/src/globalSetup.js",
  globalTeardown: "<rootDir>/src/globalTeardown.js",
};
