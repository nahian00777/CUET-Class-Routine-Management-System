import { Router } from "express";
// prettier-ignore
import { getSchedules, setSchedules } from "../controllers/schedule.controller.js";

const scheduleRouter = Router();

scheduleRouter.route("/setSchedule").post(setSchedules);
scheduleRouter.route("/getSchedule").get(getSchedules);

export default scheduleRouter;
