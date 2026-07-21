<div align="center">

# 📋 ENGSE203 LAB 3
### Campus Service Request — Responsive Web UI, Form & Event

**🔗 [Live Demo](https://kittitatk.github.io/engse203-lab03-68543210019-4/)** &nbsp;|&nbsp; **📁 [Repository](https://github.com/KittitatK/engse203-lab03-68543210019-4)**

</div>

---

## 👤 ผู้จัดทำ

| รายการ | รายละเอียด |
|---|---|
| ชื่อ-นามสกุล | นาย กิตติทัต กันธรรม |
| รหัสนักศึกษา | 68543210019-4 |
| ระบบปฏิบัติการที่ใช้ | Windows |

---

## 📌 สารบัญ

- [วัตถุประสงค์ของงาน](#-วัตถุประสงค์ของงาน)
- [เครื่องมือที่ใช้](#-เครื่องมือที่ใช้)
- [วิธีติดตั้งและรัน](#-วิธีติดตั้งและรัน)
- [โครงสร้างไฟล์](#-โครงสร้างไฟล์)
- [หลักฐานผลลัพธ์](#-หลักฐานผลลัพธ์)
- [ภาพหน้าจอ](#-ภาพหน้าจอ)
- [ปัญหาที่พบและวิธีแก้ไข](#-ปัญหาที่พบและวิธีแก้ไข)
- [References & AI Assistance](#-references--ai-assistance)

---

## 🎯 วัตถุประสงค์ของงาน

- สร้างหน้าเว็บโดยใช้ **โครงสร้าง HTML เชิงความหมาย (Semantic HTML)** ได้แก่ `header`, `main`, `section`, `aside`, `form` และคำนึงถึงผู้ใช้ที่เข้าถึงเว็บด้วยเทคโนโลยีช่วยเหลือ (accessibility) เช่น จับคู่ `label for` กับ `id` ให้ถูกต้อง และเชื่อมข้อความแจ้งเตือน/คำอธิบายด้วย `aria-describedby`
- ออกแบบเลย์เอาต์ให้ **ปรับขนาดตามหน้าจอ (Responsive)** ตั้งแต่มือถือขนาด 375px (แสดงหนึ่งคอลัมน์ ไม่มี scroll แนวนอน) ไปจนถึงจอคอมพิวเตอร์ พร้อมทดสอบการ zoom หน้าเว็บที่ 200%
- ใช้ **Event ของ DOM** ทั้ง `input` และ `submit` เพื่อทำระบบแสดงผลตัวอย่างแบบทันที (Live Preview) และหยุดพฤติกรรม reload หน้าเว็บของฟอร์มด้วย `preventDefault()`
- เพิ่มระบบ **ตรวจสอบความถูกต้องของข้อมูล (Validation)** ก่อนบันทึก พร้อมแสดงสถานะข้อมูลผิด/ถูกให้ผู้ใช้เห็นชัดเจน
- ฝึกการทำงานร่วมกับ Git อย่างเป็นระบบ (แยก feature branch, commit เป็นช่วง ๆ, เปิดและ merge Pull Request) และนำแอปขึ้น **GitHub Pages** โดยใช้ผลลัพธ์จากการ build ด้วย Vite

---

## 🛠️ เครื่องมือที่ใช้

| หมวด | เครื่องมือ |
|---|---|
| Build Tool | Vite (dev server / build) |
| Frontend | HTML5, CSS3, JavaScript (Vanilla, ES Modules) |
| Runtime | Node.js, npm |
| Version Control | Git, GitHub, GitHub Pages |
| Editor | Visual Studio Code |
| AI Assistant | Claude — รายละเอียดอยู่ในหัวข้อ [References & AI Assistance](#-references--ai-assistance) |

---

## 🚀 วิธีติดตั้งและรัน

```bash
git clone https://github.com/KittitatK/engse203-lab03-68543210019-4
cd engse203-lab03-68543210019-4

npm install
npm run dev
npm run check

# build เพื่อสร้างโฟลเดอร์ docs/ ไว้สำหรับ GitHub Pages
npm run build
npm run preview
```

> ⚠️ **ก่อน deploy:** อย่าลืมแก้ค่า `base` ในไฟล์ `vite.config.js` ให้ตรงกับชื่อ repository ก่อนรันคำสั่ง `npm run build` ทุกครั้ง

---

## 📂 โครงสร้างไฟล์

```text
engse203-lab03-68543210019-4/
├── docs/                # ผลลัพธ์จาก npm run build → ใช้สำหรับ GitHub Pages
│   ├── assets/
│   └── index.html
├── src/
│   ├── main.js          # state, DOM event (input/submit), validate, render live preview
│   └── style.css        # responsive layout (mobile-first → 2 คอลัมน์บน desktop)
├── index.html           # หน้าเว็บหลัก (semantic HTML, ฟอร์ม, live preview)
├── package.json
├── vite.config.js
└── README.md
```

---

## ✅ หลักฐานผลลัพธ์

โปรเจกต์ **Campus Service Request** คือฟอร์มสำหรับยื่นคำขอใช้บริการภายในมหาวิทยาลัย ประกอบด้วยช่องกรอกชื่อผู้ขอ (Requester Name) ประเภทคำขอ (Request Type) และรายละเอียด (Details) พร้อมแสดงตัวอย่างแบบเรียลไทม์และรายการคำขอที่บันทึกสำเร็จแล้ว

| หัวข้อ | รายละเอียดการทำงาน |
|---|---|
| **Semantic HTML / Accessibility** | จัดวางด้วย `header`, `main`, `section`, `aside`, `form`; ทุก `label` ผูกกับ `id` ของ field ที่ถูกต้อง; ทุก control กำหนด `name`; ข้อความ error เชื่อมกับ field ผ่าน `aria-describedby` |
| **Responsive Layout** | บนมือถือ (375px) จัดเป็นหนึ่งคอลัมน์และไม่เกิด scroll แนวนอน; บนจอ desktop ปรับเป็นสองคอลัมน์ (ฟอร์ม + live preview) |
| **Event / Live Preview** | ใช้ event `input` เพื่ออัปเดตค่าตัวอย่างทันทีที่พิมพ์; ใช้ event `submit` ร่วมกับ `preventDefault()` ป้องกันการโหลดหน้าใหม่; แสดงข้อมูลผู้ใช้ด้วย `textContent` เพื่อลดความเสี่ยง XSS |
| **Validation / Feedback** | ตรวจสอบความยาวของชื่อผู้ขอ การเลือกประเภทคำขอ และความยาวของรายละเอียด; แสดงข้อความ error ไว้ใกล้ field ที่ผิดโดยไม่ล้างข้อมูลในฟอร์ม; เมื่อข้อมูลผ่านจะเพิ่มรายการใหม่และเคลียร์ฟอร์มอัตโนมัติ |

---

## 🖼️ ภาพหน้าจอ

<details open>
<summary><strong>หน้าจอปกติ (No error)</strong></summary>
<br>
<img width="841" height="135" alt="Screenshot 2026-07-19 173505" src="https://github.com/user-attachments/assets/c140e98a-723f-412f-a9df-09cc1df64e21" />
</details>

<details open>
<summary><strong>มุมมองมือถือ (375px)</strong></summary>
<br>
<img width="1917" height="1017" alt="Screenshot 2026-07-19 183112" src="https://github.com/user-attachments/assets/6d543297-ba86-46b8-b864-5c75e55251dc" />
</details>

<details open>
<summary><strong>มุมมองแท็บเล็ต (768px)</strong></summary>
<br>
<img width="1917" height="1018" alt="Screenshot 2026-07-19 183423" src="https://github.com/user-attachments/assets/7b31b925-f29a-454b-8429-3e378c7b5b61" />
</details>

<details open>
<summary><strong>มุมมองเดสก์ท็อป</strong></summary>
<br>
<img width="1920" height="1080" alt="Screenshot (40)" src="https://github.com/user-attachments/assets/d76e45f8-39bc-4657-9ed5-cd59355ae818" />
</details>

<details open>
<summary><strong>การแสดงผลแบบเรียลไทม์ (Live Preview)</strong></summary>
<br>
<img width="1917" height="1078" alt="Screenshot 2026-07-19 181437" src="https://github.com/user-attachments/assets/3593e9df-348d-4065-956f-45f161494eb5" />
</details>

<details open>
<summary><strong>สถานะข้อมูลไม่ถูกต้อง (Validation Error)</strong></summary>
<br>
<img width="1917" height="1078" alt="Screenshot 2026-07-19 181537" src="https://github.com/user-attachments/assets/e1b0f283-fc16-4bdd-af3d-c88f17a30f74" />
</details>

<details open>
<summary><strong>สถานะสำเร็จ (Success)</strong></summary>
<br>
<img width="1917" height="1077" alt="Screenshot 2026-07-19 181800" src="https://github.com/user-attachments/assets/b3efce30-b66d-479e-adca-ac8058c9af7e" />
</details>

---

## 🐛 ปัญหาที่พบและวิธีแก้ไข

| # | ปัญหา | วิธีแก้ไข |
|---|---|---|
| 1 | รันโปรเจกต์แล้วไฟล์ CSS ไม่ถูกโหลด สาเหตุจากระบุ path ผิด | เติมเครื่องหมายจุดนำหน้า path: `/src/style.css` → `./src/style.css` |
| 2 | รันโปรเจกต์แล้วไฟล์ JavaScript ไม่ถูกโหลด สาเหตุจากระบุ path ผิดเช่นกัน | เติมเครื่องหมายจุดนำหน้า path: `/src/main.js` → `./src/main.js` |
| 3 | เปิดด้วย Live Server แล้ว JavaScript ไม่ทำงาน | คอมเมนต์บรรทัด `import './style.css';` ไว้ชั่วคราว เนื่องจาก Live Server ไม่รองรับการ import สไตล์แบบนี้โดยตรง |
| 4 | สั่ง `npm install` แล้วระบบแจ้งว่าหา Node.js ไม่พบ | ถอนการติดตั้ง Node.js เดิมออกแล้วติดตั้งใหม่อีกครั้ง |
| 5 | PowerShell ปฏิเสธการรันสคริปต์ (`npm.ps1`) เนื่องจากตั้งค่า Execution Policy เป็น Restricted | รัน `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` แล้วกด `Y` เพื่อยืนยัน |
| 6 | สั่ง `npm install` ไม่สำเร็จ เพราะยังไม่ได้เข้าไปในโฟลเดอร์โปรเจกต์ที่ถูกต้อง | เข้าไปยังโฟลเดอร์ที่มีไฟล์ `package.json`, โฟลเดอร์ `src`, และ `index.html` ก่อนรันคำสั่งอีกครั้ง |

### 🔍 แนวทางตรวจสอบปัญหาเบื้องต้น (Quick Diagnosis)

| อาการ | จุดที่ควรตรวจสอบ |
|---|---|
| GitHub Pages ขึ้น 404 | ตรวจ Settings → Pages ว่าตั้ง branch `main` และโฟลเดอร์ `/docs` ถูกต้อง |
| ไม่มี CSS/JS หลัง deploy | ตรวจค่า `base` ใน `vite.config.js` ให้ตรงกับชื่อ repository แล้ว build ใหม่ |
| `FormData` ว่างเปล่า | ตรวจว่าทุก input มี attribute `name` ครบถ้วน |
| กด Submit แล้วหน้ารีโหลด | ตรวจว่า submit handler เรียก `preventDefault()` แล้วหรือยัง |
| Push ถูกปฏิเสธ (denied) | ตรวจการเชื่อมต่อด้วย `ssh -T git@github.com` และตรวจ `git remote -v` |

---

## 📚 References & AI Assistance

**Source / Documentation**
- ใบงาน `ENGSE203_LAB03_Web_UI_Responsive_Form_ฉบับขยาย_v2.docx`

**AI tools used:** Claude, Gemini, ChatGPT

**Used for:**
ศึกษาเทคนิคการจัดการ DOM Events (`input` และ `submit`) รวมถึงกระบวนการตรวจสอบความถูกต้องของข้อมูลในฟอร์ม (Form Validation) ตลอดจนการประยุกต์ใช้ HTML attributes เช่น `id`, `name` และ `aria-describedby` เพื่ออ้างอิงและควบคุมออบเจ็กต์ผ่านคำสั่ง `querySelector`

**My adaptation:**
- **JS & HTML:** ทำความเข้าใจโครงสร้าง `main.js` และ `index.html` โดยเน้นเรื่องลำดับการทำงานของฟังก์ชัน การส่งค่าระหว่างฟังก์ชัน และการเข้าถึง element ด้วย DOM (`querySelector`)
- **CSS (Mobile-First):** เขียนโค้ดจัดการเลย์เอาต์ด้วยตนเอง โดยใช้ `@media query` ปรับคลาส `.page-grid` ให้เป็น 2 คอลัมน์เมื่อแสดงผลบนหน้าจอ desktop
- **AI Assistance:** ยอมรับว่ามีการใช้ AI ช่วยให้คำแนะนำด้านการตกแต่งและจัดสัดส่วนหน้าเว็บให้สวยงามยิ่งขึ้น อย่างไรก็ตาม กลไกการเขียนโค้ดเพื่อจัดเลย์เอาต์ยังคงเป็นการพัฒนาด้วยตนเอง

---

<div align="center">

Made with 💻 by **กิตติทัต กันธรรม** · ENGSE203

</div>
