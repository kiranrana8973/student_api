/**
 * Student Repository Interface
 * Defines the contract for student data operations
 */

class IStudentRepository {
  /**
   * Create a new student
   * @param {Student} student
   * @returns {Promise<Student>}
   */
  async create(student) {
    throw new Error("Method create() must be implemented");
  }

  /**
   * Find student by ID
   * @param {string} id
   * @returns {Promise<Student|null>}
   */
  async findById(id) {
    throw new Error("Method findById() must be implemented");
  }

  /**
   * Find student by email
   * @param {string} email
   * @returns {Promise<Student|null>}
   */
  async findByEmail(email) {
    throw new Error("Method findByEmail() must be implemented");
  }

  /**
   * Find student by email with password
   * @param {string} email
   * @returns {Promise<Student|null>}
   */
  async findByEmailWithPassword(email) {
    throw new Error("Method findByEmailWithPassword() must be implemented");
  }

  /**
   * Get all students with pagination
   * @param {number} skip
   * @param {number} limit
   * @returns {Promise<{students: Student[], total: number}>}
   */
  async findAll(skip, limit) {
    throw new Error("Method findAll() must be implemented");
  }

  /**
   * Find students by batch
   * @param {string} batchId
   * @returns {Promise<Student[]>}
   */
  async findByBatch(batchId) {
    throw new Error("Method findByBatch() must be implemented");
  }

  /**
   * Find students by course
   * @param {string} courseId
   * @returns {Promise<Student[]>}
   */
  async findByCourse(courseId) {
    throw new Error("Method findByCourse() must be implemented");
  }

  /**
   * Update student
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Student|null>}
   */
  async update(id, data) {
    throw new Error("Method update() must be implemented");
  }

  /**
   * Delete student
   * @param {string} id
   * @returns {Promise<Student|null>}
   */
  async delete(id) {
    throw new Error("Method delete() must be implemented");
  }

  /**
   * Check if student exists by email
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async existsByEmail(email) {
    throw new Error("Method existsByEmail() must be implemented");
  }

  /**
   * Find student by query
   * @param {Object} query
   * @returns {Promise<Student|null>}
   */
  async findOne(query) {
    throw new Error("Method findOne() must be implemented");
  }
}

module.exports = IStudentRepository;
