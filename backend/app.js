import express from "express";
import cors from "cors";
import userRouter from "./routes/users.route.js";
import cookieParser from "cookie-parser";
import courseRouter from "./routes/courses.route.js";
import teacherRouter from "./routes/teachers.route.js";
import coordinatorRouter from "./routes/coordinators.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/coordinators", coordinatorRouter);
// app.use("api/v1/video", videoRouter);
// app.use(express.json({ limit: "16mb" }));
// app.use(express.urlencoded({ extended: true, limit: "16mb" }));
// app.use(express.static("public"));

export default app;
