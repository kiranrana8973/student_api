/**
 * Upload Student Image Use Case
 */

const ValidationException = require('../../../domain/exceptions/ValidationException');

class UploadStudentImage {
  constructor(fileStorage) {
    this.fileStorage = fileStorage;
  }

  async execute(file) {
    if (!file) {
      throw new ValidationException('Please upload a file');
    }

    // Check file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      // Delete the uploaded file
      if (file.path) {
        await this.fileStorage.delete(file.path);
      }
      throw new ValidationException('Please upload an image less than 2MB');
    }

    return file.filename;
  }
}

module.exports = UploadStudentImage;
