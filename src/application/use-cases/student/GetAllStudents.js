/**
 * Get All Students Use Case
 */

class GetAllStudents {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(page = 1, limit = 25) {
    const skip = (page - 1) * limit;

    const result = await this.studentRepository.findAll(skip, limit);

    return {
      students: result.students,
      total: result.total,
      page,
      pages: Math.ceil(result.total / limit),
      count: result.students.length,
    };
  }
}

module.exports = GetAllStudents;
