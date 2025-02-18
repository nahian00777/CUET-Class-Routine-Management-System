import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Teacher } from "../models/teachers.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const getTeacher = asyncHandler(async (req, res) => {
  // 1. Fetch all Courses from the database
  const teacher = await Teacher.find();

  // 2. Return success response with the Courses
  return res
    .status(200)
    .json(new ApiResponse(200, teacher, "Courses fetched successfully"));
});

const addTeacher = asyncHandler(async (req, res) => {
  // 1. get user information from req.body
  // 2. validate user information
  // 3. check if user already exists
  // 4. check for avatar and coverImage
  // 5. upload avatar and coverImage on cloudinary
  // 6. check if avatar and coverImage uploaded successfully
  // 7. create user object in database
  // 8. check for user object creation
  // 9. return success response

  // 1st step :
  const { teacherID, teacherName, department } = req.body;
  const email = teacherID + "@teacher.com";
  const password = teacherID;
  // 2nd step :
  if (
    [teacherName, teacherID, password].some((field) => !field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // 3rd step :
  const existedUser = await Teacher.findOne({
    $or: [{ teacherID }],
  });
  if (existedUser) {
    throw new ApiError(405, "User already exists");
  }
  // 7th step :
  const teacher = await Teacher.create({
    teacherID,
    teacherName,
    department,
    email,
    password,
    // coverImage: coverImage?.url || "",
  });

  // 8th step :
  const createdTeacher = await Teacher.findById(teacher._id).select(
    "-password"
  );
  if (!createdTeacher) {
    throw new ApiError(500, "User creation failed");
  }
  // 9th step :
  return res
    .status(201)
    .json(new ApiResponse(201, createdTeacher, "User created successfully"));
});

const loginTeacher = asyncHandler(async (req, res) => {
  /*
    1. get user information from req.body
    2. check
    3. check user exists or not
    4. password validation
    5. generate access token and refresh token
    6. refresh token store in database
    7. cookies save refresh token and access token
    8. return success response
  */
  // 1st step :
  const { email, password } = req.body;
  // 2nd step:
  if (!email) {
    throw new ApiError(400, "Email or username is required");
  }

  // 3rd step :
  const teacher = await Teacher.findOne({
    email: email,
    password: password,
  });

  if (!teacher) {
    throw new ApiError(404, "User not found");
  }

  // 4th step :
  // const isPasswordValid = await teacher.isPasswordCorrect(password);

  // if (!isPasswordValid) {
  //   throw new ApiError(401, "Invalid password");
  // }

  // 5th step :
  const accessToken = await teacher.generateAccessToken();

  const refreshToken = await teacher.generateRefreshToken();

  // 6th step :
  teacher.refreshToken = refreshToken;
  await teacher.save({
    validateBeforeSave: false,
  });

  // hadling error
  const loggedInUser = await Teacher.findById(teacher._id).select(
    "-password -refreshToken"
  );
  if (!loggedInUser) {
    throw new ApiError(500, "User login failed");
  }

  // cookies can be accessed by only backend user
  const options = await {
    httpOnly: true,
    secure: true,
  };

  // 7th && 8th step :
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutTeacher = async (req, res) => {
  /*
  1. find the user
  2. update its refresh token to null
  3. clear the cookies
  4. return success response
  */

  // 1st step & 2nd step :
  const teacher = await Teacher.findByIdAndUpdate(
    req.teacher._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // 3rd step & 4th step :
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged out successfully"));
};

// const refreshAccessToken = asyncHandler(async (req, res) => {
//   /*
//     1. access toke expire --> refresh toke expire ?
//     2. refresh token --> access token
//     3. return success response
//     */
//   const incomingRefreshToken = req.cookies.refreshToken;
//   if (!incomingRefreshToken) {
//     throw new ApiError(401, "Unauthorized access");
//   }

//   const decodedToken = jwt.verify(
//     incomingRefreshToken,
//     process.env.REFRESH_TOKEN_SECRET
//   );

//   const user = await User.findById(decodedToken?._id);

//   if (!user) {
//     throw new ApiError(404, "Invalid refresh token");
//   }

//   if (incomingRefreshToken != user.refreshToken) {
//     throw new ApiError(401, "Refresh Token is invalid");
//   }

//   const accessToken = await user.generateAccessToken();
//   const refreshToken = await user.generateRefreshToken();

//   user.refreshToken = refreshToken;
//   await user.save({
//     validateBeforeSave: false,
//   });

//   const options = {
//     httpOnly: true,
//     secure: true,
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       new ApiResponse(
//         200,
//         {
//           accessToken,
//           refreshToken,
//         },
//         "Token refreshed successfully"
//       )
//     );
// });

// const changeCurrentPassword = asyncHandler(async (req, res) => {
//   const { oldPassword, newPassword, confirmPassword } = req.body;

//   if (newPassword != confirmPassword) {
//     throw new ApiError(400, "Password and confirm password do not match");
//   }

//   const user = await User.findById(req.user._id);

//   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

//   if (isPasswordCorrect) {
//     throw new ApiError(400, "Old password is incorrect");
//   }

//   user.password = newPassword;
//   await user.save({ validateBeforeSave: false });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Password changed successfully"));
// });

// const getCurrentUser = asyncHandler(async (req, res) => {
//   return res
//     .status(200)
//     .json(new ApiResponse(200, req.user, "User found successfully"));
// });

const updateTeacher = asyncHandler(async (req, res) => {
  const { prevTeacherID, teacherID, teacherName, department } = req.body;

  if (!teacherID || !teacherName || !department) {
    throw new ApiError(400, "All fields are required");
  }
  const email = teacherID + "@teacher.com";
  const password = teacherID + "123";
  // console.log("req.teacher:", req.body);
  // console.log("req.teacher:",prevteacherID, teacherID, teacherName, department, email, password);
  // console.log("req.teacher:", req.teacher);
  const teacher = await Teacher.findOneAndUpdate(
    { teacherID: prevTeacherID },
    {
      $set: {
        teacherID: teacherID,
        teacherName: teacherName,
        department: department,
        email: email,
        password: password,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  // console.log("teacher:", teacher);
  if (!teacher) {
    throw new ApiError(500, "User update failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, teacher, "User updated successfully"));
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const { teacherID } = req.body;

  if (!teacherID) {
    throw new ApiError(400, "Invalid teacher ID");
  }

  const teacher = await Teacher.findOneAndDelete({ teacherID: teacherID });
  if (!teacher) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export {
  addTeacher,
  loginTeacher,
  logoutTeacher,
  getTeacher,
  updateTeacher,
  deleteTeacher,
};
