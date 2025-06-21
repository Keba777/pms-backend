import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller";
import { filterImage } from "../middlewares/multer";

const router = express.Router();

router.route("/").get(getAllUsers); 
router.route("/:id").get(getUserById).delete(deleteUser); 
router.put(
  "/:id",
  filterImage.single("profile_picture"),
  updateUser
);

export default router;
