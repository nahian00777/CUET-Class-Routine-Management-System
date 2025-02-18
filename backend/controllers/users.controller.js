import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { Coordinator } from "../models/coordinators.model.js";
import { Teacher } from "../models/teachers.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
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
  const { email, username, password } = req.body;
  // 2nd step :
  if ([username, password].some((field) => !field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  // console.log(username);
  // 3rd step :
  const existedUser = await User.findOne({ username: username });
  if (existedUser) {
    throw new ApiError(405, "User already exists");
  }
  const user = await User.create({
    email: email,
    username: username,
    password: password,
  });
  // console.log(user);

  // 8th step :
  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }
  console.log(createdUser);
  // 9th step :
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
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
  const { username, password, role } = req.body;
  // 2nd step:
  if (!username) {
    throw new ApiError(400, "username is required");
  }

  // 3rd step :
  var user = null;
  if (role === "coordinator") {
    user = await Coordinator.findOne({
      $or: [{ email: username }],
    });
  } else if (role === "teacher") {
    user = await Teacher.findOne({
      $or: [{ email: username }],
    });
  } else if (role === "admin") {
    user = await User.findOne({
      $or: [{ username }],
    });
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 4th step :
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // 5th step :
  const accessToken = await user.generateAccessToken();

  const refreshToken = await user.generateRefreshToken();

  // 6th step :
  user.refreshToken = refreshToken;
  await user.save({
    validateBeforeSave: false,
  });

  // hadling error
  var loggedInUser = null;
  if (role === "coordinator") {
    loggedInUser = await Coordinator.findById(user._id).select(
      "-password -refreshToken"
    );
  } else if (role === "teacher") {
    loggedInUser = await Teacher.findById(user._id).select(
      "-password -refreshToken"
    );
  } else if (role === "admin") {
    loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  }
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

const logoutUser = async (req, res) => {
  /*
  1. find the user
  2. update its refresh token to null
  3. clear the cookies
  4. return success response
  */

  // 1st step & 2nd step :
  const user = await User.findByIdAndUpdate(
    req.user._id,
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

const refreshAccessToken = asyncHandler(async (req, res) => {
  /*
    1. access toke expire --> refresh toke expire ?
    2. refresh token --> access token
    3. return success response
    */
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(404, "Invalid refresh token");
  }

  if (incomingRefreshToken != user.refreshToken) {
    throw new ApiError(401, "Refresh Token is invalid");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({
    validateBeforeSave: false,
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        "Token refreshed successfully"
      )
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword != confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match");
  }

  const user = await User.findById(req.user._id);
  // console.log(oldPassword);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  // console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User found successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username } = req.body;

  if (!fullName || !email || !username) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName: fullName,
        email: email,
        username: username,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(500, "User update failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
};
