import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI, ZERO_ADDRESS } from '../lib/contracts'
import { formatEther, formatUnits } from 'viem'

export const Route = createFileRoute('/leaderboard')({
  component: LeaderboardPage,
})

function LeaderboardPage() {
  const { isConnected, address: userAddress } = useAccount()
  const normalizedAddress = userAddress as `0x${string}` | undefined

  const { data: activeTournamentId } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'activeTournamentId',
    query: { refetchInterval: 10_000 },
  })
  const tournamentId = activeTournamentId ?? 0n

  const { data: nextTokenId } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'nextTokenId',
    query: { refetchInterval: 10_000 },
  })

  const candidateTokenIds = useMemo(() => {
    const upperBound = Number(nextTokenId ?? 1n)
    return Array.from({ length: Math.max(upperBound - 1, 0) }, (_, i) => BigInt(i + 1))
  }, [nextTokenId])

  const { data: positionsVersion } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'positionsVersion',
    query: { refetchInterval: 10_000 },
  })

  const { data: positionData } = useReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: CONTRACT_ADDRESSES.PREDICTIONS,
      abi: PREDICTIONS_ABI,
      functionName: 'tokenPositions' as const,
      args: [tokenId] as const,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchInterval: 10_000 },
  })

  const { data: positionVersionData } = useReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: CONTRACT_ADDRESSES.PREDICTIONS,
      abi: PREDICTIONS_ABI,
      functionName: 'tokenPositionsVersion' as const,
      args: [tokenId] as const,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchInterval: 10_000 },
  })

  const positionsArray = useMemo(
    () =>
      candidateTokenIds
        .map((tokenId, i) => ({
          tokenId,
          rank: (positionData?.[i]?.result as bigint | undefined) ?? 0n,
          version: (positionVersionData?.[i]?.result as bigint | undefined) ?? 0n,
        }))
        .filter((entry) => entry.rank > 0n && entry.version === (positionsVersion ?? 0n))
        .sort((a, b) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0))
        .map((entry) => entry.tokenId),
    [candidateTokenIds, positionData, positionVersionData, positionsVersion],
  )

  const pointsContracts = useMemo(
    () =>
      positionsArray.map((tokenId) => ({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'calculateTotalPoints' as const,
        args: [tokenId] as const,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [positionsArray.join(',')],
  )

  const { data: pointsData } = useReadContracts({
    contracts: pointsContracts,
    query: { enabled: pointsContracts.length > 0, refetchInterval: 10_000 },
  })

  const { data: userTokensRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'getUserTokens',
    args: normalizedAddress ? [normalizedAddress] : undefined,
    query: {
      enabled: Boolean(normalizedAddress) && isConnected,
      refetchInterval: 10_000,
      refetchOnWindowFocus: true,
    },
  })
  const userTokenSet = useMemo<Set<string>>(
    () => new Set((userTokensRaw ?? []).map((id) => id.toString())),
    [userTokensRaw],
  )

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

  const { data: ethPool } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getPrizePool',
    args: tournamentId > 0n ? [tournamentId, ZERO_ADDRESS] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10_000 },
  })

  const { data: usdcPool } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getPrizePool',
    args: tournamentId > 0n ? [tournamentId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10_000 },
  })

  const ethPrizeContracts = useMemo(
    () =>
      positionsArray.map((_, i) => ({
        address: CONTRACT_ADDRESSES.TREASURY,
        abi: TREASURY_ABI,
        functionName: 'getUserPrizeAmount' as const,
        args: [tournamentId, ZERO_ADDRESS, BigInt(i + 1)] as const,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [positionsArray.join(','), tournamentId],
  )

  const usdcPrizeContracts = useMemo(
    () =>
      positionsArray.map((_, i) => ({
        address: CONTRACT_ADDRESSES.TREASURY,
        abi: TREASURY_ABI,
        functionName: 'getUserPrizeAmount' as const,
        args: [tournamentId, CONTRACT_ADDRESSES.USDC, BigInt(i + 1)] as const,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [positionsArray.join(','), tournamentId],
  )

  const { data: ethPrizesData } = useReadContracts({
    contracts: ethPrizeContracts,
    query: { enabled: Boolean(ethClosed) && ethPrizeContracts.length > 0, refetchInterval: 10_000 },
  })

  const { data: usdcPrizesData } = useReadContracts({
    contracts: usdcPrizeContracts,
    query: { enabled: Boolean(usdcClosed) && usdcPrizeContracts.length > 0, refetchInterval: 10_000 },
  })

  const leaderboardRows = useMemo(
    () =>
      positionsArray.map((tokenId, i) => ({
        rank: i + 1,
        tokenId,
        points: (pointsData?.[i]?.result as bigint | undefined) ?? 0n,
        ethPrize: ethClosed ? ((ethPrizesData?.[i]?.result as bigint | undefined) ?? 0n) : undefined,
        usdcPrize: usdcClosed ? ((usdcPrizesData?.[i]?.result as bigint | undefined) ?? 0n) : undefined,
        isYours: userTokenSet.has(tokenId.toString()),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [positionsArray.join(','), pointsData, ethPrizesData, usdcPrizesData, userTokenSet, ethClosed, usdcClosed],
  )

  const yourBestRank = useMemo(() => {
    const yourRows = leaderboardRows.filter((r) => r.isYours)
    if (yourRows.length === 0) return null
    return Math.min(...yourRows.map((r) => r.rank))
  }, [leaderboardRows])

  const rankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const formatPrize = (amount: bigint, decimals: number, symbol: string) => {
    if (amount === 0n) return '—'
    const formatted =
      decimals === 18
        ? Number(formatEther(amount)).toFixed(4)
        : Number(formatUnits(amount, decimals)).toFixed(2)
    return `${formatted} ${symbol}`
  }

  const statCards = [
    {
      label: 'Jugadores',
      value: positionsArray.length > 0 ? String(positionsArray.length) : '—',
    },
    {
      label: 'Pool ETH',
      value: ethPool !== undefined ? `${Number(formatEther(ethPool)).toFixed(3)}` : '—',
      unit: 'ETH',
      sub: ethClosed ? 'Cerrado' : 'En vivo',
    },
    {
      label: 'Pool USDC',
      value: usdcPool !== undefined ? `${Number(formatUnits(usdcPool, 6)).toFixed(2)}` : '—',
      unit: 'USDC',
      sub: usdcClosed ? 'Cerrado' : 'En vivo',
    },
    {
      label: 'Tu mejor puesto',
      value: yourBestRank !== null ? `#${yourBestRank}` : '—',
      sub: isConnected ? 'Entre tus cartones' : 'Conecta wallet',
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ─── Page header ─── */}
      <div>
        <h1 className="font-display text-3xl font-black uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
          Clasificación
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Ranking basado en precisión de predicciones
        </p>
      </div>

      {/* ─── Stats cards ─── */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>
              {card.label}
            </p>
            <p className="font-display text-3xl font-black leading-none" style={{ color: 'var(--text-primary)' }}>
              {card.value}
              {card.unit && (
                <span className="text-base font-sans font-normal ml-1" style={{ color: 'var(--text-secondary)' }}>
                  {card.unit}
                </span>
              )}
            </p>
            {card.sub && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-disabled)' }}>
                {card.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ─── Leaderboard table ─── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border-color)' }}
      >
        {/* Table header */}
        <div
          className="hidden md:grid grid-cols-[2.5rem_1fr_auto_auto_auto] gap-3 px-4 py-2.5 text-xs font-medium uppercase tracking-wider"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}
        >
          <div>#</div>
          <div>Cartón</div>
          <div className="text-right">Puntos</div>
          <div className="text-right">ETH</div>
          <div className="text-right">USDC</div>
        </div>

        {positionsArray.length === 0 ? (
          <div className="py-16 text-center" style={{ background: 'var(--bg-card)' }}>
            <p className="font-display text-xl font-bold uppercase" style={{ color: 'var(--text-disabled)' }}>
              Sin clasificación aún
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-disabled)' }}>
              El admin publicará los resultados al finalizar el torneo.
            </p>
          </div>
        ) : (
          <div>
            {leaderboardRows.map((row, idx) => {
              const icon = rankIcon(row.rank)
              const isTop3 = row.rank <= 3
              return (
                <div
                  key={row.tokenId.toString()}
                  className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[2.5rem_1fr_auto_auto_auto] gap-3 items-center px-4 py-3 transition-colors"
                  style={{
                    background: row.isYours ? 'rgba(0,230,118,0.05)' : idx % 2 === 0 ? 'var(--bg-card)' : 'rgba(11,16,32,0.5)',
                    borderLeft: row.isYours ? '2px solid var(--accent-green)' : '2px solid transparent',
                    borderBottom: idx < leaderboardRows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center">
                    {icon ? (
                      <span className="text-xl">{icon}</span>
                    ) : (
                      <span
                        className="text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center"
                        style={{
                          background: 'var(--bg-elevated)',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono-custom)',
                        }}
                      >
                        {row.rank}
                      </span>
                    )}
                  </div>

                  {/* Token info */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        fontFamily: 'var(--font-mono-custom)',
                        color: row.isYours ? 'var(--accent-green)' : isTop3 ? 'var(--accent-gold)' : 'var(--text-primary)',
                      }}
                    >
                      #{row.tokenId.toString()}
                    </span>
                    {row.isYours && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(0,230,118,0.12)', color: 'var(--accent-green)' }}
                      >
                        tú
                      </span>
                    )}
                    <span className="text-xs md:hidden" style={{ color: 'var(--text-secondary)' }}>
                      {row.points.toString()} pts
                    </span>
                  </div>

                  {/* Points */}
                  <div
                    className="hidden md:block text-right font-semibold tabular-nums"
                    style={{
                      fontFamily: 'var(--font-mono-custom)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {row.points.toString()}
                  </div>

                  {/* ETH Prize */}
                  <div
                    className="hidden md:block text-right text-sm tabular-nums"
                    style={{
                      fontFamily: 'var(--font-mono-custom)',
                      color: row.ethPrize && row.ethPrize > 0n ? 'var(--accent-gold)' : 'var(--text-disabled)',
                    }}
                  >
                    {row.ethPrize !== undefined ? formatPrize(row.ethPrize, 18, 'ETH') : '—'}
                  </div>

                  {/* USDC Prize */}
                  <div
                    className="hidden md:block text-right text-sm tabular-nums"
                    style={{
                      fontFamily: 'var(--font-mono-custom)',
                      color: row.usdcPrize && row.usdcPrize > 0n ? 'var(--accent-blue)' : 'var(--text-disabled)',
                    }}
                  >
                    {row.usdcPrize !== undefined ? formatPrize(row.usdcPrize, 6, 'USDC') : '—'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
