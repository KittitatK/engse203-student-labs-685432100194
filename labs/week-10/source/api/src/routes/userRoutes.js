import { Router } from 'express';
import * as service from '../services/requestService.js';

const router = Router();

// GET /api/users → รายชื่อผู้ใช้ทั้งหมด
router.get('/', (req, res) => {
  const users = service.findAllUsers();
  res.status(200).json(users);
});

// GET /api/users/:id/requests → คำร้องของคนนั้น
router.get('/:id/requests', (req, res) => {
  const requests = service.findRequestsByUserId(req.params.id);
  res.status(200).json(requests);
});

export default router;
