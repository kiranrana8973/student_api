const NotFoundException = require('../../../domain/exceptions/NotFoundException');
const ValidationException = require('../../../domain/exceptions/ValidationException');
class UpdateStudent {
  constructor(studentRepository, batchRepository) {
    this.studentRepository = studentRepository;
    this.batchRepository = batchRepository;
  }
  async execute(id, updateData) {
    if (updateData.password) {
      throw new ValidationException(
        'Password cannot be updated through this endpoint'
      );
    }
    if (updateData.batch) {
      const batchExists = await this.batchRepository.exists(updateData.batch);
      if (!batchExists) {
        throw new NotFoundException('Batch not found');
      }
    }
    const student = await this.studentRepository.update(id, updateData);
    if (!student) {
      throw new NotFoundException(`Student not found with id of ${id}`);
    }
    return student;
  }
}
module.exports = UpdateStudent;
