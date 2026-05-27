
import { useParams, Link } from 'react-router-dom';
import { mockPatients, mockReports, mockDoctors } from '../mocks/data';
import { ArrowLeft, FileText, PlusCircle, Activity } from 'lucide-react';
import './PatientDetails.css';

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const patientId = Number(id);
  
  const patient = mockPatients.find(p => p.id === patientId);
  const patientReports = mockReports.filter(r => r.patient_id === patientId);
  
  // Encontrar outros médicos que atenderam esse paciente
  const doctorIds = Array.from(new Set(patientReports.map(r => r.doctor_id)));
  const attendingDoctors = mockDoctors.filter(d => doctorIds.includes(d.id));

  if (!patient) {
    return <div>Paciente não encontrado.</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="page-header flex-between">
        <div>
          <Link to="/app" className="back-link">
            <ArrowLeft size={16} /> Voltar para lista
          </Link>
          <h1>Prontuário: {patient.name}</h1>
          <p>Visão geral e histórico de laudos.</p>
        </div>
        
        <button className="btn-primary flex-center">
          <PlusCircle size={18} /> Novo Laudo
        </button>
      </header>

      <div className="details-grid">
        {/* Lado Esquerdo: Info e Médicos */}
        <div className="details-sidebar">
          <div className="dashboard-section mb-4">
            <div className="flex-center-gap mb-3">
              <img src={patient.avatar} alt={patient.name} className="avatar" style={{ marginBottom: 0 }} />
              <div>
                <h3 style={{ margin: 0 }}>{patient.name}</h3>
                <span className="text-muted">{patient.email}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
              <Activity className="icon" size={18} />
              <h4>Equipe Médica Vinculada</h4>
            </div>
            <div className="patient-list">
              {attendingDoctors.map(doc => (
                <div key={doc.id} className="patient-list-item" style={{ padding: '0.75rem' }}>
                  <div className="patient-info">
                    <img src={doc.avatar} alt={doc.name} className="avatar-sm" style={{ width: '36px', height: '36px' }} />
                    <div>
                      <h4 style={{ fontSize: '0.9rem' }}>{doc.name}</h4>
                      <p className="text-muted" style={{ fontSize: '0.8rem' }}>{doc.specialty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Direito: Timeline de Laudos */}
        <div className="details-main dashboard-section">
          <div className="section-title">
            <FileText className="icon" />
            <h2>Histórico de Laudos</h2>
          </div>

          <div className="timeline">
            {patientReports.length === 0 ? (
              <p className="text-muted">Nenhum laudo encontrado para este paciente.</p>
            ) : (
              patientReports.map(report => {
                const doc = mockDoctors.find(d => d.id === report.doctor_id);
                return (
                  <div key={report.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h4>{report.name}</h4>
                        <span className="timeline-date">{new Date(report.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="timeline-details">{report.details}</p>
                      <div className="timeline-footer">
                        <img src={doc?.avatar} alt={doc?.name} className="avatar-xs" />
                        <span className="text-muted">Emitido por {doc?.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
