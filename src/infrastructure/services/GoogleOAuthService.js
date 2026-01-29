const { OAuth2Client } = require('google-auth-library');
const IGoogleOAuthService = require('../../domain/services/IGoogleOAuthService');
class GoogleOAuthService extends IGoogleOAuthService {
  constructor() {
    super();
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    if (!this.clientId) {
      console.warn('Warning: GOOGLE_CLIENT_ID is not set in environment variables');
    }
    this.client = new OAuth2Client(this.clientId);
  }
  async verifyIdToken(idToken) {
    try {
      if (!this.clientId) {
        throw new Error('Google OAuth is not configured. Please set GOOGLE_CLIENT_ID in environment variables');
      }
      const ticket = await this.client.verifyIdToken({
        idToken: idToken,
        audience: this.clientId,
      });
      const payload = ticket.getPayload();
      return {
        sub: payload.sub, // Google user ID
        email: payload.email,
        email_verified: payload.email_verified,
        name: payload.name,
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture: payload.picture,
        locale: payload.locale,
      };
    } catch (error) {
      throw new Error(`Failed to verify Google token: ${error.message}`);
    }
  }
}
module.exports = GoogleOAuthService;
