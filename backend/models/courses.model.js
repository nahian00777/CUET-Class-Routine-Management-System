import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseID: {
    type: String,
    required: true,
    unique: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  creditHours: {
    type: Number,
    required: true,
  },
  courseType: {
    type: String,
    required: true,
  },
});

export const Course = mongoose.model("Course", courseSchema);
