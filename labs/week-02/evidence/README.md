<div align="center">

# 📋 Week 02 Evidence

**สถานะการทำงานของหน้าเว็บ: initial / loading / success / error / filter / mobile**
**พร้อมผลลัพธ์การรัน `npm run check` และ `npm run build`**

**🔗 [Live Demo](https://kittitatk.github.io/engse203-student-labs-685432100194/labs/week-02/)**

</div>

---

## 🖼️ สถานะของหน้าเว็บ (UI States)

<details open>
<summary><strong>1️⃣ Initial — หน้าเว็บไซต์ตอนปกติ</strong></summary>
<br>

หน้าจอเริ่มต้นก่อนมีการโต้ตอบใด ๆ แสดงองค์ประกอบพื้นฐานของหน้าเว็บครบถ้วน

![Initial state](<image/Screenshot 2026-07-21 125216.png>)

</details>

<details open>
<summary><strong>2️⃣ Loading — หน้าเว็บไซต์ตอนกำลังโหลดข้อมูล</strong></summary>
<br>

ทดสอบสถานะ loading โดยจำลองความเร็วเครือข่ายแบบ **H (High latency / throttling)** ผ่าน DevTools เพื่อดูว่าหน้าเว็บแสดงตัวบ่งชี้การโหลด (loading indicator) ระหว่างรอข้อมูลอย่างถูกต้อง

![Loading state](<image/Screenshot 2026-07-21 124518.png>)

</details>

<details open>
<summary><strong>3️⃣ Error — หน้าเว็บไซต์ตอนเกิดข้อผิดพลาด</strong></summary>
<br>

แสดงข้อความแจ้งเตือนเมื่อระบบไม่สามารถดึงข้อมูลได้สำเร็จ เพื่อให้ผู้ใช้ทราบสถานะและสาเหตุของปัญหา

![Error state](<image/Screenshot 2026-07-21 125348.png>)

</details>

<details open>
<summary><strong>4️⃣ Filter — ระบบกรองข้อมูลตอนค้นหา</strong></summary>
<br>

ผลลัพธ์เมื่อผู้ใช้พิมพ์คำค้นหา ระบบจะกรองรายการที่ตรงเงื่อนไขและแสดงผลแบบทันที

![Filter result](<image/Screenshot 2026-07-21 125452.png>)

</details>

<details open>
<summary><strong>5️⃣ Mobile — หน้าเว็บไซต์บนอุปกรณ์มือถือ</strong></summary>
<br>

ทดสอบการแสดงผลจริงบนหน้าจอมือถือผ่านลิงก์เว็บไซต์ที่ deploy แล้ว

🔗 https://kittitatk.github.io/engse203-student-labs-685432100194/labs/week-02/

</details>

---

## ⚙️ ผลการรันคำสั่ง

<details open>
<summary><strong><code>npm run dev</code> — รัน dev server</strong></summary>
<br>

ผลลัพธ์ใน Terminal หลังสั่งรัน dev server

![npm run dev terminal output](<image/Screenshot 2026-07-21 124934.png>)

ผลลัพธ์การรันจริงบน Web Browser

![Result on browser](<image/Screenshot 2026-07-21 130436.png>)

</details>

<details open>
<summary><strong><code>npm run check</code> — ตรวจสอบโค้ด</strong></summary>
<br>

ผลลัพธ์การตรวจสอบโค้ดผ่าน `npm run check` ไม่พบข้อผิดพลาด

![npm run check output](<image/Screenshot 2026-07-21 130837.png>)

</details>

<details open>
<summary><strong><code>npm run build</code> — build โปรเจกต์</strong></summary>
<br>

ผลลัพธ์การ build โปรเจกต์สำเร็จ พร้อมไฟล์ output สำหรับ deploy

![npm run build output](<image/Screenshot 2026-07-21 124958.png>)

</details>