import type { ReactNode } from 'react'
import { X } from 'lucide-react'

import { Button } from './ui/button'

type PurchaseCartonModalProps = {
  isOpen: boolean
  onClose: () => void
  salesClosed: boolean
  arsPriceLabel: string
  usdcPriceLabel: string
  networkLabel: string
  walletAddressLabel: string
  arsActionLabel: string
  onArsCheckout: () => void
  isCreatingArsOrder: boolean
  arsBlockedMessage: string | null
  approvalAction: ReactNode
  usdcAction: ReactNode
  gasNotice?: {
    title: string
    description: string
  } | null
}

export function PurchaseCartonModal({
  isOpen,
  onClose,
  salesClosed,
  arsPriceLabel,
  usdcPriceLabel,
  networkLabel,
  walletAddressLabel,
  arsActionLabel,
  onArsCheckout,
  isCreatingArsOrder,
  arsBlockedMessage,
  approvalAction,
  usdcAction,
  gasNotice,
}: PurchaseCartonModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-2xl border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          aria-label="Cerrar modal de compra"
        >
          <X size={18} />
        </button>

        <div className="border-b px-6 py-5" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-xs font-medium uppercase tracking-[0.22em]" style={{ color: 'var(--accent-gold)' }}>
            Comprar cartón
          </p>
          <h2 className="mt-2 font-display text-2xl font-black uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
            Elige cómo pagar
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            El cartón se emitirá a la wallet conectada: <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{walletAddressLabel}</span>
          </p>
        </div>

        {salesClosed ? (
          <div className="p-6">
            <div
              className="rounded-xl p-5 text-center space-y-2"
              style={{ background: 'rgba(255, 77, 109, 0.08)' }}
            >
              <p className="text-base font-semibold" style={{ color: 'var(--accent-red)' }}>
                Las ventas de cartones están cerradas para este torneo.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 p-6 md:grid-cols-2">
          <section
            className="rounded-2xl border p-5 flex flex-col"
            style={{ borderColor: 'rgba(0, 230, 118, 0.18)', background: 'rgba(0, 230, 118, 0.06)' }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.22em]" style={{ color: 'var(--accent-green)' }}>
              Pesos argentinos
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono-custom)' }}>
                {arsPriceLabel}
              </span>
              <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
                Mercado Pago
              </span>
            </div>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Cuando se aprueba el pago se emite un cartón automáticamente a tu wallet.
            </p>
            <div className="mt-5 space-y-3 flex flex-col flex-grow items-end mb-7">
              <Button
                className="mt-5 h-11 w-full text-base font-semibold"
                onClick={onArsCheckout}
                disabled={arsBlockedMessage !== null}
                style={arsBlockedMessage === null ? { boxShadow: 'var(--glow-green)' } : undefined}
              >
                {isCreatingArsOrder ? 'Redirigiendo…' : arsActionLabel}
              </Button>
              {arsBlockedMessage && (
                <p className="mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {arsBlockedMessage}
                </p>
              )}
            </div>
          </section>

          <section
            className="rounded-2xl border p-5 flex flex-col"
            style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.22em]" style={{ color: 'var(--accent-gold)' }}>
              USDC onchain
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono-custom)' }}>
                {usdcPriceLabel}
              </span>
              <span className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
                {networkLabel}
              </span>
            </div>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              apruebas USDC si hace falta y compras el cartón directamente onchain.
            </p>
            {gasNotice && (
              <div
                className="mt-4 rounded-xl p-3"
                style={{ background: 'rgba(255, 77, 109, 0.08)', border: '1px solid rgba(255, 77, 109, 0.22)' }}
              >
                <p className="text-sm font-semibold" style={{ color: 'var(--accent-red)' }}>
                  {gasNotice.title}
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {gasNotice.description}
                </p>
              </div>
            )}
            <div className={`mt-5 space-y-3 flex flex-col flex-grow justify-end mb-7`}>
              {approvalAction}
              {usdcAction}
            </div>
          </section>
          </div>
        )}
      </div>
    </div>
  )
}
