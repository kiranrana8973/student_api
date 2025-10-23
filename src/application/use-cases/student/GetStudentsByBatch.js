/**
 * Get Students By Batch Use Case
 */

const NotFoundException = require('../../../domain/exceptions/NotFoundException');

class GetStudentsByBatch {
  constructor(studentRepository, batchRepository) {
    this.studentRepository = studentRepository;
    this.batchRepository = batchRepository;
  }

  async execute(batchId) {
    // Validate batch exists
    const batch = await this.batchRepository.findById(batchId);
    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const students = await this.studentRepository.findByBatch(batchId);

    return students;
  }
}

module.exports = GetStudentsByBatch;
