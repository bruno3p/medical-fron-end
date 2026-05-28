import { api } from './api';
import type { Patient } from '../mocks/data';

export const PatientService = {
  getAll: async () => {
    const response = await api.get<Patient[]>('/patients');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },
  create: async (data: Omit<Patient, 'id'>) => {
    const response = await api.post<Patient>('/patients', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Patient>) => {
    const response = await api.put<Patient>(`/patients/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/patients/${id}`);
  }
};
