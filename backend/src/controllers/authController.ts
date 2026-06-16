import asyncHandler from 'express-async-handler';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/response';
import env from '../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  res.cookie('token', token, COOKIE_OPTIONS);
  sendSuccess(res, 201, { user }, 'Registered successfully');
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  res.cookie('token', token, COOKIE_OPTIONS);
  sendSuccess(res, 200, { user });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
  sendSuccess(res, 200, null, 'Logged out');
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user!.userId);
  sendSuccess(res, 200, user);
});
