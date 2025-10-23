/**
 * Get Course By ID Use Case
 */

const NotFoundException = require('../../../domain/exceptions/NotFoundException');

class GetCourseById {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(id) {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundException(`Course not found with id of ${id}`);
    }

    return course;
  }
}

module.exports = GetCourseById;
