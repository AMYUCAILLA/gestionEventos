// src/pages/HelpPage.tsx
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSpeech } from '../context/speechContext'
import SpeakButton from '../componentes/SpeakButton'
import { Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import './HelpPage.css'

const HelpPage: React.FC = () => {
  const { t } = useTranslation()
  const { speak } = useSpeech()

  /** ▶️ Explicación completa para el botón de voz */
  const general =
    `${t('help.step1')}. ${t('help.step2')}. ${t('help.step3')}`

    const sentence =
    `${t('help.description')}. ${t('help.instructions')}`


  /* ------------------------------------------------------------------ */
  /*   Hablar “Ayuda” / “Help” solo la primera vez que se monta          */
  /* ------------------------------------------------------------------ */
  const spokenOnce = useRef(false)
  useEffect(() => {
    if (!spokenOnce.current) {
      speak(t('navbar.help'))   // dice “Ayuda” o “Help”
      spokenOnce.current = true
    }
  }, [speak, t])               // ← no causa bucles porque la ref corta repeticiones

  return (
    <section className="help-container">
     
 <h2>
        {t('help.title1')}
        <SpeakButton text={general} />
      </h2>
      {/* Guion / transcripción */}
      <ol className="steps">
        <li>{t('help.step1')}</li>
        <li>{t('help.step2')}</li>
        <li>{t('help.step3')}</li>
        {/* …añade más pasos si lo necesitas */}
      </ol>



 <h2>
        {t('help.title')}
        <SpeakButton text={sentence} />
      </h2>

      {/* Vídeo paso a paso */}
      <div className="player-wrapper">
        <ReactPlayer
          url="/assets/help.mp4"      /* o un enlace de YouTube/Vimeo            */
          controls
          width="100%"
          height="100%"
        />
      </div>


      {/* Botón volver al inicio */}
      <Link to="/" className="back-btn">
        {t('help.back')}
      </Link>
    </section>
  )
}

export default HelpPage
