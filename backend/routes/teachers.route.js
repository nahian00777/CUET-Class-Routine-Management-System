import { Router } from "express";
// prettier-ignore
import {
    addTeacher,
    deleteTeacher,
    getTeacher,
    loginTeacher,
    logoutTeacher,
    updateTeacher,
} from "../controllers/teachers.controller.js";
import { verifyJWT, verifyJWTteacher } from "../middlewares/auth.middleware.js";

const teacherRouter = Router();

teacherRouter.route("/addTeacher").post(addTeacher);

teacherRouter.route("/loginTeacher").post(loginTeacher);

teacherRouter.route("/logoutTeacher").post(verifyJWTteacher, logoutTeacher);

teacherRouter.route("/getTeacher").get(getTeacher);

// teacherRouter.route("/refreshAcessToken").post(refreshAccessToken);

// teacherRouter.route("/changePassword").patch(verifyJWT, changeCurrentPassword);

teacherRouter.route("/updateTeacher").patch(updateTeacher);

teacherRouter.route("/deleteTeacher").delete(deleteTeacher);

// teacherRouter.route("/getCurrentUser").get(verifyJWT, getCurrentUser);
export default teacherRouter;
