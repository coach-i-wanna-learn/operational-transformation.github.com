module.exports = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css)$": "identity-obj-proxy",
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
};
