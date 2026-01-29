const ValidationException = require('../../../domain/exceptions/ValidationException');
const Course = require('../../../domain/entities/Course');
class CreateCourse {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }
  async execute(courseData) {
    const course = new Course(courseData);
    const validation = course.validate();
    if (!validation.isValid) {
      throw new ValidationException('Validation failed', validation.errors);
    }
    const createdCourse = await this.courseRepository.create(course);
    return createdCourse;
  }
}
module.exports = CreateCourse;
