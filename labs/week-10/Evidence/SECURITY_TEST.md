# รายงานผลการทดสอบความปลอดภัย: SQL Injection Prevention (CP31)

**วิชา:** ENGSE203 การเขียนโปรแกรมสำหรับวิศวกรซอฟต์แวร์  
**หน่วยที่ 4 · สัปดาห์ที่ 10:** Node.js & Database Integration  
**ผู้ทดสอบ:** กิตติทัต กันธรรม (รหัสนักศึกษา: 685432100194)  
**เป้าหมาย:** พิสูจน์ว่าระบบป้องกันการโจมตีแบบ SQL Injection ได้อย่างสมบูรณ์ ด้วยเทคนิค Parameterized Queries (`?`)

---

## 1. หลักการและแนวคิดความปลอดภัย

โค้ดที่ปลอดภัยกับโค้ดที่มีช่องโหว่ต่างกันเพียงการส่งผ่านค่าไปยังฐานข้อมูล:

```javascript
// ❌ อันตรายอย่างยิ่ง — การนำค่าจากผู้ใช้มาต่อ String เข้า SQL Command โดยตรง
db.prepare(`SELECT * FROM requests WHERE status = '${status}'`).all();

// ✅ ปลอดภัยสูงสุด — ใช้ Parameterized Query (Placeholder ?)
db.prepare('SELECT * FROM requests WHERE status = ?').all(status);
```

### กลไกการป้องกันของ Parameterized Queries
เมื่อใช้ placeholder `?` ตัวประมวลผลคำสั่งของ SQLite จะทำการ **แยกขั้นตอนการตีความโครงสร้างคำสั่ง SQL (Compile/Prepare)** ออกจาก **ขั้นตอนการรับส่งข้อมูล (Data Binding)** อย่างเด็ดขาด:
- ข้อมูลที่ส่งเข้ามาผ่าน `status` ไม่ว่าจะยาวแค่ไหน หรือมีเครื่องหมายพิเศษทาง SQL เช่น `'`, `;`, `--`, `OR 1=1` จะถูกมองเป็น **ข้อความธรรมดา (String Literal)** เท่านั้น
- SQLite จะไม่นำค่าดังกล่าวมาแปลงเป็นคำสั่งเพื่อรันโดยเด็ดขาด ทำให้ผู้ไม่หวังดีไม่สามารถ Break out ออกมาแก้ไขตรรกะของ SQL ได้

---

## 2. สิ่งที่ `?` ใช้แทนไม่ได้ และแนวทางแก้ไข

Placeholder `?` ในคำสั่ง SQL ถูกออกแบบมาเพื่อใช้แทน **ข้อมูล (Values)** เท่านั้น **ไม่สามารถใช้แทนชื่อคอลัมน์ (Column Name) หรือชื่อตาราง (Table Name) ได้** เช่น:

```javascript
// ❌ ผิดไวยากรณ์ SQLite ไม่ยอมรับ
db.prepare('SELECT * FROM requests ORDER BY ?').all(sortBy);
```

### การป้องกันด้วย Allowlist
หากจำเป็นต้องให้ผู้ใช้เลือกคอลัมน์ในการจัดเรียง (`ORDER BY`) ให้ใช้เทคนิค **Allowlist** เพื่อตรวจสอบค่าที่อนุญาตก่อนเสมอ:

```javascript
const ALLOWED_COLUMNS = ['id', 'status', 'priority', 'created_at'];
const safeSortCol = ALLOWED_COLUMNS.includes(sortBy) ? sortBy : 'id';

// ปลอดภัยเพราะ safeSortCol ได้รับการตรวจสอบอย่างเข้มงวดแล้ว
db.prepare(`SELECT * FROM requests ORDER BY ${safeSortCol}`).all();
```

---

## 3. บันทึกผลการทดสอบเจาะระบบจริง (Security Testing Log)

การทดสอบทำขึ้นขณะเปิดเซิร์ฟเวอร์ Express API ที่ `http://localhost:3001` โดยใช้คำสั่ง `curl.exe` จำลองการโจมตีใน 3 รูปแบบหลัก:

### ① การทดสอบเงื่อนไขที่เป็นจริงเสมอ (Always True Attack)
*เป้าหมายของผู้โจมตี: ต้องการให้ตรรกะ SQL เป็นจริงเสมอเพื่อขโมยข้อมูลทั้งหมดในระบบ*

```bash
curl.exe "http://localhost:3001/api/requests?status=x'%20OR%20'1'='1"
```

- **Payload:** `status=x' OR '1'='1`
- **HTTP Status Code ที่ได้:** `200 OK`
- **Response Body:**
  ```json
  []
  ```
- **ผลการวิเคราะห์:** ระบบคืนค่า Array ว่าง (`[]`) จำนวน 0 รายการ แสดงว่าค่า `x' OR '1'='1` ถูกค้นหาในฐานข้อมูลในฐานะคำเฉพาะคำหนึ่งเท่านั้น และไม่มีแถวใดในตารางที่มีสถานะชื่อนี้จริง ตรรกะ `OR '1'='1` ไม่ได้ถูกนำไปประเมินผล

---

### ② การทดสอบคำสั่งซ้อนเพื่อทำลายฐานข้อมูล (Stacked Query / Drop Table Attack)
*เป้าหมายของผู้โจมตี: ต้องการยุติคำสั่งเดิมด้วยเครื่องหมาย `;` แล้วสั่งลบตารางคำร้องทิ้ง*

```bash
curl.exe "http://localhost:3001/api/requests?status='%3B%20DROP%20TABLE%20requests%3B%20--"
```

- **Payload:** `status='; DROP TABLE requests; --`
- **HTTP Status Code ที่ได้:** `200 OK`
- **Response Body:**
  ```json
  []
  ```
- **การพิสูจน์ความสมบูรณ์ของฐานข้อมูล (Verifying Table Integrity):**
  ทดสอบยิงเรียกดูรายการปกติทันทีหลังการโจมตี:
  ```bash
  curl.exe "http://localhost:3001/api/requests"
  ```
  **ผลลัพธ์ที่ได้:**
  ```json
  [
    {
      "id": "REQ-001",
      "requesterName": "สมชาย ใจดี",
      "requestType": "แจ้งซ่อม",
      "location": "อาคารเรียนรวม",
      "details": "คอมพิวเตอร์ไม่ทำงาน",
      "priority": "urgent",
      "status": "in-progress"
    },
    ...
  ]
  ```
- **ผลการวิเคราะห์:** ตาราง `requests` ยังอยู่ครบถ้วน ข้อมูลไม่สูญหาย คำสั่ง `DROP TABLE` ถูกมองเป็นเพียงข้อความค้นหา ไม่มีการประมวลผลคำสั่งอันตรายใด ๆ

---

### ③ การทดสอบเพิ่มเงื่อนไขซ้อน (Compound Query Attack)
*เป้าหมายของผู้โจมตี: ต้องการแทรกเงื่อนไข OR เพื่อดึงสถานะอื่นที่ไม่มีสิทธิ์เข้าถึง*

```bash
curl.exe "http://localhost:3001/api/requests?status=pending'%20OR%20status='completed"
```

- **Payload:** `status=pending' OR status='completed`
- **HTTP Status Code ที่ได้:** `200 OK`
- **Response Body:**
  ```json
  []
  ```
- **ผลการวิเคราะห์:** ระบบตอบกลับเป็น Array ว่าง `[]` เช่นกัน ป้องกันไม่ให้ผู้โจมตี Bypass ตรรกะการกรองข้อมูลได้

---

## 4. Automated Test Verification (Automated Suite)

นอกเหนือจากการทดสอบผ่าน Terminal ด้วย `curl` แล้ว ในชุดทดสอบอัตโนมัติ [api.test.js](file:///e:/engse203-student-labs-685432100194/labs/week-10/source/api/tests/api.test.js) ได้บรรจุ Test Case สำหรับ SQL Injection ไว้ด้วย:

```javascript
test('6. ยิง SQL injection ผ่าน ?status= แล้วไม่หลุด (คืน 200 พร้อม array ว่าง)', async () => {
  const evil = encodeURIComponent("x' OR '1'='1");
  const res = await request(app).get(`/api/requests?status=${evil}`);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.equal(res.body.length, 0);
});
```

**ผลการรันคำสั่ง `npm test`:**
```text
ok 6 - 6. ยิง SQL injection ผ่าน ?status= แล้วไม่หลุด (คืน 200 พร้อม array ว่าง)
  ---
  duration_ms: 5.6679
  type: 'test'
  ...
# tests 6
# suites 1
# pass 6
# fail 0
```

---

## 5. สรุปผลการตรวจสอบความปลอดภัย

| รายการตรวจสอบ | สถานะ | หมายเหตุ |
|---|---|---|
| ทุก Query ที่รับค่าจากผู้ใช้ใช้ Parameterized Query (`?`) | ✅ ผ่าน | ใน [requestService.js](file:///e:/engse203-student-labs-685432100194/labs/week-10/source/api/src/services/requestService.js) ไม่มีการนำค่ามาต่อสตริง SQL |
| ยิงทดสอบครบทั้ง 3 แบบได้ผลลัพธ์เป็น 0 รายการ | ✅ ผ่าน | คืนค่า `[]` (200 OK) ทุกกรณี |
| ตาราง `requests` ยังอยู่ครบถ้วนหลังการโจมตี DROP | ✅ ผ่าน | ข้อมูลไม่ได้รับความเสียหาย |
| Automated Test Suite ครอบคลุมการโจมตี | ✅ ผ่าน | รันผ่าน 100% ทุกครั้ง |
