const express = require('express');
const createCourseRoutes = (courseController, authMiddleware) => {
  const router = express.Router();
  router.get(
    '/getAllCourses',
    courseController.getCourses.bind(courseController)
  );
  router.get('/:id', courseController.getCourse.bind(courseController));
  router.post(
    '/createCourse',
    courseController.create.bind(courseController)
  );
  router.put(
    '/:id',
    authMiddleware.protect(),
    courseController.update.bind(courseController)
  );
  router.delete(
    '/:id',
    authMiddleware.protect(),
    courseController.delete.bind(courseController)
  );
  return router;
};
module.exports = createCourseRoutes;
