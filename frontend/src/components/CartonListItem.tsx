import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, Gift } from 'lucide-react'
import type { PredictionStatus } from '../lib/types'
import { TokenStatusBadge } from './TokenStatusBadge'
import { useAppReadContract } from '../hooks/useAppRead'
import { CARTON_ABI, CONTRACT_ADDRESSES } from '../lib/contracts'
import { getCartonImageUrl } from '../lib/carton-metadata'
import { Button } from './ui/button'

const STATUS_COPY: Record<PredictionStatus, string> = {
  none: 'Todavia no enviaste ninguna prediccion.',
  partial: 'Este carton sigue abierto y le faltan pasos.',
  complete: 'Ya tiene partidos y ganadores enviados.',
  expired: 'El cartón no se completó a tiempo.',
}

export function CartonListItem({
  tokenId,
  status,
  prizeStatus = 'none',
  highlighted = false,
  onGift,
  giftDisabled = false,
}: {
  tokenId: bigint
  status: PredictionStatus
  prizeStatus?: 'none' | 'claimable' | 'claimed'
  highlighted?: boolean
  onGift?: () => void
  giftDisabled?: boolean
}) {
  const navigate = useNavigate()

  const { data: variant } = useAppReadContract<number>({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'variantByTokenId',
    args: [tokenId],
  })

  const flagUrl = variant !== undefined ? getCartonImageUrl(variant, tokenId) : ''

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex min-h-[80px]"
      style={{
        background: highlighted ? 'rgba(0, 230, 118, 0.08)' : 'var(--bg-card)',
        border: `1px solid ${highlighted ? 'rgba(0, 230, 118, 0.25)' : 'var(--border-color)'}`,
        boxShadow: highlighted ? 'var(--glow-green)' : undefined,
      }}
    >
      {onGift && (
        <div className="absolute right-3 top-3 z-10">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={giftDisabled}
            onClick={onGift}
            className="gap-1.5"
          >
            <Gift className="h-3.5 w-3.5" />
            Regalar
          </Button>
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate({ to: '/predictions', search: { carton: tokenId.toString() } })}
        className="flex min-h-[80px] w-full text-left"
      >
      {/* Left 40%: texto y badges */}
      <div className="w-[60%] px-4 py-8 flex flex-col justify-between gap-2 shrink-0">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Carton #{tokenId.toString()}
            </span>
            {prizeStatus === 'claimable' && (
              <span
                className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(96, 165, 250, 0.14)', color: 'rgb(125, 211, 252)' }}
              >
                Premio
              </span>
            )}
            {prizeStatus === 'claimed' && (
              <span
                className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}
              >
                Reclamado
              </span>
            )}
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
        <div className="w-fit">
          <TokenStatusBadge status={status} />
        </div>
      </div>

      {/* Right 40%: bandera */}
      <div className="relative flex-1 overflow-hidden opacity-50">
        {flagUrl && (
          <img
            src={flagUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        )}
        <div
          className="absolute inset-y-0 left-0 w-12"
          style={{ background: `linear-gradient(to right, ${highlighted ? 'rgba(0,230,118,0.08)' : 'var(--bg-card)'}, transparent)` }}
        />
        <span
          className="absolute bottom-2.5 right-3 p-1.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
        >
          <ArrowRight className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.9)' }} />
        </span>
      </div>
      </button>
    </div>
  )
}
