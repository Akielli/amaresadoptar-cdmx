import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark">
      <div className="container footer-container">
        <div className="footer-info">
          <h3>Gobierno de la Ciudad de México</h3>
          <p>Portal de Transparencia de Albergues Caninos</p>
          <p className="copyright">&copy; {new Date().getFullYear()} Amar es Adoptar. Todos los derechos reservados.</p>
        </div>
        <div className="footer-links">
          <h4>Atención Ciudadana</h4>
          <a href="tel:56581111">Locatel: 5658 1111</a>
          <a href="https://cdmx.gob.mx" target="_blank" rel="noopener noreferrer">cdmx.gob.mx</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
