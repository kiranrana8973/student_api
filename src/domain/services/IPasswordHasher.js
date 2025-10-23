/**
 * Password Hasher Service Interface
 */

class IPasswordHasher {
  /**
   * Hash a password
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hash(password) {
    throw new Error('Method hash() must be implemented');
  }

  /**
   * Compare password with hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  async compare(password, hash) {
    throw new Error('Method compare() must be implemented');
  }
}

module.exports = IPasswordHasher;
