module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/.next/**'
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/'
  ],
  transform: {
    // Use babel-jest for test files only, not for Next.js code
    '^.+\\.(test|spec)\\.(js|jsx)$': 'babel-jest',
    // Use next/jest for non-test files
    '^(?!.*\\.(test|spec)\\.(js|jsx)$).+\\.(js|jsx)$': ['babel-jest', { 
      configFile: './babel.config.js'
    }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  }
};
