# Campus Service — Full-Stack Application

ระบบแจ้งและติดตามคำขอบริการภายในสถานศึกษา (Campus Service Request System) พัฒนาแบบ Full-Stack ครบวงจร ครอบคลุมตั้งแต่หน้าบ้าน (Frontend), หลังบ้าน (API) ไปจนถึงการจัดเก็บข้อมูล (Database) พร้อมรองรับทั้งสภาพแวดล้อม Development และ Production (Single-Port Deployment)

---

## 🏗️ สถาปัตยกรรม 3 ชั้น (3-Tier Architecture)

ระบบถูกออกแบบแยกส่วนหน้าที่อย่างชัดเจนตามหลักการ Separation of Concerns ประกอบด้วย 3 ชั้นหลัก ดังนี้:

```text
┌─────────────────┐         HTTP / REST         ┌─────────────────┐          SQL Query          ┌─────────────────┐
│    Frontend     │ ──────────────────────────► │       API       │ ──────────────────────────► │    Database     │
│  (React + Vite) │ ◄────────────────────────── │    (Express)    │ ◄────────────────────────── │    (SQLite)     │
└─────────────────┘             JSON            └─────────────────┘            Rows             └─────────────────┘
```

| ชั้น (Tier) | เทคโนโลยีหลัก | หน้าที่รับผิดชอบ | โฟลเดอร์ |
|---|---|---|---|
| **Frontend** | React 19, Vite, React Router | หน้าจอติดต่อผู้ใช้ (UI), แบบฟอร์มส่งคำขอบริการ, Dashboard แสดงรายการและสถิติ, จัดการ Client-side Routing | `frontend/` |
| **API (Backend)** | Express 5, Node.js (>=22.13) | RESTful API, Route handling, Controller, Service Layer จัดการ Business Logic, ตรวจสอบความถูกต้อง, Error Handling รวมศูนย์ และ Logging | `api/src/` |
| **Database** | SQLite (`node:sqlite` ในตัว Node.js) | จัดเก็บข้อมูลคำขอบริการและผู้ใช้อย่างถาวร (Persistent Storage) มี Schema ชัดเจน | `api/data/` |

---

## 🚀 วิธีการติดตั้งและรันระบบ (Getting Started)

### ความต้องการของระบบ (Prerequisites)
* **Node.js**: เวอร์ชัน `>= 22.13.0` (เนื่องจากใช้งานฟีเจอร์ Built-in `node:sqlite`)
* **npm**: เวอร์ชัน `>= 10.0.0`

### การติดตั้ง Dependencies
รันคำสั่งที่โฟลเดอร์ Root (`labs/week-11/source`):
```bash
npm run build
```
*(คำสั่งนี้จะทำการ `npm install` ทั้งฝั่ง API, Frontend และทำการ Build Frontend Asset อัตโนมัติ)*

---

### 1. วิธีรันในโหมด Development (2 Terminals)

ในการพัฒนา เราจะแยกการทำงานเป็น 2 Terminal เพื่อความสะดวกและรองรับ Hot Module Replacement (HMR):

* **Terminal 1: รัน API Server**
  ```bash
  cd api
  npm run dev
  ```
  API จะทำงานที่: `http://localhost:3001` (มี Health Check ที่ `http://localhost:3001/api/health`)

* **Terminal 2: รัน Frontend Development Server**
  ```bash
  cd frontend
  npm run dev
  ```
  หน้าเว็บจะทำงานที่: `http://localhost:5173` พร้อม Hot Reload ทันทีเมื่อแก้ไขโค้ด

---

### 2. วิธีรันในโหมด Production (Single-Port Web Service)

ในโหมด Production ระบบจะรวมการทำงานทั้ง Frontend และ API ให้ทำงานอยู่บน **พอร์ตเดียวกัน (Single Port)** โดย Express จะเสิร์ฟทั้ง REST API (`/api/*`) และ Static Files ที่ได้จากการ build (`frontend/dist/`):

1. **Build ระบบทั้งหมด:**
   ```bash
   cd source/api
   npm install --include=dev
   npm run build
   ```

2. **Start เซิร์ฟเวอร์ในโหมด Production:**
   * **Linux / macOS:**
     ```bash
     npm install
     NODE_ENV=production npm start
     ```
   * **Windows PowerShell:**
     ```powershell
     $env:NODE_ENV="production"; npm start
     ```
   * **Windows CMD:**
     ```cmd
     set NODE_ENV=production && npm start
     ```

3. เข้าใช้งานระบบที่: `http://localhost:3001/` (หน้าเว็บและ API ทำงานร่วมกันบนพอร์ตเดียว ไม่ติดปัญหา CORS)

---

## ⚙️ Environment Variables

ระบบจัดการคอนฟิกกูเรชันผ่าน `api/src/config.js` โดยอ่านค่าจาก Environment Variables ดังนี้:

| ตัวแปร | ค่าเริ่มต้น (Default) | คำอธิบาย |
|---|---|---|
| `NODE_ENV` | `development` | สภาพแวดล้อมการทำงาน (`development` หรือ `production`) มีผลต่อการเปิด/ปิด Static File Serving และรูปแบบ Logging |
| `PORT` | `3001` | พอร์ตที่ API / Production Server เปิดรับการเชื่อมต่อ |
| `CORS_ORIGIN` | `http://localhost:5173` | โดเมนที่อนุญาตให้เรียกใช้ API ข้าม Origin (ใช้งานในโหมด Development) |
| `DB_FILE` | `api/data/campus.db` | ที่อยู่ของไฟล์ฐานข้อมูล SQLite |
| `STATIC_DIR` | `frontend/dist` | โฟลเดอร์ที่เก็บไฟล์ Production Build ของ Frontend |
| `VITE_API_BASE_URL` | `""` (สตริงว่างใน prod) | URL พื้นฐานของ API ที่ Frontend เรียกใช้ (ใน Production ปล่อยว่างเพื่อใช้ Relative Path `/api`) |

---

## 💡 การตัดสินใจออกแบบ (Design Decisions)

1. **ทำไมต้องแยกสถาปัตยกรรมเป็น 3 ชั้น (3-Tier)?**
   * **Separation of Concerns:** แยกหน้าที่ชัดเจนระหว่างส่วนแสดงผล (UI), ตรรกะทางธุรกิจ (Business Logic), และการจัดเก็บข้อมูล (Data Storage)
   * **Maintainability & Scalability:** สามารถปรับปรุงหรือเปลี่ยนเทคโนโลยีในชั้นใดชั้นหนึ่งได้โดยไม่กระทบชั้นอื่น เช่น หากต้องการเปลี่ยนหน้าบ้านจาก React เป็น Mobile App หรือสลับฐานข้อมูล ก็ไม่ต้องเขียนระบบใหม่ทั้งหมด
   * **Security:** ฐานข้อมูลถูกซ่อนอยู่หลัง API Client ภายนอกไม่สามารถเข้าถึงไฟล์ฐานข้อมูลหรือสั่ง Query โดยตรงได้

2. **ทำไมเลือกใช้ SQLite แทนฐานข้อมูลอื่นในโปรเจกต์นี้?**
   * **Zero Configuration:** เป็น Serverless Database ในรูปของไฟล์เดียว ไม่จำเป็นต้องติดตั้งหรือเปิดเซอร์วิสฐานข้อมูลแยก (เช่น MySQL หรือ MongoDB)
   * **Built-in บน Node.js 22:** ใช้โมดูลมาตรฐาน `node:sqlite` ที่มีมาพร้อมกับ Node.js ได้ทันที ไม่ต้องพึ่งพา native binary dependency ภายนอก
   * **Relational Data & Schema Integrity:** ข้อมูลคำขอบริการ ผู้ใช้ และหมวดหมู่มีความสัมพันธ์กันแบบ Relational ที่ต้องการ Foreign Keys และ Data Constraints ชัดเจน ซึ่ง SQLite ตอบโจทย์ได้สมบูรณ์แบบ

---

## 🩺 การตรวจสอบระบบ (Health Check & Diagnostics)

* ตรวจสอบสถานะการทำงานของเซิร์ฟเวอร์และฐานข้อมูล:
  ```http
  GET /api/health
  ```
  ผลลัพธ์ตัวอย่าง:
  ```json
  {
    "status": "ok",
    "env": "production",
    "uptime": 120,
    "database": {
      "connected": true,
      "tableCount": 3
    },
    "time": "2026-10-04T12:00:00.000Z"
  }
  ```
* ตรวจสอบความถูกต้องของโปรเจกต์ตาม Checkpoint:
  ```bash
  npm run check
  ```

---

## 🎬 วิดีโอสาธิตการใช้งาน (Demo)

* ลิงก์วิดีโอสาธิตระบบ (Demo Video): [YouTube / Google Drive Link](#)
* สรุปการสาธิต: ดูรายละเอียดเพิ่มเติมได้ที่ [DEMO.md](DEMO.md)
