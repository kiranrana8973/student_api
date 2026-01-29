class IAppleOAuthService {
  async verifyIdToken(idToken, userData = null) {
    throw new Error('Method not implemented');
  }
}
module.exports = IAppleOAuthService;
