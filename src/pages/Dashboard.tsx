
import { useOutletContext, Link } from 'react-router-dom';
import { mockDoctors, mockPatients } from '../mocks/data';
import type { Role } from '../mocks/data';
import { Users, Stethoscope, ChevronRight } from 'lucide-react';
import './Dashboard.css';

interface DashboardContext {
  role: Role;
}

export default function Dashboard() {
  const { role } = useOutletContext<DashboardContext>();

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>{role === 'patient' ? 'Olá, Paciente!' : 'Olá, Doutor(a)!'}</h1>
        <p>Bem-vindo ao seu painel de controle.</p>
      </header>

      {role === 'patient' ? (
        <section className="dashboard-section">
          <div className="section-title">
            <Stethoscope className="icon" />
            <h2>Meus Médicos</h2>
          </div>
          
          <div className="card-grid">
            {mockDoctors.map(doctor => (
              <div key={doctor.id} className="user-card">
                <img src={doctor.avatar} alt={doctor.name} className="avatar" />
                <div className="card-info">
                  <h3>{doctor.name}</h3>
                  <span className="badge">{doctor.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="dashboard-section">
          <div className="section-title">
            <Users className="icon" />
            <h2>Meus Pacientes</h2>
          </div>

          <div className="patient-list">
            {mockPatients.map(patient => (
              <Link to={`/app/patient/${patient.id}`} key={patient.id} className="patient-list-item">
                <div className="patient-info">
                  <img src={patient.avatar} alt={patient.name} className="avatar-sm" />
                  <div>
                    <h4>{patient.name}</h4>
                    <p className="text-muted">{patient.email}</p>
                  </div>
                </div>
                <ChevronRight className="text-muted" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
