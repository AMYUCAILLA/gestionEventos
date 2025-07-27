// src/pages/HelpPage.tsx
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useSpeech } from '../context/speechContext'
import SpeakButton from '../componentes/SpeakButton'

import './HelpPage.css'

const HelpPage: React.FC = () => {
  const { t }     = useTranslation()
  const { speak } = useSpeech()

  /* textos para TTS */
  const general  = `${t('help.step1')}. ${t('help.step2')}. ${t('help.step3')}`
  const sentence = `${t('help.description')}. ${t('help.instructions')}`

  /* decir “Ayuda / Help” sólo la 1.ª vez */
  const once = useRef(false)
  useEffect(() => {
    if (!once.current) {
      speak(t('navbar.help'))
      once.current = true
    }
  }, [speak, t])

  return (
    <section className="help-container">
      {/* Pasos generales */}
      <h2>
        {t('help.title1')}
        <SpeakButton text={general} />
      </h2>

      <ol className="steps">
        <li>{t('help.step1')}</li>
        <li>{t('help.step2')}</li>
        <li>{t('help.step3')}</li>
      </ol>

      {/* Vídeo + descripción */}
      <h2>
        {t('help.title')}
        <SpeakButton text={sentence} />
      </h2>

      <div className="player-wrapper">
        {/* ▶️ vídeo servido desde /public */}
        <video
          src="/tutorialEventos.mp4"
          controls
          width="100%"
          style={{ maxWidth: 720 }}
        />
      </div>

      {/* volver */}
      <Link to="/" className="back-btn">{t('help.back')}</Link>
    </section>
  )
}

export default HelpPage
