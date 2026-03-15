import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../api/supabaseClient';
import { Trash2, Edit, Plus, X, Search, Upload } from 'lucide-react';
import './AdminForms.css';

const DogManager = () => {
  const [dogs, setDogs] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '', size: 'Mediano', sex: 'Macho', age: '', 
    description: '', shelter_id: '', existingPhotos: [], newFiles: []
  });

  const fetchData = async () => {
    setLoading(true);
    const [dogsRes, sheltersRes] = await Promise.all([
      supabase.from('dogs').select('*').order('created_at', { ascending: false }),
      supabase.from('shelters').select('id, name')
    ]);
    
    if (dogsRes.data) setDogs(dogsRes.data);
    if (sheltersRes.data) {
      setShelters(sheltersRes.data);
      if (sheltersRes.data.length > 0 && !formData.shelter_id) {
        setFormData(prev => ({...prev, shelter_id: sheltersRes.data[0].id}));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (dog = null) => {
    if (dog) {
      setEditingId(dog.id);
      setFormData({
        name: dog.name,
        size: dog.size,
        sex: dog.sex,
        age: dog.age,
        description: dog.description,
        shelter_id: dog.shelter_id,
        existingPhotos: dog.photos || [],
        newFiles: []
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', size: 'Mediano', sex: 'Macho', age: '', 
        description: '', shelter_id: shelters[0]?.id || '', existingPhotos: [], newFiles: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.existingPhotos.length + files.length > 3) {
      alert('Solo puedes subir un máximo de 3 fotos por perrito.');
      return;
    }
    setFormData({ ...formData, newFiles: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalPhotos = [...formData.existingPhotos];

    // Upload new files
    for (const file of formData.newFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const fillPath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('dogs_photos')
        .upload(fillPath, file);

      if (error) {
        console.error("Error uploading image:", error);
        alert('Hubo un error al subir alguna imagen.');
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('dogs_photos')
        .getPublicUrl(fillPath);

      finalPhotos.push(publicUrlData.publicUrl);
    }

    const payload = {
      name: formData.name,
      size: formData.size,
      sex: formData.sex,
      age: formData.age,
      description: formData.description,
      shelter_id: formData.shelter_id,
      photos: finalPhotos.slice(0, 3) // Hard limit to 3
    };

    if (editingId) {
      await supabase.from('dogs').update(payload).eq('id', editingId);
    } else {
      payload.id = `dog-new-${Date.now()}`;
      await supabase.from('dogs').insert(payload);
    }

    handleCloseModal();
    fetchData(); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar a este perrito?')) {
      await supabase.from('dogs').delete().eq('id', id);
      fetchData();
    }
  };

  const displayedDogs = dogs
    .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 50);

  return (
    <div className="admin-page fade-in">
      <div className="admin-page-header">
        <h2>Gestión de Perritos</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar por nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
              style={{ paddingLeft: '2.2rem', margin: 0 }}
            />
          </div>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Agregar Perrito
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Tamaño</th>
                <th>Sexo</th>
                <th>Edad</th>
                <th>Albergue</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayedDogs.map(dog => ( // Limit to 50 for admin view performance, filtered
                <tr key={dog.id}>
                  <td>
                    <img src={dog.photos[0] || 'https://via.placeholder.com/40'} alt={dog.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{dog.name}</td>
                  <td>{dog.size}</td>
                  <td>{dog.sex}</td>
                  <td>{dog.age}</td>
                  <td>{shelters.find(s => s.id === dog.shelter_id)?.name || 'N/A'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => handleOpenModal(dog)} className="icon-btn edit-btn" title="Editar">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(dog.id)} className="icon-btn delete-btn" title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Mostrando los 50 perritos más recientes.
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>{editingId ? 'Editar Perrito' : 'Agregar Nuevo Perrito'}</h3>
              <button onClick={handleCloseModal} className="modal-close"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="filter-input" />
                </div>
                <div className="form-group">
                  <label>Edad</label>
                  <input required type="text" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="filter-input" placeholder="Ej. 2 años" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tamaño</label>
                  <select value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} className="filter-select">
                    <option value="Pequeño">Pequeño</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sexo</label>
                  <select value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})} className="filter-select">
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Albergue asignado</label>
                <select value={formData.shelter_id} onChange={e => setFormData({...formData, shelter_id: e.target.value})} className="filter-select">
                  {shelters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Fotografías (Máximo 3)</label>
                {formData.existingPhotos.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {formData.existingPhotos.map((url, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={url} alt="Dog preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                        <button 
                          type="button" 
                          style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}
                          onClick={() => setFormData({...formData, existingPhotos: formData.existingPhotos.filter((_, idx) => idx !== i)})}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                  <button type="button" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={16} /> Seleccionar Archivos
                  </button>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} 
                  />
                </div>
                {formData.newFiles.length > 0 && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--primary)' }}>
                    {formData.newFiles.length} archivo(s) nuevo(s) seleccionado(s).
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="filter-input" style={{ resize: 'vertical' }}></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn-secondary" style={{ background: '#e2e8f0', color: '#475569' }} disabled={loading}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Registrar Perrito'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DogManager;
