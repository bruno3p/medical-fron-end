import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, HeartPulse, ShieldAlert } from 'lucide-react';
import './DashboardLayout.css';
import type { Role } from '../mocks/data';

// Componente Wrapper para simular estado de autenticação
export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('patient');

  // Helper para verificar qual rota está ativa
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // Redireciona para o login
    navigate('/');
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <HeartPulse size={32} className="logo-icon" />
          <h2>MediCare</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/app" className={`nav-item ${isActive('/app') ? 'active' : ''}`}>
            <Home size={20} />
            <span>Início</span>
          </Link>
          <Link to="/app/profile" className={`nav-item ${isActive('/app/profile') ? 'active' : ''}`}>
            <User size={20} />
            <span>Meu Perfil</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          {/* FAKE TOGGLE PARA TESTE */}
          <div className="role-toggler">
            <span className="toggler-label">
              <ShieldAlert size={14}/> Teste Visual:
            </span>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as Role)}
              className="toggler-select"
            >
              <option value="patient">Ver como Paciente</option>
              <option value="doctor">Ver como Médico</option>
            </select>
          </div>
          
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Passamos o "role" via Outlet context para as páginas filhas saberem quem está "logado" */}
        <Outlet context={{ role }} />
      </main>
    </div>
  );
}
