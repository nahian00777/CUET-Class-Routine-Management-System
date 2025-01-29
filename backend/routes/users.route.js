import { Router } from "express";
// prettier-ignore
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
} from "../controllers/users.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/refreshAcessToken").post(refreshAccessToken);

userRouter.route("/changePassword").patch(verifyJWT, changeCurrentPassword);

userRouter
  .route("/updateAccountDetails")
  .patch(verifyJWT, updateAccountDetails);

userRouter.route("/getCurrentUser").get(verifyJWT, getCurrentUser);
export default userRouter;
