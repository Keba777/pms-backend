import express from "express";
import { createLabor, getAllLabors, getLaborById, updateLabor, deleteLabor, importLabors } from "../controllers/labor.controller";
import { updateLaborInformation, deleteLaborInformation, getLaborInformationById } from "../controllers/laborInformation.controller";
import { filterImage } from "../middlewares/multer";

const router = express.Router();

router.route("/").post(createLabor).get(getAllLabors);
router.route("/:id").get(getLaborById).put(updateLabor).delete(deleteLabor);
router.post("/import", filterImage.array("profile_picture"), importLabors);

// Labor Information specific routes
router.get("/info/:id", getLaborInformationById);
router.put("/info/:id", filterImage.single("profile_picture"), updateLaborInformation);
router.delete("/info/:id", deleteLaborInformation);

export default router;
