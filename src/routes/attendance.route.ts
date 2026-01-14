import express from "express";
import { checkIn, checkOut } from "../controllers/Attendance.controller";
import protectRoute from "../middlewares/auth";

const router = express.Router();

router.post("/check-in", protectRoute, checkIn);
router.post("/check-out", protectRoute, checkOut);

export default router;
