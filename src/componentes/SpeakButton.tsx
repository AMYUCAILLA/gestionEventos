// src/componentes/SpeakButton.tsx
import { useSpeech } from '../context/speechContext'

interface BtnProps { text: string }

const SpeakButton: React.FC<BtnProps> = ({ text }) => {
  const { speak, stop, speaking } = useSpeech()

  return (
    <button
      type="button"
      className={`speak-btn ${speaking ? 'speaking' : ''}`}
      onClick={() => (speaking ? stop() : speak(text))}
      aria-label={speaking ? 'Parar lectura' : 'Leer en voz alta'}
    >
      {speaking ? '⏹️' : '🔊'}
    </button>
  )
}
export default SpeakButton
