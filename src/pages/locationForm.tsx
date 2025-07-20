import React, { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { LocationItem } from '../types'
import { useData } from '../context/dataContext'
import { v4 as uuidv4 } from 'uuid'
import './LocationForm.css'

interface Props {
  existing?: LocationItem
  onClose: () => void
}

const LocationForm: React.FC<Props> = ({ existing, onClose }) => {
  const { t } = useTranslation()
  const { addLocation, updateLocation } = useData()

  // mantener estado como string para inputs numéricos
  const [title, setTitle] = useState(existing?.title ?? '')
  const [address, setAddress] = useState(existing?.address ?? '')
  const [latitude, setLatitude] = useState(existing ? String(existing.latitude) : '')
  const [longitude, setLongitude] = useState(existing ? String(existing.longitude) : '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  /* ── validación ───────────────────────────── */
  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = t('location.errors.title')
    if (!address.trim()) e.address = t('location.errors.address')
    if (latitude.trim() && isNaN(Number(latitude)))
      e.latitude = t('location.errors.latitude')
    if (longitude.trim() && isNaN(Number(longitude)))
      e.longitude = t('location.errors.longitude')
    return e
  }

  /* ── submit ───────────────────────────────── */
  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const v = validate()
    if (Object.keys(v).length) {
      setErrors(v)
      return
    }
    const item: LocationItem = {
      id: existing?.id ?? uuidv4(),
      title: title.trim(),
      address: address.trim(),
      latitude: latitude.trim() === '' ? 0 : Number(latitude.trim()),
      longitude: longitude.trim() === '' ? 0 : Number(longitude.trim()),
    }
    existing ? updateLocation(item) : addLocation(item)
    onClose()
  }

  /* ── UI ───────────────────────────────────── */
  return (
    <div className="modal-backdrop">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loc-form-title"
      >
        <h3 id="loc-form-title">
          {existing ? t('location.form.editTitle') : t('location.form.newTitle')}
        </h3>

        <form onSubmit={handleSubmit} className="location-form">
          {/* título */}
          <div className="form-group">
            <label htmlFor="loc-title">{t('location.form.title')} *</label>
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

          {/* dirección */}
          <div className="form-group">
            <label htmlFor="loc-address">{t('location.form.address')} *</label>
            <input
              id="loc-address"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              aria-invalid={!!errors.address}
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          {/* latitud */}
          <div className="form-group">
            <label htmlFor="loc-lat">{t('location.form.latitude')}</label>
            <input
              id="loc-lat"
              type="text"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
              aria-invalid={!!errors.latitude}
            />
            {errors.latitude && <span className="error">{errors.latitude}</span>}
          </div>

          {/* longitud */}
          <div className="form-group">
            <label htmlFor="loc-lon">{t('location.form.longitude')}</label>
            <input
              id="loc-lon"
              type="text"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
              aria-invalid={!!errors.longitude}
            />
            {errors.longitude && <span className="error">{errors.longitude}</span>}
          </div>

          {/* botones */}
          <div className="form-actions">
            <button type="submit">
              {existing ? t('common.save') : t('common.create')}
            </button>
            <button type="button" onClick={onClose}>
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LocationForm
