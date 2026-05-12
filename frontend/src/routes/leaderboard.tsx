import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI } from '../lib/contracts'
import { formatUnits } from 'viem'
import { computeSharedRanks } from '../lib/prize-payout'

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

  const { data: positionsUpdateInProgress } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'positionsUpdateInProgress',
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
        .sort((a, b) => {
          if (a.rank !== b.rank) return a.rank < b.rank ? -1 : 1
          if (a.tokenId === b.tokenId) return 0
          return a.tokenId < b.tokenId ? -1 : 1
        }),
    [candidateTokenIds, positionData, positionVersionData, positionsVersion],
  )

  const { data: usedData } = useReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: CONTRACT_ADDRESSES.PREDICTIONS,
      abi: PREDICTIONS_ABI,
      functionName: 'used' as const,
      args: [tokenId] as const,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchInterval: 10_000 },
  })

  const usedTokenIds = useMemo(
    () => candidateTokenIds.filter((_, i) => Boolean(usedData?.[i]?.result)),
    [candidateTokenIds, usedData],
  )

  const pointsContracts = useMemo(
    () =>
      usedTokenIds.map((tokenId) => ({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'calculateTotalPoints' as const,
        args: [tokenId] as const,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [usedTokenIds.map((tokenId) => tokenId.toString()).join(',')],
  )

  const { data: pointsData } = useReadContracts({
    contracts: pointsContracts,
    query: { enabled: pointsContracts.length > 0, refetchInterval: 10_000 },
  })

  const pointsByTokenId = useMemo(() => {
    const map = new Map<string, bigint>()
    usedTokenIds.forEach((tokenId, i) => {
      map.set(tokenId.toString(), (pointsData?.[i]?.result as bigint | undefined) ?? 0n)
    })
    return map
  }, [pointsData, usedTokenIds])

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

  const { data: tournamentFinalized } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'tournamentFinalized',
    args: tournamentId > 0n ? [tournamentId] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10_000 },
  })

  const { data: usdcPool } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getPrizePool',
    args: tournamentId > 0n ? [tournamentId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10_000 },
  })

  const usdcPrizeContracts = useMemo(
    () =>
      positionsArray.map(({ tokenId }) => ({
        address: CONTRACT_ADDRESSES.TREASURY,
        abi: TREASURY_ABI,
        functionName: 'getClaimablePrizeAmount' as const,
        args: [tournamentId, tokenId, CONTRACT_ADDRESSES.USDC] as const,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [positionsArray.map((entry) => entry.tokenId.toString()).join(','), tournamentId],
  )

  const { data: usdcPrizesData } = useReadContracts({
    contracts: usdcPrizeContracts,
    query: { enabled: Boolean(tournamentFinalized) && usdcPrizeContracts.length > 0, refetchInterval: 10_000 },
  })

  const finalLeaderboardRows = useMemo(
    () =>
      positionsArray.map(({ tokenId, rank }, i) => ({
        rank: Number(rank),
        tokenId,
        points: pointsByTokenId.get(tokenId.toString()) ?? 0n,
        usdcPrize: tournamentFinalized ? ((usdcPrizesData?.[i]?.result as bigint | undefined) ?? 0n) : undefined,
        isYours: userTokenSet.has(tokenId.toString()),
      })),
    [pointsByTokenId, positionsArray, tournamentFinalized, usdcPrizesData, userTokenSet],
  )

  const provisionalLeaderboardRows = useMemo(() => {
    const sortedEntries = usedTokenIds
      .map((tokenId) => ({ tokenId, points: pointsByTokenId.get(tokenId.toString()) ?? 0n }))
      .sort((a, b) => {
        if (a.points !== b.points) return a.points > b.points ? -1 : 1
        if (a.tokenId === b.tokenId) return 0
        return a.tokenId < b.tokenId ? -1 : 1
      })

    return computeSharedRanks(sortedEntries).map((entry) => ({
      rank: entry.rank,
      tokenId: entry.tokenId,
      points: entry.points,
      usdcPrize: undefined,
      isYours: userTokenSet.has(entry.tokenId.toString()),
    }))
  }, [pointsByTokenId, usedTokenIds, userTokenSet])

  const isFinalLeaderboard = positionsArray.length > 0 && !positionsUpdateInProgress

  const leaderboardRows = useMemo(
    () => (isFinalLeaderboard ? finalLeaderboardRows : provisionalLeaderboardRows),
    [finalLeaderboardRows, isFinalLeaderboard, provisionalLeaderboardRows],
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
    const formatted = Number(formatUnits(amount, decimals)).toFixed(2)
    return `${formatted} ${symbol}`
  }

  const statCards = [
      {
        label: 'Jugadores',
        value: leaderboardRows.length > 0 ? String(leaderboardRows.length) : '—',
      },
    {
      label: 'Pool USDC',
      value: usdcPool !== undefined ? `${Number(formatUnits(usdcPool, 6)).toFixed(2)}` : '—',
      unit: 'USDC',
      sub: tournamentFinalized ? 'Finalizado' : isFinalLeaderboard ? 'Casi final' : 'Parcial',
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
          {isFinalLeaderboard
            ? 'Tabla final basada en los puestos publicados onchain'
            : 'Tabla provisional calculada en frontend con los resultados cargados hasta ahora'}
        </p>
      </div>

      {!isFinalLeaderboard && leaderboardRows.length > 0 && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.18)', color: 'rgb(125, 211, 252)' }}
        >
          Clasificación provisional: se ordena solo por puntos acumulados hasta ahora. Si hay empate, el puesto se comparte.
        </div>
      )}

      {/* ─── Stats cards ─── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
          className="hidden md:grid grid-cols-[2.5rem_1fr_auto_auto] gap-3 px-4 py-2.5 text-xs font-medium uppercase tracking-wider"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}
        >
          <div>#</div>
          <div>Cartón</div>
          <div className="text-right">Puntos</div>
          <div className="text-right">USDC</div>
        </div>

        {leaderboardRows.length === 0 ? (
          <div className="py-16 text-center" style={{ background: 'var(--bg-card)' }}>
            <p className="font-display text-xl font-bold uppercase" style={{ color: 'var(--text-disabled)' }}>
              Sin clasificación aún
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-disabled)' }}>
              {usedTokenIds.length === 0
                ? 'Todavía no hay cartones con predicciones enviadas.'
                : 'Aún no hay puntos para mostrar o falta publicar más resultados.'}
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
                  className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[2.5rem_1fr_auto_auto] gap-3 items-center px-4 py-3 transition-colors"
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
