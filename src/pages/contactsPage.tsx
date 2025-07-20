// src/pages/ContactsPage.tsx
import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useData } from '../context/dataContext'
import { ContactItem } from '../types'
import ContactForm from '../pages/contactForm'
import { useSpeech } from '../context/speechContext'

import './ContactsPage.css'

const ContactsPage: React.FC = () => {
  const { t } = useTranslation()
  const { contacts, deleteContact } = useData()
  const { speak, speaking } = useSpeech()

  /* ------------------------------- state -------------------------------- */
  const [editing, setEditing]   = useState<ContactItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleEdit  = (c: ContactItem) => { setEditing(c); setShowForm(true) }
  const handleAdd   = ()            => { setEditing(null); setShowForm(true) }
  const handleClose = ()            => { setEditing(null); setShowForm(false) }

  /* ------------------------------ filtering ----------------------------- */
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return contacts
    return contacts.filter(c =>
      c.fullName.toLowerCase().includes(term)   ||
      c.idNumber.toLowerCase().includes(term)   ||
      c.email.toLowerCase().includes(term)      ||
      c.phone.toLowerCase().includes(term)      ||
      c.salutation.toLowerCase().includes(term)
    )
  }, [contacts, searchTerm])

  /* ---------- convert each contact to a sentence for text‑to‑speech ------ */
  const lbl = {
    salutation: t('contact.read.salutation', { defaultValue: 'Saludo:' }),
    fullName:   t('contact.read.fullName',   { defaultValue: 'Nombre:' }),
    id:         t('contact.read.id',         { defaultValue: 'Identificación:' }),
    email:      t('contact.read.email',      { defaultValue: 'Correo:' }),
    phone:      t('contact.read.phone',      { defaultValue: 'Teléfono:' })
  }

  const contactToSentence = (c: ContactItem) =>
    `${lbl.salutation} ${c.salutation}. ` +
    `${lbl.fullName} ${c.fullName}. `       +
    `${lbl.id} ${c.idNumber}. `             +
    `${lbl.email} ${c.email}. `             +
    `${lbl.phone} ${c.phone}. `

  /* ------------------------------- render ------------------------------- */
  return (
    <div className="contacts-page">
      <header className="contacts-header">
        <h2>{t('contact.title')}</h2>

        <div className="header-actions">

          {/* 🔊 Leer contactos */}
          <button
            type="button"
            className={`speak-btn ${speaking ? 'speaking' : ''}`}
            onClick={() =>
              filtered.length
                ? speak(filtered.map(contactToSentence).join(' '))
                : speak(t('contact.noResults'))
            }
            aria-label="Leer contactos"
          >
            {speaking ? '⏹️' : '🔊'}
          </button>

          {/* búsqueda */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder={t('contact.searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <span className="search-icon" aria-hidden="true" />
          </div>

          <button onClick={handleAdd}>{t('contact.new')}</button>
        </div>
      </header>

      {showForm && (
        <ContactForm existing={editing || undefined} onClose={handleClose} />
      )}

      <table className="contacts-table">
        <thead>
          <tr>
            <th>{t('contact.columns.photo')}</th>
            <th>{t('contact.columns.salutation')}</th>
            <th>{t('contact.columns.fullName')}</th>
            <th>{t('contact.columns.id')}</th>
            <th>{t('contact.columns.email')}</th>
            <th>{t('contact.columns.phone')}</th>
            <th>{t('contact.columns.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.id}>
              <td>
                {c.photoUrl
                  ? <img src={c.photoUrl} alt="" className="contact-photo" />
                  : '-'}
              </td>
              <td>{c.salutation}</td>
              <td>{c.fullName}</td>
              <td>{c.idNumber}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <button onClick={() => handleEdit(c)}>{t('common.edit')}</button>
                <button
                  onClick={() =>
                    confirm(t('contact.confirmDelete')) && deleteContact(c.id)
                  }
                >
                  {t('common.delete')}
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7}>
                {searchTerm ? t('contact.noResults') : t('contact.empty')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ContactsPage
