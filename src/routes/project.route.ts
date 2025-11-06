import express from "express";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject, updateProjectActuals, updateProjectProgress } from "../controllers/project.controller";

const router = express.Router();

router.route("/").post(createProject).get(getAllProjects);
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);
router.route("/:id/actuals").patch(updateProjectActuals);
router.route("/:id/progress").put(updateProjectProgress);

export default router;
