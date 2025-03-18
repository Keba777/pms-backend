import express from "express";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from "../controllers/project.controller";

const router = express.Router();

router.route("/").post(createProject).get(getAllProjects);
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);

export default router;
