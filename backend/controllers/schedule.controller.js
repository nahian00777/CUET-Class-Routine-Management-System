import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/courses.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Schedule } from "../models/schedule.model.js";
import mongoose from "mongoose";

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
  const { course, timeSlots, department, level, term, section } = req.body;

  if (!mongoose.Types.ObjectId.isValid(course)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  // Validate required fields
  if (!course || !timeSlots || !department || !level || !term || !section) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Define the query to find an existing schedule
    const query = { course, department, section, term, level };

    // Define the update operation
    const update = {
      timeSlots,
      department,
      level,
      term,
      section,
    };

    // Options for findOneAndUpdate
    const options = {
      new: true, // Return the updated document
      upsert: true, // Create a new document if no match is found
      setDefaultsOnInsert: true, // Apply default values if a new document is created
    };

    // Find and update the schedule, or create a new one if it doesn't exist
    const savedSchedule = await Schedule.findOneAndUpdate(
      query,
      update,
      options
    );

    // Send a success response with the saved schedule
    res.status(200).json(savedSchedule);
  } catch (error) {
    console.log(error);
    // Handle any errors that occur during save
    res.status(500).json({
      message: "Failed to create or update schedule",
      error: error.message,
    });
  }
});
