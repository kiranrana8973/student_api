/**
 * File Storage Service Interface
 */

class IFileStorage {
  /**
   * Delete a file
   * @param {string} filePath
   * @returns {Promise<void>}
   */
  async delete(filePath) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Check if file exists
   * @param {string} filePath
   * @returns {Promise<boolean>}
   */
  async exists(filePath) {
    throw new Error('Method exists() must be implemented');
  }

  /**
   * Get file path
   * @param {string} fileName
   * @returns {string}
   */
  getPath(fileName) {
    throw new Error('Method getPath() must be implemented');
  }
}

module.exports = IFileStorage;
