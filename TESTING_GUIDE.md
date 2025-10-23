# Testing Guide

Comprehensive testing setup for Student API with unit tests, integration tests, and test coverage reporting.

## 📦 Test Stack

- **Framework:** Jest
- **HTTP Testing:** Supertest
- **In-Memory Database:** MongoDB Memory Server
- **Coverage:** Istanbul (built into Jest)

## 🗂️ Test Structure

```
tests/
├── setup.js                    # Global test setup
├── helpers/
│   ├── mockRepositories.js     # Mock implementations
│   └── testUtils.js            # Test utilities
├── unit/
│   └── student/
│       ├── RegisterStudent.test.js
│       └── LoginStudent.test.js
└── integration/
    ├── auth.test.js            # Authentication endpoints
    └── course.test.js          # Course endpoints
```

## 🚀 Running Tests

### All Tests

```bash
npm test
```

### Unit Tests Only

```bash
npm run test:unit
```

### Integration Tests Only

```bash
npm run test:integration
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

## 📝 Test Types

### 1. Unit Tests

Test individual use cases in isolation with mocked dependencies.

**Location:** `tests/unit/`

**Example:** Testing RegisterStudent use case

```javascript
const RegisterStudent = require("../../../src/application/use-cases/student/RegisterStudent");
const {
  MockStudentRepository,
  MockBatchRepository,
  MockPasswordHasher,
} = require("../../helpers/mockRepositories");

describe("RegisterStudent Use Case", () => {
  let registerStudent;
  let studentRepository;
  let batchRepository;
  let passwordHasher;

  beforeEach(() => {
    studentRepository = new MockStudentRepository();
    batchRepository = new MockBatchRepository();
    passwordHasher = new MockPasswordHasher();
    registerStudent = new RegisterStudent(
      studentRepository,
      batchRepository,
      passwordHasher
    );
  });

  test("should register a new student successfully", async () => {
    const batch = await batchRepository.create({
      name: "Batch 2024-A",
      course: "507f1f77bcf86cd799439010",
    });

    const studentData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      batch: batch._id,
    };

    const result = await registerStudent.execute(studentData);

    expect(result).toBeDefined();
    expect(result.name).toBe("John Doe");
  });
});
```

### 2. Integration Tests

Test complete API endpoints with real MongoDB Memory Server.

**Location:** `tests/integration/`

**Example:** Testing Course API endpoints

```javascript
const request = require("supertest");
const { setupTestDB, teardownTestDB } = require("../helpers/testUtils");

describe("Course API Endpoints", () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  test("should return all courses", async () => {
    const response = await request(app)
      .get("/api/v1/course/getAllCourses")
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

## 🔧 Test Configuration

### jest.config.js

```javascript
module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/**/*.spec.js",
  ],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  verbose: true,
  testTimeout: 30000,
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
```

### Environment Variables

Tests use `.env.test` file with test-specific configuration:

```env
NODE_ENV=test
PORT=3001
LOCAL_DATABASE_URI=mongodb://127.0.0.1:27017/student_batch_test
JWT_SECRET=test_secret_key
```

## 📊 Code Coverage

### Generate Coverage Report

```bash
npm run test:coverage
```

### View Coverage Report

After running tests with coverage, open:

```bash
open coverage/lcov-report/index.html
```

### Coverage Goals

- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

## 🧪 Writing Tests

### Best Practices

1. **Test Names Should Be Descriptive**

   ```javascript
   // ✅ Good
   test("should return error when email already exists", () => {});

   // ❌ Bad
   test("test register", () => {});
   ```

2. **Arrange-Act-Assert Pattern**

   ```javascript
   test("should create course successfully", async () => {
     // Arrange
     const courseData = { courseName: "CS", duration: "4 years" };

     // Act
     const result = await createCourse.execute(courseData);

     // Assert
     expect(result).toBeDefined();
     expect(result.courseName).toBe("CS");
   });
   ```

3. **Test One Thing at a Time**

   ```javascript
   // ✅ Good - focused test
   test("should hash password before saving", async () => {
     const student = await registerStudent.execute({
       password: "plain123",
     });
     expect(student.password).not.toBe("plain123");
   });
   ```

4. **Use Beforeach/AfterEach for Setup/Teardown**

   ```javascript
   beforeEach(async () => {
     await clearDatabase();
   });

   afterEach(async () => {
     jest.clearAllMocks();
   });
   ```

5. **Test Both Success and Failure Cases**

   ```javascript
   describe("LoginStudent", () => {
     test("should login with valid credentials", async () => {
       // Test success case
     });

     test("should return error with invalid email", async () => {
       // Test failure case
     });
   });
   ```

### Testing Authenticated Routes

```javascript
test("should access protected route with valid token", async () => {
  // 1. Register user
  await request(app).post("/api/v1/auth/register").send(userData);

  // 2. Login to get token
  const loginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password });

  const token = loginResponse.body.token;

  // 3. Access protected route
  const response = await request(app)
    .get("/api/v1/auth/getMe")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(response.body.success).toBe(true);
});
```

### Testing Error Cases

```javascript
test("should return 400 for missing required fields", async () => {
  const response = await request(app)
    .post("/api/v1/course/createCourse")
    .send({})
    .expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body.error).toBeDefined();
});
```

## 🛠️ Test Utilities

### Mock Repositories

Located in `tests/helpers/mockRepositories.js`

Available mocks:

- `MockStudentRepository`
- `MockCourseRepository`
- `MockBatchRepository`
- `MockPasswordHasher`
- `MockTokenService`
- `MockFileStorage`

### Test Utilities

Located in `tests/helpers/testUtils.js`

Available utilities:

- `setupTestDB()` - Setup in-memory MongoDB
- `teardownTestDB()` - Cleanup test database
- `clearDatabase()` - Clear all collections
- `createMockStudent()` - Create mock student data
- `createMockCourse()` - Create mock course data
- `createMockBatch()` - Create mock batch data

## 🐛 Debugging Tests

### Run Single Test File

```bash
npm test -- tests/unit/student/RegisterStudent.test.js
```

### Run Tests Matching Pattern

```bash
npm test -- --testNamePattern="should register"
```

### Verbose Output

```bash
npm test -- --verbose
```

### See Console Logs

```bash
npm test -- --silent=false
```

## 🔄 Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          files: ./coverage/lcov.info
```

## 📈 Test Coverage Report

After running tests with coverage, you'll see output like:

```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   85.23 |    78.45 |   82.67 |   85.23 |
 application/use-cases/   |   92.15 |    85.32 |   90.12 |   92.15 |
  RegisterStudent.js      |   95.23 |    88.45 |   92.67 |   95.23 |
  LoginStudent.js         |   89.07 |    82.19 |   87.57 |   89.07 |
 infrastructure/services/ |   78.34 |    71.23 |   75.45 |   78.34 |
--------------------------|---------|----------|---------|---------|
```

## 🎯 Test Scenarios Covered

### Authentication Tests

- ✅ Register with valid data
- ✅ Register with duplicate email
- ✅ Register with missing fields
- ✅ Login with valid credentials
- ✅ Login with invalid email
- ✅ Login with wrong password
- ✅ Access protected routes with token
- ✅ Access protected routes without token

### Course Tests

- ✅ Create course
- ✅ Get all courses
- ✅ Get course by ID
- ✅ Update course
- ✅ Delete course
- ✅ Handle invalid course ID

### Student Tests

- ✅ Get all students
- ✅ Get student by ID
- ✅ Get students by batch
- ✅ Get students by course
- ✅ Update student
- ✅ Delete student
- ✅ Upload student image

### Batch Tests

- ✅ Create batch
- ✅ Get all batches
- ✅ Get batch by ID
- ✅ Update batch
- ✅ Delete batch

## 🚨 Common Issues

### Issue 1: Port Already in Use

**Solution:** Tests use port 3001 (not 3000) to avoid conflicts with dev server.

### Issue 2: MongoDB Memory Server Timeout

**Solution:** Increase timeout in jest.config.js:

```javascript
testTimeout: 30000; // 30 seconds
```

### Issue 3: Jest Cache Issues

**Solution:** Clear Jest cache:

```bash
npx jest --clearCache
```

### Issue 4: Module Not Found

**Solution:** Ensure all paths are relative from test file location.

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

## ✅ Test Checklist

Before committing code, ensure:

- [ ] All tests pass
- [ ] Coverage is above 80%
- [ ] New features have tests
- [ ] Bug fixes have regression tests
- [ ] No console.log statements in tests
- [ ] Tests run in CI/CD pipeline

---

**Happy Testing! 🧪**
