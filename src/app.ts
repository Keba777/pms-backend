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
import masterScheduleRouter from "./routes/masterSchedule.route"
import equipmentRouter from "./routes/equipment.route"
import warehouseRouter from "./routes/warehouse.route"
import materialRouter from "./routes/material.route"
import laborRouter from "./routes/labor.route"
import protectRoute from "./middlewares/auth";

dotenv.config({
    path: path.join(__dirname, "../.env"),
});

const app = express();

const allowedOrigins = ["https://pms-frontend-opal.vercel.app", "http://localhost:3000"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // Set the specific origin
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Required for cookies/auth headers
}));



app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", protectRoute, userRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/projects", protectRoute, projectRouter)
app.use("/api/v1/tasks", protectRoute, taskRouter)
app.use("/api/v1/activities", protectRoute, activityRouter)
app.use("/api/v1/tags", protectRoute, tagRouter)
app.use("/api/v1/master-schedule", protectRoute, masterScheduleRouter)
app.use("/api/v1/equipments", protectRoute, equipmentRouter)
app.use("/api/v1/warehouses", protectRoute, warehouseRouter)
app.use("/api/v1/materials", protectRoute, materialRouter)
app.use("/api/v1/labors", protectRoute, laborRouter)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World!" });
});

export default app;