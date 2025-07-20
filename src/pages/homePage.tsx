// src/pages/HomePage.tsx
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SpeakButton from '../componentes/SpeakButton'
import { useSpeech } from '../context/speechContext'   // ⬅️ ➊  hook de voz
import './HomePage.css'

const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const { speak, speaking } = useSpeech()              // ⬅️ ➋

  /* Mensaje completo que leerá la voz */
  const fullSentence = `${t('home.welcome')}. ${t('home.hint')}`

  /* ➌ Hablar automáticamente cuando cambie el idioma o se monte la página */
  useEffect(() => {
    if (!speaking) {
      speak(fullSentence)
    }
  }, [fullSentence])           // se reactiva si cambia de idioma

  return (
    <section className="home-container">
      <h1>
        {t('home.welcome')}
        {/* Botón opcional para repetir / detener la locución */}
        <SpeakButton text={fullSentence} />
      </h1>

      <p>
        {t('home.hint')}
   
      </p>
    </section>
  )
}

export default HomePage
