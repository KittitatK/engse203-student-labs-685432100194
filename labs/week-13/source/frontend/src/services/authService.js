import { apiFetch } from './apiClient.js';
import { setToken, clearToken } from './authStore.js';

export async function login(email, password) {
  const result = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (result?.token) {
    setToken(result.token);
  }
  return result;
}

export async function register(email, password, name) {
  const result = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  if (result?.token) {
    setToken(result.token);
  }
  return result;
}

export function logout() {
  clearToken();
}
