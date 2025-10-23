/**
 * Mongoose Batch Model
 * Infrastructure layer - database adapter
 */

const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: [true, "Please add a batch name"],
      unique: true,
      trim: true,
      maxlength: [50, "Batch name cannot be more than 50 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
batchSchema.index({ batchName: 1 });

module.exports = mongoose.model("Batch", batchSchema);
