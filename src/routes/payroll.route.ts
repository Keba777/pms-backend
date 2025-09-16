import express from "express";
import {
    createPayroll,
    getAllPayrolls,
    getPayrollById,
    updatePayroll,
    deletePayroll,
} from "../controllers/payroll.controller";

const router = express.Router();

router.route("/").post(createPayroll).get(getAllPayrolls);
router.route("/:id").get(getPayrollById).put(updatePayroll).delete(deletePayroll);

export default router;
