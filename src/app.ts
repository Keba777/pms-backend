import express, { urlencoded, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route"
import roleRouter from "./routes/role.route";
import projectRouter from "./routes/project.route"
import taskRouter from "./routes/task.route"
import activityRouter from "./routes/activity.route"
import tagRouter from "./routes/tag.router"
import masterScheduleRoute from "./routes/masterSchedule.route"
import protectRoute from "./middlewares/auth";

dotenv.config({
    path: path.join(__dirname, "../.env"),
});

const app = express();

app.use(cors())
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", protectRoute, userRouter);
app.use("/api/v1/roles", protectRoute, roleRouter);
app.use("/api/v1/projects", protectRoute, projectRouter)
app.use("/api/v1/tasks", protectRoute, taskRouter)
app.use("/api/v1/activities", protectRoute, activityRouter)
app.use("/api/v1/tags", protectRoute, tagRouter)
app.use("/api/v1/master-schedule", protectRoute, masterScheduleRoute)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World!" });
});

export default app;