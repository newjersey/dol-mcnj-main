const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/backend/"],
  transformIgnorePatterns: [
    "node_modules/(?!(marked)/)"
  ],
};

module.exports = createJestConfig(customJestConfig);
