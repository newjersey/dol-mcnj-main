module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "<rootDir>/src/globalSetup.js",
  globalTeardown: "<rootDir>/src/globalTeardown.js",
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(p-limit|yocto-queue)/)"],
};
