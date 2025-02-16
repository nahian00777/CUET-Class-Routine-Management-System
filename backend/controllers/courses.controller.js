import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/courses.model.js";
import { ApiError } from "../utils/ApiError.js";

const getCourses = asyncHandler(async (req, res) => {
  // 1. Fetch all Courses from the database
  const course = await Course.find();

  // 2. Return success response with the Courses
  return res
    .status(200)
    .json(new ApiResponse(200, course, "Courses fetched successfully"));
});

export const getCourseByID = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  const course = await Course.findOne({ courseID: courseId });
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course get successfully"));
});

const addCourse = asyncHandler(async (req, res) => {
  const { courseID, courseName, creditHours, courseType } = req.body;

  const course = new Course({
    courseID,
    courseName,
    creditHours,
    courseType,
  });

  await course.save();

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course added successfully"));
});

const updateCourse = asyncHandler(async (req, res) => {
  const { prevCourseID, courseID, courseName, creditHours } = req.body;

  const course = await Course.findOneAndUpdate(
    { courseID: prevCourseID },
    {
      $set: {
        courseID,
        courseName,
        creditHours,
      },
    },
    {
      new: true,
    }
  );
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, course, "User updated successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { courseID } = req.body; // Ensure this matches the frontend

  if (!courseID) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  const course = await Course.findOneAndDelete({ courseID: courseID });
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course deleted successfully"));
});

export { getCourses, addCourse, updateCourse, deleteCourse };
