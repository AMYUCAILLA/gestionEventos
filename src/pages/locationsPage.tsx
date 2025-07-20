// src/pages/LocationsPage.tsx
import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useData } from '../context/dataContext'
import { LocationItem } from '../types'
import LocationForm from '../pages/locationForm'
import { useSpeech } from '../context/speechContext'

import './LocationsPage.css'

const LocationsPage: React.FC = () => {
  const { t } = useTranslation()
  const { locations, deleteLocation } = useData()
  const { speak, speaking } = useSpeech()

  /* -------------------------------- state -------------------------------- */
  const [editing, setEditing] = useState<LocationItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleEdit   = (loc: LocationItem) => { setEditing(loc);  setShowForm(true) }
  const handleAdd    = ()             => { setEditing(null); setShowForm(true) }
  const handleClose  = ()             => { setEditing(null); setShowForm(false) }

  /* ------------------------------ filtering ------------------------------ */
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return locations
    return locations.filter(l =>
      l.title.toLowerCase().includes(term)     ||
      l.address.toLowerCase().includes(term)   ||
      String(l.latitude).includes(term)        ||
      String(l.longitude).includes(term)
    )
  }, [locations, searchTerm])

  /* ----------------------- sentence for text‑to‑speech ------------------- */
  const lbl = {
    title:     t('location.read.title',     { defaultValue: 'Título:' }),
    address:   t('location.read.address',   { defaultValue: 'Dirección:' }),
    latitude:  t('location.read.latitude',  { defaultValue: 'Latitud:' }),
    longitude: t('location.read.longitude', { defaultValue: 'Longitud:' })
  }

  const locToSentence = (l: LocationItem) =>
    `${lbl.title} ${l.title}. ` +
    `${lbl.address} ${l.address}. ` +
    `${lbl.latitude} ${l.latitude}. ` +
    `${lbl.longitude} ${l.longitude}. `

  /* -------------------------------- render ------------------------------ */
  return (
    <div className="locations-page">
      <header className="locations-header">
        <h2>{t('location.title')}</h2>

        <div className="header-actions">
          {/* 🔊 Leer ubicaciones */}
          <button
            type="button"
            className={`speak-btn ${speaking ? 'speaking' : ''}`}
            onClick={() =>
              filtered.length
                ? speak(filtered.map(locToSentence).join(' '))
                : speak(t('location.noResults'))
            }
            aria-label="Leer ubicaciones"
          >
            {speaking ? '⏹️' : '🔊'}
          </button>

          {/* búsqueda */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder={t('location.searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <span className="search-icon" aria-hidden="true" />
          </div>

          <button onClick={handleAdd}>{t('location.new')}</button>
        </div>
      </header>

      {showForm && (
        <LocationForm existing={editing || undefined} onClose={handleClose} />
      )}

      <table className="locations-table">
        <thead>
          <tr>
            <th>{t('location.columns.title')}</th>
            <th>{t('location.columns.address')}</th>
            <th>{t('location.columns.latitude')}</th>
            <th>{t('location.columns.longitude')}</th>
            <th>{t('location.columns.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(l => (
            <tr key={l.id}>
              <td>{l.title}</td>
              <td>{l.address}</td>
              <td>{l.latitude}</td>
              <td>{l.longitude}</td>
              <td>
                <button onClick={() => handleEdit(l)}>{t('common.edit')}</button>
                <button
                  onClick={() =>
                    confirm(t('location.confirmDelete')) && deleteLocation(l.id)
                  }
                >
                  {t('common.delete')}
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan={5}>
                {searchTerm ? t('location.noResults') : t('location.empty')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default LocationsPage
