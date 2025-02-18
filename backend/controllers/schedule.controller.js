import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/courses.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Schedule } from "../models/schedule.model.js";
import mongoose from "mongoose";

export const getSchedules = asyncHandler(async (req, res) => {
  const { term, level, department } = req.body; // Expect these in the request body

  const schedules = await Schedule.find({
    term: term,
    level: level,
    department: department,
  });

  if (!schedules || schedules.length === 0) {
    throw new ApiError(404, "Schedules not found");
  }

  // Group routines by section
  const routinesBySection = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.section]) {
      acc[schedule.section] = [];
    }
    schedule.routine.forEach(([course, day, time, isLab]) => {
      acc[schedule.section].push({
        course,
        day,
        time,
        type: isLab == "1" ? "Lab" : "Theory",
        span: isLab == "1" ? 3 : 1,
      });
    });
    return acc;
  }, {});

  // Return success response with the grouped routines
  return res
    .status(200)
    .json(
      new ApiResponse(200, routinesBySection, "Schedules fetched successfully")
    );
});

export const setSchedules = asyncHandler(async (req, res) => {
  const { routine, department, level, term, section } = req.body;

  // Validate required fields
  if (!routine || !department || !level || !term || !section) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Define the query to find an existing schedule
    const query = { department, level, term, section };

    // Define the update operation
    const update = {
      routine,
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
    console.error("Error creating/updating schedule:", error);
    res.status(500).json({
      message: "Failed to create or update schedule",
      error: error.message,
    });
  }
});

export const findSchedule = asyncHandler(async (req, res) => {
  const { instructor } = req.body;
  const schedule = await Schedule.find({ instructor: instructor });
  if (!schedule) {
    throw new ApiError(404, "Schedule not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, schedule, "Schedule fetched successfully"));
});

export const updateTimeSlot = asyncHandler(async (req, res) => {
  const { courseId, timeSlots } = req.body;
  const courseObjectId = await Course.findOne({ courseID: courseId });
  if (!courseObjectId) {
    throw new ApiError(404, "Course not found");
  }
  const schedule = await Schedule.findOneAndUpdate(
    { course: courseObjectId },
    { timeSlots: timeSlots },
    { new: true }
  );
  if (!schedule) {
    throw new ApiError(404, "Schedule not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, schedule, "Schedule updated successfully"));
});
