import 'dotenv/config';

/**
 * รวมค่าตั้งค่าทั้งหมดไว้ที่เดียว — ที่อื่นห้ามอ่าน process.env ตรง ๆ
 * ทำให้รู้ได้ทันทีว่าแอปนี้ต้องการค่าอะไรบ้าง
 */
export const config = {
  dbFile: process.env.DB_FILE ?? './data/campus.db', //เพิ่มค่าตั้งค่า DB_FILE สำหรับ path ของไฟล์ฐานข้อมูล SQLite *NEW*
  schemaFile: process.env.SCHEMA_FILE ?? './data/schema.sql', //เพิ่มค่าตั้งค่า SCHEMA_FILE สำหรับ path ของไฟล์ schema.sql *NEW*
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  get isProduction() {
    return this.nodeEnv === 'production';
  },
};
