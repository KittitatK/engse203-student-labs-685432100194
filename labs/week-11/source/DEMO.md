# หลักฐานการสาธิตระบบ Full-Stack (A4 · CP42)

**ชื่อ-นามสกุล:** Kittitat K.  
**รหัสนักศึกษา:** 685432100194  
**วิชา:** ENGSE203 Software Architecture and Engineering  
**สัปดาห์ที่ 11:** Full-Stack Integration & Production Readiness  

---

## 📹 ลิงก์วิดีโอนำเสนอ (YouTube / Demo Video)

🔗 **YouTube Link:** `[ใส่ลิงก์ YouTube ที่นี่ เช่น https://youtu.be/xxxxxxxxxxx]`  
*(หมายเหตุ: แนะนำตั้งค่าเป็น Unlisted เพื่อความเป็นส่วนตัว)*

---

## ⏱️ สารบัญเวลาและหัวข้อการนำเสนอ (Timestamps)

### 🎬 ช่วง A: สาธิตระบบทำงานครบวงจร (≈ 3–4 นาที)
* **Timestamp:** `00:00 - 03:30`
* **รายการที่สาธิตในคลิป:**
  - [ ] **เปิดระบบครบ 3 ชั้น:** แสดงหน้าจอ React (Frontend) เชื่อมต่อ API (Express) และอ่านเขียนข้อมูลจาก SQLite
  - [ ] **การทำงาน CRUD ครบวงจร:**
    - ดูรายการคำขอบริการทั้งหมด (Read / Dashboard)
    - สร้างคำขอบริการใหม่ (Create)
    - ปรับเปลี่ยนสถานะคำขอ เช่น pending $\rightarrow$ in_progress $\rightarrow$ completed (Update)
    - ลบคำขอบริการ (Delete)
  - [ ] **Health Check Endpoint:** เปิดเบราว์เซอร์ไปที่ `http://localhost:3001/api/health` แสดงสถานะ `status: "ok"`, `env`, `uptime` และ `database.connected: true`
  - [ ] **ความถาวรของข้อมูล (Data Persistence):** ปิดเซิร์ฟเวอร์ Node.js (Ctrl+C) แล้วสตาร์ทใหม่ เพื่อพิสูจน์ว่าข้อมูลใน SQLite ยังคงอยู่ครบถ้วน ไม่สูญหาย
  - [ ] **Production Mode (พอร์ตเดียว):** รันคำสั่ง `npm run build` และ `npm start` แสดงให้เห็นว่าเข้าใช้งานหน้าเว็บและ API ได้ผ่านพอร์ต 3001 เพียงพอร์ตเดียว

---

### 💻 ช่วง B: อธิบาย Source Code และสถาปัตยกรรม (≈ 4–5 นาที)
* **Timestamp:** `03:30 - 08:00`
* **ไฟล์โค้ดและประเด็นที่เปิดอธิบายในคลิป:**
  - [ ] **Frontend เรียก API อย่างไร:**
    - ชี้ไฟล์: `frontend/src/services/apiClient.js`
    - ประเด็น: อธิบายการดึง Base URL และการใช้ fetch ส่ง HTTP Request ไปยังหลังบ้าน
  - [ ] **เส้นทางของ Request (Data Flow):**
    - ชี้ไฟล์: `api/src/routes/requestRoutes.js` $\rightarrow$ `api/src/controllers/requestController.js` $\rightarrow$ `api/src/services/requestService.js`
    - ประเด็น: เมื่อ Client ยิงคำขอเข้ามา Route จะจับคู่ URL แล้วส่งต่อให้ Controller ตรวจสอบพารามิเตอร์ จากนั้นส่งต่อให้ Service ประมวลผล Business Logic
  - [ ] **Service คุยกับฐานข้อมูล SQLite อย่างไร:**
    - ชี้ไฟล์: `api/src/services/requestService.js`
    - ประเด็น: ใช้โมดูลมาตรฐาน `node:sqlite` เตรียมคำสั่ง SQL ด้วย `db.prepare(...)` และรันแบบ Synchronous เพราะไฟล์ DB อยู่ในเครื่องเดียวกัน
  - [ ] **การรวมศูนย์การอ่าน Environment Variables:**
    - ชี้ไฟล์: `api/src/config.js`
    - ประเด็น: อ่านค่า `NODE_ENV`, `PORT`, `CORS_ORIGIN`, `DB_FILE` ไว้ที่เดียว เพื่อไม่ให้ hardcode ค่ากระจายในโปรเจกต์
  - [ ] **Health Check ตรวจสอบอะไรบ้าง:**
    - ชี้ไฟล์: `api/src/routes/healthRoutes.js`
    - ประเด็น: เช็คการเชื่อมต่อ Database ด้วย `getDbStatus()` และคืนค่า uptime พร้อม status code 200 (หรือ 503 หากต่อฐานข้อมูลไม่ได้)
  - [ ] **Production ต่างจาก Development อย่างไร:**
    - ชี้ไฟล์: `api/src/app.js` และ `frontend/.env.production`
    - ประเด็น: ใน Production ฝั่ง API จะเปิด static middleware เพื่อเสิร์ฟไฟล์ HTML/JS จากโฟลเดอร์ `frontend/dist` บนพอร์ตเดียวกัน และไฟล์ `.env.production` มีการตั้งค่า `VITE_API_BASE_URL=` เป็นค่าว่าง เพื่อให้หน้าเว็บเรียก API ผ่าน Relative Path `/api`

---

## 🌐 Live Demo (สำหรับ Challenge บน Render)
* **URL:** `https://xxxx.onrender.com` *(ใส่ลิงก์ Render ถ้าทำ Challenge)*
* **ฐานข้อมูล:** SQLite (ไฟล์ในเครื่อง)
