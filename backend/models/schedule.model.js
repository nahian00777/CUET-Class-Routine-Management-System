import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  timeSlots: [
    {
      day: {
        type: String,
        required: true,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
      startTime: {
        type: "String",
        require: true,
      },
      endTime: {
        type: "String",
        required: true,
      },
    },
  ],
  instructor: {
    type: String,
  },
  department: {
    type: String,
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
  section: {
    type: String,
    required: true,
  },
  room: {
    type: String,
  },
});

export const Schedule = mongoose.model("Schedule", scheduleSchema);
