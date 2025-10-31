import express from "express";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject, updateProjectActuals } from "../controllers/project.controller";

const router = express.Router();

router.route("/").post(createProject).get(getAllProjects);
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);
router.route("/:id/actuals").patch(updateProjectActuals);

export default router;
