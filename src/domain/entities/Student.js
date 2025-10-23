/**
 * Student Entity - Domain Model
 * Pure business logic, framework-independent
 */

class Student {
  constructor({
    id,
    firstName,
    lastName,
    phone,
    image,
    email,
    password,
    batch,
    course,
    authProvider,
    googleId,
    appleId,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.image = image;
    this.email = email;
    this.password = password;
    this.batch = batch;
    this.course = course || [];
    this.authProvider = authProvider || "email"; // 'email', 'google', 'apple'
    this.googleId = googleId;
    this.appleId = appleId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Get full name of student
   */
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Validate student data
   */
  validate() {
    const errors = [];

    if (!this.firstName || this.firstName.trim().length === 0) {
      errors.push("First name is required");
    }

    if (this.firstName && this.firstName.length > 50) {
      errors.push("First name cannot be more than 50 characters");
    }

    if (!this.lastName || this.lastName.trim().length === 0) {
      errors.push("Last name is required");
    }

    if (this.lastName && this.lastName.length > 50) {
      errors.push("Last name cannot be more than 50 characters");
    }

    if (!this.email || this.email.trim().length === 0) {
      errors.push("Email is required");
    }

    if (this.email && !/^\S+@\S+\.\S+$/.test(this.email)) {
      errors.push("Please provide a valid email address");
    }

    // Password is only required for email-based authentication
    if (this.authProvider === "email") {
      if (!this.password || this.password.length === 0) {
        errors.push("Password is required");
      }

      if (this.password && this.password.length < 6) {
        errors.push("Password must be at least 6 characters");
      }
    }

    if (!this.batch) {
      errors.push("Batch is required");
    }

    if (this.phone && !/^[0-9]{10}$/.test(this.phone)) {
      errors.push("Please add a valid 10-digit phone number");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if user has access to specific course
   */
  hasAccessToCourse(courseId) {
    return this.course.some((c) => c.toString() === courseId.toString());
  }

  /**
   * Convert to plain object (for response)
   */
  toJSON() {
    const { password, ...studentWithoutPassword } = this;
    return studentWithoutPassword;
  }
}

module.exports = Student;
