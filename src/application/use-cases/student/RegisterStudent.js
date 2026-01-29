const ValidationException = require("../../../domain/exceptions/ValidationException");
const ConflictException = require("../../../domain/exceptions/ConflictException");
const NotFoundException = require("../../../domain/exceptions/NotFoundException");
const Student = require("../../../domain/entities/Student");
class RegisterStudent {
  constructor(studentRepository, batchRepository, passwordHasher) {
    this.studentRepository = studentRepository;
    this.batchRepository = batchRepository;
    this.passwordHasher = passwordHasher;
  }
  async execute(studentData) {
    const student = new Student({
      ...studentData,
      email: studentData.email?.toLowerCase().trim(),
    });
    const validation = student.validate();
    if (!validation.isValid) {
      throw new ValidationException("Validation failed", validation.errors);
    }
    const existingStudent = await this.studentRepository.findByEmail(
      student.email
    );
    if (existingStudent) {
      throw new ConflictException("Email already exists");
    }
    const batchExists = await this.batchRepository.exists(student.batch);
    if (!batchExists) {
      throw new NotFoundException("Batch not found");
    }
    student.password = await this.passwordHasher.hash(student.password);
    const createdStudent = await this.studentRepository.create(student);
    return createdStudent;
  }
}
module.exports = RegisterStudent;
