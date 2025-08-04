import routes from "express";
import {createWorkflowLog, getWorkflowLogsByEntity} from "../controllers/workflowLog.controller";

const router = routes.Router();

router.post("/", createWorkflowLog);
router.get("/:entityType/:entityId", getWorkflowLogsByEntity);

export default router;