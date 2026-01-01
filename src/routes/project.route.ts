import express from "express";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject, updateProjectActuals, updateProjectProgress } from "../controllers/project.controller";
import { uploadFiles } from "../middlewares/multer";

const router = express.Router();

router.route("/").post(uploadFiles.array("attachments"), createProject).get(getAllProjects);
router.route("/:id").get(getProjectById).put(uploadFiles.array("attachments"), updateProject).delete(deleteProject);
router.route("/:id/actuals").patch(updateProjectActuals);
router.route("/:id/progress").put(updateProjectProgress);

export default router;
