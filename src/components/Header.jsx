import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header glass-panel">
      <div className="container header-container">
        <div className="header-logo">
          <img src="https://cdn.cdmx.gob.mx/apps/amaresadoptar/Iconos/Small/icono-perritocorazon.svg" alt="Rescate Canino Logo" className="logo-icon" />
          <div className="logo-text">
            <h1>Rescate Canino</h1>
            <span>Gobierno de la Ciudad de México</span>
          </div>
        </div>
        <nav className="header-nav">
          <a href="#inicio" className="nav-link">Inicio</a>
          <a href="#albergues" className="nav-link">Albergues</a>
          <a href="#galeria" className="nav-link">Conoce a los Perritos</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
