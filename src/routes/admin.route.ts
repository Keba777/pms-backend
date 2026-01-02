import express from "express";
import { getSystemStats } from "../controllers/admin.controller";

const router = express.Router();

router.route("/stats").get(getSystemStats);

export default router;
