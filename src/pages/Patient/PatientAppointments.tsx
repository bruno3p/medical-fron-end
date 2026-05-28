import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DoctorService } from '../../services/DoctorService';
import { AppointmentService } from '../../services/AppointmentService';
import type { Appointment, Doctor } from '../../mocks/data';
import { Calendar, Clock, MapPin, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import './PatientAppointments.css';

export default function PatientAppointments() {
  const loggedPatientId = Number(localStorage.getItem('loggedUserId')) || 101;
  
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<(Appointment & { doctor?: Doctor })[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docs = await DoctorService.getAll();
        
        const allApts: (Appointment & { doctor?: Doctor })[] = [];
        
        await Promise.all(docs.map(async (doc) => {
          try {
            const docApts = await AppointmentService.getByDoctor(doc.id);
            const myApts = docApts.filter(a => a.patient_id === loggedPatientId);
            myApts.forEach(a => allApts.push({ ...a, doctor: doc }));
          } catch (e) {}
        }));

        allApts.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
        setAppointments(allApts);
      } catch (err) {
        console.error("Erro ao carregar agendamentos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [loggedPatientId]);

  const handleCancel = async (aptId: number) => {
    if (window.confirm('Tem certeza que deseja cancelar esta consulta?')) {
      try {
        await AppointmentService.cancel(aptId);
        setAppointments(prev => prev.filter(a => a.id !== aptId));
        alert('Consulta cancelada com sucesso!');
      } catch (err: any) {
        if (err.response?.status === 400) {
          alert('Cancelamento só é permitido com no mínimo 4 horas de antecedência.');
        } else {
          alert('Erro ao tentar cancelar a consulta.');
        }
      }
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '50vh' }}><Loader2 className="icon-spin icon-primary" size={40} /></div>;
  }

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Meus Agendamentos</h1>
        <p>Acompanhe suas próximas consultas marcadas.</p>
        <div className="alert-info mt-3">
          <AlertCircle size={16} />
          <span>Lembrete: O cancelamento só é permitido com até <strong>4 horas</strong> de antecedência.</span>
        </div>
      </header>

      <section className="dashboard-section">
        {appointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} className="text-muted mb-3" />
            <h3>Nenhuma consulta agendada</h3>
            <p className="text-muted">Você ainda não possui consultas marcadas.</p>
            <Link to="/app" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
              Encontrar um Médico
            </Link>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map(apt => {
              const doc = apt.doctor;
              if (!doc) return null;
              
              const dateObj = new Date(apt.date + 'T12:00:00');
              const dayStr = dateObj.toLocaleDateString('pt-BR');
              
              return (
                <div key={apt.id} className="appointment-card">
                  <div className="apt-date-box">
                    <span className="apt-day">{dateObj.getDate()}</span>
                    <span className="apt-month">{dateObj.toLocaleDateString('pt-BR', { month: 'short' })}</span>
                  </div>
                  
                  <div className="apt-details">
                    <div className="apt-doc-info">
                      <img src={doc.avatar} alt={doc.name} className="avatar-sm" />
                      <div>
                        <h4>{doc.name}</h4>
                        <span className="badge">{doc.specialty}</span>
                      </div>
                    </div>
                    
                    <div className="apt-meta-info">
                      <div className="meta-item">
                        <Calendar size={16} /> {dayStr}
                      </div>
                      <div className="meta-item">
                        <Clock size={16} /> {apt.time}
                      </div>
                      <div className="meta-item text-muted">
                        <MapPin size={16} /> Clínica MediCare
                      </div>
                    </div>
                  </div>
                  
                  <div className="apt-actions">
                    <button 
                      className="btn-cancel" 
                      onClick={() => handleCancel(apt.id)}
                      title="Cancelar Consulta"
                    >
                      <XCircle size={20} />
                      <span className="cancel-text">Cancelar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
