/**
 * Google OAuth Login Use Case
 * Application layer - handles business logic for Google Sign-In
 */

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

  /**
   * Execute Google OAuth login
   * @param {string} idToken - Google ID token from client
   * @param {string} batchId - Batch ID (required for new users)
   * @returns {Promise<{student: Object, token: string, isNewUser: boolean}>}
   */
  async execute(idToken, batchId = null) {
    if (!idToken) {
      throw new ValidationException("Google ID token is required");
    }

    // Verify the Google token and get user info
    const googleUserInfo = await this.googleOAuthService.verifyIdToken(idToken);

    if (!googleUserInfo.email_verified) {
      throw new ValidationException("Google email is not verified");
    }

    // Check if user already exists by providerId
    let student = await this.studentRepository.findOne({
      providerId: googleUserInfo.sub,
      authProvider: "google",
    });

    let isNewUser = false;

    if (student) {
      // Existing user - just return with token
      const token = this.tokenService.generateToken(student.id);
      return { student, token, isNewUser };
    }

    // Check if a user with this email already exists (with different auth provider)
    const existingEmailUser = await this.studentRepository.findOne({
      email: googleUserInfo.email,
    });

    if (existingEmailUser) {
      throw new ConflictException(
        `An account with email ${googleUserInfo.email} already exists. Please use ${existingEmailUser.authProvider} sign-in or contact support.`
      );
    }

    // New user - create account
    if (!batchId) {
      throw new ValidationException(
        "Batch ID is required for new user registration via Google Sign-In"
      );
    }

    // Verify batch exists
    const batch = await this.batchRepository.findById(batchId);
    if (!batch) {
      throw new ValidationException("Invalid batch ID");
    }

    // Create new student
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
