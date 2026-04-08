import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { PredictionStatus } from '../lib/types'
import { TokenStatusBadge } from './TokenStatusBadge'

const CTA_LABEL: Record<PredictionStatus, string> = {
  none: 'Empezar',
  partial: 'Continuar',
  complete: 'Ver',
  expired: 'Ver',
}

const STATUS_COPY: Record<PredictionStatus, string> = {
  none: 'Todavia no enviaste ninguna prediccion.',
  partial: 'Este carton sigue abierto y le faltan pasos.',
  complete: 'Ya tiene partidos y ganadores enviados.',
  expired: 'El cierre paso antes de completarlo.',
}

export function CartonListItem({
  tokenId,
  status,
  highlighted = false,
}: {
  tokenId: bigint
  status: PredictionStatus
  highlighted?: boolean
}) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate({ to: '/predictions', search: { carton: tokenId.toString() } })}
      className="w-full rounded-xl px-4 py-3 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
      style={{
        background: highlighted ? 'rgba(0, 230, 118, 0.08)' : 'var(--bg-card)',
        border: `1px solid ${highlighted ? 'rgba(0, 230, 118, 0.25)' : 'var(--border-color)'}`,
        boxShadow: highlighted ? 'var(--glow-green)' : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Carton #{tokenId.toString()}
            </span>
            {highlighted && (
              <span
                className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}
              >
                Siguiente
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {STATUS_COPY[status]}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TokenStatusBadge status={status} />
          <span className="text-xs font-medium hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>
            {CTA_LABEL[status]}
          </span>
          <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </div>
      </div>
    </button>
  )
}
