// src/pages/EventsPage.tsx
import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useData } from '../context/dataContext'
import { EventItem } from '../types'
import EventForm   from '../pages/eventForm'
import { useSpeech } from '../context/speechContext'

import './EventsPage.css'

const EventsPage: React.FC = () => {
  const { t } = useTranslation()
  const { events, deleteEvent, locations } = useData()
  const { speak, speaking } = useSpeech()

  const [editing,   setEditing]   = useState<EventItem | null>(null)
  const [showForm,  setShowForm]  = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  /* -------- utils -------- */
  const handleEdit  = (ev: EventItem) => { setEditing(ev); setShowForm(true) }
  const handleAdd   = ()             => { setEditing(null); setShowForm(true) }
  const handleClose = ()             => { setShowForm(false); setEditing(null) }

  /* Texto a leer por cada evento */
  const eventToSentence = (e: EventItem): string => {
  /* Traducciones cortas para los rótulos ------------- */
  const lbl = {
    title:       t('event.read.title',       { defaultValue: 'Título:' }),
    invited:     t('event.read.invited',     { defaultValue: 'Invitados:' }),
    date:        t('event.read.date',        { defaultValue: 'Fecha:' }),
    time:        t('event.read.time',        { defaultValue: 'Hora:' }),
    tz:          t('event.read.timezone',    { defaultValue: 'Zona horaria:' }),
    desc:        t('event.read.description', { defaultValue: 'Descripción:' }),
    rec:         t('event.read.recurrence',  { defaultValue: 'Repetición:' }),
    rem:         t('event.read.reminder',    { defaultValue: 'Recordatorio:' }),
    cat:         t('event.read.category',    { defaultValue: 'Clasificación:' }),
    loc:         t('event.read.location',    { defaultValue: 'Lugar:' }),
    none:        t('event.read.none',        { defaultValue: 'ninguno' })
  }


  /* Texto para cada campo ---------------------------- */
  const invited =
    e.invited.length ? e.invited.join(', ') : lbl.none

  const locName =
    locations.find(l => l.id === e.locationId)?.title || lbl.none

  const reminder =
    e.reminderMinutesBefore != null
      ? t('event.read.reminderMinutes', {
          defaultValue: '{{n}} minutos antes',
          n: e.reminderMinutesBefore
        })
      : lbl.none

  /* Construir la oración ----------------------------- */
  return [
    `${lbl.title} ${e.title}.`,
    `${lbl.invited} ${invited}.`,
    `${lbl.date} ${e.date}.`,
    `${lbl.time} ${e.time}.`,
    `${lbl.tz} ${e.timezone}.`,
    `${lbl.desc} ${e.description || lbl.none}.`,
    `${lbl.rec} ${recLabel(e.recurrence)}.`,
    `${lbl.rem} ${reminder}.`,
    `${lbl.cat} ${e.category || lbl.none}.`,
    `${lbl.loc} ${locName}.`
  ].join(' ')
}

  /* --- filtrado reactivo --- */
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return events
    return events.filter(e =>
      e.title.toLowerCase().includes(term) ||
      e.invited.some(inv => inv.toLowerCase().includes(term))
    )
  }, [events, searchTerm])

  const recLabel = (r: EventItem['recurrence']) =>
    t(`event.recurrence.${r}`)

  /* -------- render -------- */
  return (
    <div className="events-page">
      <header className="events-header">
        <h2>{t('event.title')}</h2>

        <div className="header-actions">
          {/* 🔊 leer eventos filtrados */}
          <button
            type="button"
            className={`speak-btn ${speaking ? 'speaking' : ''}`}
            onClick={() =>
              filtered.length
                ? speak(filtered.map(eventToSentence).join(' '))
                : speak(t('event.noResults'))
            }
            aria-label="Leer eventos"
          >
            {speaking ? '⏹️' : '🔊'}
          </button>

          {/* búsqueda */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder={t('event.searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <span className="search-icon" aria-hidden="true" />
          </div>

          <button onClick={handleAdd}>{t('event.new')}</button>
        </div>
      </header>

      {showForm && (
        <EventForm existing={editing || undefined} onClose={handleClose} />
      )}

      <table className="events-table">
        <thead>
          <tr>
            <th>{t('event.columns.title')}</th>
            <th>{t('event.columns.invited')}</th>
            <th>{t('event.columns.date')}</th>
            <th>{t('event.columns.time')}</th>
            <th>{t('event.columns.timezone')}</th>
            <th>{t('event.columns.description')}</th>
            <th>{t('event.columns.recurrence')}</th>
            <th>{t('event.columns.reminder')}</th>
            <th>{t('event.columns.category')}</th>
            <th>{t('event.columns.location')}</th>
            <th>{t('event.columns.actions')}</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(e => {
            const loc = locations.find(l => l.id === e.locationId)
            return (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.invited.join(', ') || '-'}</td>
                <td>{e.date}</td>
                <td>{e.time}</td>
                <td>{e.timezone}</td>
                <td className="description-cell">{e.description || '-'}</td>
                <td>{recLabel(e.recurrence)}</td>
                <td>
                  {e.reminderMinutesBefore != null
                    ? t('event.reminderMinutes', { n: e.reminderMinutesBefore })
                    : '-'}
                </td>
                <td>{e.category || '-'}</td>
                <td>{loc ? loc.title : '-'}</td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(e)}>{t('common.edit')}</button>
                  <button
                    onClick={() =>
                      confirm(t('event.confirmDelete')) && deleteEvent(e.id)
                    }
                  >
                    {t('common.delete')}
                  </button>
                </td>
              </tr>
            )
          })}

          {filtered.length === 0 && (
            <tr>
              <td colSpan={11}>
                {searchTerm ? t('event.noResults') : t('event.empty')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default EventsPage
