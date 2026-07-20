# Week 01 Evidence

ใส่ screenshots, test output หรือ reflection ที่ไม่ใช่ข้อมูลลับ แล้วอ้างชื่อไฟล์ใน `../README.md`
# Week 01 — Developer Environment & GitHub Setup

## Source

นำ source code จาก LAB 1 เดิมเข้า `source/` ด้วย:

```bash
npm run import:source -- week-01 /path/to/old-lab01
```

## Evidence ที่ควรมี

- ผล `node --version`, `npm --version`, `git --version`

  <img width="1076" height="174" alt="7424D83A-3E28-44CB-81FB-8F761DF45D33_4_5005_c" src="https://github.com/user-attachments/assets/85f78f4a-a229-4c97-a34c-2f69f7136aaa" />


- Screenshot โปรแกรม `hello.js`

  <img width="1320" height="68" alt="04476651-2B7E-4FCB-B76B-A53773615E66_4_5005_c" src="https://github.com/user-attachments/assets/b6bdcec3-dec5-4e0e-9c56-ef00ce0b7f1d" />


## Original Repository

| รายการ | ค่า |
|---|---|
| Repository URL | https://github.com/KittitatK/engse203-lab01-68543210019-4 |
| Commit SHA | `ef4ab81e50888a970d76c3c21def6dcc88ad44b1` |

> Commit SHA ได้จากคำสั่ง `git log -1` หรือ `git log --oneline -1`

## Reflection: Git Workflow ที่ใช้

1. **Clone/Setup** — เริ่มจากตั้งค่า environment (nvm, node, npm) ให้พร้อมก่อนเริ่มทำงานกับ repository
2. **Import source code** — ใช้ script `import:source` เพื่อดึงโค้ดต้นฉบับของ week-01 เข้ามาในโปรเจกต์
3. **Commit เป็นระยะ** — หลังแก้ไขหรือเพิ่มโค้ดแต่ละส่วน ใช้ `git add` และ `git commit -m "..."` เพื่อบันทึกความคืบหน้าเป็น checkpoint ย่อยๆ แทนที่จะ commit รวบครั้งเดียวตอนจบ
4. **Push ขึ้น remote** — ใช้ `git push` เพื่อส่งงานขึ้น GitHub ให้ผู้สอนตรวจได้

## หมายเหตุ

LAB 1 ไม่มี web application ได้ เมื่อ `publish/` ไม่มี `index.html` ระบบจะสร้าง evidence report จาก metadata ให้อัตโนมัติ
