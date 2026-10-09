/**
 * utils/token.js — ถอด payload ของ JWT สำหรับนำมาแสดงผลบนหน้าเว็บ
 * ⚠ ถอดเพื่อแสดงผลเท่านั้น ไม่ใช่การตรวจความปลอดภัย (การตรวจจริงอยู่ที่ server เสมอ)
 */

export function decodeTokenPayload(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(token, now = Date.now()) {
  const payload = decodeTokenPayload(token);
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 <= now;
}

export function getCurrentUser(token) {
  const payload = decodeTokenPayload(token);
  if (!payload) return null;
  return {
    id: payload.sub,
    name: payload.name,
    role: payload.role,
  };
}
