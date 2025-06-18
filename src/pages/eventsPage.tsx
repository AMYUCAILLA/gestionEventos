
import React, { useState, useMemo } from 'react';
import { useData } from '../context/dataContext';
import { EventItem } from '../types';
import EventForm from '../pages/eventForm'; 
import './EventsPage.css';

const EventsPage: React.FC = () => {
  const { events, deleteEvent, locations } = useData();
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (event: EventItem) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  // Preparar la lista filtrada de eventos según searchTerm
  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return events;
    }
    return events.filter(e => {
      // Buscar en título
      if (e.title.toLowerCase().includes(term)) {
        return true;
      }
      // Buscar en invitados: e.invited es string[]
      if (e.invited.some(inv => inv.toLowerCase().includes(term))) {
        return true;
      }
      return false;
    });
  }, [events, searchTerm]);

  // Función auxiliar para mostrar etiqueta de repetición:
  const labelRecurrence = (rec: EventItem['recurrence']) => {
    switch (rec) {
      case 'daily': return 'Diaria';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensual';
      default: return 'Ninguna';
    }
  };

  return (
    <div className="events-page">
      <header className="events-header">
        <h2>Eventos</h2>
        <div className="header-actions">
          {/* Caja de búsqueda */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por título o invitado..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {/* Ícono de búsqueda (SVG) */}
            <span className="search-icon" aria-hidden="true">
              {/* Aquí un SVG de lupa sencillo */}
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
          <button onClick={handleAdd}>+ Nuevo Evento</button>
        </div>
      </header>

      {showForm && (
        <EventForm
          existing={editingEvent || undefined}
          onClose={handleCloseForm}
        />
      )}

      <table className="events-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Invitados</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Zona Horaria</th>
            <th>Descripción</th>
            <th>Repetición</th>
            <th>Recordatorio</th>
            <th>Clasificación</th>
            <th>Lugar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map(e => {
            const loc = locations.find(l => l.id === e.locationId);
            return (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.invited.length > 0 ? e.invited.join(', ') : '-'}</td>
                <td>{e.date}</td>
                <td>{e.time}</td>
                <td>{e.timezone}</td>
                <td className="description-cell">
                  {e.description || '-'}
                </td>
                <td>{labelRecurrence(e.recurrence)}</td>
                <td>
                  {e.reminderMinutesBefore != null
                    ? `${e.reminderMinutesBefore} min antes`
                    : '-'}
                </td>
                <td>{e.category || '-'}</td>
                <td>{loc ? loc.title : '-'}</td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(e)}>Editar</button>
                  <button onClick={() => {
                    if (confirm('¿Seguro que desea eliminar este evento?')) {
                      deleteEvent(e.id);
                    }
                  }}>Eliminar</button>
                </td>
              </tr>
            );
          })}
          {filteredEvents.length === 0 && (
            <tr>
              <td colSpan={11}>
                {searchTerm
                  ? 'No hay eventos que coincidan con la búsqueda.'
                  : 'No hay eventos registrados.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventsPage;
