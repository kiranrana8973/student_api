const LoginStudent = require("../../../src/application/use-cases/student/LoginStudent");
const {
  MockStudentRepository,
  MockPasswordHasher,
  MockTokenService,
} = require("../../helpers/mockRepositories");

describe("LoginStudent Use Case", () => {
  let loginStudent;
  let studentRepository;
  let passwordHasher;
  let tokenService;

  beforeEach(() => {
    studentRepository = new MockStudentRepository();
    passwordHasher = new MockPasswordHasher();
    tokenService = new MockTokenService();
    loginStudent = new LoginStudent(
      studentRepository,
      passwordHasher,
      tokenService
    );
  });

  test("should login with correct credentials", async () => {
    await studentRepository.create({
      _id: '507f1f77bcf86cd799439011',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashed_password123',
    });

    const result = await loginStudent.execute(
      "john@example.com",
      "password123"
    );

    expect(result).toBeDefined();
    expect(result.token).toBe("mock_jwt_token");
    expect(result.student).toBeDefined();
    expect(result.student.email).toBe("john@example.com");
  });

  test("should throw error with invalid email", async () => {
    await expect(
      loginStudent.execute("nonexistent@example.com", "password123")
    ).rejects.toThrow();
  });

  test("should throw error with incorrect password", async () => {
    await studentRepository.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashed_password123',
    });

    await expect(
      loginStudent.execute("john@example.com", "wrongpassword")
    ).rejects.toThrow();
  });

  test("should not include password in response", async () => {
    await studentRepository.create({
      _id: '507f1f77bcf86cd799439011',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashed_password123',
    });

    const result = await loginStudent.execute(
      "john@example.com",
      "password123"
    );

    expect(result.student.password).toBeUndefined();
  });
});
