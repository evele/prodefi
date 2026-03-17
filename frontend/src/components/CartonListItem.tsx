import { useNavigate } from '@tanstack/react-router'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'
import { TokenStatusBadge } from './TokenStatusBadge'

export function CartonListItem({ tokenId, deadline }: { tokenId: bigint; deadline?: number }) {
  const navigate = useNavigate()

  const { data: cartonGroupsState } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'used',
    args: [tokenId],
    query: {
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    },
  })

  const { data: cartonWinnersState } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'winnersPredictions',
    args: [tokenId],
    query: {
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    },
  })

  const cartonStatus = () => {
    const now = Math.floor(Date.now() / 1000)
    const expired = typeof deadline === 'number' && now >= deadline

    if (cartonGroupsState && cartonWinnersState) {
      return 'complete'
    }
    if (expired && !cartonGroupsState) {
      return 'expired'
    }
    if (cartonGroupsState || cartonWinnersState) {
      return 'partial'
    }
    return 'none'
  }

  return (
    <div
      key={tokenId.toString()}
      className="group flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
      onClick={() => {
        navigate({
          to: '/predictions',
          search: { carton: tokenId.toString() },
        })
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
          #{tokenId.toString()}
        </div>
        <div>
          <div className="text-sm font-medium">Carton #{tokenId.toString()}</div>
          <div className="text-xs text-gray-500">Click to predict</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TokenStatusBadge status={cartonStatus()} />
        <span
          className="text-gray-300 opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        >
          ➔
        </span>
      </div>
    </div>
  )
}
