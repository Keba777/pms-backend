import express from 'express';
import {
    createRequestDelivery,
    getAllRequestDeliveries,
    getRequestDeliveryById, updateRequestDelivery, deleteRequestDelivery
} from '../controllers/requestDelivery.controller';

const router = express.Router();

router.route('/')
    .post(createRequestDelivery)
    .get(getAllRequestDeliveries);

router.route('/:id')
    .get(getRequestDeliveryById)
    .put(updateRequestDelivery)
    .delete(deleteRequestDelivery);

export default router;