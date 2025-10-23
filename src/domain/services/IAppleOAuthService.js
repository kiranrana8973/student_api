/**
 * Apple OAuth Service Interface
 * Domain layer - defines contract for Apple Sign-In verification
 */

class IAppleOAuthService {
  /**
   * Verify Apple ID token and extract user information
   * @param {string} idToken - Apple ID token from client
   * @param {Object} userData - Additional user data from Apple (optional, only provided on first sign-in)
   * @returns {Promise<{sub: string, email: string, name?: {firstName: string, lastName: string}}>}
   */
  async verifyIdToken(idToken, userData = null) {
    throw new Error('Method not implemented');
  }
}

module.exports = IAppleOAuthService;
