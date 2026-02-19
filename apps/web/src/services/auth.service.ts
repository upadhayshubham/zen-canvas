import api from '@/lib/api';
import { AuthResponse } from '@/types';
import { getSessionId } from '@/lib/session';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>(
    '/auth/login',
    { email, password },
    { headers: { 'X-Session-Id': getSessionId() } }
  );
  return res.data;
}

export async function register(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', data);
  return res.data;
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await api.post('/auth/reset-password', { token, newPassword });
}
