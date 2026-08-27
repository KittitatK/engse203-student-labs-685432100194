# ENGSE203 LAB05 — AI / Resource Usage

| Tool / Resource | Purpose | Used portion | How I verified | My final decision |
|---|---|---|---|---|
| Gemini | ช่วยวิเคราะห์และแก้ไขโค้ด | ฟังก์ชัน readStoredRequests ในไฟล์ requestStorage.js | source review / runtime test (อ่านทำความเข้าใจโค้ดที่ AI แนะนำ และนำไปรันทดสอบด้วย npm run check) | นำโค้ดมาปรับใช้จริง เนื่องจากสามารถแก้ไขข้อผิดพลาดได้ครบถ้วนและทำงานได้ตรงตามที่โจทย์กำหนด |
| Gemini | อธิบายการใช้ `async/await` | `DashboardPage.jsx` และ Service Layer | source review / runtime test (ตรวจสอบความเข้าใจกับเอกสารอ้างอิง (เช่น MDN) และทดสอบรันโปรแกรมเพื่อดูการดึงข้อมูลว่าทำงานได้ถูกต้อง ไม่บล็อก UI) | นำความเข้าใจที่ได้มาใช้จัดการ Promise ตอนเรียก API เช่น ตอนโหลดและเพิ่มคำร้อง ทำให้โค้ดทำงานตามลำดับได้ถูกต้องและอ่านง่ายขึ้น |

คำรับรอง:

- [x] ไม่ส่ง token, password, secret หรือข้อมูลส่วนบุคคลจริงให้เครื่องมือ
- [x] ตรวจ source และรัน test ด้วยตนเอง
- [x] อธิบาย Route, Effect, Service Layer และ persistence ของ final code ได้
