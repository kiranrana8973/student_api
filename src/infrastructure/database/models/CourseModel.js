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
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
      default: null,
    },
    duration: {
      type: Number,
      required: false,
      min: [1, 'Duration must be at least 1'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
courseSchema.index({ courseName: 1 });

module.exports = mongoose.model('Course', courseSchema);
