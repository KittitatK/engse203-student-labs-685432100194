import { decodeTokenPayload, isTokenExpired } from '../utils/token.js';

const KEY = 'campus.auth.token';
const LEGACY_KEY = 'token';

let listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notify() {
  listeners.forEach((l) => {
    try {
      l();
    } catch {}
  });
}

export function getToken() {
  try {
    const token = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY);
    if (token && isTokenExpired(token)) {
      localStorage.removeItem(KEY);
      localStorage.removeItem(LEGACY_KEY);
      notify();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(KEY, token);
    localStorage.setItem(LEGACY_KEY, token);
    notify();
  } catch {}
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY_KEY);
    notify();
  } catch {}
}

export function getStoredUser() {
  const token = getToken();
  if (!token) return null;
  const payload = decodeTokenPayload(token);
  if (!payload) return null;
  return {
    id: payload.sub,
    name: payload.name,
    role: payload.role,
  };
}
