/**
 * Get Students By Course Use Case
 */

class GetStudentsByCourse {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async execute(courseId) {
    const students = await this.studentRepository.findByCourse(courseId);
    return students;
  }
}

module.exports = GetStudentsByCourse;
