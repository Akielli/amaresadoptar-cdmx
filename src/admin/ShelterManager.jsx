import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { Edit, X } from 'lucide-react';
import './AdminForms.css';

const ShelterManager = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', location: '', hours: '', description: '', image: ''
  });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('shelters').select('*').order('name');
    if (data) setShelters(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (shelter) => {
    setEditingId(shelter.id);
    setFormData({
      name: shelter.name,
      location: shelter.location,
      hours: shelter.hours,
      description: shelter.description,
      image: shelter.image
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('shelters').update(formData).eq('id', editingId);
    handleCloseModal();
    fetchData();
  };

  return (
    <div className="admin-page fade-in">
      <div className="admin-page-header">
        <h2>Gestión de Albergues</h2>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando albergues...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nombre y Ubicación</th>
                <th>Horarios</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {shelters.map(shelter => (
                <tr key={shelter.id}>
                  <td>
                    <img src={shelter.image} alt={shelter.name} style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{shelter.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{shelter.location}</div>
                  </td>
                  <td>{shelter.hours}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleOpenModal(shelter)} className="icon-btn edit-btn" title="Editar Información">
                      <Edit size={16} /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Editar Información del Albergue</h3>
              <button onClick={handleCloseModal} className="modal-close"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Nombre del Albergue</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="filter-input" />
              </div>
              
              <div className="form-group">
                <label>Ubicación / Dirección</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="filter-input" />
              </div>

              <div className="form-group">
                <label>Horarios de Atención</label>
                <input required type="text" value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} className="filter-input" />
              </div>

              <div className="form-group">
                <label>URL de la Fotografía Principal</label>
                <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="filter-input" />
              </div>

              <div className="form-group">
                <label>Descripción para la Ciudadanía</label>
                <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="filter-input" style={{ resize: 'vertical' }}></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn-secondary" style={{ background: '#e2e8f0', color: '#475569' }}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterManager;
