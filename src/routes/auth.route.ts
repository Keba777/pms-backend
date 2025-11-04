import { Router } from "express";
import {
    registerUser,
    loginUser,
    getCurrentUser,
    changePassword,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller";
import { filterImage } from "../middlewares/multer";
import protectRoute from "../middlewares/auth";

const router = Router();
router.post("/register", filterImage.single("profile_picture"), registerUser);
router.post("/login", loginUser);
router.get("/me", protectRoute, getCurrentUser);
router.patch("/change-password", protectRoute, changePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

export default router;