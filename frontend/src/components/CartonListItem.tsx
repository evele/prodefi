import { useNavigate } from '@tanstack/react-router'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'

const STATUS_DOT: Record<string, string> = {
  none: 'var(--text-disabled)',
  partial: 'var(--accent-gold)',
  complete: 'var(--accent-green)',
  expired: 'var(--accent-red)',
}

const STATUS_BG: Record<string, string> = {
  none: 'rgba(21, 30, 53, 0.6)',
  partial: 'rgba(255, 214, 0, 0.08)',
  complete: 'rgba(0, 230, 118, 0.08)',
  expired: 'rgba(255, 77, 109, 0.08)',
}

const STATUS_BORDER: Record<string, string> = {
  none: 'rgba(255,255,255,0.07)',
  partial: 'rgba(255, 214, 0, 0.2)',
  complete: 'rgba(0, 230, 118, 0.2)',
  expired: 'rgba(255, 77, 109, 0.2)',
}

export function CartonListItem({ tokenId, deadline }: { tokenId: bigint; deadline?: number }) {
  const navigate = useNavigate()

  const { data: cartonGroupsState } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'used',
    args: [tokenId],
    query: { refetchInterval: 10000, refetchOnWindowFocus: true },
  })

  const { data: cartonWinnersState } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'winnersPredictions',
    args: [tokenId],
    query: { refetchInterval: 10000, refetchOnWindowFocus: true },
  })

  const status = (() => {
    const now = Math.floor(Date.now() / 1000)
    const expired = typeof deadline === 'number' && now >= deadline
    if (cartonGroupsState && cartonWinnersState) return 'complete'
    if (expired && !cartonGroupsState) return 'expired'
    if (cartonGroupsState || cartonWinnersState) return 'partial'
    return 'none'
  })()

  return (
    <button
      onClick={() => navigate({ to: '/predictions', search: { carton: tokenId.toString() } })}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer"
      style={{
        background: STATUS_BG[status],
        border: `1px solid ${STATUS_BORDER[status]}`,
        color: 'var(--text-primary)',
      }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: STATUS_DOT[status] }}
      />
      #{tokenId.toString()}
    </button>
  )
}
