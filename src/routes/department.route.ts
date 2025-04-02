import express from "express";
import { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } from "../controllers/department.controller";

const router = express.Router();

router.route("/").post(createDepartment).get(getAllDepartments);
router.route("/:id").get(getDepartmentById).put(updateDepartment).delete(deleteDepartment);

export default router;
