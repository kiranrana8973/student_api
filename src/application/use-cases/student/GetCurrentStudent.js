const NotFoundException = require('../../../domain/exceptions/NotFoundException');
class GetCurrentStudent {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }
  async execute(studentId) {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }
}
module.exports = GetCurrentStudent;
