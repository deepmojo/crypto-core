module.exports = {
  verbose: false,
  preset: 'ts-jest',
  collectCoverage: false,
  coverageReporters: [],
  coverageDirectory: 'coverage',
  testEnvironment: "jsdom",
  testPathIgnorePatterns: [
    'lib/'
  ]
};
