<div align="center">

# 📋 Week 03 Evidence

**หลักฐานการทดสอบ Responsive Layout, Form Validation และการทำงานแบบ Real-time**

</div>

---

## 📱 Responsive Layout (@media query)

<details open>
<summary><strong>1️⃣ Mobile — มุมมองหน้าจอมือถือ</strong></summary>
<br>

แสดงผลเป็นหนึ่งคอลัมน์ ปรับด้วย `@media query` ให้เหมาะกับหน้าจอขนาดเล็ก ไม่มี scroll แนวนอน

![Mobile view](<image/Screenshot 2026-07-19 183112.png>)

</details>

<details open>
<summary><strong>2️⃣ Tablet — มุมมองหน้าจอแท็บเล็ต</strong></summary>
<br>

เลย์เอาต์ปรับตัวตามความกว้างหน้าจอระดับกลาง

![Tablet view](<image/Screenshot 2026-07-19 183423.png>)

</details>

<details open>
<summary><strong>3️⃣ Desktop — มุมมองหน้าจอเดสก์ท็อป</strong></summary>
<br>

บนหน้าจอขนาดใหญ่ เลย์เอาต์ปรับเป็นสองคอลัมน์ (ฟอร์ม + live preview)

![Desktop view](<image/Screenshot (40).png>)

</details>

---

## 📝 Form Validation

<details open>
<summary><strong>4️⃣ Valid State — เมื่อข้อมูลถูกต้อง</strong></summary>
<br>

เมื่อกรอกข้อมูลถูกต้องครบถ้วนและกด submit ระบบแสดงสถานะสำเร็จ พร้อมเพิ่มรายการใหม่และเคลียร์ฟอร์มให้อัตโนมัติ

![Valid state](<image/Screenshot 2026-07-19 181800.png>)

</details>

<details open>
<summary><strong>5️⃣ Invalid State — เมื่อข้อมูลไม่ถูกต้อง</strong></summary>
<br>

เมื่อข้อมูลไม่ผ่านการตรวจสอบ ระบบแสดงข้อความ error ไว้ใกล้ field ที่ผิด โดยไม่ล้างข้อมูลที่กรอกไว้ในฟอร์ม

![Invalid state](<image/Screenshot 2026-07-19 181537.png>)

</details>

---

## ⚡ การทำงานแบบ Real-time

<details open>
<summary><strong>6️⃣ Initial — สถานะเริ่มต้นของหน้าเว็บ</strong></summary>
<br>

หน้าจอเริ่มต้นก่อนผู้ใช้กรอกข้อมูลใด ๆ

![Initial state](<image/Screenshot (40).png>)

</details>

<details open>
<summary><strong>7️⃣ Real-time — การแสดงผล Live Preview</strong></summary>
<br>

เมื่อพิมพ์ข้อมูลในฟอร์ม ระบบอัปเดตตัวอย่าง (Live Preview) ให้ทันทีผ่าน event `input`

![Real-time preview](<image/Screenshot 2026-07-19 181437.png>)

</details>

---

## ✅ Manual Test

<details open>
<summary><strong>Console ไม่มี error</strong></summary>
<br>

ตรวจสอบผ่าน Developer Tools ยืนยันว่าไม่มีข้อความ error ปรากฏใน Console ขณะใช้งาน

![Console no error](<image/image.png>)

</details>