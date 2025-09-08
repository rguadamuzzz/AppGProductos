
import api from './api';

export async function loginUser(data: { email: string; password: string }) {
  const response = await api.post('/auth/login', data);
  return response.data.token;
}

export async function registerUser(data: { username: string; email: string; password: string }) {
  const response = await api.post('/auth/register', data);
  return response.data;
}
