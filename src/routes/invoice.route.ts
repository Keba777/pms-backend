import express from "express";
import {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
} from "../controllers/invoice.controller";

const router = express.Router();

router.route("/").post(createInvoice).get(getAllInvoices);
router.route("/:id").get(getInvoiceById).put(updateInvoice).delete(deleteInvoice);

export default router;
