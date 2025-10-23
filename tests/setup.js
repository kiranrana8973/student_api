require('dotenv').config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Increase test timeout
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
  // Setup code before all tests
});

// Global test teardown
afterAll(async () => {
  // Cleanup code after all tests
});
