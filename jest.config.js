module.exports = {
  verbose: false,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json'
    }
  },
  collectCoverage: false,
  coverageReporters: [],
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: [
    'lib/'
  ]
};
