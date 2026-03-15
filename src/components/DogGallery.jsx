import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../api/supabaseClient';
import DogCard from './DogCard';
import Filters from './Filters';
import './DogGallery.css';

const ITEMS_PER_PAGE = 12;

const DogGallery = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    size: '',
    sex: '',
    shelterId: '',
    search: '',
    page: 1
  });

  useEffect(() => {
    const fetchDogs = async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching dogs:", error);
      } else {
        setDogs(data);
      }
      setLoading(false);
    };

    fetchDogs();
  }, []);

  const filteredDogs = useMemo(() => {
    return dogs.filter(dog => {
      const matchSize = !filters.size || dog.size === filters.size;
      const matchSex = !filters.sex || dog.sex === filters.sex;
      const matchShelter = !filters.shelterId || dog.shelter_id === filters.shelterId;
      const matchSearch = !filters.search || dog.name.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchSize && matchSex && matchShelter && matchSearch;
    });
  }, [dogs, filters.size, filters.sex, filters.shelterId, filters.search]);

  const totalPages = Math.ceil(filteredDogs.length / ITEMS_PER_PAGE);
  const currentDogs = filteredDogs.slice(
    (filters.page - 1) * ITEMS_PER_PAGE,
    filters.page * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: document.getElementById('galeria').offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <section id="galeria" className="gallery-section">
      <div className="container">
        <div className="section-header text-center fade-in">
          <span className="badge badge-blue mb-2">Transparencia</span>
          <h2 className="section-title">Nuestra Población Canina</h2>
          <p className="section-subtitle">
            Actualmente resguardamos a <strong>{dogs.length} perritos</strong> en nuestros centros. Usa los filtros para conocer a cada uno de ellos y sus condiciones.
          </p>
        </div>

        <Filters filters={filters} setFilters={setFilters} maxPages={totalPages} />

        {loading ? (
          <div className="text-center">Cargando datos desde la base de datos segura...</div>
        ) : (
          <>
            <div className="gallery-results-count fade-in">
              Mostrando {currentDogs.length} de {filteredDogs.length} resultados
            </div>

            {currentDogs.length > 0 ? (
              <div className="dog-grid">
                {currentDogs.map((dog, index) => (
                  <div key={dog.id} style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 0.1}s` }} className="fade-in">
                    <DogCard dog={dog} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results fade-in">
                <div className="no-results-icon">🐾</div>
                <h3>No encontramos perritos con esas características</h3>
                <p>Intenta ajustar los filtros o limpiar tu búsqueda.</p>
                <button className="btn-primary mt-4" onClick={() => setFilters({ size: '', sex: '', shelterId: '', search: '', page: 1 })}>
                  Limpiar Filtros
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination fade-in">
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                >
                  Anterior
                </button>
                <div className="pagination-info">
                  Página <span className="current-page">{filters.page}</span> de {totalPages}
                </div>
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DogGallery;
