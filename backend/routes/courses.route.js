import { Router } from "express";
// prettier-ignore
import {
    getCourses,
    addCourse,
    updateCourse,
    getCourseByID,
} from "../controllers/courses.controller.js";

const courseRouter = Router();

courseRouter.route("/addCourse").post(addCourse);
courseRouter.route("/getCourse").get(getCourses);
courseRouter.route("/updateCourse").patch(updateCourse);
courseRouter.route("/getCourseById").post(getCourseByID);

export default courseRouter;
