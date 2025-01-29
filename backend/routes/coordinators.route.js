import { Router } from "express";
// prettier-ignore
import {
    addCoordinator,
    getCoordinator,
    loginCoordinator,
    logoutCoordinator,
    updateCoordinator,
} from "../controllers/coordinators.controller.js";
import { verifyJWT, verifyJWTteacher } from "../middlewares/auth.middleware.js";

const coordinatorRouter = Router();

coordinatorRouter.route("/addCoordinator").post(addCoordinator);

coordinatorRouter.route("/loginCoordinator").post(loginCoordinator);

coordinatorRouter.route("/logoutCoordinator").post(logoutCoordinator);

coordinatorRouter.route("/getCoordinator").get(getCoordinator);

// coordinatorRouter.route("/refreshAcessToken").post(refreshAccessToken);

// coordinatorRouter.route("/changePassword").patch(verifyJWT, changeCurrentPassword);

coordinatorRouter.route("/updateCoordinator").patch(updateCoordinator);

// coordinatorRouter.route("/getCurrentUser").get(verifyJWT, getCurrentUser);
export default coordinatorRouter;
