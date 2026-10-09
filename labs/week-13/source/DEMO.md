# หลักฐานการสาธิตระบบ Full-Stack & Web Security (A5 · CP48–CP52)

**ชื่อ-นามสกุล:** กิตติทัต กันธรรม (Kittitat K.)  
**รหัสนักศึกษา:** 685432100194  
**วิชา:** ENGSE203 Software Architecture and Engineering  
**สัปดาห์ที่ 13:** Software Quality & Security (Validation, Password Hashing, JWT Auth, Role-Based Access Control)  

---

## 📹 วิดีโอนำเสนอ (YouTube / Demo Video)

🔗 **YouTube Link:** [https://youtu.be/lJdUQZs8CWY?si=woEDjCbjRG5s_WeB](https://youtu.be/lJdUQZs8CWY?si=woEDjCbjRG5s_WeB)  
*(สถานะวิดีโอ: Unlisted / สาธารณะ)*

---

## ⏱️ สิ่งที่สาธิตในวิดีโอและสารบัญเวลา (Timestamps)

### 🎬 ช่วง A: สาธิตระบบทำงานครบวงจรและฟังก์ชันความปลอดภัย (≈ 00:00 - 04:30)
- [x] **เปิดระบบครบ 3 ชั้น (React + Express API + Database):** เชื่อมต่อหน้าบ้านและหลังบ้านพร้อมทำงานร่วมกับฐานข้อมูล
- [x] **ดูรายการคำร้อง (Read):** ดึงข้อมูลคำขอบริการจากฐานข้อมูลมาแสดงผลใน Dashboard
- [x] **เพิ่มคำร้องใหม่ (Create):** ตรวจสอบว่าผู้ใช้ทั่วไปสามารถส่งคำร้องได้โดยไม่ต้องล็อกอิน และบันทึกข้อมูลจริง
- [x] **การตรวจสอบสิทธิ์และการจัดการคำร้อง (Update / Delete):**
  - เมื่อยังไม่ได้เข้าสู่ระบบ: ปุ่มเปลี่ยนสถานะและลบจะไม่ทำงาน / ได้รับ 401 Unauthorized
  - เข้าสู่ระบบด้วยบัญชีเจ้าหน้าที่ (`staff@rmutl.ac.th` / `staff1234`): ได้รับ JWT Token และสามารถเปลี่ยนสถานะ (`PUT` $\rightarrow$ 200) และลบคำร้อง (`DELETE` $\rightarrow$ 204) ได้สำเร็จ
- [x] **ระบบรีเซ็ตข้อมูลตัวอย่าง (Reset Demo Data):** กดปุ่ม Reset สีแดง เพื่อคืนค่าคำร้องเริ่มต้นผ่าน API `POST /api/requests/reset`
- [x] **Health Check Endpoint:** เรียก `GET /api/health` แสดงสถานะ `status: "ok"`, `env: "production"`, `uptime`, และสถานะการเชื่อมต่อฐานข้อมูล
- [x] **ความคงทนของข้อมูล (Data Persistence):** ทดสอบปิดเซิร์ฟเวอร์และเปิดใหม่ ข้อมูลยังคงอยู่ครบถ้วน
- [x] **Production Mode:** รัน production build และเข้าใช้งานผ่านพอร์ตเดียว (Single Port 3001)

---

### 💻 ช่วง B: อธิบายสถาปัตยกรรม Source Code และ Security (≈ 04:30 - 08:30)
- [x] **CP48 — Input Validation & Body Limit:**
  - ชี้ไฟล์: `api/src/validators/requestValidator.js` และ `api/src/app.js`
  - ประเด็น: กำหนดขนาด `express.json({ limit: '10kb' })` เพื่อป้องกัน Denial of Service (DoS) และตรวจความยาวชื่อ (ไม่เกิน 100 ตัว), รายละเอียด (ไม่เกิน 1000 ตัว), สถานที่ (ไม่เกิน 100 ตัว)
- [x] **CP49 — Password Hashing with scrypt:**
  - ชี้ไฟล์: `api/src/services/authService.js`
  - ประเด็น: ไม่เก็บรหัสผ่านเป็น plain text ใช้ `crypto.scrypt` ร่วมกับ random salt (32-byte hex) และเปรียบเทียบด้วย `timingSafeEqual` ป้องกัน Timing Attack
- [x] **CP50 — JWT Authentication (`POST /api/auth/login`):**
  - ชี้ไฟล์: `api/src/routes/authRoutes.js` และ `api/src/controllers/authController.js`
  - ประเด็น: ตรวจสอบอีเมลและรหัสผ่าน หากถูกต้องจะสร้าง JWT Token ที่มี Header, Payload (`sub`, `role: 'staff'`, `exp`), และ Signature โดยรหัสผ่านผิดหรืออีเมลไม่พบจะส่งข้อความ `401` เดียวกันเพื่อป้องกัน User Enumeration
- [x] **CP51 — Route Protection & RBAC (401 vs 403):**
  - ชี้ไฟล์: `api/src/middleware/auth.js` และ `api/src/routes/requestRoutes.js`
  - ประเด็น:
    - `401 Unauthorized`: ไม่มี Token หรือ Token ปลอม / หมดอายุ (ยังไม่รู้ว่าเป็นใคร)
    - `403 Forbidden`: Token ถูกต้องแต่ Role ไม่ตรง (รู้ว่าเป็นใครแต่ไม่มีสิทธิ์)
    - Route สาธารณะ (`GET`, `POST`) เข้าถึงได้ทุกคน ส่วน `PUT`, `DELETE` ต้องเป็น `staff` เท่านั้น
- [x] **CP52 — Secrets Management & Production Fail-Safe:**
  - ชี้ไฟล์: `api/src/config.js` และ `api/src/middleware/errorHandler.js`
  - ประเด็น: ตรวจสอบ `JWT_SECRET` ในโหมด production หากไม่ได้ตั้งค่าระบบจะไม่ยอม start (Fail-Fast) และ Error Handler จะไม่ส่ง stack trace ไปยัง Client เพื่อป้องกัน Information Disclosure

---

## 🌐 Live Demo & Deployment Info

* **Live Demo URL:** [https://engse203-student-labs-685432100194-1.onrender.com/](https://engse203-student-labs-685432100194-1.onrender.com/)
* **Platform:** Render (Web Service)
* **Database:** SQLite / Turso Database
* **บัญชีทดสอบสำหรับเข้าสู่ระบบ (Staff):**
  * **Email:** `staff@rmutl.ac.th`
  * **Password:** `staff1234`
  * **Role:** `staff`
