import express from 'express';
import { createDispatch, getAllDispatches, getDispatchById, updateDispatch, deleteDispatch } from '../controllers/dispatch.controller';

const router = express.Router();

router.route('/')
    .post(createDispatch)
    .get(getAllDispatches);
router.route('/:id')
    .get(getDispatchById)
    .put(updateDispatch)
    .delete(deleteDispatch)

export default router;