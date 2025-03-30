import express from "express";
import { createLabor, getAllLabors, getLaborById, updateLabor, deleteLabor } from "../controllers/labor.controller";

const router = express.Router();

router.route("/").post(createLabor).get(getAllLabors);
router.route("/:id").get(getLaborById).put(updateLabor).delete(deleteLabor);

export default router;
