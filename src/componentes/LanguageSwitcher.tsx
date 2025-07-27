/* src/componentes/LanguageSwitcher.tsx */
import { useTranslation } from 'react-i18next'
import { useSpeech } from '../context/speechContext'
import './LanguageSwitcher.css'          // añades .sr‑only aquí

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { speak }  = useSpeech()

  /* Evita repetir audio si ya estamos en el idioma elegido */
  const changeLang = (lng: 'es' | 'en') => {
    if (i18n.language.startsWith(lng)) return     // ← ya estamos, no repitas
    i18n.changeLanguage(lng)
    speak(lng === 'es'
      ? t('navbar.langChangedEs', { defaultValue: 'Idioma cambiado a español' })
      : t('navbar.langChangedEn', { defaultValue: 'Language set to English' })
    )
  }

  return (
    <div className="lang-switcher">
      {/* label solo visible a tecnologías de asistencia */}
      <label htmlFor="lang-select" className="sr-only">
        {t('navbar.language', { defaultValue: 'Select language' })}
      </label>

      <select
        id="lang-select"
        value={i18n.language.startsWith('en') ? 'en' : 'es'}
        onChange={e => changeLang(e.target.value as 'es' | 'en')}
        /* Si prefieres sin <label>, podrías usar aria-label="..." */
      >
        <option value="es">{t('navbar.spanish',  { defaultValue: 'Español' })}</option>
        <option value="en">{t('navbar.english',  { defaultValue: 'English' })}</option>
      </select>
    </div>
  )
}

export default LanguageSwitcher
