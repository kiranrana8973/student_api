/**
 * Local File Storage Implementation
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const IFileStorage = require('../../domain/services/IFileStorage');

class LocalFileStorage extends IFileStorage {
  constructor(uploadDir) {
    super();
    this.uploadDir = uploadDir;
  }

  async delete(filePath) {
    await fs.unlink(filePath);
  }

  async exists(filePath) {
    return fsSync.existsSync(filePath);
  }

  getPath(fileName) {
    return path.join(this.uploadDir, fileName);
  }
}

module.exports = LocalFileStorage;
