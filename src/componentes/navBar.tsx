// src/componentes/Navbar.tsx
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSpeech } from '../context/speechContext'   // 🔊
import SpeakButton from './SpeakButton'                // 🔊
import LanguageSwitcher from './LanguageSwitcher'
import './Navbar.css'

const Navbar: React.FC = () => {
  const { t } = useTranslation()
  const { speak, speaking } = useSpeech()

  const handleSpeak = (text: string) => {
    if (!speaking) speak(text)
  }

  /** Texto que leerá el sintetizador cuando el usuario pulse el altavoz */
  const voiceText = [
    t('navbar.brand', { defaultValue: 'Gestión Eventos' }),
    t('navbar.home'),
    t('navbar.events'),
    t('navbar.locations'),
    t('navbar.contacts')
  ].join(', ')

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {t('navbar.brand', { defaultValue: 'Gestión Eventos' })}

        {/* botón de audio */}
        <button
          type="button"
          className="speak-btn"   /* misma clase de ContactForm.css */
          onClick={() => speak(voiceText)}
          aria-label={t('navbar.readMenu', { defaultValue: 'Leer menú' })}
        >
          🔊
        </button>
      </div>

      <ul className="navbar-links">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('navbar.home')}
          </NavLink>
        </li>
        <li>
          <NavLink to="/events" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('navbar.events')}
          </NavLink>
        </li>
        <li>
          <NavLink to="/locations" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('navbar.locations')}
          </NavLink>
        </li>
        <li>
          <NavLink to="/contacts" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('navbar.contacts')}
          </NavLink>
        </li>
        <li>
  <NavLink to="/help" className={({isActive})=>isActive?'active':''}>
    {t('navbar.help')}
  </NavLink>
</li>

      </ul>

      {/* selector de idioma */}
      <LanguageSwitcher />
    </nav>
  )
}

export default Navbar
