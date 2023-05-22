module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "<rootDir>/src/globalSetup.js",
  globalTeardown: "<rootDir>/src/globalTeardown.js",
  moduleNameMapper: {
    "next/router": "<rootDir>/__mocks__/next/router.js",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$": "<rootDir>/__mocks__/file-mock.js",
    "react-markdown": "<rootDir>/node_modules/react-markdown/react-markdown.min.js",
  },
};
