// src/context/speechContext.tsx
import React, { createContext, useContext, useRef, useState, useCallback } from 'react'

interface SpeechCtx {
  speak: (text: string) => void
  stop: () => void
  speaking: boolean
}

const SpeechContext = createContext<SpeechCtx | undefined>(undefined)

export const SpeechProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const utterRef         = useRef<SpeechSynthesisUtterance | null>(null)
  const [speaking, setSpeaking] = useState(false)

  /** util: obtiene (o crea) un único utterance reutilizable */
  const getUtter = () => {
    if (utterRef.current) return utterRef.current
    const u = new SpeechSynthesisUtterance()
    u.onend   = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    utterRef.current = u
    return u
  }

  /** habla cancelando primero cualquier cola/sonido */
  const speak = useCallback((text: string) => {
    const synth = window.speechSynthesis
    if (!synth) return

    synth.cancel()                    // ← mata TODO lo que se esté reproduciendo
    const utter = getUtter()
    utter.text = text
    utter.lang = synth.getVoices().find(v => v.lang.startsWith('es'))?.lang || 'es-ES'
    setSpeaking(true)
    synth.speak(utter)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  return (
    <SpeechContext.Provider value={{ speak, stop, speaking }}>
      {children}
    </SpeechContext.Provider>
  )
}

export const useSpeech = () => {
  const ctx = useContext(SpeechContext)
  if (!ctx) throw new Error('useSpeech must be used inside <SpeechProvider>')
  return ctx
}
