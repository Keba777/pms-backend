import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller";

const router = express.Router();

router.route("/").get(getAllUsers); 
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser); 

export default router;
