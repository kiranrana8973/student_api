/**
 * Get All Courses Use Case
 */

class GetAllCourses {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute() {
    const courses = await this.courseRepository.findAll();
    return courses;
  }
}

module.exports = GetAllCourses;
