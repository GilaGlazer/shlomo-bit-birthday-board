import api from './axios';
import { ApiResponse, PaginatedApiResponse, Person } from '../types';

export const getPeople = (page: number, limit = 10, search = '') => {
  const params: Record<string, string | number> = { page, limit };
  if (search) params.search = search;
  return api.get<PaginatedApiResponse<Person>>('/people', { params }).then((r) => r.data);
};

export const getTodayBirthdays = () =>
  api.get<ApiResponse<Person[]>>('/people/today').then((r) => r.data.data);

export const createPerson = (data: { name: string; birthDate: string }) =>
  api.post<ApiResponse<Person>>('/people', data).then((r) => r.data.data);

export const updatePerson = (id: string, data: { name?: string; birthDate?: string }) =>
  api.patch<ApiResponse<Person>>(`/people/${id}`, data).then((r) => r.data.data);

export const deletePerson = (id: string) =>
  api.delete<ApiResponse<null>>(`/people/${id}`);
