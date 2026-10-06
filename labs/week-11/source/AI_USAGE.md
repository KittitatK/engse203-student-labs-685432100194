# บันทึกการใช้งาน AI ช่วยเหลือในการทำโปรเจกต์ (AI_USAGE.md)

**เครื่องมือ AI ที่ใช้งาน:** Gemini (Antigravity)  
**สัปดาห์ / งานที่ทำ:** Week 11 — การประกอบระบบ Full-Stack และการเตรียมความพร้อมสู่ Production (งาน A4)  
**ผู้จัดทำ:** กิตติทัต กันธรรม (รหัสนักศึกษา: 685432100194)  

ในสัปดาห์ที่ 11 นี้ ได้นำ AI มาใช้งานในลักษณะ Pair Programming Assistant เพื่อช่วยทำความเข้าใจ ออกแบบ และตรวจสอบระบบ Full-Stack ให้สามารถทำงานร่วมกันได้อย่างสมบูรณ์ ทั้งฝั่ง Frontend (React), Backend (Express API), และ Database (SQLite / Turso) รวมถึงการจำลองสภาพแวดล้อมจริงแบบ Single-Port Production Service โดยมีบันทึกการใช้งานตามแต่ละหัวข้อสำคัญดังนี้:

---

## ครั้งที่ 1: การรวมศูนย์ Configuration และการแยกสภาพแวดล้อม Dev / Production (CP36, CP38)

**ถามอะไร**
- ขอคำแนะนำในการออกแบบไฟล์ `api/src/config.js` เพื่อรวมศูนย์การอ่าน Environment Variables (`process.env`) ทั้งหมดไว้ที่เดียว แทนที่จะเขียนฮาร์ดโค้ดกระจายอยู่ในโปรเจกต์
- วิธีการกำหนดค่า Default สำหรับตัวแปรต่าง ๆ เช่น `PORT`, `NODE_ENV`, `CORS_ORIGIN`, `DB_FILE`, `STATIC_DIR`
- ทำไมในฝั่ง API จึงควรแยกรูปแบบ Logging ของ `morgan` ระหว่างโหมด Development และ Production (`morgan(config.isProd ? 'combined' : 'dev')`)

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- การรวมศูนย์ config ไว้ที่ไฟล์เดียวช่วยให้การแก้ไขคอนฟิกทำได้ง่าย และมี Fallback Value ที่ปลอดภัยหากไม่มีการกำหนดใน Environment
- แนะนำการใช้ `process.env.NODE_ENV === 'production'` สร้างแฟล็ก `isProd` เพื่อให้ส่วนอื่นของแอปสามารถตรวจสอบเงื่อนไขได้ง่ายและเป็นมาตรฐานเดียวกัน
- โหมด Development ควรใช้ฟอร์แมต `dev` เพื่อแสดงแถบสีและสถานะที่อ่านง่ายตอนพัฒนา ส่วน Production ควรใช้ฟอร์แมต `combined` ซึ่งเป็นมาตรฐาน Apache/Nginx เหมาะสำหรับเครื่องมือ Log Analytics และเก็บข้อมูล Request ได้ครบถ้วน

**ใช้ส่วนไหน / แก้เองตรงไหน**
- นำโครงสร้าง `config` Object ไปเขียนใน [config.js](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/api/src/config.js) และนำไปผูกเข้ากับ `createApp()` ใน [app.js](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/api/src/app.js) แทนค่าตัวเลขและสตริงเดิม

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 2: การทำ Health Check Endpoint และดึงสถานะฐานข้อมูล (CP37)

**ถามอะไร**
- การทำ Endpoint `/api/health` ที่ถูกต้องสำหรับ Cloud Services หรือ Container Orchestrator ควรคืนค่าอะไรบ้าง
- ทำไมต้องตรวจสอบสถานะของฐานข้อมูลด้วย ไม่ใช่แค่ตอบว่า API ทำงานอยู่
- ขอแนวทางการเขียนฟังก์ชัน `getDbStatus()` ใน `requestService.js` เพื่อส่งข้อมูลสถานะ SQLite และควรตอบ HTTP Status Code อะไรเมื่อฐานข้อมูลขัดข้อง

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- Health Check ไม่ควรตรวจสอบแค่ว่าเว็บเซิร์ฟเวอร์ตอบสนองได้ แต่ต้องตรวจสอบ Deep Health โดยเฉพาะความพร้อมของฐานข้อมูล เพราะหากฐานข้อมูลล่มแต่ API ยังตอบ 200 ระบบ Load Balancer หรือ Cloud Platform (เช่น Render) จะยังส่ง Traffic มาหา ทำให้ผู้ใช้พบปัญหา
- แนะนำให้ `getDbStatus()` ส่งคำสั่ง `SELECT COUNT(*) FROM sqlite_master WHERE type='table'` เพื่อยืนยันว่าเปิดไฟล์ SQLite และอ่าน Schema ได้จริง หากสำเร็จคืนสถานะ `connected: true`, จำนวนตาราง, และ `driver`
- คืนค่า HTTP 200 เมื่อฐานข้อมูลพร้อม (`status: "ok"`) และคืนค่า HTTP 503 Service Unavailable เมื่อฐานข้อมูลมีปัญหา เพื่อให้ Cloud Monitoring ทราบทันที

**ใช้ส่วนไหน / แก้เองตรงไหน**
- นำฟังก์ชัน `getDbStatus()` ไปเขียนใน [requestService.js](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/api/src/services/requestService.js) และสร้างเราเตอร์ [healthRoutes.js](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/api/src/routes/healthRoutes.js) โดยเพิ่มการคืนค่า `uptime` และเวลาปัจจุบันในรูปแบบ ISO

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 3: การเสิร์ฟแบบ Single-Port Production และ Client-side Routing (CP39, CP43)

**ถามอะไร**
- ทำไมในโหมด Production ถึงนิยมรันทั้ง Frontend (React) และ Backend (Express) อยู่บนพอร์ตเดียวกัน (Single-Port Web Service)
- เมื่อนำไฟล์ Build ของ React (`frontend/dist`) มาเสิร์ฟด้วย `express.static()` แล้วพบปัญหาว่า Route หน้าแรก `/` ถูกแย่งโดยข้อความ API และเมื่อเปิดหน้าย่อยเช่น `/about` แล้วกด Refresh จะขึ้น Error 404 มีแนวทางแก้ไขอย่างไร
- ทำไมในไฟล์ `frontend/.env.production` ต้องตั้ง `VITE_API_BASE_URL=` เป็นค่าว่าง

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- การใช้พอร์ตเดียวทำให้ไม่ต้องตั้งค่า CORS ใน Production และลดค่าใช้จ่าย/ความซับซ้อนในการจัดการโฮสต์ โดยหน้าเว็บสามารถเรียกหา API ผ่าน Relative Path `/api/...` ได้ทันที
- ปัญหา Route `/` แก้โดยการย้ายข้อความต้อนรับของ API ไปไว้ที่ path `/api` ส่วนหน้าแรก `/` ในโหมด Production ให้ปล่อยให้ Static Middleware เสิร์ฟ `index.html`
- ปัญหา 404 ใน SPA (Single Page Application) เกิดจากเบราว์เซอร์ส่งคำขอหน้าย่อยไปยัง Express ซึ่งไม่มีไฟล์หรือเราต์นั้นจริงบนดิสก์ แก้โดยการเพิ่ม Catch-All Handler ด้วย Regex `app.get(/^\/(?!api).*/, ...)` ส่งไฟล์ `index.html` คืนไปเสมอ เพื่อให้ React Router บนเบราว์เซอร์เป็นตัวจัดการแสดงคอมโพเนนต์ตาม URL
- ตั้ง `VITE_API_BASE_URL=` เป็นค่าว่าง เพื่อให้ตอน Build Bundle ด้วย Vite โค้ดฝั่งหน้าบ้านจะยิง Request ไปที่ Origin เดียวกันโดยอัตโนมัติ ป้องกันปัญหาการฮาร์ดโค้ด `http://localhost:3001` ซึ่งจะทำให้เว็บพังเมื่อนำไปรันบนเซิร์ฟเวอร์เครื่องอื่นหรือบน Cloud

**ใช้ส่วนไหน / แก้เองตรงไหน**
- แก้ไขการจัดวางลำดับ Middleware และ Catch-All Route ใน [app.js](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/api/src/app.js) ให้ทำงานเฉพาะตอน `config.isProd`
- สร้างไฟล์ [frontend/.env.production](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/frontend/.env.production) พร้อมตรวจสอบโค้ด JavaScript ที่ Build ออกมาใน `frontend/dist` ว่าไม่มีการฝัง `localhost:3001` ค้างอยู่

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 4: การจำลองสภาพแวดล้อม Cloud และการทำ Build Script ด้วย `--include=dev` (CP43 & Challenge)

**ถามอะไร**
- ทำไมคำสั่ง Build ในระดับ Root `package.json` ต้องมีคำสั่ง `npm install --include=dev --prefix frontend`
- ทำไมในการจำลอง Production บนเครื่อง ถึงควรทดสอบด้วยคำสั่ง `NODE_ENV=production PORT=10000 npm start` แทนที่จะใช้พอร์ต 3001 ตามเดิม
- ขอคำแนะนำโครงสร้างไฟล์ `render.yaml` เพื่อใช้ Deploy ขึ้นแพลตฟอร์ม Render อัตโนมัติ

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- บน Cloud Platform เช่น Render เมื่อระบบตั้งค่า `NODE_ENV=production` ในขั้นตอนติดตั้งและคอมไพล์ `npm install` ปกติจะข้าม dependencies ในกลุ่ม `devDependencies` โดยอัตโนมัติ แต่เนื่องจากตัว Build Tool อย่าง Vite ถูกจัดอยู่ในกลุ่ม `devDependencies` ของ Frontend หากไม่ระบุ `--include=dev` จะเกิดข้อผิดพลาด `vite: not found` ทำให้ขั้นตอน Build ล้มเหลว
- การทดสอบด้วยพอร์ต 10000 จะช่วยให้เราตรวจจับข้อผิดพลาดกรณีที่โค้ดยังมีการฮาร์ดโค้ดพอร์ต 3001 ไว้ที่จุดใดจุดหนึ่ง ช่วยให้แก้ไขได้ทันทีในเครื่องก่อนนำขึ้นจริง
- แนะนำรูปแบบไฟล์ `render.yaml` โดยระบุ `rootDir: labs/week-11/source`, `buildCommand`, `startCommand`, และ `healthCheckPath: /api/health` พร้อมกำหนด `NODE_VERSION: "22"` เพื่อรองรับโมดูล `node:sqlite`

**ใช้ส่วนไหน / แก้เองตรงไหน**
- อัปเดตสคริปต์ `build` และ `start` ใน [package.json](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/package.json)
- สร้างไฟล์คอนฟิก [render.yaml](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/render.yaml) และทดสอบรันคำสั่งจำลองบน Terminal ผ่าน PowerShell

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 5: สถาปัตยกรรม 3 ชั้น และการรองรับฐานข้อมูลถาวร Turso / LibSQL (CP41 & Challenge)

**ถามอะไร**
- ทำความเข้าใจเหตุผลที่ว่าทำไมการเปลี่ยนฐานข้อมูลจาก SQLite เป็น MongoDB ถึงกระทบไปจนถึงชั้น Controller แต่ทำไมการเปลี่ยนมาใช้ Turso (LibSQL) จึงแก้แค่ชั้น Service เพียงไฟล์เดียวได้
- การใช้ Dynamic Import `await import('libsql')` มีข้อดีอย่างไรเมื่อเทียบกับการเขียน `import Database from 'libsql'` ไว้บนสุดของไฟล์

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- MongoDB เป็น Database ที่อยู่ภายนอกและทำงานผ่าน Network I/O จึงเป็น Asynchronous ทั้งหมด ทำให้ Method ใน Service ต้องเปลี่ยนเป็น `async` ส่งผลกระทบให้ Controller ที่เรียกใช้ต้องปรับเปลี่ยนเป็น `async / await` ตามไปด้วย
- ในทางกลับกัน ไลบรารี `libsql` ของ Turso มี API ที่ทำงานแบบ Synchronous และมีเมธอดเหมือนกับ `node:sqlite` (`prepare().all()`, `.run()`, `.get()`) แทบทุกประการ จึงทำให้เปลี่ยนแค่เลเยอร์การเปิดฐานข้อมูลใน Service ได้โดยไม่ต้องแก้ Controller
- การใช้ Dynamic Import `await import('libsql')` ภายในฟังก์ชัน `openDatabase()` ช่วยให้เครื่องที่ไม่ได้ติดตั้งแพ็กเกจ `libsql` (เช่น เครื่องตรวจ Checker หรือสภาพแวดล้อมที่รัน `npm test`) ยังคงสามารถรันงานผ่าน `node:sqlite` ได้อย่างราบรื่นโดยไม่พังตั้งแต่ตอนโหลดโมดูล

**ใช้ส่วนไหน / แก้เองตรงไหน**
- นำความเข้าใจนี้ไปเขียนอธิบายใน [DATABASE_CHOICES.md](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/DATABASE_CHOICES.md)
- ปรับปรุงฟังก์ชัน `openDatabase()` และ `loadSeed()` ใน [requestService.js](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/api/src/services/requestService.js) เพื่อรองรับการสลับระหว่าง SQLite Local File และ Turso ผ่าน Environment Variables

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## สรุปภาพรวมการทำงานในสัปดาห์ที่ 11

- **ส่วนที่ลงมือทำและเขียนเอง:**
  - การจัดวางโครงสร้างโฟลเดอร์และการรวมสถาปัตยกรรมทั้ง 3 ชั้นเข้าด้วยกัน
  - การเขียนและตรวจสอบ Logic ใน `config.js`, `healthRoutes.js`, และ `requestService.js`
  - การเขียนเอกสารสรุปสถาปัตยกรรม [README.md](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/README.md) และการตอบคำถามเชิงวิเคราะห์ใน [DATABASE_CHOICES.md](file:///e:/engse203-student-labs-685432100194/labs/week-11/source/DATABASE_CHOICES.md)
  - การรันคำสั่งทดสอบระบบจริงทั้งในโหมด Dev และการจำลอง Production Single-Port จนผ่านเกณฑ์ `check-week11.mjs` ครบ 41/41 รายการ
- **ส่วนที่ AI ช่วยสนับสนุน:**
  - แนะนำแนวคิดสถาปัตยกรรม Single-Port Web Service และหลักการทำ Catch-All Regex สำหรับ React Router
  - อธิบายเบื้องหลังการทำงานของ Flag `--include=dev` สำหรับกระบวนการ Build บน Cloud
  - แนะนำการทำ Dynamic Import สำหรับ Driver ฐานข้อมูล เพื่อให้โค้ดยืดหยุ่นและไม่ทำให้ชุดทดสอบหรือเครื่องมือตรวจพัง
- **ความเข้าใจในระบบ:**
  - เข้าใจขั้นตอนและ Data Flow ทั้งหมดตั้งแต่เมื่อผู้ใช้ส่งข้อมูลจากหน้าเว็บ React ผ่าน REST API ไปยัง Service และบันทึกลง SQLite รวมถึงเข้าใจความแตกต่างอย่างชัดเจนระหว่างสภาพแวดล้อม Development กับ Production
