/**
 * Batch Entity - Domain Model
 * Pure business logic, framework-independent
 */

class Batch {
  constructor({ id, batchName, createdAt, updatedAt }) {
    this.id = id;
    this.batchName = batchName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validate batch data
   */
  validate() {
    const errors = [];

    if (!this.batchName || this.batchName.trim().length === 0) {
      errors.push('Batch name is required');
    }

    if (this.batchName && this.batchName.length > 50) {
      errors.push('Batch name cannot be more than 50 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      id: this.id,
      batchName: this.batchName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Batch;
