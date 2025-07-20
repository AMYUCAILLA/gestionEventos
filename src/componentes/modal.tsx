import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import './Modal.css'

interface Props {
  title: string     // La prop sigue llegando traducida desde quien llama
  onClose: () => void
  children: ReactNode
}

const Modal: React.FC<Props> = ({ title, onClose, children }) => {
  const { t } = useTranslation()
  const backdropRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose()
  }

  useEffect(() => contentRef.current?.focus(), [])

  return (
    <div
      className="modal-backdrop"
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" ref={contentRef} tabIndex={-1}>
        <h3 id="modal-title">{title}</h3>
        {children}
        {/* Ejemplo de botón de cierre traducido */}
        <button onClick={onClose}>{t('modal.close')}</button>
      </div>
    </div>
  )
}

export default Modal
