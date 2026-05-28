import { api } from './api';
import type { Doctor } from '../mocks/data';

export const DoctorService = {
  getAll: async () => {
    const response = await api.get<Doctor[]>('/doctors');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },
  create: async (data: Omit<Doctor, 'id'>) => {
    const response = await api.post<Doctor>('/doctors', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Doctor>) => {
    const response = await api.put<Doctor>(`/doctors/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/doctors/${id}`);
  }
};
