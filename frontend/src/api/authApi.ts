import api from './axios';
import { ApiResponse, User } from '../types';

interface AuthPayload {
  email: string;
  password: string;
}

interface AuthResult {
  user: User;
}

export const login = (data: AuthPayload) =>
  api.post<ApiResponse<AuthResult>>('/auth/login', data).then((r) => r.data.data);

export const register = (data: AuthPayload) =>
  api.post<ApiResponse<AuthResult>>('/auth/register', data).then((r) => r.data.data);

export const logout = () =>
  api.post<ApiResponse<null>>('/auth/logout').then((r) => r.data);

export const getMe = () =>
  api.get<ApiResponse<User>>('/auth/me').then((r) => r.data.data);
