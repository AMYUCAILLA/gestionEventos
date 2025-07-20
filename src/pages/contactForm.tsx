import { useState, FormEvent, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ContactItem } from '../types'
import { useData } from '../context/dataContext'
import { useSpeech } from '../context/speechContext'
import SpeakButton from '../componentes/SpeakButton'
import { v4 as uuidv4 } from 'uuid'
import './ContactForm.css'

interface Props {
  existing?: ContactItem
  onClose: () => void
}

const salutations = ['Sr.', 'Sra.', 'Srta.', 'Dr.', 'Dra.', 'Ing.', 'Prof.', 'Otros']

const ContactForm: React.FC<Props> = ({ existing, onClose }) => {
  const { t } = useTranslation()
  const { speak } = useSpeech()
  const { addContact, updateContact } = useData()

  /* ------- estado ------- */
  const [salutation, setSalutation] = useState(existing?.salutation ?? salutations[0])
  const [fullName, setFullName]   = useState(existing?.fullName   ?? '')
  const [idNumber, setIdNumber]   = useState(existing?.idNumber   ?? '')
  const [email,    setEmail]      = useState(existing?.email      ?? '')
  const [phone,    setPhone]      = useState(existing?.phone      ?? '')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoUrl,  setPhotoUrl]  = useState<string | null>(existing?.photoUrl ?? null)
  const [errors,    setErrors]    = useState<Record<string, string>>({})

  /* vista previa de foto */
  useEffect(() => {
    if (!photoFile) return
    const r = new FileReader()
    r.onload = () => typeof r.result === 'string' && setPhotoUrl(r.result)
    r.readAsDataURL(photoFile)
  }, [photoFile])

  /* validación */
  const validate = () => {
    const e: Record<string, string> = {}
    if (!fullName.trim()) e.fullName = t('contact.form.errors.fullName')
    if (!idNumber.trim()) e.idNumber = t('contact.form.errors.idNumber')
    if (!email.trim())   e.email    = t('contact.form.errors.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = t('contact.form.errors.emailFormat')
    if (!phone.trim())   e.phone    = t('contact.form.errors.phone')
    return e
  }

  /* submit */
  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const v = validate()
    if (Object.keys(v).length) {
      setErrors(v)
      speak(Object.values(v)[0])           // lee el primer error
      return
    }

    const item: ContactItem = {
      id: existing?.id ?? uuidv4(),
      salutation,
      fullName: fullName.trim(),
      idNumber: idNumber.trim(),
      email: email.trim(),
      phone: phone.trim(),
      photoUrl,
    }
    existing ? updateContact(item) : addContact(item)
    speak(existing ? t('common.saveChanges') : t('common.create'))
    onClose()
  }

  /* ----------------------- UI ----------------------- */
  return (
    <div className="modal-backdrop">
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="contact-form-title">
        <h3 id="contact-form-title">
          {existing ? t('contact.form.editTitle') : t('contact.form.newTitle')}
          <button type="button" className="speak-btn">
            <SpeakButton text={t('contact.form.newTitleHelp', { defaultValue: t('contact.form.newTitle') })} />
          </button>
        </h3>

        <form onSubmit={handleSubmit} className="contact-form">

          {/* Saludo */}
          <div className="form-group">
            <label htmlFor="salutation">
              {t('contact.form.salutation')}
              <button type="button" className="speak-btn">
                <SpeakButton text={t('contact.form.salutationHelp', { defaultValue: t('contact.form.salutation') })} />
              </button>
            </label>
            <select id="salutation" value={salutation} onChange={e => setSalutation(e.target.value)}>
              {salutations.map(s => (
                <option key={s} value={s}>{t(`contact.salutations.${s}`)}</option>
              ))}
            </select>
          </div>

          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="fullName">
              {t('contact.form.fullName')} *
              <button type="button" className="speak-btn">
                <SpeakButton text={t('contact.form.fullNameHelp', { defaultValue: t('contact.form.fullName') })} />
              </button>
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </div>

          {/* ID */}
          <div className="form-group">
            <label htmlFor="idNumber">
              {t('contact.form.idNumber')} *
              <button type="button" className="speak-btn">
                <SpeakButton text={t('contact.form.idHelp', { defaultValue: t('contact.form.idNumber') })} />
              </button>
            </label>
            <input
              id="idNumber"
              value={idNumber}
              onChange={e => setIdNumber(e.target.value)}
              aria-invalid={!!errors.idNumber}
            />
            {errors.idNumber && <span className="error">{errors.idNumber}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              {t('contact.form.email')} *
              <button type="button" className="speak-btn">
                <SpeakButton text={t('contact.form.emailHelp', { defaultValue: t('contact.form.email') })} />
              </button>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* Teléfono */}
          <div className="form-group">
            <label htmlFor="phone">
              {t('contact.form.phone')} *
              <button type="button" className="speak-btn">
                <SpeakButton text={t('contact.form.phoneHelp', { defaultValue: t('contact.form.phone') })} />
              </button>
            </label>
            <input
              id="phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          {/* Foto */}
          <div className="form-group">
            <label htmlFor="photo">
              {t('contact.form.photo')}
              <button type="button" className="speak-btn">
                <SpeakButton text={t('contact.form.photoHelp', { defaultValue: t('contact.form.photo') })} />
              </button>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={e =>
                e.target.files && setPhotoFile(e.target.files[0])
              }
            />
            {photoUrl && <img src={photoUrl} alt="preview" className="photo-preview" />}
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button type="submit">
              {existing ? t('common.save') : t('common.create')}
            </button>
            <button type="button" onClick={onClose}>{t('common.cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
