const ValidationException = require("../../../domain/exceptions/ValidationException");
const UnauthorizedException = require("../../../domain/exceptions/UnauthorizedException");
class LoginStudent {
  constructor(studentRepository, passwordHasher, tokenService) {
    this.studentRepository = studentRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }
  async execute(email, password) {
    if (!email || !password) {
      throw new ValidationException("Email and password are required");
    }
    const normalizedEmail = email.toLowerCase().trim();
    const student = await this.studentRepository.findByEmailWithPassword(
      normalizedEmail
    );
    if (!student) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const isPasswordValid = await this.passwordHasher.compare(
      password,
      student.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const token = this.tokenService.generateToken(student.id);
    delete student.password;
    return { student, token };
  }
}
module.exports = LoginStudent;
