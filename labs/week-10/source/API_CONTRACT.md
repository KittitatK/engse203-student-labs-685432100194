# API Contract — Campus Service Request API

**เวอร์ชัน:** 2.1.0 · **Base URL:** `http://localhost:3001`
**รูปแบบข้อมูล:** JSON (`Content-Type: application/json`)

> **API Contract คืออะไร** — ข้อตกลงระหว่างคนทำ front-end กับคนทำ back-end
> ว่าจะคุยกันด้วย endpoint อะไร ส่งอะไรไป ได้อะไรกลับ
> มีไว้เพื่อให้สองฝั่ง**ทำงานคู่ขนานกันได้** โดยไม่ต้องรอกัน

---

## โครงสร้างข้อมูล Request

| field | ชนิด | คำอธิบาย | ตัวอย่าง |
|---|---|---|---|
| `id` | string | รหัสคำร้อง · ขึ้นต้นด้วย `REQ-` · เซิร์ฟเวอร์สร้างให้ | `"REQ-001"` |
| `requesterName` | string | ชื่อผู้แจ้ง · อย่างน้อย 2 ตัวอักษร | `"สมชาย ใจดี"` |
| `requestType` | string | ประเภท · 1 ใน 4 ค่าที่กำหนด | `"แจ้งซ่อม"` |
| `location` | string | สถานที่ · ห้ามว่าง | `"ห้องปฏิบัติการ 301"` |
| `details` | string | รายละเอียด · อย่างน้อย 10 ตัวอักษร | `"เครื่องปรับอากาศไม่ทำงาน"` |
| `priority` | string | `"normal"` หรือ `"urgent"` | `"urgent"` |
| `status` | string | `"pending"` · `"in-progress"` · `"completed"` | `"pending"` |

**ค่าที่ยอมรับของ `requestType`** — `แจ้งซ่อม` · `บริการบัญชีผู้ใช้` · `ขอใช้อุปกรณ์` · `อื่น ๆ`

---

## Endpoints

| Method | Endpoint | คำอธิบาย | Request body | สำเร็จ | ผิดพลาด |
|---|---|---|---|---|---|
| `GET` | `/api/requests` | ดูคำร้องทั้งหมด | — | `200` + array | — |
| `GET` | `/api/requests?status=` | กรองตามสถานะ | — | `200` + array | — |
| `GET` | `/api/requests/:id` | ดูคำร้องใบเดียว | — | `200` + object | `404` ไม่พบ |
| `POST` | `/api/requests` | สร้างคำร้องใหม่ | Request (ไม่ต้องมี `id`, `status`) | `201` + object ที่สร้าง | `400` ข้อมูลไม่ถูกต้อง |
| `PUT` | `/api/requests/:id` | เปลี่ยนสถานะ | `{ "status": "..." }` | `200` + object ที่แก้แล้ว | `400` สถานะผิด · `404` ไม่พบ |
| `DELETE` | `/api/requests/:id` | ลบคำร้อง | — | `204` ไม่มี body | `404` ไม่พบ |
| `GET` | `/api/users` | ดูรายชื่อผู้ใช้ทั้งหมด (⭐ Challenge) | — | `200` + array | — |
| `GET` | `/api/users/:id/requests` | ดูคำร้องทั้งหมดของผู้ใช้ที่ระบุ (⭐ Challenge) | — | `200` + array | — |

---

## ตัวอย่างการเรียกใช้

### GET /api/requests

```http
GET /api/requests HTTP/1.1
Host: localhost:3001
```

```json
[
  {
    "id": "REQ-001",
    "requesterName": "สมชาย ใจดี",
    "requestType": "แจ้งซ่อม",
    "location": "ห้องปฏิบัติการ 301",
    "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
    "priority": "urgent",
    "status": "pending"
  }
]
```

### POST /api/requests

```http
POST /api/requests HTTP/1.1
Content-Type: application/json

{
  "requesterName": "สุภาวดี รักเรียน",
  "requestType": "ขอใช้อุปกรณ์",
  "location": "ห้องประชุม 2",
  "details": "ขอยืมโปรเจกเตอร์สำหรับนำเสนอ",
  "priority": "normal"
}
```

**201 Created**

```json
{
  "id": "REQ-MTYOA3MX-YEX9",
  "requesterName": "สุภาวดี รักเรียน",
  "requestType": "ขอใช้อุปกรณ์",
  "location": "ห้องประชุม 2",
  "details": "ขอยืมโปรเจกเตอร์สำหรับนำเสนอ",
  "priority": "normal",
  "status": "pending"
}
```

**400 Bad Request** — เมื่อข้อมูลไม่ถูกต้อง

```json
{
  "error": "ข้อมูลคำร้องไม่ถูกต้อง",
  "details": [
    "ชื่อผู้แจ้งต้องมีอย่างน้อย 2 ตัวอักษร",
    "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร"
  ]
}
```

### PUT /api/requests/:id

```http
PUT /api/requests/REQ-001 HTTP/1.1
Content-Type: application/json

{ "status": "in-progress" }
```

**200 OK** — คืนคำร้องที่อัปเดตแล้ว

### DELETE /api/requests/:id

**204 No Content** — ไม่มี body ส่งกลับ

---

## รูปแบบ Error

ทุก error ตอบเป็น JSON ที่มี field `error` เสมอ

```json
{ "error": "ข้อความที่ผู้ใช้ทั่วไปอ่านเข้าใจ" }
```

กรณี validation จะมี `details` เพิ่มมาเป็น array บอกว่าผิดตรงไหนบ้าง

| Status | เมื่อไหร่ | ฝั่งไหนผิด |
|---|---|---|
| `400` | ข้อมูลที่ส่งมาไม่ถูกต้อง | ผู้ใช้ |
| `404` | ไม่พบทรัพยากรที่ขอ | ผู้ใช้ |
| `500` | โค้ดเซิร์ฟเวอร์ผิดพลาด | เซิร์ฟเวอร์ |

> **ตอน production จะไม่ส่ง stack trace กลับไป** — เปิดเผยโครงสร้างภายในให้คนภายนอกเห็นไม่ได้

---

## CORS

API อนุญาตให้เรียกจาก origin ที่กำหนดใน `CORS_ORIGIN` เท่านั้น

```
Access-Control-Allow-Origin: http://localhost:5173
```

**ถ้าเรียกจาก origin อื่น** เบราว์เซอร์จะบล็อกก่อนที่โค้ดจะได้เห็น response — จะเห็น error ใน Console ว่าถูกบล็อกโดย CORS policy

> ⚠ CORS เป็นกลไกของ **เบราว์เซอร์** เท่านั้น · Postman และ curl ไม่ถูกบล็อก เพราะไม่ใช่เบราว์เซอร์

---

## Environment Variables

### ฝั่ง API (`api/.env`)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| `PORT` | `3001` | พอร์ตที่ API รับคำขอ |
| `CORS_ORIGIN` | `http://localhost:5173` | origin ที่อนุญาตให้เรียก |
| `NODE_ENV` | `development` | `production` จะเปลี่ยนรูปแบบ log และซ่อน stack trace |

### ฝั่ง Frontend (`frontend/.env.local`)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001` | ที่อยู่ของ API |

> **ต้องขึ้นต้นด้วย `VITE_`** ไม่งั้น Vite จะไม่ส่งค่าไปให้โค้ดฝั่งเบราว์เซอร์
> และ**ห้าม commit ไฟล์ `.env`** — ใช้ `.env.example` เป็นตัวอย่างแทน

---

## การรันทั้งระบบ

ต้องเปิด **2 terminal** พร้อมกัน

```bash
# Terminal 1 — API
cd api && npm run dev          # http://localhost:3001

# Terminal 2 — Frontend
cd frontend && npm run dev     # http://localhost:5173
```

**ลำดับสำคัญ** — เปิด API ก่อนเสมอ ไม่งั้น frontend จะขึ้นข้อความว่าติดต่อเซิร์ฟเวอร์ไม่ได้

---

## Data Model (โครงสร้างฐานข้อมูลเชิงสัมพันธ์)

ในสัปดาห์ที่ 10 ระบบได้เปลี่ยนการจัดเก็บข้อมูลจากไฟล์ JSON มาเป็นฐานข้อมูล SQLite (`campus.db`) โดยออกแบบให้เป็นฐานข้อมูลเชิงสัมพันธ์ (Relational Database) แบ่งออกเป็น 2 ตารางหลัก:

```
┌──────────────────────────┐               ┌──────────────────────────────────────┐
│          users           │               │               requests               │
├──────────────────────────┤               ├──────────────────────────────────────┤
│ PK  id (INTEGER)         │◄──────┐       │ PK  id (TEXT)                        │
│     name (TEXT)          │       └───────┼─ FK requester_id (INTEGER)           │
│     department (TEXT)    │  1         N  │     request_type (TEXT)              │
│     email (TEXT, UNIQUE) │               │     location (TEXT)                  │
└──────────────────────────┘               │     details (TEXT)                   │
                                           │     priority (TEXT)                  │
                                           │     status (TEXT)                    │
                                           │     created_at (TEXT)                │
                                           └──────────────────────────────────────┘
```

### 1. โครงสร้างตาราง (Database Schema)

#### ตาราง `users` (ผู้ใช้งานระบบ)
| คอลัมน์ | ชนิดข้อมูล | ข้อกำหนด (Constraints) | คำอธิบาย |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | รหัสผู้ใช้งานอัตโนมัติ (Surrogate Key) |
| `name` | `TEXT` | `NOT NULL` | ชื่อ-นามสกุลของผู้แจ้ง |
| `department` | `TEXT` | `NOT NULL` | หน่วยงาน/สังกัด |
| `email` | `TEXT` | `NOT NULL UNIQUE` | อีเมล (ห้ามซ้ำ) |

#### ตาราง `requests` (คำร้องขอรับบริการ)
| คอลัมน์ | ชนิดข้อมูล | ข้อกำหนด (Constraints) | คำอธิบาย |
|---|---|---|---|
| `id` | `TEXT` | `PRIMARY KEY` | รหัสคำร้อง เช่น `REQ-001` |
| `requester_id` | `INTEGER` | `NOT NULL, REFERENCES users(id)` | รหัสผู้แจ้ง อ้างอิงตาราง `users(id)` (Foreign Key) |
| `request_type` | `TEXT` | `NOT NULL, CHECK (request_type IN ('แจ้งซ่อม','บริการบัญชีผู้ใช้','ขอใช้อุปกรณ์','อื่น ๆ'))` | ประเภทคำร้อง |
| `location` | `TEXT` | `NOT NULL` | สถานที่เกิดเหตุ |
| `details` | `TEXT` | `NOT NULL` | รายละเอียดคำร้อง |
| `priority` | `TEXT` | `NOT NULL DEFAULT 'normal', CHECK (priority IN ('normal','urgent'))` | ระดับความเร่งด่วน |
| `status` | `TEXT` | `NOT NULL DEFAULT 'pending', CHECK (status IN ('pending','in-progress','completed'))` | สถานะการดำเนินการ |
| `created_at` | `TEXT` | `NOT NULL DEFAULT (datetime('now','localtime'))` | เวลาที่บันทึกคำร้อง |

---

### 2. ข้อสังเกตเรื่องรูปแบบ (Database Schema vs API Shape)
> **โครงสร้างในฐานข้อมูลไม่เหมือนรูปแบบที่ API ส่งออก**
> 
> - **ในฐานข้อมูล:** เก็บเป็น `requester_id` (ตัวเลข) เพื่อป้องกันปัญหาข้อมูลซ้ำซ้อน (Data Redundancy) และความผิดปกติในการแก้ไข (Update Anomaly)
> - **ในผลลัพธ์ของ API:** คืนค่าเป็น `requesterName` (ข้อความชื่อผู้แจ้ง) เพราะฝั่ง Frontend ต้องการนำชื่อไปแสดงผลทันทีโดยไม่ต้องยิง query ซ้ำซ้อน
> - **บทบาทของ Service Layer:** ทำหน้าที่แปลงข้อมูลระหว่างสองฝั่งด้วยคำสั่ง `JOIN users u ON u.id = r.requester_id` และกำหนด alias ด้วย `u.name AS requesterName`

---

### 3. พฤติกรรมสำคัญของ `POST /api/requests` (Auto-create User) ⭐
> **ถ้าส่ง `requesterName` ที่ยังไม่มีในระบบ จะสร้างผู้ใช้ใหม่ให้อัตโนมัติ**

- เมื่อได้รับ Request สร้างคำร้อง ชั้น Service จะนำ `requesterName` ไปค้นหาในตาราง `users` ด้วยฟังก์ชัน `resolveUserId()`:
  - **กรณีมีผู้ใช้นี้อยู่แล้ว:** จะนำ `id` ของผู้ใช้เดิมมาผูกกับ `requester_id` ทันที (ไม่สร้างผู้ใช้ซ้ำ)
  - **กรณีเป็นชื่อใหม่:** ระบบจะทำการ `INSERT` ผู้ใช้คนใหม่เข้าสู่ตาราง `users` โดยอัตโนมัติ (กำหนดอีเมลและแผนกเริ่มต้นให้) แล้วนำ `id` ใหม่ไปใช้สร้างคำร้อง
- **ข้อควรระวังสำหรับผู้พัฒนา:** พฤติกรรมนี้ไม่สามารถคาดเดาได้จากการดูเฉพาะ HTTP Method ทั่วไป ดังนั้นผู้ใช้ API ต้องระมัดระวังการสะกดชื่อผู้แจ้ง เพราะการพิมพ์ผิดแม้แต่ตัวอักษรเดียวจะส่งผลให้เกิด User ใหม่ขึ้นในฐานข้อมูลโดยไม่ตั้งใจ

---

## ผลการทดสอบความปลอดภัย (SQL Injection Prevention)

ระบบใช้ **Parameterized Queries (`?`)** ของไลบรารี `node:sqlite` ในทุก Query ที่รับค่าจากผู้ใช้ ทำให้ป้องกันการโจมตีแบบ SQL Injection ได้อย่างสมบูรณ์:

| รูปแบบการทดสอบ | Endpoint ที่ยิงทดสอบ | ผลลัพธ์ที่ได้ | ผลการป้องกัน |
|---|---|---|---|
| 1. เงื่อนไขจริงเสมอ (Always True) | `GET /api/requests?status=x'%20OR%20'1'='1` | `200 OK` พร้อม `[]` (0 รายการ) | ✅ ปลอดภัย — เครื่องหมาย `'` ถูกมองเป็น String Literal ไม่ใช่ SQL Command |
| 2. พยายามลบตาราง (Drop Table) | `GET /api/requests?status='%3B%20DROP%20TABLE%20requests%3B%20--` | `200 OK` พร้อม `[]` (0 รายการ) และตารางยังอยู่ครบ | ✅ ปลอดภัย — ไม่มีการรันคำสั่งซ้อน และฐานข้อมูลยังสมบูรณ์ |
| 3. เพิ่มเงื่อนไขซ้อน (Compound Query) | `GET /api/requests?status=pending'%20OR%20status='completed` | `200 OK` พร้อม `[]` (0 รายการ) | ✅ ปลอดภัย — ค่าถูกนำไปค้นหาตรงตัว ไม่เกิดการ bypass ตรรกะ |

---

## ประวัติการปรับปรุงเอกสาร (Changelog)

- **v2.1.0 (สัปดาห์ที่ 10 - Take-home CP34):**
  - เพิ่มหัวข้อ Data Model และโครงสร้างฐานข้อมูลเชิงสัมพันธ์ SQLite (`users` และ `requests`)
  - อธิบายเหตุผลที่ Schema ในฐานข้อมูลแตกต่างจาก JSON Shape ของ API (การทำ Normalization vs ความสะดวกของ UI)
  - บันทึกพฤติกรรม Auto-create User ของ `POST /api/requests`
  - เพิ่มผลการทดสอบ SQL Injection Prevention
- **v2.0.0 (สัปดาห์ที่ 07):**
  - กำหนด API Contract เริ่มต้นสำหรับระบบ Campus Service Request

