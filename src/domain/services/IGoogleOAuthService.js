/**
 * Google OAuth Service Interface
 * Domain layer - defines contract for Google OAuth verification
 */

class IGoogleOAuthService {
  /**
   * Verify Google ID token and extract user information
   * @param {string} idToken - Google ID token from client
   * @returns {Promise<{sub: string, email: string, name: string, given_name: string, family_name: string, picture: string}>}
   */
  async verifyIdToken(idToken) {
    throw new Error('Method not implemented');
  }
}

module.exports = IGoogleOAuthService;
