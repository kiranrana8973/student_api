const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Please add a last name'],
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters'],
    },
    phone: {
      type: String,
      default: null,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number'],
    },
    image: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please add a valid email'],
    },
    password: {
      type: String,
      required: function() {
        return !this.authProvider || this.authProvider === 'local';
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'apple'],
      default: 'local',
    },
    providerId: {
      type: String,
      default: null,
      sparse: true, // Allows multiple null values
    },
    batch: {
      type: mongoose.Schema.ObjectId,
      ref: 'Batch',
      required: [true, 'Please add a batch'],
    },
    course: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
studentSchema.index({ email: 1 });
studentSchema.index({ batch: 1 });
studentSchema.index({ course: 1 });
studentSchema.index({ createdAt: -1 });
studentSchema.index({ providerId: 1, authProvider: 1 }, { sparse: true }); // Composite index for OAuth lookup
module.exports = mongoose.model('Student', studentSchema);
