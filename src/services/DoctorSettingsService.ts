import { api } from './api';
import type { DoctorSettings } from '../mocks/data';

interface BackendSettings extends Omit<DoctorSettings, 'workDays'> {
  workDays: string; // comma separated "1,2,3"
}

const parseSettings = (backendSettings: BackendSettings): DoctorSettings => ({
  ...backendSettings,
  workDays: backendSettings.workDays 
    ? backendSettings.workDays.split(',').filter(Boolean).map(Number) 
    : []
});

const formatSettings = (frontendSettings: Partial<DoctorSettings>): Partial<BackendSettings> => {
  const result: any = { ...frontendSettings };
  if (frontendSettings.workDays) {
    result.workDays = frontendSettings.workDays.join(',');
  }
  return result;
};

export const DoctorSettingsService = {
  getByDoctor: async (doctorId: number) => {
    const response = await api.get<BackendSettings>(`/doctor-settings/${doctorId}`);
    return parseSettings(response.data);
  },
  save: async (data: DoctorSettings) => {
    const response = await api.post<BackendSettings>('/doctor-settings', formatSettings(data));
    return parseSettings(response.data);
  }
};
