import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  routine: {
    type: [[String]],
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
  },
  isLab: {
    type: Boolean,
    required: true,
    default: 1,
  },
});

export const Schedule = mongoose.model("Schedule", scheduleSchema);
