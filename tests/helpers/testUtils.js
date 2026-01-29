const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;
async function setupTestDB() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}
async function teardownTestDB() {
  await mongoose.disconnect();
  await mongoServer.stop();
}
async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}
function createMockStudent(overrides = {}) {
  return {
    name: 'Test Student',
    email: 'test@example.com',
    password: 'password123',
    batch: new mongoose.Types.ObjectId(),
    phone: '1234567890',
    ...overrides,
  };
}
function createMockCourse(overrides = {}) {
  return {
    courseName: 'Test Course',
    duration: '4 years',
    fees: 50000,
    ...overrides,
  };
}
function createMockBatch(overrides = {}) {
  return {
    batchName: 'Test Batch',
    course: new mongoose.Types.ObjectId(),
    startDate: new Date(),
    ...overrides,
  };
}
module.exports = {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  createMockStudent,
  createMockCourse,
  createMockBatch,
};
