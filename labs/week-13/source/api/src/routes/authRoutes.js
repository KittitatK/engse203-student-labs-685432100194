import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

// route ให้มาแล้ว — งานหลักอยู่ใน services/authService.js (CP50)
const router = Router();

const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 3 * 60 * 1000;

export function resetLoginLimiter(){
  attempts.clear();
}


router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const now = Date.now();
  const record = attempts.get(email) ?? { count: 0, firstAttempt: now };

   // ถ้ายังอยู่ในช่วง 15 นาที และผิดครบ 5 ครั้งแล้ว → ตอบ 429
  if (now - record.firstAttempt < WINDOW_MS && record.count >= MAX_ATTEMPTS) {
    return res.status(429).json({ error: 'พยายามเข้าสู่ระบบมากเกินไป กรุณารอ 3 นาที' });
  }

  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }

  const result = authService.login(email, password);
  if (!result) {
    // ล็อกอินผิด → บันทึกการนับเพิ่ม
    if (now - record.firstAttempt > WINDOW_MS) { //เวลาหมดเริ่มใหม่
      attempts.set(email, { count: 1, firstAttempt: now });
    } else {//ยังไม่หมดเวลาก็เริ่มนับต่อ
      attempts.set(email, { count: record.count + 1, firstAttempt: record.firstAttempt });
    }
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }

  // ล็อกอินถูก → ล้างประวัติการนับผิดของอีเมลนี้
  attempts.delete(email);
  res.status(200).json(result);
});


/*router.post('/login', (req, res) => { //code เก่าก่อนตั้งค่าให้กรอกรหัสผิดได้แค่5ครั้ง
  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }
  const result = authService.login(req.body.email, req.body.password);
  if (!result) {
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
  res.status(200).json(result);
});*/

export default router;
