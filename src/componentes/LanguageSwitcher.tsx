import { useTranslation } from 'react-i18next'
import { useSpeech } from '../context/speechContext'

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()
  const { speak } = useSpeech()

   const changeLang = (lng: 'es' | 'en') => {
    i18n.changeLanguage(lng)
    speak(lng === 'es' ? 'Idioma cambiado a español' : 'Language set to English')
  }

  // ① Log para saber si el componente se monta
  console.log('[LanguageSwitcher] mounted – current lang:', i18n.language)

  return (
    <select
      value={i18n.language.startsWith('en') ? 'en' : 'es'}
      onChange={e => changeLang(e.target.value as 'es' | 'en')}
    >
      <option value="es">SPANISH</option>
      <option value="en">ENGLISH</option>
    </select>
  )
}

export default LanguageSwitcher          
