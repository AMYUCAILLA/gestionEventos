import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config'
import { SpeechProvider } from './context/speechContext'

import App from './App'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <SpeechProvider>
      <App />
    </SpeechProvider>
  </StrictMode>,
)
