import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.join(__dirname, "../../.env"),
});


const sequelize: Sequelize = new Sequelize({
    database: process.env.PG_DATABASE,
    dialect: "postgres",
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,

    models: [],
    logging: false,
});

export default sequelize;