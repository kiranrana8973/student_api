class CourseController {
  constructor(useCases) {
    this.createCourse = useCases.createCourse;
    this.getAllCourses = useCases.getAllCourses;
    this.getCourseById = useCases.getCourseById;
    this.updateCourse = useCases.updateCourse;
    this.deleteCourse = useCases.deleteCourse;
  }
  async getCourses(req, res, next) {
    try {
      const courses = await this.getAllCourses.execute();
      res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }
  async getCourse(req, res, next) {
    try {
      const course = await this.getCourseById.execute(req.params.id);
      res.status(200).json({
        success: true,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      const course = await this.createCourse.execute(req.body);
      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const course = await this.updateCourse.execute(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
      await this.deleteCourse.execute(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Course deleted successfully',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = CourseController;
