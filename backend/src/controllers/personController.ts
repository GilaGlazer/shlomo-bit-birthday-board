import asyncHandler from 'express-async-handler';
import * as personService from '../services/personService';
import { sendSuccess, sendPaginated } from '../utils/response';

export const create = asyncHandler(async (req, res) => {
  const person = await personService.create(req.user!.userId, req.body);
  sendSuccess(res, 201, person, 'Person added');
});

export const list = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query as unknown as { page: number; limit: number; search: string };
  const result = await personService.list(req.user!.userId, page, limit, search);
  sendPaginated(res, 200, result.data, result.pagination);
});

export const todayBirthdays = asyncHandler(async (req, res) => {
  const people = await personService.todayBirthdays(req.user!.userId);
  sendSuccess(res, 200, people);
});

export const update = asyncHandler(async (req, res) => {
  const person = await personService.update(req.user!.userId, req.params.id, req.body);
  sendSuccess(res, 200, person);
});

export const remove = asyncHandler(async (req, res) => {
  await personService.remove(req.user!.userId, req.params.id);
  sendSuccess(res, 200, null, 'Person deleted');
});
