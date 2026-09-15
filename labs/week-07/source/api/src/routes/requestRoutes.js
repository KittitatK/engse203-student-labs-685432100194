import express from 'express';
import * as controller from '../controllers/requestController.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// นำ asyncHandler() ไปครอบฟังก์ชันของ controller แบบนี้
router.get('/', asyncHandler(controller.listRequests));
router.get('/:id', asyncHandler(controller.getRequest));
router.post('/', validateRequest, asyncHandler(controller.createRequest));
router.post('/reset', asyncHandler(controller.resetRequests));
router.put('/:id', asyncHandler(controller.updateRequestStatus));
router.delete('/:id', asyncHandler(controller.deleteRequest));
router.post('/reset', asyncHandler(controller.resetRequests));

export default router;