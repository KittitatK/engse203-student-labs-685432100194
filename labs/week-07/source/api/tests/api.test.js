import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => {
  await loadSeed();
  app = createApp();
});

const validRequest = {
  requesterName: 'ทดสอบ ระบบ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

/**
 * TODO W07-TEST (🏠 CP16) · เขียน test อย่างน้อย 6 เคส
 *
 * ที่ต้องมี
 *   1. GET /api/requests            → 200 และได้ array
 *   2. GET /api/requests/:id พบ      → 200
 *   3. GET /api/requests/:id ไม่พบ   → 404
 *   4. POST ข้อมูลถูกต้อง            → 201 และ status เป็น pending
 *   5. POST ข้อมูลไม่ครบ             → 400
 *   6. CORS header ตอบ origin ที่อนุญาต
 *
 * รันด้วย: npm test
 * ตัวอย่างโครง (ลบคอมเมนต์นี้แล้วเขียนจริง)
 */
describe('GET /api/requests', () => {
 // เคสที่ 1: GET /api/requests -> 200 และได้ array
  test('1. GET /api/requests คืนรายการทั้งหมด พร้อม status 200', async () => {
     const res = await request(app).get('/api/requests');
     assert.equal(res.status, 200);
     assert.ok(Array.isArray(res.body), 'Expected an array');
  });

  // เคสที่ 2: GET /api/requests/:id พบ -> 200
  test('2. GET /api/requests/:id คืนข้อมูลคำร้องที่ระบุ พร้อม status 200', async () => {
    // แอบดึงข้อมูลทั้งหมดมาก่อน เพื่อเอา ID ของรายการแรกมาทดสอบ
    const listRes = await request(app).get('/api/requests');
    const existingId = listRes.body[0].id;

    const res = await request(app).get(`/api/requests/${existingId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.id, existingId);
  });

  // เคสที่ 3: GET /api/requests/:id ไม่พบ -> 404
  test('3. GET /api/requests/:id ที่ไม่มีในระบบ ต้องตอบ status 404', async () => {
    const res = await request(app).get('/api/requests/REQ-INVALID-999');
    assert.equal(res.status, 404);
  });

  // เคสที่ 4: POST ข้อมูลถูกต้อง -> 201 และ status เป็น pending
  test('4. POST /api/requests ส่งข้อมูลถูกต้อง ต้องตอบ 201 และสถานะเป็น pending', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send(validRequest); // ใช้ตัวแปรที่คุณเตรียมไว้ด้านบน
    
    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
    assert.ok(res.body.id); // ยืนยันว่า API สุ่ม ID กลับมาให้
  });

  // เคสที่ 5: POST ข้อมูลไม่ครบ -> 400
  test('5. POST /api/requests ส่งข้อมูลไม่ครบถ้วน ต้องตอบ status 400', async () => {
    const invalidRequest = {
      requestType: 'แจ้งซ่อม'
      // ขาด requesterName, location, details ฯลฯ
    };

    const res = await request(app).post('/api/requests').send(invalidRequest);
    assert.equal(res.status, 400);
  });

  // เคสที่ 6: CORS header ตอบ origin ที่อนุญาต
  test('6. CORS header ต้องตอบ Access-Control-Allow-Origin ตามที่อนุญาต', async () => {
    const originUrl = 'http://localhost:5173'; 
    
    const res = await request(app)
      .get('/api/requests')
      .set('Origin', originUrl); // จำลองว่า Request ยิงมาจากฝั่ง React
    
    const allowOrigin = res.headers['access-control-allow-origin'];
    
    // ตรวจสอบว่า header ส่งกลับมาตรงกับที่เราส่งไป หรือส่งมาเป็น * (อนุญาตทั้งหมด)
    assert.ok(allowOrigin === originUrl || allowOrigin === '*');
  });
});
