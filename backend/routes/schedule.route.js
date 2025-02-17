import { Router } from "express";
// prettier-ignore
import { findSchedule, getSchedules, setSchedules, updateTimeSlot } from "../controllers/schedule.controller.js";

const scheduleRouter = Router();

scheduleRouter.route("/setSchedule").post(setSchedules);
scheduleRouter.route("/getSchedule").post(getSchedules);
scheduleRouter.route("/findSchedule").post(findSchedule);
scheduleRouter.route("/updateTimeSlot").patch(updateTimeSlot);

export default scheduleRouter;
