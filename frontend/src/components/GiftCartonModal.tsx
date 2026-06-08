import { X } from 'lucide-react'

import { Button } from './ui/button'
import { Input } from './ui/input'

export type GiftRecipientVerificationState =
  | { status: 'idle' }
  | { status: 'verifying' }
  | { status: 'eligible'; walletAddress: string }
  | { status: 'ineligible'; message: string }
  | { status: 'error'; message: string }

type GiftCartonModalProps = {
  isOpen: boolean
  tokenId: bigint | null
  recipientWallet: string
  verificationState: GiftRecipientVerificationState
  isSubmitting: boolean
  walletValidationMessage: string | null
  onRecipientWalletChange: (value: string) => void
  onVerify: () => void
  onConfirm: () => void
  onClose: () => void
}

function getStatusToneStyles(status: GiftRecipientVerificationState['status']) {
  if (status === 'eligible') {
    return {
      background: 'rgba(0, 230, 118, 0.08)',
      border: '1px solid rgba(0, 230, 118, 0.2)',
      color: 'var(--accent-green)',
    }
  }

  if (status === 'ineligible' || status === 'error') {
    return {
      background: 'rgba(255, 77, 109, 0.08)',
      border: '1px solid rgba(255, 77, 109, 0.22)',
      color: 'var(--accent-red)',
    }
  }

  return {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
  }
}

export function GiftCartonModal({
  isOpen,
  tokenId,
  recipientWallet,
  verificationState,
  isSubmitting,
  walletValidationMessage,
  onRecipientWalletChange,
  onVerify,
  onConfirm,
  onClose,
}: GiftCartonModalProps) {
  if (!isOpen || tokenId === null) return null

  const verificationMessage = (() => {
    if (verificationState.status === 'verifying') return 'Verificando si esta wallet pertenece a un usuario activo de ProDefi…'
    if (verificationState.status === 'eligible') return 'Esta wallet puede recibir cartones.'
    if (verificationState.status === 'ineligible' || verificationState.status === 'error') return verificationState.message
    if (walletValidationMessage) return walletValidationMessage
    return 'Pega la wallet de destino y verifica que pertenezca a un usuario activo de ProDefi.'
  })()

  const statusStyles = getStatusToneStyles(verificationState.status)
  const canConfirm = verificationState.status === 'eligible' && !isSubmitting

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={isSubmitting ? undefined : onClose} />

      <div
        className="relative z-10 w-full max-w-lg rounded-2xl border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:opacity-40"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          aria-label="Cerrar modal de regalo"
        >
          <X size={18} />
        </button>

        <div className="border-b px-6 py-5" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-xs font-medium uppercase tracking-[0.22em]" style={{ color: 'var(--accent-green)' }}>
            Regalar cartón
          </p>
          <h2 className="mt-2 font-display text-2xl font-black uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
            Cartón #{tokenId.toString()}
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Solo puedes regalarlo a una wallet que ya pertenezca a un usuario activo de ProDefi.
          </p>
        </div>

        <div className="space-y-5 p-6">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
              Wallet destino
            </label>
            <Input
              value={recipientWallet}
              onChange={(event) => onRecipientWalletChange(event.target.value)}
              placeholder="0x..."
              autoComplete="off"
              spellCheck={false}
              disabled={isSubmitting || verificationState.status === 'verifying'}
            />
          </div>

          <div
            className="rounded-xl p-4 text-sm"
            style={{
              background: statusStyles.background,
              border: statusStyles.border,
              color: statusStyles.color,
            }}
          >
            {verificationMessage}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={onVerify}
              disabled={isSubmitting || verificationState.status === 'verifying'}
            >
              {verificationState.status === 'verifying' ? 'Verificando…' : 'Verificar wallet'}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!canConfirm}
              style={canConfirm ? { boxShadow: 'var(--glow-green)' } : undefined}
            >
              {isSubmitting ? 'Regalando…' : 'Regalar cartón'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
