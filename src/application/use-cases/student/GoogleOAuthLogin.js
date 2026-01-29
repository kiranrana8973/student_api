const ValidationException = require("../../../domain/exceptions/ValidationException");
const ConflictException = require("../../../domain/exceptions/ConflictException");
class GoogleOAuthLogin {
  constructor(
    studentRepository,
    googleOAuthService,
    tokenService,
    batchRepository
  ) {
    this.studentRepository = studentRepository;
    this.googleOAuthService = googleOAuthService;
    this.tokenService = tokenService;
    this.batchRepository = batchRepository;
  }
  async execute(idToken, batchId = null) {
    if (!idToken) {
      throw new ValidationException("Google ID token is required");
    }
    const googleUserInfo = await this.googleOAuthService.verifyIdToken(idToken);
    if (!googleUserInfo.email_verified) {
      throw new ValidationException("Google email is not verified");
    }
    let student = await this.studentRepository.findOne({
      providerId: googleUserInfo.sub,
      authProvider: "google",
    });
    let isNewUser = false;
    if (student) {
      const token = this.tokenService.generateToken(student.id);
      return { student, token, isNewUser };
    }
    const existingEmailUser = await this.studentRepository.findOne({
      email: googleUserInfo.email,
    });
    if (existingEmailUser) {
      throw new ConflictException(
        `An account with email ${googleUserInfo.email} already exists. Please use ${existingEmailUser.authProvider} sign-in or contact support.`
      );
    }
    if (!batchId) {
      throw new ValidationException(
        "Batch ID is required for new user registration via Google Sign-In"
      );
    }
    const batch = await this.batchRepository.findById(batchId);
    if (!batch) {
      throw new ValidationException("Invalid batch ID");
    }
    const studentData = {
      firstName: googleUserInfo.given_name || "User",
      lastName: googleUserInfo.family_name || "",
      email: googleUserInfo.email,
      authProvider: "google",
      providerId: googleUserInfo.sub,
      image: googleUserInfo.picture || null,
      batch: batchId,
      course: [],
    };
    student = await this.studentRepository.create(studentData);
    isNewUser = true;
    const token = this.tokenService.generateToken(student.id);
    return { student, token, isNewUser };
  }
}
module.exports = GoogleOAuthLogin;
