
class Batch {
  constructor({ id, batchName, capacity, startDate, endDate, createdAt, updatedAt }) {
    this.id = id;
    this.batchName = batchName;
    this.capacity = capacity;
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }


  validate() {
    const errors = [];

    if (!this.batchName || this.batchName.trim().length === 0) {
      errors.push('Batch name is required');
    }

    if (this.batchName && this.batchName.length > 50) {
      errors.push('Batch name cannot be more than 50 characters');
    }

    if (!this.capacity || typeof this.capacity !== 'number' || this.capacity <= 0) {
      errors.push('Capacity must be a positive number');
    }

    if (!this.startDate || !(this.startDate instanceof Date)) {
      errors.push('Start date is required and must be a valid date');
    }

    if (!this.endDate || !(this.endDate instanceof Date)) {
      errors.push('End date is required and must be a valid date');
    }

    if (this.startDate && this.endDate && this.startDate >= this.endDate) {
      errors.push('End date must be after start date');
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
      capacity: this.capacity,
      startDate: this.startDate,
      endDate: this.endDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Batch;
