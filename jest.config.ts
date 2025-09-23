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
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@svg/(.*)$": "<rootDir>/src/svg/$1",
    "^@data/(.*)$": "<rootDir>/src/data/$1",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@images/(.*)$": "<rootDir>/src/images/$1"
  }
};

module.exports = createJestConfig(customJestConfig);
