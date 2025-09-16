import express from "express";
import {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
} from "../controllers/payment.controller";

const router = express.Router();

router.route("/").post(createPayment).get(getAllPayments);
router.route("/:id").get(getPaymentById).put(updatePayment).delete(deletePayment);

export default router;
