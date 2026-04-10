import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'

type ConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
  title: ReactNode
  message: ReactNode
  confirmLabel?: string
  onConfirm: () => void
  variant?: 'default' | 'warning'
}

export function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = 'Confirmar',
  onConfirm,
  variant = 'default',
}: ConfirmModalProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-sm mx-4 p-6 rounded-2xl border border-border"
        style={{ background: 'var(--bg-card)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-bg-elevated transition-colors"
        >
          <X size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>

        <div className="space-y-4">
          <h2
            className="text-xl font-bold font-display"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h2>

          <p
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            {message}
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              variant={variant === 'warning' ? 'default' : 'default'}
              onClick={handleConfirm}
              style={
                variant === 'warning'
                  ? { background: 'var(--accent-gold)', color: 'var(--bg-base)' }
                  : undefined
              }
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
