const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = Schema(
  {
    user_id: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    labname: {
      type: String,
      required: false,
      trim: true,
    },
    lab_addr: {
      type: String,
      required: false,
      trim: true,
    },
    testname: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
