import express from 'express';
import * as controller from '../controllers/requestController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// นำ asyncHandler() ไปครอบฟังก์ชันของ controller แบบนี้
router.get('/', asyncHandler(controller.listRequests));
router.get('/:id', asyncHandler(controller.getRequest));
router.post('/', asyncHandler(controller.createRequest));
router.put('/:id', asyncHandler(controller.updateRequestStatus));
router.delete('/:id', asyncHandler(controller.deleteRequest));

export default router;