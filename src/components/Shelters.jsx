import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import './Shelters.css';

const Shelters = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelters = async () => {
      const { data, error } = await supabase
        .from('shelters')
        .select('*');
      
      if (error) {
        console.error("Error fetching shelters:", error);
      } else {
        setShelters(data);
      }
      setLoading(false);
    };

    fetchShelters();
  }, []);

  return (
    <section id="albergues" className="shelters-section">
      <div className="container">
        <div className="section-header text-center fade-in">
          <span className="badge badge-green mb-2">Instalaciones</span>
          <h2 className="section-title">Nuestros Albergues</h2>
          <p className="section-subtitle">
            Conoce los centros donde resguardamos y rehabilitamos a los perritos de la ciudad.
          </p>
        </div>
        
        {loading ? (
          <div className="text-center">Cargando albergues...</div>
        ) : (
          <div className="shelters-grid">
            {shelters.map((shelter, index) => (
              <div 
                key={shelter.id} 
                className="shelter-card fade-in" 
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="shelter-img-wrapper">
                  <img src={shelter.image} alt={shelter.name} className="shelter-img" />
                </div>
                <div className="shelter-content">
                  <h3 className="shelter-name">{shelter.name}</h3>
                  <p className="shelter-desc">{shelter.description}</p>
                  <div className="shelter-info">
                    <div className="info-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{shelter.location}</span>
                    </div>
                    <div className="info-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cdmx-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{shelter.hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Shelters;
