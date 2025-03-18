import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import authRouter from "./routes/auth.route";
import roleRouter from "./routes/role.route";

dotenv.config({
    path: path.join(__dirname, "../.env"),
});

const app = express();

app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/roles", roleRouter);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World!" });
});

export default app;