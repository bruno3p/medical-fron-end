import { api } from './api';
import type { Appointment } from '../mocks/data';

export const AppointmentService = {
  getByDoctor: async (doctorId: number) => {
    const response = await api.get<Appointment[]>(`/appointments/doctor/${doctorId}`);
    return response.data;
  },
  create: async (data: Omit<Appointment, 'id'>) => {
    const response = await api.post<Appointment>('/appointments', data);
    return response.data;
  },
  cancel: async (id: number) => {
    const response = await api.post<Appointment>(`/appointments/${id}/cancel`);
    return response.data;
  }
};
