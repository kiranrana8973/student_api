const createStudentRoutes = require('./studentRoutes');
const createCourseRoutes = require('./courseRoutes');
const createBatchRoutes = require('./batchRoutes');
const setupRoutes = (app, container) => {
  const studentController = container.getStudentController();
  const courseController = container.getCourseController();
  const batchController = container.getBatchController();
  const authMiddleware = container.getAuthMiddleware();
  app.use('/api/students', createStudentRoutes(studentController, authMiddleware));
  app.use('/api/courses', createCourseRoutes(courseController, authMiddleware));
  app.use('/api/batches', createBatchRoutes(batchController, authMiddleware));
};
module.exports = setupRoutes;
