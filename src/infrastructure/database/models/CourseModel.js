/**
 * Mongoose Course Model
 * Infrastructure layer - database adapter
 */

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, 'Please add a course name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Course name cannot be more than 50 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
courseSchema.index({ courseName: 1 });

module.exports = mongoose.model('Course', courseSchema);
