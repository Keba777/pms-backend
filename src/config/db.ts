import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";
import configs from "./config";

import User from "../models/User.model";
import Role from "../models/Role.model";
import Project from "../models/Project.model";
import Task from "../models/Task.model";
import Activity from "../models/Activity.model";
import Tag from "../models/Tag.model";
import Equipment from "../models/Equipment.model";
import Material from "../models/Material.model";
import Labor from "../models/Labor.model";
import Warehouse from "../models/Warehouse.model";
import Department from "../models/Department.model";
import Request from "../models/Request.model";
import Approval from "../models/Approval.model";
import ProjectMember from "../models/ProjectMember.model";
import TaskMember from "../models/TaskMember.model";
import ActivityMember from "../models/ActivityMember.model";
import Notification from "../models/Notification.model";
import Site from "../models/Site.model";
import { EquipmentTimesheet, LaborTimesheet, MaterialBalanceSheet } from "../models/Timesheet.model";
import Issue from "../models/Issue.model";
import StoreRequisition from "../models/StoreRequisition.model";
import ChatMessage from "../models/ChatMessage.model";
import LaborInformation from "../models/LaborInformation.model";
import KPI from "../models/KPI.model";
import Dispatch from "../models/Dispatch.model";
import RequestDelivery from "../models/RequestDelivery.model";
import WorkflowLog from "../models/WorkflowLog.model";

dotenv.config({
    path: path.join(__dirname, "../../.env"),
});

const env = (process.env.NODE_ENV || "development") as keyof typeof configs;
const configFile = configs[env];

const sequelize: Sequelize = new Sequelize({
    database: configFile.database,
    dialect: "postgres",
    username: configFile.username,
    password: configFile.password,
    host: configFile.host,

    models: [
        User,
        Role,
        Project,
        Task,
        Activity,
        Tag,
        Equipment,
        Material,
        Labor,
        Warehouse,
        Department,
        Request,
        Approval,
        ProjectMember,
        TaskMember,
        ActivityMember,
        Notification,
        Site,
        LaborTimesheet,
        EquipmentTimesheet,
        MaterialBalanceSheet,
        Issue,
        StoreRequisition,
        ChatMessage,
        LaborInformation,
        KPI,
        Dispatch,
        RequestDelivery,
        WorkflowLog
    ],

    logging: false,
});

export default sequelize;