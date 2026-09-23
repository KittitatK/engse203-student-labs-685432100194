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
  requesterName: 'สมชาย ทดสอบ',
  requestType: 'แจ้งซ่อม',
  location: 'อาคารเรียนรวม ชั้น 3',
  details: 'เครื่องปรับอากาศเปิดไม่ติด มีเสียงดังผิดปกติ',
  priority: 'normal',
};

/**
 * TODO W10-TEST (🏠 CP33) · เขียน test อย่างน้อย 6 เคส ที่ยิงเข้าฐานข้อมูลจริง
 *   1. GET /api/requests → 200 และได้ array
 *   2. คืน requesterName ไม่ใช่ requester_id
 *   3. GET /:id พบ → 200 · ไม่พบ → 404
 *   4. POST ถูกต้อง → 201
 *   5. POST ไม่ครบ → 400
 *   6. ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด
 */
describe('API & Database Integration Tests (CP33)', () => {
  // เคสที่ 1: GET /api/requests → 200 และได้ array
  test('1. GET /api/requests คืน status 200 และได้ array ข้อมูล', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body), 'ผลลัพธ์ต้องเป็น array');
    assert.ok(res.body.length > 0, 'ต้องมีข้อมูลอย่างน้อย 1 รายการ');
  });

  // เคสที่ 2: คืน requesterName ไม่ใช่ requester_id
  test('2. คืน requesterName ไม่ใช่ requester_id (ผ่านการ JOIN)', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    const firstItem = res.body[0];
    assert.ok('requesterName' in firstItem, 'ต้องมีคอลัมน์ requesterName');
    assert.ok(!('requester_id' in firstItem), 'ต้องไม่มีคอลัมน์ requester_id');
  });

  // เคสที่ 3: GET /:id พบ → 200 · ไม่พบ → 404
  test('3. GET /api/requests/:id พบ → 200 และ ไม่พบ → 404', async () => {
    const listRes = await request(app).get('/api/requests');
    const existingId = listRes.body[0].id;

    // เคสพบข้อมูล
    const foundRes = await request(app).get(`/api/requests/${existingId}`);
    assert.equal(foundRes.status, 200);
    assert.equal(foundRes.body.id, existingId);

    // เคสไม่พบข้อมูล
    const notFoundRes = await request(app).get('/api/requests/REQ-999');
    assert.equal(notFoundRes.status, 404);
  });

  // เคสที่ 4: POST ถูกต้อง → 201 (พร้อมลบออกเมื่อทดสอบเสร็จเพื่อไม่ให้ข้อมูลค้าง)
  test('4. POST /api/requests ข้อมูลถูกต้อง → 201 และสร้างสำเร็จ', async () => {
    const res = await request(app).post('/api/requests').send(validRequest);
    assert.equal(res.status, 201);
    assert.equal(res.body.requesterName, validRequest.requesterName);
    assert.equal(res.body.status, 'pending');

    // ลบข้อมูลออกหลังทดสอบเสร็จ เพื่อไม่ให้ข้อมูลค้างใน DB
    if (res.body.id) {
      await request(app).delete(`/api/requests/${res.body.id}`);
    }
  });

  // เคสที่ 5: POST ไม่ครบ → 400
  test('5. POST /api/requests ข้อมูลไม่ครบถ้วน → 400', async () => {
    const invalidPayload = {
      requesterName: 'ส', // สั้นเกินไป และขาด field อื่น
    };
    const res = await request(app).post('/api/requests').send(invalidPayload);
    assert.equal(res.status, 400);
  });

  // เคสที่ 6: ยิง SQL injection ผ่าน ?status= แล้วไม่หลุด
  test('6. ยิง SQL injection ผ่าน ?status= แล้วไม่หลุด (คืน 200 พร้อม array ว่าง)', async () => {
    const evil = encodeURIComponent("x' OR '1'='1");
    const res = await request(app).get(`/api/requests?status=${evil}`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length, 0);
  });
});
