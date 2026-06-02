import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI } from '../lib/contracts'
import { formatUnits } from 'viem'
import { computeSharedRanks } from '../lib/prize-payout'
import { useAppReadContracts } from '../hooks/useAppRead'
import { useStableValue } from '../hooks/useStableValue'
import { appChainId } from '../lib/chains'
import { appPublicClient } from '../lib/publicClient'

export const Route = createFileRoute('/leaderboard')({
  component: LeaderboardPage,
})

function LeaderboardPage() {
  const { isConnected, address: userAddress } = useAccount()
  const normalizedAddress = userAddress as `0x${string}` | undefined
  const [activeTournamentId, setActiveTournamentId] = useState<bigint>()
  const [nextTokenId, setNextTokenId] = useState<bigint>()
  const [positionsVersion, setPositionsVersion] = useState<bigint>()
  const [positionsUpdateInProgress, setPositionsUpdateInProgress] = useState<boolean>()
  const [userTokensRaw, setUserTokensRaw] = useState<bigint[]>()
  const [tournamentFinalized, setTournamentFinalized] = useState<boolean>()
  const [usdcPool, setUsdcPool] = useState<bigint>()

  const tournamentId = activeTournamentId ?? 0n

  const candidateTokenIds = useMemo(() => {
    const upperBound = Number(nextTokenId ?? 1n)
    return Array.from({ length: Math.max(upperBound - 1, 0) }, (_, i) => BigInt(i + 1))
  }, [nextTokenId])

  useEffect(() => {
    let cancelled = false

    const fetchBaseReads = async () => {
      try {
        const [nextActiveTournamentId, nextNextTokenId, nextPositionsVersion, nextPositionsUpdateInProgress] = await Promise.all([
          appPublicClient.readContract({
            address: CONTRACT_ADDRESSES.CARTON,
            abi: CARTON_ABI,
            functionName: 'activeTournamentId',
          }),
          appPublicClient.readContract({
            address: CONTRACT_ADDRESSES.CARTON,
            abi: CARTON_ABI,
            functionName: 'nextTokenId',
          }),
          appPublicClient.readContract({
            address: CONTRACT_ADDRESSES.PREDICTIONS,
            abi: PREDICTIONS_ABI,
            functionName: 'positionsVersion',
          }),
          appPublicClient.readContract({
            address: CONTRACT_ADDRESSES.PREDICTIONS,
            abi: PREDICTIONS_ABI,
            functionName: 'positionsUpdateInProgress',
          }),
        ])

        const [nextUserTokensRaw, nextTournamentFinalized, nextUsdcPool] = await Promise.all([
          normalizedAddress && isConnected
            ? appPublicClient.readContract({
                address: CONTRACT_ADDRESSES.CARTON,
                abi: CARTON_ABI,
                functionName: 'getUserTokens',
                args: [normalizedAddress],
              })
            : Promise.resolve([]),
          nextActiveTournamentId > 0n
            ? appPublicClient.readContract({
                address: CONTRACT_ADDRESSES.TREASURY,
                abi: TREASURY_ABI,
                functionName: 'tournamentFinalized',
                args: [nextActiveTournamentId],
              })
            : Promise.resolve(false),
          nextActiveTournamentId > 0n
            ? appPublicClient.readContract({
                address: CONTRACT_ADDRESSES.TREASURY,
                abi: TREASURY_ABI,
                functionName: 'getPrizePool',
                args: [nextActiveTournamentId, CONTRACT_ADDRESSES.USDC],
              })
            : Promise.resolve(undefined),
        ])

        if (cancelled) return

        setActiveTournamentId(nextActiveTournamentId)
        setNextTokenId(nextNextTokenId)
        setPositionsVersion(nextPositionsVersion)
        setPositionsUpdateInProgress(nextPositionsUpdateInProgress)
        setUserTokensRaw(Array.from(nextUserTokensRaw))
        setTournamentFinalized(nextTournamentFinalized)
        setUsdcPool(nextUsdcPool)
      } catch {
        if (cancelled) return
        setUsdcPool(undefined)
      }
    }

    void fetchBaseReads()
    const intervalId = window.setInterval(() => {
      void fetchBaseReads()
    }, 10_000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [isConnected, normalizedAddress])

  const candidateTokenIdsKey = useMemo(
    () => candidateTokenIds.map((tokenId) => tokenId.toString()).join(','),
    [candidateTokenIds],
  )

  const { data: positionData, refetch: refetchPositionData } = useAppReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: CONTRACT_ADDRESSES.PREDICTIONS,
      abi: PREDICTIONS_ABI,
      functionName: 'tokenPositions' as const,
      args: [tokenId] as const,
      chainId: appChainId,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchOnWindowFocus: false },
  })

  const { data: positionVersionData, refetch: refetchPositionVersionData } = useAppReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: CONTRACT_ADDRESSES.PREDICTIONS,
      abi: PREDICTIONS_ABI,
      functionName: 'tokenPositionsVersion' as const,
      args: [tokenId] as const,
      chainId: appChainId,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchOnWindowFocus: false },
  })

  const positionsSnapshotReady = useMemo(() => {
    if (candidateTokenIds.length === 0) return true
    if (positionsVersion === undefined) return false
    if (positionData?.length !== candidateTokenIds.length || positionVersionData?.length !== candidateTokenIds.length) {
      return false
    }

    return candidateTokenIds.every(
      (_, i) => typeof positionData?.[i]?.result === 'bigint' && typeof positionVersionData?.[i]?.result === 'bigint',
    )
  }, [candidateTokenIds, positionData, positionVersionData, positionsVersion])

  const livePositionsArray = useMemo(() => {
    if (!positionsSnapshotReady) return undefined

    return candidateTokenIds
      .map((tokenId, i) => ({
        tokenId,
        rank: positionData?.[i]?.result as bigint,
        version: positionVersionData?.[i]?.result as bigint,
      }))
      .filter((entry) => entry.rank > 0n && entry.version === (positionsVersion ?? 0n))
      .sort((a, b) => {
        if (a.rank !== b.rank) return a.rank < b.rank ? -1 : 1
        if (a.tokenId === b.tokenId) return 0
        return a.tokenId < b.tokenId ? -1 : 1
      })
  }, [candidateTokenIds, positionData, positionVersionData, positionsSnapshotReady, positionsVersion])

  const positionsArray = useStableValue(livePositionsArray, livePositionsArray !== undefined) ?? []

  const { data: usedData, refetch: refetchUsedData } = useAppReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: CONTRACT_ADDRESSES.PREDICTIONS,
      abi: PREDICTIONS_ABI,
      functionName: 'used' as const,
      args: [tokenId] as const,
      chainId: appChainId,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchOnWindowFocus: false },
  })

  useEffect(() => {
    if (!candidateTokenIds.length) return

    void refetchPositionData()
    void refetchPositionVersionData()
    void refetchUsedData()
  }, [candidateTokenIds.length, candidateTokenIdsKey, positionsVersion, refetchPositionData, refetchPositionVersionData, refetchUsedData])

  const usedSnapshotReady = useMemo(() => {
    if (candidateTokenIds.length === 0) return true
    if (usedData?.length !== candidateTokenIds.length) return false

    return candidateTokenIds.every((_, i) => typeof usedData?.[i]?.result === 'boolean')
  }, [candidateTokenIds, usedData])

  const liveUsedTokenIds = useMemo(() => {
    if (!usedSnapshotReady) return undefined
    return candidateTokenIds.filter((_, i) => Boolean(usedData?.[i]?.result))
  }, [candidateTokenIds, usedData, usedSnapshotReady])

  const usedTokenIds = useStableValue(liveUsedTokenIds, liveUsedTokenIds !== undefined) ?? []

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

  const usedTokenIdsKey = useMemo(
    () => usedTokenIds.map((tokenId) => tokenId.toString()).join(','),
    [usedTokenIds],
  )

  const { data: pointsData, refetch: refetchPointsData } = useAppReadContracts({
    contracts: pointsContracts,
    query: { enabled: pointsContracts.length > 0, refetchOnWindowFocus: false },
  })

  useEffect(() => {
    if (!pointsContracts.length) return

    void refetchPointsData()
  }, [pointsContracts.length, positionsVersion, refetchPointsData, usedTokenIdsKey])

  const pointsSnapshotReady = useMemo(() => {
    if (usedTokenIds.length === 0) return true
    if (pointsData?.length !== usedTokenIds.length) return false

    return usedTokenIds.every((_, i) => typeof pointsData?.[i]?.result === 'bigint')
  }, [pointsData, usedTokenIds])

  const livePointsByTokenId = useMemo(() => {
    if (!pointsSnapshotReady) return undefined

    const map = new Map<string, bigint>()
    usedTokenIds.forEach((tokenId, i) => {
      map.set(tokenId.toString(), pointsData?.[i]?.result as bigint)
    })
    return map
  }, [pointsData, pointsSnapshotReady, usedTokenIds])

  const pointsByTokenId = useStableValue(livePointsByTokenId, livePointsByTokenId !== undefined) ?? new Map<string, bigint>()

  const userTokenSet = useMemo<Set<string>>(
    () => new Set((userTokensRaw ?? []).map((id) => id.toString())),
    [userTokensRaw],
  )

  const usdcPrizeContracts = useMemo(
    () =>
      positionsArray.map(({ tokenId }) => ({
        address: CONTRACT_ADDRESSES.TREASURY,
        abi: TREASURY_ABI,
        functionName: 'getClaimablePrizeAmount' as const,
        args: [tournamentId, tokenId, CONTRACT_ADDRESSES.USDC] as const,
        chainId: appChainId,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [positionsArray.map((entry) => entry.tokenId.toString()).join(','), tournamentId],
  )

  const positionsArrayKey = useMemo(
    () => positionsArray.map((entry) => entry.tokenId.toString()).join(','),
    [positionsArray],
  )

  const { data: usdcPrizesData, refetch: refetchUsdcPrizesData } = useAppReadContracts({
    contracts: usdcPrizeContracts,
    query: { enabled: Boolean(tournamentFinalized) && usdcPrizeContracts.length > 0, refetchOnWindowFocus: false },
  })

  useEffect(() => {
    if (!tournamentFinalized || !usdcPrizeContracts.length) return

    void refetchUsdcPrizesData()
  }, [positionsArrayKey, positionsVersion, refetchUsdcPrizesData, tournamentFinalized, usdcPrizeContracts.length])

  const usdcPrizesSnapshotReady = useMemo(() => {
    if (!tournamentFinalized || positionsArray.length === 0) return true
    if (usdcPrizesData?.length !== positionsArray.length) return false

    return positionsArray.every((_, i) => typeof usdcPrizesData?.[i]?.result === 'bigint')
  }, [positionsArray, tournamentFinalized, usdcPrizesData])

  const liveUsdcPrizesByTokenId = useMemo(() => {
    if (!usdcPrizesSnapshotReady) return undefined

    const map = new Map<string, bigint>()
    if (!tournamentFinalized) return map

    positionsArray.forEach(({ tokenId }, i) => {
      map.set(tokenId.toString(), usdcPrizesData?.[i]?.result as bigint)
    })

    return map
  }, [positionsArray, tournamentFinalized, usdcPrizesData, usdcPrizesSnapshotReady])

  const usdcPrizesByTokenId = useStableValue(liveUsdcPrizesByTokenId, liveUsdcPrizesByTokenId !== undefined) ?? new Map<string, bigint>()

  const finalRowsReady = useMemo(
    () =>
      positionsArray.every((entry) => pointsByTokenId.has(entry.tokenId.toString()))
      && (!tournamentFinalized || positionsArray.every((entry) => usdcPrizesByTokenId.has(entry.tokenId.toString()))),
    [pointsByTokenId, positionsArray, tournamentFinalized, usdcPrizesByTokenId],
  )

  const liveFinalLeaderboardRows = useMemo(
    () =>
      finalRowsReady
        ? positionsArray.map(({ tokenId, rank }) => ({
            rank: Number(rank),
            tokenId,
            points: pointsByTokenId.get(tokenId.toString()) ?? 0n,
            usdcPrize: tournamentFinalized ? (usdcPrizesByTokenId.get(tokenId.toString()) ?? 0n) : undefined,
            isYours: userTokenSet.has(tokenId.toString()),
          }))
        : undefined,
    [finalRowsReady, pointsByTokenId, positionsArray, tournamentFinalized, usdcPrizesByTokenId, userTokenSet],
  )

  const finalLeaderboardRows = useStableValue(liveFinalLeaderboardRows, liveFinalLeaderboardRows !== undefined) ?? []

  const provisionalRowsReady = useMemo(
    () => usedTokenIds.every((tokenId) => pointsByTokenId.has(tokenId.toString())),
    [pointsByTokenId, usedTokenIds],
  )

  const liveProvisionalLeaderboardRows = useMemo(() => {
    if (!provisionalRowsReady) return undefined

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
  }, [pointsByTokenId, provisionalRowsReady, usedTokenIds, userTokenSet])

  const provisionalLeaderboardRows = useStableValue(
    liveProvisionalLeaderboardRows,
    liveProvisionalLeaderboardRows !== undefined,
  ) ?? []

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
          className="hidden md:grid grid-cols-[4rem_1fr_auto_auto] gap-3 px-4 py-2.5 text-xs font-medium uppercase tracking-wider"
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
              const isTop3 = row.rank <= 3
              const rankColor = row.rank === 1
                ? 'var(--accent-gold)'
                : row.rank === 2
                  ? '#cbd5e1'
                  : row.rank === 3
                    ? '#fdba74'
                    : 'var(--text-secondary)'

              return (
                <div
                  key={row.tokenId.toString()}
                  className="grid grid-cols-[4rem_1fr] md:grid-cols-[4rem_1fr_auto_auto] gap-3 items-center px-4 py-3 transition-colors"
                  style={{
                    background: row.isYours ? 'rgba(0,230,118,0.05)' : idx % 2 === 0 ? 'var(--bg-card)' : 'rgba(11,16,32,0.5)',
                    borderLeft: row.isYours ? '2px solid var(--accent-green)' : '2px solid transparent',
                    borderBottom: idx < leaderboardRows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center">
                    <span
                      className="text-sm font-bold rounded-full px-2 py-1"
                      style={{
                        background: 'var(--bg-elevated)',
                        color: rankColor,
                        fontFamily: 'var(--font-mono-custom)',
                      }}
                    >
                      #{row.rank}
                    </span>
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
                      Cartón {row.tokenId.toString()}
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
