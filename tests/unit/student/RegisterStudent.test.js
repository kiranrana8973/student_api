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
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      batch: batch._id,
      phone: "1234567890",
    };
    const result = await registerStudent.execute(studentData);
    expect(result).toBeDefined();
    expect(result.firstName).toBe("John");
    expect(result.lastName).toBe("Doe");
    expect(result.email).toBe("john@example.com");
    expect(result.password).toContain("hashed_");
    expect(result.batch).toBe(batch._id);
  });
  test("should throw error if email already exists", async () => {
    const studentData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      batch: "507f1f77bcf86cd799439013",
    };
    await studentRepository.create(studentData);
    await expect(registerStudent.execute(studentData)).rejects.toThrow();
  });
  test("should throw error if batch does not exist", async () => {
    const studentData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      batch: "invalid_batch_id",
    };
    await expect(registerStudent.execute(studentData)).rejects.toThrow();
  });
  test("should hash password before saving", async () => {
    const batch = await batchRepository.create({
      name: "Batch 2024-A",
    });
    const studentData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      batch: batch._id,
    };
    const result = await registerStudent.execute(studentData);
    expect(result.password).not.toBe("password123");
    expect(result.password).toBe("hashed_password123");
  });
});
