import { Router } from "express";
import {
    registerUser,
    loginUser,
} from "../controllers/auth.controller";
// import protectRoute from "../middlewares/auth";
import { filterImage } from "../middlewares/multer"

const router = Router();
router.post("/register", filterImage.single("profile_picture"), registerUser);
router.post("/login", loginUser);
// router.get("/me", getCurrentUser);

export default router;