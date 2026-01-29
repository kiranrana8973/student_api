class Course {
  constructor({ id, courseName, description, duration, createdAt, updatedAt }) {
    this.id = id;
    this.courseName = courseName;
    this.description = description || null;
    this.duration = duration || null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  validate() {
    const errors = [];
    if (!this.courseName || this.courseName.trim().length === 0) {
      errors.push('Course name is required');
    }
    if (this.courseName && this.courseName.length > 50) {
      errors.push('Course name cannot be more than 50 characters');
    }
    if (this.description && this.description.length > 500) {
      errors.push('Description cannot be more than 500 characters');
    }
    if (this.duration !== null && this.duration !== undefined) {
      if (typeof this.duration !== 'number' || this.duration <= 0) {
        errors.push('Duration must be a positive number');
      }
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  toJSON() {
    return {
      id: this.id,
      courseName: this.courseName,
      description: this.description,
      duration: this.duration,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
module.exports = Course;
