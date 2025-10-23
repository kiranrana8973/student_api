/**
 * Token Service Interface
 */

class ITokenService {
  /**
   * Generate JWT token for student
   * @param {string} studentId
   * @returns {string}
   */
  generateToken(studentId) {
    throw new Error('Method generateToken() must be implemented');
  }

  /**
   * Verify JWT token
   * @param {string} token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    throw new Error('Method verifyToken() must be implemented');
  }
}

module.exports = ITokenService;
