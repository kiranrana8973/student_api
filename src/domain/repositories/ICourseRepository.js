/**
 * Course Repository Interface
 * Defines the contract for course data operations
 */

class ICourseRepository {
  /**
   * Create a new course
   * @param {Course} course
   * @returns {Promise<Course>}
   */
  async create(course) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Find course by ID
   * @param {string} id
   * @returns {Promise<Course|null>}
   */
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  /**
   * Find course by name
   * @param {string} courseName
   * @returns {Promise<Course|null>}
   */
  async findByName(courseName) {
    throw new Error('Method findByName() must be implemented');
  }

  /**
   * Get all courses
   * @returns {Promise<Course[]>}
   */
  async findAll() {
    throw new Error('Method findAll() must be implemented');
  }

  /**
   * Update course
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Course|null>}
   */
  async update(id, data) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Delete course
   * @param {string} id
   * @returns {Promise<Course|null>}
   */
  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Check if course exists
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async exists(id) {
    throw new Error('Method exists() must be implemented');
  }
}

module.exports = ICourseRepository;
