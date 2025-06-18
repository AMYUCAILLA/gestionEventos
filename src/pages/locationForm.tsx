import React, { useState, FormEvent } from 'react';
import { LocationItem } from '../types';
import { useData } from '../context/dataContext';
import { v4 as uuidv4 } from 'uuid';
import './LocationForm.css';

interface Props {
  existing?: LocationItem;
  onClose: () => void;
}

const LocationForm: React.FC<Props> = ({ existing, onClose }) => {
  const { addLocation, updateLocation } = useData();
  // Mantener estado como string para inputs, luego parsear a número
  const [title, setTitle] = useState(existing?.title || '');
  const [address, setAddress] = useState(existing?.address || '');
  const [latitude, setLatitude] = useState(existing ? String(existing.latitude) : '');
  const [longitude, setLongitude] = useState(existing ? String(existing.longitude) : '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = 'Título es requerido.';
    if (!address.trim()) errs.address = 'Dirección es requerida.';
    // validar lat/lon numéricos si no vacíos
    if (latitude.trim() !== '' && isNaN(Number(latitude))) errs.latitude = 'Debe ser numérico.';
    if (longitude.trim() !== '' && isNaN(Number(longitude))) errs.longitude = 'Debe ser numérico.';
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    const item: LocationItem = {
      id: existing?.id || uuidv4(),
      title: title.trim(),
      address: address.trim(),
      latitude: latitude.trim() === '' ? 0 : Number(latitude.trim()),
      longitude: longitude.trim() === '' ? 0 : Number(longitude.trim()),
    };
    if (existing) updateLocation(item);
    else addLocation(item);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="loc-form-title">
        <h3 id="loc-form-title">{existing ? 'Editar Ubicación' : 'Nueva Ubicación'}</h3>
        <form onSubmit={handleSubmit} className="location-form">
          <div className="form-group">
            <label htmlFor="loc-title">Título *</label>
            <input
              id="loc-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              aria-invalid={!!errors.title}
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="loc-address">Dirección *</label>
            <input
              id="loc-address"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              aria-invalid={!!errors.address}
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="loc-latitude">Latitud</label>
            <input
              id="loc-latitude"
              type="text"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
              aria-invalid={!!errors.latitude}
            />
            {errors.latitude && <span className="error">{errors.latitude}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="loc-longitude">Longitud</label>
            <input
              id="loc-longitude"
              type="text"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
              aria-invalid={!!errors.longitude}
            />
            {errors.longitude && <span className="error">{errors.longitude}</span>}
          </div>
          <div className="form-actions">
            <button type="submit">{existing ? 'Guardar' : 'Crear'}</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm;
