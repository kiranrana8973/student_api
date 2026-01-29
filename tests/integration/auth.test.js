const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  createMockStudent,
  createMockBatch,
} = require("../helpers/testUtils");
const Container = require("../../src/container");
const createStudentRoutes = require("../../src/presentation/http/routes/studentRoutes");
let app;
let studentController;
let authMiddleware;
beforeAll(async () => {
  await setupTestDB();
  app = express();
  app.use(express.json());
  const container = new Container();
  studentController = container.getStudentController();
  authMiddleware = container.getAuthMiddleware();
  const studentRoutes = createStudentRoutes(studentController, authMiddleware);
  app.use("/api/v1/auth", studentRoutes);
});
afterAll(async () => {
  await teardownTestDB();
});
afterEach(async () => {
  await clearDatabase();
});
describe("Authentication API Endpoints", () => {
  describe("POST /api/v1/auth/register", () => {
    test("should register a new student", async () => {
      const Batch = mongoose.model("Batch");
      const batch = await Batch.create(createMockBatch());
      const studentData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        batch: batch._id.toString(),
        phone: "1234567890",
      };
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(studentData)
        .expect(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe("John");
      expect(response.body.data.lastName).toBe("Doe");
      expect(response.body.data.email).toBe("john@example.com");
      expect(response.body.data.password).toBeUndefined(); // Password should not be returned
    });
    test("should return error for duplicate email", async () => {
      const Batch = mongoose.model("Batch");
      const Student = mongoose.model("Student");
      const batch = await Batch.create(createMockBatch());
      const studentData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        batch: batch._id,
      };
      await Student.create(studentData);
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(studentData)
        .expect(400);
      expect(response.body.success).toBe(false);
    });
    test("should return error for missing required fields", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "John Doe",
        })
        .expect(400);
      expect(response.body.success).toBe(false);
    });
  });
  describe("POST /api/v1/auth/login", () => {
    test("should login with valid credentials", async () => {
      const Batch = mongoose.model("Batch");
      const Student = mongoose.model("Student");
      const batch = await Batch.create(createMockBatch());
      const studentData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        batch: batch._id,
      };
      await request(app).post("/api/v1/auth/register").send(studentData);
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "john@example.com",
          password: "password123",
        })
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe("john@example.com");
    });
    test("should return error for invalid email", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);
      expect(response.body.success).toBe(false);
    });
    test("should return error for incorrect password", async () => {
      const Batch = mongoose.model("Batch");
      const batch = await Batch.create(createMockBatch());
      const studentData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        batch: batch._id,
      };
      await request(app).post("/api/v1/auth/register").send(studentData);
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "john@example.com",
          password: "wrongpassword",
        })
        .expect(401);
      expect(response.body.success).toBe(false);
    });
  });
  describe("GET /api/v1/auth/getMe", () => {
    test("should return current user with valid token", async () => {
      const Batch = mongoose.model("Batch");
      const batch = await Batch.create(createMockBatch());
      const studentData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        batch: batch._id,
      };
      await request(app).post("/api/v1/auth/register").send(studentData);
      const loginResponse = await request(app).post("/api/v1/auth/login").send({
        email: "john@example.com",
        password: "password123",
      });
      const token = loginResponse.body.token;
      const response = await request(app)
        .get("/api/v1/auth/getMe")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe("john@example.com");
    });
    test("should return error without token", async () => {
      const response = await request(app).get("/api/v1/auth/getMe").expect(401);
      expect(response.body.success).toBe(false);
    });
  });
  describe("GET /api/v1/auth/getAllStudents", () => {
    test("should return all students with valid token", async () => {
      const Batch = mongoose.model("Batch");
      const Student = mongoose.model("Student");
      const batch = await Batch.create(createMockBatch());
      await Student.create(
        createMockStudent({ batch: batch._id, email: "student1@test.com" })
      );
      await Student.create(
        createMockStudent({ batch: batch._id, email: "student2@test.com" })
      );
      await request(app).post("/api/v1/auth/register").send({
        name: "Admin",
        email: "admin@test.com",
        password: "admin123",
        batch: batch._id,
      });
      const loginResponse = await request(app).post("/api/v1/auth/login").send({
        email: "admin@test.com",
        password: "admin123",
      });
      const token = loginResponse.body.token;
      const response = await request(app)
        .get("/api/v1/auth/getAllStudents")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
    test("should return error without authentication", async () => {
      const response = await request(app)
        .get("/api/v1/auth/getAllStudents")
        .expect(401);
      expect(response.body.success).toBe(false);
    });
  });
});
