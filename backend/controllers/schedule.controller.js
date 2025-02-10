import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/courses.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Schedule } from "../models/schedule.model.js";

export const getSchedules = asyncHandler(async (req, res) => {
  // 1. Fetch specific schedule
  const { section, term, level, department } = req.body;
  const schedule = await Schedule.find({
    section,
    term,
    level,
    department,
  }).populate("course");
  // 2. Return success response with the schedule
  return res
    .status(200)
    .json(new ApiResponse(200, schedule, "Schedule fetched successfully"));
});

export const setSchedules = asyncHandler(async (req, res) => {
  const { course, timeSlots, department, level, term , section} = req.body;

  // Validate required fields
  if (!course || !timeSlots || !department || !level || !term || !section) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Create a new Schedule document
  const newSchedule = new Schedule({
    course,
    timeSlots,
    department, // Assuming you might want to include department, level, and term as part of the schema
    level,
    term,
    section
  });

  try {
    // Save the Schedule to the database
    const savedSchedule = await Schedule.save(newSchedule);
    // Send a success response with the saved schedule
    res.status(201).json(savedSchedule);
  } catch (error) {
    // Handle any errors that occur during save
    res
      .status(500)
      .json({ message: "Failed to create schedule", error: error.message });
  }
});
