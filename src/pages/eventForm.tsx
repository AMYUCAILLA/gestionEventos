import { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { EventItem, RecurrenceOption } from '../types'
import { useData } from '../context/dataContext'
import { v4 as uuidv4 } from 'uuid'
import { timezones } from '../utils/timezones'
import './EventForm.css'

interface Props {
  existing?: EventItem
  onClose: () => void
}

const EventForm: React.FC<Props> = ({ existing, onClose }) => {
  const { t } = useTranslation()
  const { addEvent, updateEvent, locations } = useData()

  /* ───────── estado ───────── */
  const [title, setTitle] = useState(existing?.title ?? '')
  const [invitedText, setInvitedText] = useState(
    existing ? existing.invited.join(', ') : ''
  )
  const [date, setDate] = useState(existing?.date ?? '')
  const [time, setTime] = useState(existing?.time ?? '')
  const [timezone, setTimezone] = useState(
    existing?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  )
  const [description, setDescription] = useState(existing?.description ?? '')
  const [recurrence, setRecurrence] = useState<RecurrenceOption>(
    existing?.recurrence ?? 'none'
  )
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState<
    number | ''
  >(existing?.reminderMinutesBefore ?? '')
  const [category, setCategory] = useState(existing?.category ?? '')
  const [locationId, setLocationId] = useState(existing?.locationId ?? '')

  const [errors, setErrors] = useState<Record<string, string>>({})

  /* ───────── constantes traducidas ───────── */
  const recurrenceOptions: { value: RecurrenceOption; label: string }[] = [
    { value: 'none', label: t('event.recurrence.none') },
    { value: 'daily', label: t('event.recurrence.daily') },
    { value: 'weekly', label: t('event.recurrence.weekly') },
    { value: 'monthly', label: t('event.recurrence.monthly') },
  ]

  /* ───────── validación ───────── */
  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = t('event.errors.title')
    if (!date) e.date = t('event.errors.date')
    if (!time) e.time = t('event.errors.time')
    if (
      reminderMinutesBefore !== '' &&
      typeof reminderMinutesBefore === 'number' &&
      reminderMinutesBefore < 0
    )
      e.reminderMinutesBefore = t('event.errors.reminder')
    return e
  }

  /* ───────── submit ───────── */
  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const v = validate()
    if (Object.keys(v).length) {
      setErrors(v)
      return
    }
    const invited = invitedText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const item: EventItem = {
      id: existing?.id ?? uuidv4(),
      title: title.trim(),
      invited,
      date,
      time,
      timezone,
      description: description.trim(),
      recurrence,
      reminderMinutesBefore:
        reminderMinutesBefore === '' ? null : Number(reminderMinutesBefore),
      category: category.trim(),
      locationId: locationId || null,
    }

    existing ? updateEvent(item) : addEvent(item)
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-form-title"
      >
        <h3 id="event-form-title">
          {existing ? t('event.form.editTitle') : t('event.form.newTitle')}
        </h3>

        <form onSubmit={handleSubmit} className="event-form">
          {/* título */}
          <div className="form-group">
            <label htmlFor="title">{t('event.form.title')} *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
              autoFocus
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          {/* invitados */}
          <div className="form-group">
            <label htmlFor="invited">{t('event.form.invited')}</label>
            <input
              id="invited"
              type="text"
              value={invitedText}
              onChange={e => setInvitedText(e.target.value)}
              placeholder={t('event.form.invitedPlaceholder')}
            />
          </div>

          {/* fecha */}
          <div className="form-group">
            <label htmlFor="date">{t('event.form.date')} *</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              aria-invalid={!!errors.date}
            />
            {errors.date && <span className="error">{errors.date}</span>}
          </div>

          {/* hora */}
          <div className="form-group">
            <label htmlFor="time">{t('event.form.time')} *</label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              aria-invalid={!!errors.time}
            />
            {errors.time && <span className="error">{errors.time}</span>}
          </div>

          {/* zona horaria */}
          <div className="form-group">
            <label htmlFor="timezone">{t('event.form.timezone')}</label>
            <select
              id="timezone"
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
            >
              {timezones.sort().map(tz => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          {/* descripción */}
          <div className="form-group">
            <label htmlFor="description">{t('event.form.description')}</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* repetición */}
          <div className="form-group">
            <label htmlFor="recurrence">{t('event.form.recurrence')}</label>
            <select
              id="recurrence"
              value={recurrence}
              onChange={e => setRecurrence(e.target.value as RecurrenceOption)}
            >
              {recurrenceOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* recordatorio */}
          <div className="form-group">
            <label htmlFor="reminder">{t('event.form.reminder')}</label>
            <input
              id="reminder"
              type="number"
              min={0}
              value={reminderMinutesBefore ?? ''}
              onChange={e =>
                setReminderMinutesBefore(
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
              aria-invalid={!!errors.reminderMinutesBefore}
            />
            {errors.reminderMinutesBefore && (
              <span className="error">{errors.reminderMinutesBefore}</span>
            )}
          </div>

          {/* categoría */}
          <div className="form-group">
            <label htmlFor="category">{t('event.form.category')}</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder={t('event.form.categoryPlaceholder')}
            />
          </div>

          {/* ubicación */}
          <div className="form-group">
            <label htmlFor="location">{t('event.form.location')}</label>
            <select
              id="location"
              value={locationId}
              onChange={e => setLocationId(e.target.value)}
            >
              <option value="">{t('event.form.locationPlaceholder')}</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.title}
                </option>
              ))}
            </select>
          </div>

          {/* botones */}
          <div className="form-actions">
            <button type="submit">
              {existing ? t('common.saveChanges') : t('event.form.create')}
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

export default EventForm
