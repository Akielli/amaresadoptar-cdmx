import React, { useState } from 'react';
import './DogCard.css';

const DogCard = ({ dog }) => {
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const nextPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev + 1) % dog.photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev === 0 ? dog.photos.length - 1 : prev - 1));
  };

  return (
    <div className="dog-card fade-in">
      <div className="dog-slider">
        <img src={dog.photos[currentPhoto]} alt={`${dog.name} - Foto ${currentPhoto + 1}`} className="dog-img" />
        
        {dog.photos.length > 1 && (
          <>
            <button className="slider-btn slider-btn-left" onClick={prevPhoto} aria-label="Foto anterior">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="slider-btn slider-btn-right" onClick={nextPhoto} aria-label="Siguiente foto">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <div className="slider-dots">
              {dog.photos.map((_, idx) => (
                <span key={idx} className={`dot ${idx === currentPhoto ? 'active' : ''}`}></span>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="dog-details">
        <div className="dog-header">
          <h3 className="dog-name">{dog.name}</h3>
          <span className={`badge ${dog.sex === 'Macho' ? 'badge-blue' : 'badge-secondary'}`}>
            {dog.sex}
          </span>
        </div>
        
        <p className="dog-desc">{dog.description}</p>
        
        <div className="dog-attributes">
          <div className="attr-item">
            <span className="attr-label">Folio</span>
            <span className="attr-value">{dog.folio || '-'}</span>
          </div>
          <div className="attr-item">
            <span className="attr-label">Tamaño</span>
            <span className="attr-value">{dog.size}</span>
          </div>
          <div className="attr-item">
            <span className="attr-label">Edad</span>
            <span className="attr-value">{dog.age}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogCard;
