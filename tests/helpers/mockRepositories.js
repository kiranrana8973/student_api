class MockStudentRepository {
  constructor() {
    this.students = [];
  }
  async create(studentData) {
    const student = {
      _id: "507f1f77bcf86cd799439011",
      ...studentData,
      createdAt: new Date(),
    };
    this.students.push(student);
    return student;
  }
  async findByEmail(email) {
    return this.students.find((s) => s.email === email) || null;
  }
  async findByEmailWithPassword(email) {
    return this.students.find((s) => s.email === email) || null;
  }
  async findById(id) {
    return this.students.find((s) => s._id === id) || null;
  }
  async findAll(options = {}) {
    return this.students;
  }
  async findByBatch(batchId) {
    return this.students.filter((s) => s.batch === batchId);
  }
  async findByCourse(courseId) {
    return this.students.filter((s) => s.course === courseId);
  }
  async update(id, updateData) {
    const index = this.students.findIndex((s) => s._id === id);
    if (index === -1) return null;
    this.students[index] = { ...this.students[index], ...updateData };
    return this.students[index];
  }
  async delete(id) {
    const index = this.students.findIndex((s) => s._id === id);
    if (index === -1) return null;
    const deleted = this.students[index];
    this.students.splice(index, 1);
    return deleted;
  }
  async findOne(query) {
    return (
      this.students.find((s) => {
        return Object.keys(query).every((key) => s[key] === query[key]);
      }) || null
    );
  }
}
class MockCourseRepository {
  constructor() {
    this.courses = [];
  }
  async create(courseData) {
    const course = {
      _id: "507f1f77bcf86cd799439012",
      ...courseData,
      createdAt: new Date(),
    };
    this.courses.push(course);
    return course;
  }
  async findById(id) {
    return this.courses.find((c) => c._id === id) || null;
  }
  async findAll() {
    return this.courses;
  }
  async update(id, updateData) {
    const index = this.courses.findIndex((c) => c._id === id);
    if (index === -1) return null;
    this.courses[index] = { ...this.courses[index], ...updateData };
    return this.courses[index];
  }
  async delete(id) {
    const index = this.courses.findIndex((c) => c._id === id);
    if (index === -1) return null;
    const deleted = this.courses[index];
    this.courses.splice(index, 1);
    return deleted;
  }
}
class MockBatchRepository {
  constructor() {
    this.batches = [];
  }
  async create(batchData) {
    const batch = {
      _id: "507f1f77bcf86cd799439013",
      ...batchData,
      createdAt: new Date(),
    };
    this.batches.push(batch);
    return batch;
  }
  async findById(id) {
    return this.batches.find((b) => b._id === id) || null;
  }
  async findAll() {
    return this.batches;
  }
  async update(id, updateData) {
    const index = this.batches.findIndex((b) => b._id === id);
    if (index === -1) return null;
    this.batches[index] = { ...this.batches[index], ...updateData };
    return this.batches[index];
  }
  async delete(id) {
    const index = this.batches.findIndex((b) => b._id === id);
    if (index === -1) return null;
    const deleted = this.batches[index];
    this.batches.splice(index, 1);
    return deleted;
  }
  async exists(id) {
    return this.batches.some((b) => b._id === id);
  }
}
class MockPasswordHasher {
  async hash(password) {
    return `hashed_${password}`;
  }
  async compare(password, hashedPassword) {
    return hashedPassword === `hashed_${password}`;
  }
}
class MockTokenService {
  generateToken(payload) {
    return "mock_jwt_token";
  }
  generate(payload) {
    return "mock_jwt_token";
  }
  verify(token) {
    if (token === "mock_jwt_token") {
      return { id: "507f1f77bcf86cd799439011" };
    }
    throw new Error("Invalid token");
  }
}
class MockFileStorage {
  async save(file) {
    return {
      filename: "test_image.jpg",
      path: "/uploads/test_image.jpg",
    };
  }
  async delete(filename) {
    return true;
  }
}
module.exports = {
  MockStudentRepository,
  MockCourseRepository,
  MockBatchRepository,
  MockPasswordHasher,
  MockTokenService,
  MockFileStorage,
};
