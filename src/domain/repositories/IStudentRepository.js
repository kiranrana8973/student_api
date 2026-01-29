class IStudentRepository {
  async create(student) {
    throw new Error("Method create() must be implemented");
  }
  async findById(id) {
    throw new Error("Method findById() must be implemented");
  }
  async findByEmail(email) {
    throw new Error("Method findByEmail() must be implemented");
  }
  async findByEmailWithPassword(email) {
    throw new Error("Method findByEmailWithPassword() must be implemented");
  }
  async findAll(skip, limit) {
    throw new Error("Method findAll() must be implemented");
  }
  async findByBatch(batchId) {
    throw new Error("Method findByBatch() must be implemented");
  }
  async findByCourse(courseId) {
    throw new Error("Method findByCourse() must be implemented");
  }
  async update(id, data) {
    throw new Error("Method update() must be implemented");
  }
  async delete(id) {
    throw new Error("Method delete() must be implemented");
  }
  async existsByEmail(email) {
    throw new Error("Method existsByEmail() must be implemented");
  }
  async findOne(query) {
    throw new Error("Method findOne() must be implemented");
  }
}
module.exports = IStudentRepository;
