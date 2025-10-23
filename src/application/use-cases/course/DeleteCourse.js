/**
 * Delete Course Use Case
 */

const NotFoundException = require('../../../domain/exceptions/NotFoundException');

class DeleteCourse {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(id) {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundException(`Course not found with id of ${id}`);
    }

    await this.courseRepository.delete(id);

    return course;
  }
}

module.exports = DeleteCourse;
