
import React, { useState, useEffect, FormEvent } from 'react';
import { EventItem, RecurrenceOption } from '../types';
import { useData } from '../context/dataContext';
import { v4 as uuidv4 } from 'uuid';
import { timezones } from '../utils/timezones';
import './EventForm.css';

interface Props {
  existing?: EventItem;
  onClose: () => void;
}

const recurrenceOptions: { value: RecurrenceOption; label: string }[] = [
  { value: 'none', label: 'Ninguna' },
  { value: 'daily', label: 'Diaria' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
];

const EventForm: React.FC<Props> = ({ existing, onClose }) => {
  const { addEvent, updateEvent, locations } = useData();

  // Estado de formulario
  const [title, setTitle] = useState(existing?.title || '');
  const [invitedText, setInvitedText] = useState(existing ? existing.invited.join(', ') : '');
  const [date, setDate] = useState(existing?.date || '');
  const [time, setTime] = useState(existing?.time || '');
  const [timezone, setTimezone] = useState(existing?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [description, setDescription] = useState(existing?.description || '');
  const [recurrence, setRecurrence] = useState<RecurrenceOption>(existing?.recurrence || 'none');
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState<number | ''>(existing?.reminderMinutesBefore ?? '');
  const [category, setCategory] = useState(existing?.category || '');
  const [locationId, setLocationId] = useState(existing?.locationId || '');

  // Errores de validación
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validar al submit
  const validate = () => {
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = 'Título es requerido.';
    if (!date) errs.date = 'Fecha es requerida.';
    if (!time) errs.time = 'Hora es requerida.';
    // Optional: validar formato de invitedText o email básico si deseas
    if (reminderMinutesBefore !== '' && typeof reminderMinutesBefore === 'number' && reminderMinutesBefore < 0) {
      errs.reminderMinutesBefore = 'Debe ser >= 0.';
    }
    // category y location son opcionales; si deseas hacerlos obligatorios, valida aquí:
    // if (!category.trim()) errs.category = 'Clasificación es requerida.';
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    // Procesar invitados: separar por comas
    const invitedList = invitedText
      .split(',')
      .map(s => s.trim())
      .filter(s => s);

    const item: EventItem = {
      id: existing?.id || uuidv4(),
      title: title.trim(),
      invited: invitedList,
      date,
      time,
      timezone,
      description: description.trim(),
      recurrence,
      reminderMinutesBefore: reminderMinutesBefore === '' ? null : Number(reminderMinutesBefore),
      category: category.trim(),
      locationId: locationId || null,
    };

    if (existing) {
      updateEvent(item);
    } else {
      addEvent(item);
    }
    onClose();
  };

  // Si deseas manejar focus y cerrar con Escape, puedes agregar useEffect aquí.
  // Por simplicidad, se asume que tu Modal envuelve este formulario y gestiona Escape/click fuera.

  return (
    <div className="modal-backdrop">
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="event-form-title">
        <h3 id="event-form-title">{existing ? 'Editar Evento' : 'Nuevo Evento'}</h3>
        <form onSubmit={handleSubmit} className="event-form">
          {/* Título */}
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              aria-invalid={!!errors.title}
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          {/* Invitados */}
          <div className="form-group">
            <label htmlFor="invited">Invitados (separados por comas)</label>
            <input
              id="invited"
              type="text"
              value={invitedText}
              onChange={e => setInvitedText(e.target.value)}
              placeholder="correo1@ej.com, correo2@ej.com"
            />
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label htmlFor="date">Fecha *</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              aria-invalid={!!errors.date}
            />
            {errors.date && <span className="error">{errors.date}</span>}
          </div>

          {/* Hora */}
          <div className="form-group">
            <label htmlFor="time">Hora *</label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              aria-invalid={!!errors.time}
            />
            {errors.time && <span className="error">{errors.time}</span>}
          </div>

          {/* Zona Horaria */}
          <div className="form-group">
            <label htmlFor="timezone">Zona Horaria</label>
            <select
              id="timezone"
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
            >
              {timezones.sort().map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Repetición */}
          <div className="form-group">
            <label htmlFor="recurrence">Repetición</label>
            <select
              id="recurrence"
              value={recurrence}
              onChange={e => setRecurrence(e.target.value as RecurrenceOption)}
            >
              {recurrenceOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Recordatorio */}
          <div className="form-group">
            <label htmlFor="reminder">Recordatorio (minutos antes)</label>
            <input
              id="reminder"
              type="number"
              min={0}
              value={reminderMinutesBefore ?? ''}
              onChange={e => {
                const val = e.target.value;
                setReminderMinutesBefore(val === '' ? '' : Number(val));
              }}
              aria-invalid={!!errors.reminderMinutesBefore}
            />
            {errors.reminderMinutesBefore && <span className="error">{errors.reminderMinutesBefore}</span>}
          </div>

          {/* Clasificación (Categoría) */}
          <div className="form-group">
            <label htmlFor="category">Clasificación</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Ej. Conferencia, Taller, Seminario..."
            />
          </div>

          {/* Lugar (Ubicación) */}
          <div className="form-group">
            <label htmlFor="location">Lugar</label>
            <select
              id="location"
              value={locationId || ''}
              onChange={e => setLocationId(e.target.value)}
            >
              <option value="">-- Seleccionar ubicación --</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.title}</option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button type="submit">{existing ? 'Guardar cambios' : 'Crear Evento'}</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
