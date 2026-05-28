import { useState, useEffect } from 'react';
import { DoctorService } from '../../services/DoctorService';
import { DoctorSettingsService } from '../../services/DoctorSettingsService';
import type { DoctorSettings, Doctor } from '../../mocks/data';
import { Save, Clock, CalendarDays, Coffee, Loader2 } from 'lucide-react';
import './DoctorAgendaSetup.css';

export default function DoctorAgendaSetup() {
  const loggedDoctorId = Number(localStorage.getItem('loggedUserId')) || 1;
  
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [settings, setSettings] = useState<DoctorSettings>({
    doctorId: loggedDoctorId,
    workDays: [1, 2, 3, 4, 5],
    startTime: '08:00',
    endTime: '18:00',
    hasLunchBreak: true,
    lunchStart: '12:00',
    lunchEnd: '14:00'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [doc, set] = await Promise.all([
          DoctorService.getById(loggedDoctorId),
          DoctorSettingsService.getByDoctor(loggedDoctorId).catch(() => null)
        ]);
        if (doc) setDoctor(doc);
        if (set) setSettings(set);
      } catch (err) {
        console.error("Erro ao carregar configurações", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [loggedDoctorId]);

  const daysOfWeek = [
    { id: 0, name: 'Domingo' },
    { id: 1, name: 'Segunda-feira' },
    { id: 2, name: 'Terça-feira' },
    { id: 3, name: 'Quarta-feira' },
    { id: 4, name: 'Quinta-feira' },
    { id: 5, name: 'Sexta-feira' },
    { id: 6, name: 'Sábado' }
  ];

  const toggleDay = (dayId: number) => {
    setSettings(prev => {
      const newDays = prev.workDays.includes(dayId)
        ? prev.workDays.filter(d => d !== dayId)
        : [...prev.workDays, dayId].sort();
      return { ...prev, workDays: newDays };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await DoctorSettingsService.save(settings);
      alert('Configurações de agenda salvas com sucesso!');
    } catch (err) {
      alert('Erro ao salvar configurações no servidor.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '50vh' }}><Loader2 className="icon-spin icon-primary" size={40} /></div>;
  }

  if (!doctor) return <div>Médico não encontrado.</div>;

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Configuração da Agenda</h1>
        <p>Defina seus horários de atendimento e dias de trabalho.</p>
      </header>

      <form onSubmit={handleSave} className="agenda-setup-form">
        {/* Dias de Trabalho */}
        <section className="setup-card">
          <div className="setup-header">
            <CalendarDays className="icon-primary" />
            <h2>Dias de Atendimento</h2>
          </div>
          <p className="text-muted mb-4">Selecione os dias da semana em que você realiza consultas.</p>
          
          <div className="days-grid">
            {daysOfWeek.map(day => (
              <button
                type="button"
                key={day.id}
                className={`day-btn ${settings.workDays.includes(day.id) ? 'active' : ''}`}
                onClick={() => toggleDay(day.id)}
              >
                {day.name}
              </button>
            ))}
          </div>
        </section>

        {/* Horário de Expediente */}
        <section className="setup-card">
          <div className="setup-header">
            <Clock className="icon-primary" />
            <h2>Horário de Expediente</h2>
          </div>
          <p className="text-muted mb-4">Defina o início e o fim do seu dia de trabalho.</p>
          
          <div className="time-inputs-row">
            <div className="input-group">
              <label>Horário de Início</label>
              <input 
                type="time" 
                value={settings.startTime} 
                onChange={(e) => setSettings({...settings, startTime: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label>Horário de Término</label>
              <input 
                type="time" 
                value={settings.endTime} 
                onChange={(e) => setSettings({...settings, endTime: e.target.value})}
                required
              />
            </div>
          </div>
        </section>

        {/* Pausa para Almoço */}
        <section className="setup-card">
          <div className="setup-header">
            <Coffee className="icon-primary" />
            <h2>Pausa para Almoço</h2>
          </div>
          
          <div className="toggle-row mb-4">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.hasLunchBreak}
                onChange={(e) => setSettings({...settings, hasLunchBreak: e.target.checked})}
              />
              <span className="slider round"></span>
            </label>
            <span>Tenho pausa para almoço</span>
          </div>

          {settings.hasLunchBreak && (
            <div className="time-inputs-row">
              <div className="input-group">
                <label>Início do Almoço</label>
                <input 
                  type="time" 
                  value={settings.lunchStart} 
                  onChange={(e) => setSettings({...settings, lunchStart: e.target.value})}
                  required={settings.hasLunchBreak}
                />
              </div>
              <div className="input-group">
                <label>Retorno do Almoço</label>
                <input 
                  type="time" 
                  value={settings.lunchEnd} 
                  onChange={(e) => setSettings({...settings, lunchEnd: e.target.value})}
                  required={settings.hasLunchBreak}
                />
              </div>
            </div>
          )}
        </section>

        <div className="form-actions">
          <button type="submit" className="btn-primary btn-lg">
            <Save size={20} />
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
}
