import express from "express";
import { createLabor, getAllLabors, getLaborById, updateLabor, deleteLabor, importLabors } from "../controllers/labor.controller";
import { filterImage } from "../middlewares/multer";

const router = express.Router();

router.route("/").post(createLabor).get(getAllLabors);
router.route("/:id").get(getLaborById).put(updateLabor).delete(deleteLabor);
router.post("/import", filterImage.array("profile_picture"), importLabors);

export default router;
