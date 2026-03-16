import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Dog, Building2 } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="https://cdn.cdmx.gob.mx/apps/amaresadoptar/Iconos/Small/icono-perritocorazon.svg" alt="Logo" className="admin-logo" />
          <div className="admin-brand-text">
            <h2>Panel Admin</h2>
            <span>Rescate Canino</span>
          </div>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? "admin-link active" : "admin-link"}>
            <Home size={20} />
            Inicio
          </NavLink>
          <NavLink to="/admin/perros" className={({isActive}) => isActive ? "admin-link active" : "admin-link"}>
            <Dog size={20} />
            Gestión de Perritos
          </NavLink>
          <NavLink to="/admin/albergues" className={({isActive}) => isActive ? "admin-link active" : "admin-link"}>
            <Building2 size={20} />
            Gestión de Albergues
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={20} />
            Cerrar Sesión
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-public-link">
            Ver Portal Público
          </a>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-page-title">Sistema de Gestión</h1>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
