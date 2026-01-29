const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { setupTestDB, teardownTestDB, clearDatabase, createMockCourse } = require('../helpers/testUtils');
const Container = require('../../src/container');
const createCourseRoutes = require('../../src/presentation/http/routes/courseRoutes');
let app;
let courseController;
let authMiddleware;
beforeAll(async () => {
  await setupTestDB();
  app = express();
  app.use(express.json());
  const container = new Container();
  courseController = container.getCourseController();
  authMiddleware = container.getAuthMiddleware();
  const courseRoutes = createCourseRoutes(courseController, authMiddleware);
  app.use('/api/v1/course', courseRoutes);
});
afterAll(async () => {
  await teardownTestDB();
});
afterEach(async () => {
  await clearDatabase();
});
describe('Course API Endpoints', () => {
  describe('GET /api/v1/course/getAllCourses', () => {
    test('should return empty array when no courses', async () => {
      const response = await request(app)
        .get('/api/v1/course/getAllCourses')
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });
    test('should return all courses', async () => {
      const Course = mongoose.model('Course');
      await Course.create(createMockCourse({ courseName: 'Course 1' }));
      await Course.create(createMockCourse({ courseName: 'Course 2' }));
      const response = await request(app)
        .get('/api/v1/course/getAllCourses')
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });
  describe('POST /api/v1/course/createCourse', () => {
    test('should create a new course', async () => {
      const courseData = createMockCourse({
        courseName: 'Computer Science',
        duration: '4 years',
        fees: 50000,
      });
      const response = await request(app)
        .post('/api/v1/course/createCourse')
        .send(courseData)
        .expect(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.courseName).toBe('Computer Science');
      expect(response.body.data.id).toBeDefined();
    });
    test('should return error with missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/course/createCourse')
        .send({})
        .expect(400);
      expect(response.body.success).toBe(false);
    });
  });
  describe('GET /api/v1/course/:id', () => {
    test('should return course by id', async () => {
      const Course = mongoose.model('Course');
      const course = await Course.create(createMockCourse());
      const response = await request(app)
        .get(`/api/v1/course/${course._id}`)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.courseName).toBe(course.courseName);
    });
    test('should return 404 for non-existent course', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/v1/course/${fakeId}`)
        .expect(404);
      expect(response.body.success).toBe(false);
    });
  });
  describe('PUT /api/v1/course/:id', () => {
    test('should update course', async () => {
      const Course = mongoose.model('Course');
      const course = await Course.create(createMockCourse());
      const updateData = { courseName: 'Updated Course Name' };
      const response = await request(app)
        .put(`/api/v1/course/${course._id}`)
        .send(updateData)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.courseName).toBe('Updated Course Name');
    });
  });
  describe('DELETE /api/v1/course/:id', () => {
    test('should delete course', async () => {
      const Course = mongoose.model('Course');
      const course = await Course.create(createMockCourse());
      const response = await request(app)
        .delete(`/api/v1/course/${course._id}`)
        .expect(200);
      expect(response.body.success).toBe(true);
      const deletedCourse = await Course.findById(course._id);
      expect(deletedCourse).toBeNull();
    });
  });
});
