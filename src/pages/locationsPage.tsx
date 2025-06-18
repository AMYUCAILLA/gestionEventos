import React, { useState, useMemo } from 'react';
import { useData } from '../context/dataContext';
import { LocationItem } from '../types';
import LocationForm from '../pages/locationForm'; 
import './LocationsPage.css';

const LocationsPage: React.FC = () => {
  const { locations, deleteLocation } = useData();
  const [editing, setEditing] = useState<LocationItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (loc: LocationItem) => {
    setEditing(loc);
    setShowForm(true);
  };
  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const filteredLocations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return locations;
    return locations.filter(loc => {
      // Título
      if (loc.title.toLowerCase().includes(term)) return true;
      // Dirección
      if (loc.address.toLowerCase().includes(term)) return true;
      // Latitud o longitud: convertir a string
      if (String(loc.latitude).toLowerCase().includes(term)) return true;
      if (String(loc.longitude).toLowerCase().includes(term)) return true;
      return false;
    });
  }, [locations, searchTerm]);

  return (
    <div className="locations-page">
      <header className="locations-header">
        <h2>Ubicaciones</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por título, dirección, lat/lon..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <span className="search-icon" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-search"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
          <button onClick={handleAdd}>+ Nueva Ubicación</button>
        </div>
      </header>

      {showForm && (
        <LocationForm existing={editing || undefined} onClose={handleCloseForm} />
      )}

      <table className="locations-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Dirección</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredLocations.map(l => (
            <tr key={l.id}>
              <td>{l.title}</td>
              <td>{l.address}</td>
              <td>{l.latitude}</td>
              <td>{l.longitude}</td>
              <td>
                <button onClick={() => handleEdit(l)}>Editar</button>
                <button onClick={() => {
                  if (confirm('¿Eliminar ubicación?')) deleteLocation(l.id);
                }}>Eliminar</button>
              </td>
            </tr>
          ))}
          {filteredLocations.length === 0 && (
            <tr>
              <td colSpan={5}>
                {searchTerm
                  ? 'No hay ubicaciones que coincidan con la búsqueda.'
                  : 'No hay ubicaciones.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LocationsPage;
