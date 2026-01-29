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
    capacity: {
      type: Number,
      required: [true, "Please add batch capacity"],
      min: [1, "Capacity must be at least 1"],
    },
    startDate: {
      type: Date,
      required: [true, "Please add start date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please add end date"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
  },
  {
    timestamps: true,
  }
);
batchSchema.index({ batchName: 1 });
module.exports = mongoose.model("Batch", batchSchema);
