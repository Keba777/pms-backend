import express from "express";
import { createWarehouse, getAllWarehouses, getWarehouseById, updateWarehouse, deleteWarehouse } from "../controllers/warehouse.controller";

const router = express.Router();

router.route("/").post(createWarehouse).get(getAllWarehouses);
router.route("/:id").get(getWarehouseById).put(updateWarehouse).delete(deleteWarehouse);

export default router;
