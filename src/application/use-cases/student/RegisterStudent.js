/**
 * Register Student Use Case
 */

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
    // Create student entity
    const student = new Student({
      ...studentData,
      email: studentData.email?.toLowerCase().trim(),
    });

    // Validate student data
    const validation = student.validate();
    if (!validation.isValid) {
      throw new ValidationException("Validation failed", validation.errors);
    }

    // Check if email already exists
    const existingStudent = await this.studentRepository.findByEmail(
      student.email
    );
    if (existingStudent) {
      throw new ConflictException("Email already exists");
    }

    // Validate batch exists
    const batchExists = await this.batchRepository.exists(student.batch);
    if (!batchExists) {
      throw new NotFoundException("Batch not found");
    }

    // Hash password
    student.password = await this.passwordHasher.hash(student.password);

    // Create student
    const createdStudent = await this.studentRepository.create(student);

    return createdStudent;
  }
}

module.exports = RegisterStudent;
