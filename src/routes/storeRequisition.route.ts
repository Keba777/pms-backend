import { Router } from "express";
import {
    createStoreRequisition,
    getAllStoreRequisitions,
    getStoreRequisitionById,
    updateStoreRequisition,
    deleteStoreRequisition,
} from "../controllers/storeRequisition.controller";

const router = Router();

router
    .route("/")
    .post(createStoreRequisition)
    .get(getAllStoreRequisitions);

router
    .route("/:id")
    .get(getStoreRequisitionById)
    .put(updateStoreRequisition)
    .delete(deleteStoreRequisition);

export default router;
