import express from 'express';
import { createLaborInformation, getAllLaborInformations, getLaborInformationById, updateLaborInformation, deleteLaborInformation } from '../controllers/laborInformation.controller';

const router = express.Router()

router.route("/").post(createLaborInformation).get(getAllLaborInformations)
router.route("/:id").get(getLaborInformationById).put(updateLaborInformation).delete(deleteLaborInformation)

export default router;