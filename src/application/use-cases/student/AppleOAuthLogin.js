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
  async execute(idToken, userData = null, batchId = null) {
    if (!idToken) {
      throw new ValidationException("Apple ID token is required");
    }
    const appleUserInfo = await this.appleOAuthService.verifyIdToken(
      idToken,
      userData
    );
    let student = await this.studentRepository.findOne({
      providerId: appleUserInfo.sub,
      authProvider: "apple",
    });
    let isNewUser = false;
    if (student) {
      const token = this.tokenService.generateToken(student.id);
      return { student, token, isNewUser };
    }
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
    if (!batchId) {
      throw new ValidationException(
        "Batch ID is required for new user registration via Apple Sign-In"
      );
    }
    const batch = await this.batchRepository.findById(batchId);
    if (!batch) {
      throw new ValidationException("Invalid batch ID");
    }
    let firstName = "User";
    let lastName = "";
    if (appleUserInfo.name) {
      firstName = appleUserInfo.name.firstName || "User";
      lastName = appleUserInfo.name.lastName || "";
    }
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
