import { useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { Button } from './ui/button'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI } from '../lib/contracts'
import { useSimulatedContractWrite } from '../hooks/useSimulatedContractWrite'
import { mapClaimError } from '../lib/transaction-errors'

export function ClaimSection({ tokenId }: { tokenId: bigint }) {
  const usdcClaimWrite = useSimulatedContractWrite()

  const { data: activeTournamentId } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'activeTournamentId',
    query: { refetchInterval: 10_000 },
  })

  const { data: tokenTournamentId } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'tokenTournamentId',
    args: [tokenId],
    query: { refetchInterval: 10_000 },
  })

  const tournamentId = tokenTournamentId ?? 0n
  const usesActivePredictionsEngine = tournamentId > 0n && tournamentId === (activeTournamentId ?? 0n)

  const { data: tournamentFinalized } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'tournamentFinalized',
    args: tournamentId > 0n ? [tournamentId] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10_000 },
  })

  const { data: positionsVersion } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'positionsVersion',
    query: { enabled: usesActivePredictionsEngine && Boolean(tournamentFinalized), refetchInterval: 10_000 },
  })

  const { data: rawRank } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'tokenPositions',
    args: usesActivePredictionsEngine && tournamentFinalized ? [tokenId] : undefined,
    query: { enabled: usesActivePredictionsEngine && Boolean(tournamentFinalized), refetchInterval: 10_000 },
  })

  const { data: rankVersion } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'tokenPositionsVersion',
    args: usesActivePredictionsEngine && tournamentFinalized ? [tokenId] : undefined,
    query: { enabled: usesActivePredictionsEngine && Boolean(tournamentFinalized), refetchInterval: 10_000 },
  })

  const rank = useMemo(() => {
    if (!usesActivePredictionsEngine) return null
    if (rawRank === undefined || rawRank === 0n) return null
    if (positionsVersion === undefined || rankVersion !== positionsVersion) return null
    return Number(rawRank)
  }, [positionsVersion, rankVersion, rawRank, usesActivePredictionsEngine])

  const { data: usdcPrize } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getClaimablePrizeAmount',
    args: tournamentId > 0n ? [tournamentId, tokenId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n && Boolean(tournamentFinalized), refetchInterval: 10_000 },
  })

  const { data: usdcClaimed, refetch: refetchUsdcClaimed } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'hasUserClaimed',
    args: tournamentId > 0n ? [tournamentId, tokenId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n && Boolean(tournamentFinalized), refetchInterval: 10_000 },
  })

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
        mapError: mapClaimError,
        onSuccess: async () => { await refetchUsdcClaimed() },
        logLabel: 'Claim USDC prize',
      },
    )
  }

  if (!tournamentFinalized) return null

  const usdcPrizeValue = usdcPrize ?? 0n

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

      {rank === null && usdcPrizeValue === 0n ? (
        <p className="text-sm" style={{ color: 'var(--text-disabled)' }}>
          {usesActivePredictionsEngine
            ? 'Este cartón no tiene posición en el marcador final.'
            : 'La posición de este cartón no está disponible en el motor activo, pero aún puedes reclamar si tiene premio.'}
        </p>
      ) : (
        <div
          className="rounded-lg p-4 flex flex-col gap-3"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Premio USDC
            </p>
            <p
              className="text-2xl font-bold mt-1"
              style={{
                fontFamily: 'var(--font-mono-custom)',
                color: usdcPrizeValue > 0n ? 'var(--accent-gold)' : 'var(--text-disabled)',
              }}
            >
              {usdcPrizeValue > 0n ? `${Number(formatUnits(usdcPrizeValue, 6)).toFixed(2)} USDC` : '— USDC'}
            </p>
          </div>
          <Button
            size="sm"
            className="w-full"
            disabled={usdcPrizeValue === 0n || Boolean(usdcClaimed) || usdcClaimWrite.isBusy}
            onClick={handleClaimUsdc}
            variant={usdcClaimed ? 'secondary' : 'default'}
          >
            {usdcClaimed
              ? '✓ Reclamado'
              : usdcClaimWrite.isBusy
                ? 'Reclamando…'
                : usdcPrizeValue === 0n
                  ? 'Sin premio'
                  : 'Reclamar USDC'}
          </Button>
        </div>
      )}
    </div>
  )
}
