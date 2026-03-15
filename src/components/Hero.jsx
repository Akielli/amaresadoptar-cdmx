import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="inicio" className="hero">
      <div className="hero-bg">
        <div className="hero-overlay"></div>
      </div>
      <div className="container hero-content fade-in">
        <span className="badge badge-gold mb-4">Portal de Transparencia</span>
        <h1 className="hero-title">Conoce a los Perritos de Nuestros Albergues</h1>
        <p className="hero-description">
          Este portal tiene como objetivo brindar transparencia a la ciudadanía sobre los perros 
          resguardados en los albergues del Gobierno de la Ciudad de México. 
          Aquí podrás conocer cuántos son y en qué condiciones se encuentran.
        </p>
        <div className="hero-notice">
          <strong>Nota importante:</strong> Este sitio es exclusivamente informativo y de transparencia, no es un portal de adopción directa.
        </div>
        <div className="hero-actions">
          <a href="#galeria" className="btn-primary">
            Ver Galería
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#albergues" className="btn-secondary">Conoce los Albergues</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
