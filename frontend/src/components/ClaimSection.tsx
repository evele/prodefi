import { useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { formatEther, formatUnits } from 'viem'
import { Button } from './ui/button'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI, ZERO_ADDRESS } from '../lib/contracts'
import { useSimulatedContractWrite } from '../hooks/useSimulatedContractWrite'
import { mapClaimError } from '../lib/transaction-errors'

export function ClaimSection({ tokenId }: { tokenId: bigint }) {
  const ethClaimWrite = useSimulatedContractWrite()
  const usdcClaimWrite = useSimulatedContractWrite()

  const { data: activeTournamentId } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'activeTournamentId',
    query: { refetchInterval: 10_000 },
  })
  const tournamentId = activeTournamentId ?? 0n

  const { data: ethClosed } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'isClosedTournament',
    args: tournamentId > 0n ? [tournamentId, ZERO_ADDRESS] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10_000 },
  })

  const { data: usdcClosed } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'isClosedTournament',
    args: tournamentId > 0n ? [tournamentId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10_000 },
  })

  const anyClosed = Boolean(ethClosed) || Boolean(usdcClosed)

  const { data: positionsVersion } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'positionsVersion',
    query: { enabled: anyClosed, refetchInterval: 10_000 },
  })

  const { data: rawRank } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'tokenPositions',
    args: anyClosed ? [tokenId] : undefined,
    query: { enabled: anyClosed, refetchInterval: 10_000 },
  })

  const { data: rankVersion } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'tokenPositionsVersion',
    args: anyClosed ? [tokenId] : undefined,
    query: { enabled: anyClosed, refetchInterval: 10_000 },
  })

  const rank = useMemo(() => {
    if (rawRank === undefined || rawRank === 0n) return null
    if (positionsVersion === undefined || rankVersion !== positionsVersion) return null
    return Number(rawRank)
  }, [positionsVersion, rankVersion, rawRank])

  const { data: ethPrize } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getUserPrizeAmount',
    args: rank !== null && tournamentId > 0n ? [tournamentId, ZERO_ADDRESS, BigInt(rank)] : undefined,
    query: { enabled: rank !== null && Boolean(ethClosed), refetchInterval: 10_000 },
  })

  const { data: usdcPrize } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getUserPrizeAmount',
    args: rank !== null && tournamentId > 0n ? [tournamentId, CONTRACT_ADDRESSES.USDC, BigInt(rank)] : undefined,
    query: { enabled: rank !== null && Boolean(usdcClosed), refetchInterval: 10_000 },
  })

  const { data: ethClaimed, refetch: refetchEthClaimed } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'hasUserClaimed',
    args: tournamentId > 0n ? [tournamentId, tokenId, ZERO_ADDRESS] : undefined,
    query: { enabled: tournamentId > 0n && Boolean(ethClosed), refetchInterval: 10_000 },
  })

  const { data: usdcClaimed, refetch: refetchUsdcClaimed } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'hasUserClaimed',
    args: tournamentId > 0n ? [tournamentId, tokenId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n && Boolean(usdcClosed), refetchInterval: 10_000 },
  })

  const handleClaimEth = () => {
    void ethClaimWrite.simulateAndSend(
      {
        address: CONTRACT_ADDRESSES.TREASURY,
        abi: TREASURY_ABI,
        functionName: 'claimPrize',
        args: [tournamentId, tokenId, ZERO_ADDRESS],
      },
      {
        toastId: `claim-eth-${tokenId.toString()}`,
        pendingMessage: 'Esperando confirmación del reclamo ETH…',
        successMessage: '¡Premio ETH reclamado!',
        revertedMessage: 'El reclamo ETH fue rechazado en cadena.',
        mapError: (error) => mapClaimError(error, 'ETH'),
        onSuccess: async () => { await refetchEthClaimed() },
        logLabel: 'Claim ETH prize',
      },
    )
  }

  const handleClaimUsdc = () => {
    void usdcClaimWrite.simulateAndSend(
      {
        address: CONTRACT_ADDRESSES.TREASURY,
        abi: TREASURY_ABI,
        functionName: 'claimPrize',
        args: [tournamentId, tokenId, CONTRACT_ADDRESSES.USDC],
      },
      {
        toastId: `claim-usdc-${tokenId.toString()}`,
        pendingMessage: 'Esperando confirmación del reclamo USDC…',
        successMessage: '¡Premio USDC reclamado!',
        revertedMessage: 'El reclamo USDC fue rechazado en cadena.',
        mapError: (error) => mapClaimError(error, 'USDC'),
        onSuccess: async () => { await refetchUsdcClaimed() },
        logLabel: 'Claim USDC prize',
      },
    )
  }

  if (!anyClosed) return null

  const ethPrizeValue = ethPrize ?? 0n
  const usdcPrizeValue = usdcPrize ?? 0n

  const assets = [
    {
      label: 'ETH',
      closed: Boolean(ethClosed),
      prize: ethPrizeValue,
      claimed: Boolean(ethClaimed),
      isPending: ethClaimWrite.isBusy,
      hasPrize: ethPrizeValue > 0n,
      onClaim: handleClaimEth,
      format: (v: bigint) => `${Number(formatEther(v)).toFixed(4)} ETH`,
    },
    {
      label: 'USDC',
      closed: Boolean(usdcClosed),
      prize: usdcPrizeValue,
      claimed: Boolean(usdcClaimed),
      isPending: usdcClaimWrite.isBusy,
      hasPrize: usdcPrizeValue > 0n,
      onClaim: handleClaimUsdc,
      format: (v: bigint) => `${Number(formatUnits(v, 6)).toFixed(2)} USDC`,
    },
  ]

  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid rgba(255, 214, 0, 0.25)`,
        boxShadow: 'var(--glow-gold)',
      }}
    >
      {/* Header */}
      <div>
        <p className="font-display text-2xl font-bold uppercase" style={{ color: 'var(--accent-gold)' }}>
          {rank !== null ? '¡Tienes premios!' : 'Premios'}
        </p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Cartón #{tokenId.toString()} ·{' '}
          {rank !== null ? `Posición #${rank} en el torneo` : 'Sin clasificación en este torneo'}
        </p>
      </div>

      {rank === null ? (
        <p className="text-sm" style={{ color: 'var(--text-disabled)' }}>
          Este cartón no tiene posición en el marcador final.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {assets.map((asset) => {
            if (!asset.closed) return null
            return (
              <div
                key={asset.label}
                className="rounded-lg p-4 flex flex-col gap-3"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Premio {asset.label}
                  </p>
                  <p
                    className="text-2xl font-bold mt-1"
                    style={{
                      fontFamily: 'var(--font-mono-custom)',
                      color: asset.hasPrize ? 'var(--accent-gold)' : 'var(--text-disabled)',
                    }}
                  >
                    {asset.hasPrize ? asset.format(asset.prize) : `— ${asset.label}`}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!asset.hasPrize || asset.claimed || asset.isPending}
                  onClick={asset.onClaim}
                  variant={asset.claimed ? 'secondary' : 'default'}
                >
                  {asset.claimed
                    ? '✓ Reclamado'
                    : asset.isPending
                      ? 'Reclamando…'
                      : !asset.hasPrize
                        ? 'Sin premio'
                        : `Reclamar ${asset.label}`}
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
