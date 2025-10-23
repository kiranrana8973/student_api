/**
 * Batch Repository Interface
 * Defines the contract for batch data operations
 */

class IBatchRepository {
  /**
   * Create a new batch
   * @param {Batch} batch
   * @returns {Promise<Batch>}
   */
  async create(batch) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Find batch by ID
   * @param {string} id
   * @returns {Promise<Batch|null>}
   */
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  /**
   * Find batch by name
   * @param {string} batchName
   * @returns {Promise<Batch|null>}
   */
  async findByName(batchName) {
    throw new Error('Method findByName() must be implemented');
  }

  /**
   * Get all batches
   * @returns {Promise<Batch[]>}
   */
  async findAll() {
    throw new Error('Method findAll() must be implemented');
  }

  /**
   * Update batch
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Batch|null>}
   */
  async update(id, data) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Delete batch
   * @param {string} id
   * @returns {Promise<Batch|null>}
   */
  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Check if batch exists
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async exists(id) {
    throw new Error('Method exists() must be implemented');
  }
}

module.exports = IBatchRepository;
