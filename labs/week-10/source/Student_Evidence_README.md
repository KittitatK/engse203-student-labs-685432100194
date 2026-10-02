# ENGSE203 LAB 10 — เชื่อมต่อ Node.js เข้ากับฐานข้อมูล SQLite

## Submission Contract

- **Repository:** `engse203-student-labs-685432100194`
- **Branch:** `unit4/week-10`
- **Source path:** `labs/week-10/source/`
- **Pages Hub URL:** `https://KittitatK.github.io/engse203-student-labs-685432100194/`
- **Submission tag:** `lab-10-submission-v1`

---

## ผู้จัดทำ

- **ชื่อ-นามสกุล:** กิตติทัต กันธรรม
- **รหัสนักศึกษา:** 685432100194
- **กลุ่มเรียน:** SEC1
- **ระบบปฏิบัติการที่ใช้:** Windows 11

---

## วัตถุประสงค์ของงาน

1. เปลี่ยนผ่านระบบจัดการข้อมูลของ Express API จากเดิมที่อ่าน/เขียนไฟล์ JSON แบนราบ มาเชื่อมต่อกับฐานข้อมูลเชิงสัมพันธ์จริง (SQLite ผ่านโมดูลในตัว `node:sqlite`) โดยคง Signature ของ Service ทุกฟังก์ชันไว้ตามเดิม
2. ทำความเข้าใจและเขียนคำสั่ง SQL Query เชื่อมตารางด้วย `JOIN` เพื่อแปลง `requester_id` เป็น `requesterName` ตามที่ฝั่ง Frontend ต้องการ
3. เสริมสร้างความปลอดภัยให้ระบบด้วยการใช้ **Parameterized Queries (`?`)** ในทุกจุดที่รับค่าจากผู้ใช้ และพิสูจน์การป้องกันการโจมตีแบบ **SQL Injection** ทั้ง 3 รูปแบบ
4. ออกแบบระบบจัดการข้อผิดพลาด (Error Handling) โดยแปลง SQLite Constraint Errors (FOREIGN KEY, CHECK, UNIQUE) ให้เป็น `AppError` ที่ตอบ HTTP Status ที่เหมาะสม (400, 409) พร้อมข้อความภาษาคนที่เข้าใจง่าย แทนที่จะตอบ 500
5. เขียนชุดทดสอบอัตโนมัติ (Integration Tests) ด้วย **Supertest** ยิงทดสอบระบบจริงอย่างน้อย 6 เคส รวมถึงการทำ Data Cleanup ไม่ให้เกิดข้อมูลขยะตกค้างในฐานข้อมูล
6. ปรับปรุงเอกสารข้อตกลง **`API_CONTRACT.md`** ให้ครอบคลุม Data Model, ความแตกต่างระหว่างโครงสร้าง DB กับ API Response และพฤติกรรม Auto-create User ของเมธอด POST
7. ทำงานขั้นสูง (⭐ Challenge) ครบทั้ง 3 รายการ ได้แก่ Users Endpoints (`/api/users`), Database Transactions (`BEGIN/COMMIT/ROLLBACK`), และการสร้าง Database Indexing (`idx_requests_status`, `idx_requests_requester`)

---

## เครื่องมือที่ใช้

- **Node.js (v22.x):** รันเซิร์ฟเวอร์และตัวประมวลผลคำสั่งฝั่ง Server
- **`node:sqlite` (DatabaseSync API):** โมดูลฐานข้อมูล SQLite ประสิทธิภาพสูงที่ติดมากับ Node.js
- **Express.js v5:** Web Application Framework สำหรับจัดการเส้นทางและคำขอ HTTP
- **Supertest & Node:test Runner:** เครื่องมือทดสอบยิง HTTP Request เข้า API จริงโดยไม่ต้องเปิดเซิร์ฟเวอร์
- **cURL (`curl.exe`):** เครื่องมือทดสอบยิง Request เจาะช่องโหว่ความปลอดภัยผ่าน Terminal
- **SQLite3:** ฐานข้อมูลเชิงสัมพันธ์แบบไฟล์เดี่ยว (`campus.db`)
- **AI Pair Programming Assistant:** Antigravity (Google Gemini 3.8 Flash)

---

## วิธีติดตั้งและรัน

### 1. ติดตั้ง Dependencies
```bash
cd labs/week-10/source/api
npm install
```

### 2. การรันเซิร์ฟเวอร์ในโหมดพัฒนา
```bash
cd labs/week-10/source/api
npm run dev
```
*(ระบบจะเปิดเซิร์ฟเวอร์ API ที่ `http://localhost:3001`)*

### 3. การรันชุดทดสอบอัตโนมัติ (Integration Tests)
```bash
cd labs/week-10/source/api
npm test
```

### 4. การรันสคริปต์ตรวจความถูกต้องของแล็บ
```bash
cd labs/week-10/source
node --disable-warning=ExperimentalWarning check-week10.mjs
```

---

## โครงสร้างไฟล์ในโปรเจกต์

```text
labs/week-10/
├── LAB10_INCLASS_GUIDE_TH.md     # คู่มือแล็บในห้องเรียน
├── LAB10_TAKEHOME_GUIDE_TH.md    # คู่มือแล็บการบ้าน
├── README.md                     # คำอธิบายภาพรวมของ Week 10
└── source/
    ├── check-week07.mjs          # ตัวตรวจเช็คความเข้ากันได้กับ Week 07
    ├── check-week10.mjs          # ตัวตรวจเช็คคะแนนของ Week 10
    ├── API_CONTRACT.md           # ข้อตกลง API, Data Model และพฤติกรรมสำคัญ
    ├── SECURITY_TEST.md          # รายงานการทดสอบเจาะระบบ SQL Injection (CP31)
    ├── AI_USAGE.md               # บันทึกการใช้งาน AI อย่างโปร่งใสและสร้างสรรค์
    ├── Student_Lab_README.md     # เอกสารสรุปงานของนักศึกษาฉบับนี้
    └── api/
        ├── .env                  # Environment Variables สำหรับ Local Development
        ├── data/
        │   ├── campus.db         # ไฟล์ฐานข้อมูล SQLite จริง (ต้อง Commit ส่ง)
        │   └── schema.sql        # โครงสร้างตาราง users, requests และ index
        ├── src/
        │   ├── app.js            # Express App Configuration & Route Mounting
        │   ├── server.js         # HTTP Server Entry Point
        │   ├── controllers/      # Controller Layer
        │   ├── middleware/       # Error Handler, Logger & Validation
        │   ├── routes/           # Request & User Router Definitions
        │   └── services/         # Data Access Layer (`requestService.js`)
        └── tests/
            └── api.test.js       # Supertest Integration Test Suite (6 เคส)
```

---

## หลักฐานผลลัพธ์การทำงาน

### 1. ผลการตรวจด้วย `check-week10.mjs` (ผ่านครบ 31/31 รายการ — 100% เต็ม)
```text
✅ STRUCT มีไฟล์ api/data/schema.sql
✅ STRUCT มี service ที่ api/src/services/requestService.js
✅ CP26 service เรียกใช้ node:sqlite
✅ CP26 เปิด PRAGMA foreign_keys = ON
✅ CP26 ไม่อ่านไฟล์ JSON แบบเดิมแล้ว
✅ CP27 ใช้ fileURLToPath / import.meta.url (path ไม่พึ่งที่รัน)
✅ CP28 findAll ใช้ JOIN กับตาราง users
✅ CP28 คืน requesterName ด้วย AS (ไม่ใช่ requester_id)
✅ CP29 create แปลงชื่อผู้แจ้งเป็น id
✅ CP31 ใช้ prepare() กับ placeholder ?
✅ CP31 ไม่ต่อค่าจากผู้ใช้เข้า SQL โดยตรง (กัน SQL injection)
✅ CP28 GET /api/requests คืนข้อมูลจากฐานข้อมูล
✅ CP28 ข้อมูลที่คืนมีรูปแบบ requesterName (ไม่ใช่ requester_id)
✅ CP28 กรอง ?status= ทำงาน (WHERE ในฐานข้อมูล)
✅ CP28 GET /:id ที่มีจริง → 200
✅ CP28 GET /:id ที่ไม่มี → 404
✅ CP29 POST สร้างคำร้อง → 201 · แปลงชื่อเป็น id ให้เอง
✅ CP29 POST ข้อมูลไม่ครบ → 400 (validation ยังทำงาน)
✅ CP30 PUT เปลี่ยนสถานะ → 200
✅ CP30 PUT status ไม่ถูกต้อง → 400
✅ CP30 DELETE → 204
✅ CP31 ยิง SQL injection แล้วไม่หลุด (คืน 0 รายการ)
✅ CP30 CORS ยังทำงาน (ของ Week 07 ไม่พัง)
✅ CP32 มี errorHandler รวมศูนย์ (จาก Week 06)
✅ CP33 มี test อย่างน้อย 6 เคส
✅ CP33 test ยิง request จริงด้วย supertest
✅ CP34 มี API_CONTRACT.md ที่อัปเดต
✅ CP34 contract มีหัวข้อ data model / ฐานข้อมูล
✅ CHAL ⭐ มี endpoint สำหรับ users
✅ CHAL ⭐ ใช้ transaction
✅ CHAL ⭐ สร้าง INDEX

──────────────────────────────────────────────────────────
🏫 ในห้อง (CP26–CP30)   ผ่าน 20/20 รายการ
🏠 ที่บ้าน (CP31–CP34)   ผ่าน 8/8 รายการ
⭐ Challenge            ผ่าน 3/3 รายการ
──────────────────────────────────────────────────────────
ผ่าน 31/31 รายการ
```

### 2. ผลการตรวจความเข้ากันได้กับ Week 07 (`check-week07.mjs`)
```text
──────────────────────────────────────────────────────────
🏫 ในห้อง (CP09–CP12)   ผ่าน 25/25 รายการ
🏠 ที่บ้าน (CP13–CP16)   ผ่าน 8/8 รายการ
⭐ Challenge            ผ่าน 3/3 รายการ
──────────────────────────────────────────────────────────
ผ่าน 36/36 รายการ
```

### 3. ผลการรัน Automated Test (`npm test`)
```text
TAP version 13
# Subtest: API & Database Integration Tests (CP33)
    ok 1 - 1. GET /api/requests คืน status 200 และได้ array ข้อมูล
    ok 2 - 2. คืน requesterName ไม่ใช่ requester_id (ผ่านการ JOIN)
    ok 3 - 3. GET /api/requests/:id พบ → 200 และ ไม่พบ → 404
    ok 4 - 4. POST /api/requests ข้อมูลถูกต้อง → 201 และสร้างสำเร็จ
    ok 5 - 5. POST /api/requests ข้อมูลไม่ครบถ้วน → 400
    ok 6 - 6. ยิง SQL injection ผ่าน ?status= แล้วไม่หลุด (คืน 200 พร้อม array ว่าง)
    1..6
ok 1 - API & Database Integration Tests (CP33)
# tests 6
# pass 6
# fail 0
```

### 4. ผลการทดสอบเจาะระบบ SQL Injection (cURL Test)
- ยิง `status=x' OR '1'='1` → ตอบ `200 OK` ด้วย `[]` (0 รายการ)
- ยิง `status='; DROP TABLE requests; --` → ตอบ `200 OK` ด้วย `[]` (0 รายการ) และตารางยังอยู่ครบถ้วน

---

## ปัญหาที่พบและวิธีแก้ไข

1. **ปัญหาคำสั่ง `npm run dev` ไม่สามารถเริ่มทำงานได้:**
   - **สาเหตุ:** สคริปต์ใน `package.json` กำหนดคำสั่ง `--env-file=.env` แต่ในโปรเจกต์มีเพียงไฟล์ `.env.example`
   - **วิธีแก้:** คัดลอกและสร้างไฟล์ `.env` พร้อมกำหนดค่าพอร์ต 3001 และ CORS Origin ที่ถูกต้อง ทำให้เปิดเซิร์ฟเวอร์ได้ราบรื่น
2. **ปัญหา SQLite Constraint Errors พ่นเป็น 500 Internal Server Error:**
   - **สาเหตุ:** การละเมิดเงื่อนไขฐานข้อมูล (เช่น CHECK หรือ FOREIGN KEY) เกิดขึ้นจากข้อมูลฝั่งไคลเอ็นต์ผิดพลาด ไม่ใช่ข้อผิดพลาดของเซิร์ฟเวอร์
   - **วิธีแก้:** สร้างฟังก์ชัน `toAppError()` ใน Service เพื่อดักจับข้อความ Error ของฐานข้อมูล และโยน `AppError` ที่มี Status 400/409 พร้อมข้อความภาษาคนที่เข้าใจง่าย
3. **ปัญหาข้อมูลค้างในฐานข้อมูลหลังรัน Test:**
   - **สาเหตุ:** เคสการทดสอบ `POST` สร้างข้อมูลจริงลงใน SQLite ทำให้รันเทสซ้ำแล้วข้อมูลสะสม
   - **วิธีแก้:** เขียนคำสั่ง `DELETE /api/requests/:id` ลบคำร้องที่เพิ่งสร้างออกทันทีเมื่อตรวจสอบการตอบกลับ 201 เสร็จสิ้น
4. **ปัญหาความไม่สอดคล้องของข้อมูลเมื่อสร้างคำร้องไม่สำเร็จ (Inconsistent User):**
   - **สาเหตุ:** ฟังก์ชัน `resolveUserId()` สร้างผู้ใช้ใหม่สำเร็จ แต่คำสั่ง `INSERT INTO requests` เกิดข้อผิดพลาด ทำให้เกิด User ขยะที่ไม่มีคำร้องผูกอยู่
   - **วิธีแก้:** ประยุกต์ใช้ Database Transaction ด้วย `db.exec('BEGIN')`, `COMMIT`, และ `ROLLBACK` ครอบขั้นตอนทั้งหมด ทำให้เกิดคุณสมบัติ Atomicity

---

## References & AI Assistance

- **เอกสารอ้างอิง:**
  - Node.js Documentation: [SQLite Module (`node:sqlite`)](https://nodejs.org/api/sqlite.html)
  - SQLite Official Documentation: [PRAGMA Statements & Foreign Keys](https://www.sqlite.org/pragma.html)
  - Supertest Documentation: [Testing HTTP with Supertest](https://github.com/ladjs/supertest)
  - เอกสารประจำวิชา: `LAB10_INCLASS_GUIDE_TH.md` และ `LAB10_TAKEHOME_GUIDE_TH.md`
- **การใช้งาน AI (AI Assistance):**
  - เครื่องมือที่ใช้: Gemini
  - วัตถุประสงค์: ช่วยวิเคราะห์ข้อกำหนดแล็บ, ออกแบบโค้ด Integration Test, อธิบายกลไก Parameterized Queries, ตรวจสอบ Transaction และร่างเอกสารสรุปผลการทำงานอย่างครบถ้วน (รายละเอียดบันทึกใน [AI_USAGE.md](file:///e:/engse203-student-labs-685432100194/labs/week-10/source/AI_USAGE.md))