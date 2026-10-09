import { useSyncExternalStore } from 'react';
import { subscribe, getToken, setToken, clearToken } from '../services/authStore.js';
import { decodeTokenPayload, isTokenExpired } from '../utils/token.js';

export function useAuth() {
  const token = useSyncExternalStore(subscribe, getToken, () => null);
  const payload = token ? decodeTokenPayload(token) : null;
  const user = payload && !isTokenExpired(token)
    ? {
        id: payload.sub,
        name: payload.name,
        role: payload.role,
      }
    : null;

  return {
    token,
    user,
    isStaff: user?.role === 'staff',
    login: (tokenValue) => setToken(tokenValue),
    logout: () => clearToken(),
  };
}

export default useAuth;
