/**
 * Apple OAuth Login Use Case
 * Application layer - handles business logic for Apple Sign-In
 */

const ValidationException = require("../../../domain/exceptions/ValidationException");
const ConflictException = require("../../../domain/exceptions/ConflictException");

class AppleOAuthLogin {
  constructor(
    studentRepository,
    appleOAuthService,
    tokenService,
    batchRepository
  ) {
    this.studentRepository = studentRepository;
    this.appleOAuthService = appleOAuthService;
    this.tokenService = tokenService;
    this.batchRepository = batchRepository;
  }

  /**
   * Execute Apple OAuth login
   * @param {string} idToken - Apple ID token from client
   * @param {Object} userData - User data from Apple (only provided on first sign-in)
   * @param {string} batchId - Batch ID (required for new users)
   * @returns {Promise<{student: Object, token: string, isNewUser: boolean}>}
   */
  async execute(idToken, userData = null, batchId = null) {
    if (!idToken) {
      throw new ValidationException("Apple ID token is required");
    }

    // Verify the Apple token and get user info
    const appleUserInfo = await this.appleOAuthService.verifyIdToken(
      idToken,
      userData
    );

    // Check if user already exists by providerId
    let student = await this.studentRepository.findOne({
      providerId: appleUserInfo.sub,
      authProvider: "apple",
    });

    let isNewUser = false;

    if (student) {
      // Existing user - just return with token
      const token = this.tokenService.generateToken(student.id);
      return { student, token, isNewUser };
    }

    // Check if a user with this email already exists (with different auth provider)
    // Note: Apple allows users to hide their email, but we require it for our system
    if (!appleUserInfo.email) {
      throw new ValidationException(
        'Email is required. Please sign in with Apple using "Share My Email" option.'
      );
    }

    const existingEmailUser = await this.studentRepository.findOne({
      email: appleUserInfo.email,
    });

    if (existingEmailUser) {
      throw new ConflictException(
        `An account with email ${appleUserInfo.email} already exists. Please use ${existingEmailUser.authProvider} sign-in or contact support.`
      );
    }

    // New user - create account
    if (!batchId) {
      throw new ValidationException(
        "Batch ID is required for new user registration via Apple Sign-In"
      );
    }

    // Verify batch exists
    const batch = await this.batchRepository.findById(batchId);
    if (!batch) {
      throw new ValidationException("Invalid batch ID");
    }

    // Extract names - Apple provides them only on first sign-in
    let firstName = "User";
    let lastName = "";

    if (appleUserInfo.name) {
      firstName = appleUserInfo.name.firstName || "User";
      lastName = appleUserInfo.name.lastName || "";
    }

    // Create new student
    const studentData = {
      firstName: firstName,
      lastName: lastName,
      email: appleUserInfo.email,
      authProvider: "apple",
      providerId: appleUserInfo.sub,
      batch: batchId,
      course: [],
    };

    student = await this.studentRepository.create(studentData);
    isNewUser = true;

    const token = this.tokenService.generateToken(student.id);

    return { student, token, isNewUser };
  }
}

module.exports = AppleOAuthLogin;
