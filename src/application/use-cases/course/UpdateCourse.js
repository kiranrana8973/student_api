/**
 * Update Course Use Case
 */

const NotFoundException = require('../../../domain/exceptions/NotFoundException');

class UpdateCourse {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(id, updateData) {
    const course = await this.courseRepository.update(id, updateData);

    if (!course) {
      throw new NotFoundException(`Course not found with id of ${id}`);
    }

    return course;
  }
}

module.exports = UpdateCourse;
