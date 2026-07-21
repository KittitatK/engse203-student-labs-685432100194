# Week 02 Evidence

ควรมี screenshots ของ initial/loading/success/error/filter/mobile และผล `npm run check` / `npm run build`


## Source

```bash
npm run import:source -- week-02 /path/to/old-lab02
labs/week-02/evidence/image/Screenshot 2026-07-21 112639.png

npm --prefix labs/week-02/source install
labs/week-02/evidence/image/Screenshot 2026-07-21 112745.png

npm --prefix labs/week-02/source run check
labs/week-02/evidence/image/Screenshot 2026-07-21 113137.png

npm --prefix labs/week-02/source run build
labs/week-02/evidence/image/Screenshot 2026-07-21 113249.png

```

แก้ Vite `base` ให้ตรงกับ subpath ก่อน build:
![alt text](<image/Screenshot 2026-07-21 113347.png>)

```text
/engse203-student-labs-<student-id>/labs/week-02/
```

นำ build output เข้า publish:

labs/week-02/evidence/image/Screenshot 2026-07-21 113742.png

```bash
npm run import:publish -- week-02 labs/week-02/source/docs
```

หากโครงงานเดิม build ไป `dist/` ให้เปลี่ยน path ท้ายคำสั่งเป็น `labs/week-02/source/dist`
