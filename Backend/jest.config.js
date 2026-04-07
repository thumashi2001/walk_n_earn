module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "Components/**/*.js",
    "utils/**/*.js",
    "!**/tests/**",
    "!**/node_modules/**",
  ],
  coverageReporters: ["text", "lcov"],
  // Increase timeout for mongodb-memory-server spin-up
  testTimeout: 30000,
};
