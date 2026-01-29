const NotFoundException = require('../../../domain/exceptions/NotFoundException');
class DeleteStudent {
  constructor(studentRepository, fileStorage) {
    this.studentRepository = studentRepository;
    this.fileStorage = fileStorage;
  }
  async execute(id) {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw new NotFoundException(`Student not found with id of ${id}`);
    }
    if (student.image) {
      const imagePath = this.fileStorage.getPath(student.image);
      const fileExists = await this.fileStorage.exists(imagePath);
      if (fileExists) {
        try {
          await this.fileStorage.delete(imagePath);
        } catch (err) {
          console.error(`Error deleting image: ${err.message}`);
        }
      }
    }
    await this.studentRepository.delete(id);
    return student;
  }
}
module.exports = DeleteStudent;
