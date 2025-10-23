/**
 * Apple OAuth Service Implementation
 * Infrastructure layer - implements Apple Sign-In verification using apple-signin-auth
 */

const appleSignin = require('apple-signin-auth');
const IAppleOAuthService = require('../../domain/services/IAppleOAuthService');

class AppleOAuthService extends IAppleOAuthService {
  constructor() {
    super();
    this.clientId = process.env.APPLE_CLIENT_ID; // Your app's bundle ID or service ID

    if (!this.clientId) {
      console.warn('Warning: APPLE_CLIENT_ID is not set in environment variables');
    }
  }

  /**
   * Verify Apple ID token and extract user information
   * @param {string} idToken - Apple ID token from client
   * @param {Object} userData - Additional user data from Apple (optional, only provided on first sign-in)
   * @returns {Promise<{sub: string, email: string, name?: {firstName: string, lastName: string}}>}
   */
  async verifyIdToken(idToken, userData = null) {
    try {
      if (!this.clientId) {
        throw new Error('Apple Sign-In is not configured. Please set APPLE_CLIENT_ID in environment variables');
      }

      // Verify the token with Apple
      const appleIdTokenClaims = await appleSignin.verifyIdToken(idToken, {
        audience: this.clientId,
        ignoreExpiration: false, // Recommended to verify token expiration
      });

      const result = {
        sub: appleIdTokenClaims.sub, // Apple user ID (unique and stable)
        email: appleIdTokenClaims.email,
        email_verified: appleIdTokenClaims.email_verified === 'true' || appleIdTokenClaims.email_verified === true,
      };

      // Apple only provides user name data on the first sign-in
      // Client must send this data separately
      if (userData && userData.name) {
        result.name = {
          firstName: userData.name.firstName || '',
          lastName: userData.name.lastName || '',
        };
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to verify Apple token: ${error.message}`);
    }
  }
}

module.exports = AppleOAuthService;
