/**
 * Update Student Use Case
 */

const NotFoundException = require('../../../domain/exceptions/NotFoundException');
const ValidationException = require('../../../domain/exceptions/ValidationException');

class UpdateStudent {
  constructor(studentRepository, batchRepository) {
    this.studentRepository = studentRepository;
    this.batchRepository = batchRepository;
  }

  async execute(id, updateData) {
    // Don't allow password update through this method
    if (updateData.password) {
      throw new ValidationException(
        'Password cannot be updated through this endpoint'
      );
    }

    // If batch is being updated, validate it exists
    if (updateData.batch) {
      const batchExists = await this.batchRepository.exists(updateData.batch);
      if (!batchExists) {
        throw new NotFoundException('Batch not found');
      }
    }

    // Update student
    const student = await this.studentRepository.update(id, updateData);

    if (!student) {
      throw new NotFoundException(`Student not found with id of ${id}`);
    }

    return student;
  }
}

module.exports = UpdateStudent;
