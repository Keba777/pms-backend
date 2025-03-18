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
const env = (process.env.NODE_ENV || "development") as keyof typeof configs;
const configFile = configs[env];

const sequelize: Sequelize = new Sequelize({
    database: configFile.database,
    dialect: "postgres",
    username: configFile.username,
    password: configFile.password,
    host: configFile.host,

    models: [
        User, Role
    ],
    logging: false,
});

export default sequelize;