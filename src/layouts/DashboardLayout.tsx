import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, HeartPulse, Calendar, Settings, Menu, X, FileText } from 'lucide-react';
import './DashboardLayout.css';
import type { Role } from '../mocks/data';

// Componente Wrapper
export default function DashboardLayout() {
  const [role, setRole] = useState<Role>('patient');

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as Role;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('loggedUserId');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="layout-container">
      {/* Header Mobile */}
      <div className="mobile-header">
        <div className="logo-section">
          <HeartPulse size={24} className="logo-icon" />
          <h2>MediCare</h2>
        </div>
        <button className="btn-mobile-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay para fechar o menu no mobile clicando fora */}
      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={closeMobileMenu}></div>}

      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header desktop-only">
          <HeartPulse size={28} className="logo-icon" />
          <h2>MediCare</h2>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/app" className={`nav-item ${isActive('/app') ? 'active' : ''}`} onClick={closeMobileMenu}>
            <Home size={20} />
            <span>Início</span>
          </Link>
          {role === 'patient' && (
            <>
              <Link to="/app/appointments" className={`nav-item ${isActive('/app/appointments') ? 'active' : ''}`} onClick={closeMobileMenu}>
                <Calendar size={20} />
                <span>Meus Agendamentos</span>
              </Link>
              <Link to="/app/my-reports" className={`nav-item ${isActive('/app/my-reports') ? 'active' : ''}`} onClick={closeMobileMenu}>
                <FileText size={20} />
                <span>Meus Laudos</span>
              </Link>
            </>
          )}
          {role === 'doctor' && (
            <Link to="/app/agenda-setup" className={`nav-item ${isActive('/app/agenda-setup') ? 'active' : ''}`} onClick={closeMobileMenu}>
              <Settings size={20} />
              <span>Minha Agenda</span>
            </Link>
          )}
          <Link to="/app/profile" className={`nav-item ${isActive('/app/profile') ? 'active' : ''}`} onClick={closeMobileMenu}>
            <User size={20} />
            <span>Meu Perfil</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {/* Passa o role atual via contexto para as rotas filhas usarem */}
        <Outlet context={{ role }} />
      </main>
    </div>
  );
}
