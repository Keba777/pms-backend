import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";
import User from "../models/User";
import Role from "../models/Role";
dotenv.config({
    path: path.join(__dirname, "../../.env"),
});

console.log(process.env.NODE_ENV)
import configs from "./config";
import Project from "../models/Project.model";
import Task from "../models/Task.model";
import Activity from "../models/Activity.model";
import Tag from "../models/Tag.model";
import Equipment from "../models/Equipment.model";
import Material from "../models/Material.model";
import Labor from "../models/Labor.model";
import Warehouse from "../models/Warehouse.model";
import Department from "../models/Department.model";
const env = (process.env.NODE_ENV || "development") as keyof typeof configs;
const configFile = configs[env];

const sequelize: Sequelize = new Sequelize({
    database: configFile.database,
    dialect: "postgres",
    username: configFile.username,
    password: configFile.password,
    host: configFile.host,

    models: [
        User, Role, Project, Task, Activity, Tag, Equipment, Material, Labor, Warehouse, Department
    ],
    logging: false,
});

export default sequelize;