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
import tagRouter from "./routes/tag.route"
import masterScheduleRouter from "./routes/masterSchedule.route"
import equipmentRouter from "./routes/equipment.route"
import warehouseRouter from "./routes/warehouse.route"
import materialRouter from "./routes/material.route"
import laborRouter from "./routes/labor.route"
import departmentRouter from "./routes/department.route"
import requestRouter from "./routes/request.route"
import approvalRouter from "./routes/approval.route"
import notificationRouter from "./routes/notification.route";
import siteRouter from "./routes/site.route";
import timesheetRouter from "./routes/timesheet.route"
import issueRouter from "./routes/issue.route";
import storeRequisitionRouter from "./routes/storeRequisition.route";
import laborInformationRouter from "./routes/laborInformation.route";
import kpiRouter from "./routes/kpi.route";
import dispatchRouter from "./routes/dispatch.route";
import requestDeliveryRouter from "./routes/requestDelivery.route";
import workflowLogRouter from "./routes/workflowLog.route";
import todoRouter from "./routes/todo.route"
import fileRoute from "./routes/file.route";
import paymentRouter from "./routes/payment.route";
import payrollRouter from "./routes/payroll.route";
import budgetRouter from "./routes/budget.route";
import invoiceRouter from "./routes/invoice.route";
import chatRouter from "./routes/chat.route";
import collaborationRouter from "./routes/collaboration.route";
import clientRouter from "./routes/client.routes";
import organizationRouter from "./routes/organization.route";
import adminRouter from "./routes/admin.route";
import protectRoute from "./middlewares/auth";
import { multiTenancy } from "./middlewares/multi-tenancy.middleware";

dotenv.config({
    path: path.join(__dirname, "../.env"),
});

const app = express();

const allowedOrigins = [
    "https://pms-frontend-opal.vercel.app",
    "http://localhost:3000",
    "https://rayconplc.com",
    "http://rayconplc.oasismgmt2.com",
    "https://rayconplc.oasismgmt2.com",
    "http://tsemex.oasismgmt2.com",
    "https://tsemex.oasismgmt2.com",
    "https://pms-frontend-nu-opal.vercel.app",
    "https://tsemex-pms.vercel.app",
    "http://raycon.rayconplc.com",
    "https://raycon.rayconplc.com",
    "http://nilepms.com",
    "https://nilepms.com",
    "http://192.168.8.105:8081",
    "http://localhost:8081",
    "http://192.168.8.105:8082",
    "http://localhost:8082",
    "http://10.0.2.2:8081",
    "http://10.0.2.2:8082"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // Set the specific origin
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true, // Required for cookies/auth headers
}));



app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", protectRoute, multiTenancy, userRouter);
app.use("/api/v1/roles", protectRoute, multiTenancy, roleRouter);
app.use("/api/v1/projects", protectRoute, multiTenancy, projectRouter)
app.use("/api/v1/tasks", protectRoute, multiTenancy, taskRouter)
app.use("/api/v1/activities", protectRoute, multiTenancy, activityRouter)
app.use("/api/v1/tags", protectRoute, multiTenancy, tagRouter)
app.use("/api/v1/master-schedule", protectRoute, multiTenancy, masterScheduleRouter)
app.use("/api/v1/equipments", protectRoute, multiTenancy, equipmentRouter)
app.use("/api/v1/warehouses", protectRoute, multiTenancy, warehouseRouter)
app.use("/api/v1/materials", protectRoute, multiTenancy, materialRouter)
app.use("/api/v1/labors", protectRoute, multiTenancy, laborRouter)
app.use("/api/v1/departments", protectRoute, multiTenancy, departmentRouter);
app.use("/api/v1/requests", protectRoute, multiTenancy, requestRouter);
app.use("/api/v1/approvals", protectRoute, multiTenancy, approvalRouter);
app.use("/api/v1/notifications", protectRoute, multiTenancy, notificationRouter);
app.use("/api/v1/sites", protectRoute, multiTenancy, siteRouter);
app.use("/api/v1/timesheets", protectRoute, multiTenancy, timesheetRouter)
app.use("/api/v1/issues", protectRoute, multiTenancy, issueRouter);
app.use("/api/v1/store-requisitions", protectRoute, multiTenancy, storeRequisitionRouter);
app.use("/api/v1/labor-informations", protectRoute, multiTenancy, laborInformationRouter);
app.use("/api/v1/kpis", protectRoute, multiTenancy, kpiRouter);
app.use("/api/v1/dispatches", protectRoute, multiTenancy, dispatchRouter);
app.use("/api/v1/request-deliveries", protectRoute, multiTenancy, requestDeliveryRouter);
app.use("/api/v1/workflow-logs", protectRoute, multiTenancy, workflowLogRouter);
app.use("/api/v1/todos", protectRoute, multiTenancy, todoRouter);
app.use("/api/v1/files", protectRoute, multiTenancy, fileRoute);
app.use("/api/v1/payments", protectRoute, multiTenancy, paymentRouter);
app.use("/api/v1/payrolls", protectRoute, multiTenancy, payrollRouter);
app.use("/api/v1/budgets", protectRoute, multiTenancy, budgetRouter);
app.use("/api/v1/invoices", protectRoute, multiTenancy, invoiceRouter);
app.use("/api/v1/chats", protectRoute, multiTenancy, chatRouter);
app.use("/api/v1/collaborations", protectRoute, multiTenancy, collaborationRouter);
app.use("/api/v1/clients", protectRoute, multiTenancy, clientRouter);
app.use("/api/v1/organizations", protectRoute, multiTenancy, organizationRouter);
app.use("/api/v1/admin", protectRoute, multiTenancy, adminRouter);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World!" });
});

export default app;