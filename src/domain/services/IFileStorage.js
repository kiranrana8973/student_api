class IFileStorage {
  async delete(filePath) {
    throw new Error('Method delete() must be implemented');
  }
  async exists(filePath) {
    throw new Error('Method exists() must be implemented');
  }
  getPath(fileName) {
    throw new Error('Method getPath() must be implemented');
  }
}
module.exports = IFileStorage;
