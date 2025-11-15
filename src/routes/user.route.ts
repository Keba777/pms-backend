import express from "express";
import { getAllUsers, getUserById, createUser, importUsers, updateUser, deleteUser } from "../controllers/user.controller";
import { filterImage } from "../middlewares/multer";

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);
router.post("/import", filterImage.array("profile_picture"), importUsers);
router.route("/:id").get(getUserById).delete(deleteUser); 
router.put(
  "/:id",
  filterImage.single("profile_picture"),
  updateUser
);

export default router;
