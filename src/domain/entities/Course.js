/**
 * Course Entity - Domain Model
 * Pure business logic, framework-independent
 */

class Course {
  constructor({ id, courseName, createdAt, updatedAt }) {
    this.id = id;
    this.courseName = courseName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validate course data
   */
  validate() {
    const errors = [];

    if (!this.courseName || this.courseName.trim().length === 0) {
      errors.push('Course name is required');
    }

    if (this.courseName && this.courseName.length > 50) {
      errors.push('Course name cannot be more than 50 characters');
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
      courseName: this.courseName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Course;
