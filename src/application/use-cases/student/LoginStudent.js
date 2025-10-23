/**
 * Login Student Use Case
 */

const ValidationException = require("../../../domain/exceptions/ValidationException");
const UnauthorizedException = require("../../../domain/exceptions/UnauthorizedException");

class LoginStudent {
  constructor(studentRepository, passwordHasher, tokenService) {
    this.studentRepository = studentRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute(email, password) {
    // Validate input
    if (!email || !password) {
      throw new ValidationException("Email and password are required");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find student with password
    const student = await this.studentRepository.findByEmailWithPassword(
      normalizedEmail
    );

    if (!student) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await this.passwordHasher.compare(
      password,
      student.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Generate token
    const token = this.tokenService.generateToken(student.id);

    // Remove password from response
    delete student.password;

    return { student, token };
  }
}

module.exports = LoginStudent;
