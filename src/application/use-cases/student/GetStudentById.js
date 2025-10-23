/**
 * Get Student By ID Use Case
 */

const NotFoundException = require('../../../domain/exceptions/NotFoundException');

class GetStudentById {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(id) {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      throw new NotFoundException(`Student not found with id of ${id}`);
    }

    return student;
  }
}

module.exports = GetStudentById;
