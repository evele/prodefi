import type { PredictionStatus } from '../lib/types'

const STATUS_CONFIG: Record<PredictionStatus, { text: string; dotColor: string; textColor: string; bgColor: string }> = {
  none: {
    text: 'Pendiente',
    dotColor: 'var(--text-disabled)',
    textColor: 'var(--text-disabled)',
    bgColor: 'rgba(58, 71, 92, 0.2)',
  },
  partial: {
    text: 'Pendiente',
    dotColor: 'var(--accent-gold)',
    textColor: 'var(--accent-gold)',
    bgColor: 'rgba(255, 214, 0, 0.1)',
  },
  complete: {
    text: 'Completo',
    dotColor: 'var(--accent-green)',
    textColor: 'var(--accent-green)',
    bgColor: 'rgba(0, 230, 118, 0.1)',
  },
  expired: {
    text: 'Vencido',
    dotColor: 'var(--accent-red)',
    textColor: 'var(--accent-red)',
    bgColor: 'rgba(255, 77, 109, 0.1)',
  },
}

export function TokenStatusBadge({ status }: { status: PredictionStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.none

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full"
      style={{ background: cfg.bgColor, color: cfg.textColor }}
      role="status"
      aria-label={`Estado: ${cfg.text}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: cfg.dotColor }}
        aria-hidden="true"
      />
      {cfg.text}
    </span>
  )
}
