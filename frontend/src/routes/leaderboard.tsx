import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI, ZERO_ADDRESS } from '../lib/contracts'
import { formatEther, formatUnits } from 'viem'

export const Route = createFileRoute('/leaderboard')({
  component: LeaderboardPage,
})

function LeaderboardPage() {
  const { isConnected, address: userAddress } = useAccount()
  const normalizedAddress = userAddress as `0x${string}` | undefined

  // Step 1 — Tournament context
  const { data: activeTournamentId } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'activeTournamentId',
    query: { refetchInterval: 10_000 },
  })
  const tournamentId = activeTournamentId ?? 0n

  // Step 2 — Discover minted token ids
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

  // Step 3 — Rebuild ordered positions from tokenPositions mapping
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

  // Step 4 — Points per token (batch)
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

  // Step 4 — User's tokens
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

  // Step 5 — Tournament closed status
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

  // Step 6 — Prize pools
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

  // Step 7 — Prize per position (batch, only if closed)
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
    query: {
      enabled: Boolean(ethClosed) && ethPrizeContracts.length > 0,
      refetchInterval: 10_000,
    },
  })

  const { data: usdcPrizesData } = useReadContracts({
    contracts: usdcPrizeContracts,
    query: {
      enabled: Boolean(usdcClosed) && usdcPrizeContracts.length > 0,
      refetchInterval: 10_000,
    },
  })

  // Assemble leaderboard rows
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

  // Your best rank
  const yourBestRank = useMemo(() => {
    const yourRows = leaderboardRows.filter((r) => r.isYours)
    if (yourRows.length === 0) return null
    return Math.min(...yourRows.map((r) => r.rank))
  }, [leaderboardRows])

  const rankBadgeClass = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-white'
    if (rank === 2) return 'bg-gray-400 text-white'
    if (rank === 3) return 'bg-amber-600 text-white'
    if (rank === 4) return 'bg-blue-500 text-white'
    return 'bg-gray-200 text-gray-600'
  }

  const formatPrize = (amount: bigint, decimals: number, symbol: string) => {
    if (amount === 0n) return `-- ${symbol}`
    const formatted =
      decimals === 18
        ? Number(formatEther(amount)).toFixed(4)
        : Number(formatUnits(amount, decimals)).toFixed(2)
    return `${formatted} ${symbol}`
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Leaderboard</h2>
        <p className="text-gray-600 dark:text-gray-300">
          See how players rank based on their prediction accuracy
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positionsArray.length}</div>
            <p className="text-xs text-muted-foreground">Active participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">ETH Prize Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ethPool !== undefined ? `${Number(formatEther(ethPool)).toFixed(4)} ETH` : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              {ethClosed ? 'Closed — prizes locked' : 'Live pool'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">USDC Prize Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usdcPool !== undefined
                ? `${Number(formatUnits(usdcPool, 6)).toFixed(2)} USDC`
                : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              {usdcClosed ? 'Closed — prizes locked' : 'Live pool'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Your Best Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yourBestRank !== null ? `#${yourBestRank}` : '—'}</div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'Among your cartones' : 'Connect wallet to see'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Leaderboard */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Tournament Rankings</CardTitle>
          <CardDescription>Rankings based on prediction accuracy and points earned</CardDescription>
        </CardHeader>
        <CardContent>
          {positionsArray.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">Positions not set yet</p>
              <p className="text-sm mt-1">
                The tournament admin will set final rankings once all games are complete.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header */}
              <div className="hidden md:grid grid-cols-[3rem_1fr_auto_auto_auto_auto] gap-4 px-4 text-xs text-gray-500 font-medium uppercase tracking-wide">
                <div>Rank</div>
                <div>Token</div>
                <div className="text-right">Points</div>
                <div className="text-right">ETH Prize</div>
                <div className="text-right">USDC Prize</div>
                <div />
              </div>

              {leaderboardRows.map((row) => (
                <div
                  key={row.tokenId.toString()}
                  className={`grid grid-cols-[3rem_1fr] md:grid-cols-[3rem_1fr_auto_auto_auto_auto] gap-4 items-center p-4 rounded-lg border ${
                    row.rank <= 4
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-950/30 dark:to-orange-950/30 dark:border-yellow-800'
                      : 'bg-gray-50 dark:bg-gray-900/50'
                  }`}
                >
                  {/* Rank badge */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rankBadgeClass(row.rank)}`}
                  >
                    {row.rank}
                  </div>

                  {/* Token info */}
                  <div>
                    <div className="font-mono text-sm font-semibold">Token #{row.tokenId.toString()}</div>
                    <div className="text-xs text-gray-500 md:hidden">{row.points.toString()} pts</div>
                  </div>

                  {/* Points */}
                  <div className="hidden md:block text-right font-semibold tabular-nums">
                    {row.points.toString()}
                  </div>

                  {/* ETH Prize */}
                  <div className="hidden md:block text-right text-sm font-medium text-green-700 dark:text-green-400 tabular-nums">
                    {row.ethPrize !== undefined ? formatPrize(row.ethPrize, 18, 'ETH') : '—'}
                  </div>

                  {/* USDC Prize */}
                  <div className="hidden md:block text-right text-sm font-medium text-blue-700 dark:text-blue-400 tabular-nums">
                    {row.usdcPrize !== undefined ? formatPrize(row.usdcPrize, 6, 'USDC') : '—'}
                  </div>

                  {/* You badge */}
                  <div className="flex justify-end">
                    {row.isYours && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
