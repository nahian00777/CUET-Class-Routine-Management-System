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

const addCourse = asyncHandler(async (req, res) => {
  const { courseID, courseName, creditHours } = req.body;

  const course = new Course({
    courseID,
    courseName,
    creditHours,
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

export { getCourses, addCourse, updateCourse };
