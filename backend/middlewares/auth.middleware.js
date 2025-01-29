import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";
import { Teacher } from "../models/teachers.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // 1. get token from request
  const authHeader = req.header("Authorization");
  const token =
    req.cookies?.accessToken ||
    (authHeader && authHeader.replace("Bearer ", ""));

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  // 2. decode token
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // 3. check user exists or not with the id
  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 4. set user in request object
  req.user = user;
  next();
});

export const verifyJWTteacher = asyncHandler(async (req, res, next) => {
  // 1. get token from request
  const authHeader = req.header("Authorization");
  const token =
    req.cookies?.accessToken ||
    (authHeader && authHeader.replace("Bearer ", ""));

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  // 2. decode token
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // 3. check user exists or not with the id
  const teacher = await Teacher.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!teacher) {
    return res.status(404).json({ message: "User not found" });
  }

  // 4. set user in request object
  req.teacher = teacher;
  next();
});
