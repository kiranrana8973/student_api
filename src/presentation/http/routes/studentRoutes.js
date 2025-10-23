const express = require('express');
const MulterUploadMiddleware = require('../../../infrastructure/middlewares/MulterUploadMiddleware');

const createStudentRoutes = (studentController, authMiddleware) => {
  const router = express.Router();

  const uploadMiddleware = new MulterUploadMiddleware();

  router.post(
    '/uploadImage',
    uploadMiddleware.single('profilePicture'),
    studentController.uploadImage.bind(studentController)
  );
  router.post('/register', studentController.register.bind(studentController));
  router.post('/login', studentController.login.bind(studentController));
  router.post('/google-login', studentController.googleLogin.bind(studentController));
  router.post('/apple-login', studentController.appleLogin.bind(studentController));
  router.get(
    '/getAllStudents',
    authMiddleware.protect(),
    studentController.getStudents.bind(studentController)
  );
  router.get(
    '/getStudentsByBatch/:batchId',
    authMiddleware.protect(),
    studentController.searchByBatch.bind(studentController)
  );
  router.get(
    '/getStudentsByCourse/:courseId',
    authMiddleware.protect(),
    studentController.searchByCourse.bind(studentController)
  );
  router.put(
    '/updateStudent/:id',
    authMiddleware.protect(),
    studentController.updateStudentData.bind(studentController)
  );
  router.delete(
    '/deleteStudent/:id',
    authMiddleware.protect(),
    studentController.deleteStudentData.bind(studentController)
  );
  router.get(
    '/getMe',
    authMiddleware.protect(),
    studentController.getMe.bind(studentController)
  );

  return router;
};

module.exports = createStudentRoutes;
