import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Coordinator } from "../models/coordinators.model.js";

const getCoordinator = asyncHandler(async (req, res) => {
  // 1. Fetch all Courses from the database
  const coordinator = await Coordinator.find();

  // 2. Return success response with the Courses
  return res
    .status(200)
    .json(new ApiResponse(200, coordinator, "Courses fetched successfully"));
});

const addCoordinator = asyncHandler(async (req, res) => {
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
  const { coordinatorID, coordinatorName, department, assignedBatch } =
    req.body;
  const email = coordinatorID + "@coordinator.com";
  const password = coordinatorID + "123";
  // 2nd step :
  if (
    [coordinatorName, coordinatorID, password].some(
      (field) => !field || field.trim() === ""
    ))
   {
    console.log("coordinatorName:", coordinatorName);
    throw new ApiError(400, "All fields are required");
  }
  // 3rd step :
  const existedUser = await Coordinator.findOne({
    $or: [{ coordinatorID }, { coordinatorName }],
  });
  if (existedUser) {
    throw new ApiError(405, "User already exists");
  }
  // 7th step :
  const coordinator = await Coordinator.create({
    coordinatorID,
    coordinatorName,
    department,
    email,
    password,
    assignedBatch,
    // coverImage: coverImage?.url || "",
  });

  // 8th step :
  const createdTeacher = await Coordinator.findById(coordinator._id).select(
    "-password"
  );
  if (!createdTeacher) {
    throw new ApiError(500, "User creation failed");
  }
  // 9th step :
  return res
    .status(201)
    .json(new ApiResponse(201, coordinator, "User created successfully"));
});

const loginCoordinator = asyncHandler(async (req, res) => {
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
  const coordinator = await Coordinator.findOne({
    $or: [{ coordinatorID }, { coordinatorName }],
  });

  if (!coordinator) {
    throw new ApiError(404, "User not found");
  }

  // 4th step :
  const isPasswordValid = await coordinator.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // 5th step :
  const accessToken = await coordinator.generateAccessToken();

  const refreshToken = await coordinator.generateRefreshToken();

  // 6th step :
  coordinator.refreshToken = refreshToken;
  await coordinator.save({
    validateBeforeSave: false,
  });

  // hadling error
  const loggedInUser = await Coordinator.findById(coordinator._id).select(
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

const logoutCoordinator = async (req, res) => {
  /*
  1. find the user
  2. update its refresh token to null
  3. clear the cookies
  4. return success response
  */

  // 1st step & 2nd step :
  const coordinator = await Coordinator.findByIdAndUpdate(
    req.coordinator._id,
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

const updateCoordinator = asyncHandler(async (req, res) => {
  const { prevCoordinatorID, coordinatorID, coordinatorName, department } =
    req.body;

  if (!coordinatorID || !coordinatorName || !department) {
    throw new ApiError(400, "All fields are required");
  }
  const email = coordinatorID + "@coordinator.com";
  const password = coordinatorID + "123";
  // console.log("req.coordinator:", req.body);
  // console.log("req.coordinator:",prevcoordinatorID, coordinatorID, coordinatorName, department, email, password);
  // console.log("req.coordinator:", req.coordinator);
  const coordinator = await Coordinator.findOneAndUpdate(
    { coordinatorID: prevCoordinatorID },
    {
      $set: {
        coordinatorID,
        coordinatorName,
        department,
        email,
        password,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");
  // console.log("teacher:", teacher);
  if (!coordinator) {
    throw new ApiError(500, "User update failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, coordinator, "User updated successfully"));
});
export {
  getCoordinator,
  addCoordinator,
  loginCoordinator,
  logoutCoordinator,
  updateCoordinator,
};
