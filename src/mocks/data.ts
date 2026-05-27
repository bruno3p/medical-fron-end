export type Role = 'patient' | 'doctor';

export interface Patient {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  specialty: string;
  avatar?: string;
}

export interface MedicalReport {
  id: number;
  name: string;
  details: string;
  patient_id: number;
  doctor_id: number;
  date: string;
}

export const mockDoctors: Doctor[] = [
  { id: 1, name: 'Dr. Roberto Almeida', email: 'roberto@clinic.com', specialty: 'Cardiologia', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 2, name: 'Dra. Fernanda Costa', email: 'fernanda@clinic.com', specialty: 'Dermatologia', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 3, name: 'Dr. Carlos Mendes', email: 'carlos@clinic.com', specialty: 'Ortopedia', avatar: 'https://i.pravatar.cc/150?img=14' }
];

export const mockPatients: Patient[] = [
  { id: 101, name: 'João Silva', email: 'joao@email.com', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 102, name: 'Maria Oliveira', email: 'maria@email.com', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 103, name: 'Lucas Santos', email: 'lucas@email.com', avatar: 'https://i.pravatar.cc/150?img=60' }
];

export const mockReports: MedicalReport[] = [
  { id: 1001, name: 'Eletrocardiograma', details: 'Ritmo sinusal normal. Sem alterações isquêmicas agudas.', patient_id: 101, doctor_id: 1, date: '2023-10-15' },
  { id: 1002, name: 'Exame Dermatológico', details: 'Presença de nevo atípico no dorso. Recomendada biópsia.', patient_id: 102, doctor_id: 2, date: '2023-11-02' },
  { id: 1003, name: 'Raio-X de Joelho', details: 'Sinais leves de artrose. Sem fraturas evidentes.', patient_id: 101, doctor_id: 3, date: '2024-01-20' },
  { id: 1004, name: 'Avaliação Cardiológica de Rotina', details: 'Pressão arterial 120/80. Ausculta cardíaca normal.', patient_id: 103, doctor_id: 1, date: '2024-02-10' }
];
