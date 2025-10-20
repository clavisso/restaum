module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'game.js',
    '!node_modules/**',
    '!coverage/**'
  ],
  testMatch: [
    '**/*.test.js'
  ]
};
