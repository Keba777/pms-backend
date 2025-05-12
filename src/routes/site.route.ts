import express from "express";
import {
    createSite,
    getAllSites,
    getSiteById,
    updateSite,
    deleteSite,
} from "../controllers/site.controller";

const router = express.Router();

router.route("/").post(createSite).get(getAllSites);
router.route("/:id").get(getSiteById).put(updateSite).delete(deleteSite);

export default router;