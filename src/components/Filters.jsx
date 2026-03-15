import React from 'react';
import './Filters.css';
import { shelters } from '../data/shelters';

const Filters = ({ filters, setFilters, maxPages }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // reset to first page on filter change
    }));
  };

  const clearFilters = () => {
    setFilters({
      size: '',
      sex: '',
      shelterId: '',
      search: '',
      page: 1
    });
  };

  const hasActiveFilters = filters.size || filters.sex || filters.shelterId || filters.search;

  return (
    <div className="filters-container glass-panel fade-in">
      <div className="filters-header">
        <h3 className="filters-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filtrar Perritos
        </h3>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Limpiar Filtros
          </button>
        )}
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="search">Buscar por nombre</label>
          <input 
            type="text" 
            id="search" 
            name="search" 
            placeholder="Ej. Max, Luna..." 
            value={filters.search} 
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="size">Tamaño</label>
          <select id="size" name="size" value={filters.size} onChange={handleFilterChange} className="filter-select">
            <option value="">Todos los tamaños</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sex">Sexo</label>
          <select id="sex" name="sex" value={filters.sex} onChange={handleFilterChange} className="filter-select">
            <option value="">Todos</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>

        <div className="filter-group filter-group-wide">
          <label htmlFor="shelterId">Albergue</label>
          <select id="shelterId" name="shelterId" value={filters.shelterId} onChange={handleFilterChange} className="filter-select">
            <option value="">Todos los Albergues</option>
            {shelters.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
