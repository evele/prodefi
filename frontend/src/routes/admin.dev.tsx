import { createFileRoute } from '@tanstack/react-router'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { formatUnits } from 'viem'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { useEffect, useMemo, useState } from 'react'
import { CARTON_ABI, CONTRACT_ADDRESSES, PREDICTIONS_ABI, TREASURY_ABI } from '../lib/contracts'
import { toast } from 'sonner'
import { computeTeamsHash, teams2026, teamsById } from '../lib/teams'
import { teams2026Config } from '../lib/teams2026.config'
import { buildAllGroupGames } from '../lib/games'
import { useSimulatedContractWrite } from '../hooks/useSimulatedContractWrite'
import {
  FIXED_PRIZE_DISTRIBUTION_INPUT,
  PRIZE_BANDS,
  computeFinalPrizeAmounts,
  computeSharedRanks,
  parseLeaderboardCsv,
  parsePrizeDistributionInput,
} from '../lib/prize-payout'
import { mapAdminError } from '../lib/transaction-errors'

export const Route = createFileRoute('/admin/dev')({
  component: AdminPage,
})

function useAdminWrite() {
  const write = useSimulatedContractWrite()

  const execute = (
    parameters: Parameters<typeof write.simulateAndSend>[0],
    options: Omit<Parameters<typeof write.simulateAndSend>[1], 'mapError'>,
  ) => {
    return write.simulateAndSend(parameters, {
      ...options,
      mapError: mapAdminError,
    })
  }

  return {
    ...write,
    execute,
  }
}

// --- Set Results Section ---

function SetResultsSection({ isOwner }: { isOwner: boolean }) {
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const carton = CONTRACT_ADDRESSES.CARTON
  const treasury = CONTRACT_ADDRESSES.TREASURY
  const { execute, isBusy } = useAdminWrite()
  const { games } = useMemo(() => buildAllGroupGames(), [])
  const [gameSearch, setGameSearch] = useState('')
  const demoScores = useMemo<[number, number][]>(
    () => [[0, 0], [1, 0], [0, 1], [1, 1], [2, 0], [0, 2], [2, 1], [1, 2], [2, 2], [3, 1], [1, 3], [3, 2]],
    [],
  )

  const { data: activeTournamentId } = useReadContract({
    address: carton,
    abi: CARTON_ABI,
    functionName: 'activeTournamentId',
    query: { refetchInterval: 10_000 },
  })

  const { data: tournamentFinalized } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'tournamentFinalized',
    args: activeTournamentId !== undefined ? [activeTournamentId] : undefined,
    query: {
      enabled: activeTournamentId !== undefined,
      refetchInterval: 10_000,
    },
  })

  const { data: gamesData, refetch: refetchGamesData } = useReadContracts({
    contracts: games.map((game) => ({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'games' as const,
      args: [game.id] as const,
    })),
    query: { enabled: games.length > 0, refetchInterval: 10_000 },
  })

  const storedGamesById = useMemo(() => {
    return new Map(
      games.map((game, index) => {
        const result = gamesData?.[index]?.result as
          | { id: number; result: [number, number]; set: boolean }
          | undefined
        return [game.id, result]
      }),
    )
  }, [games, gamesData])

  // Local state for goal inputs per game
  const [goals, setGoals] = useState<Record<number, [string, string]>>({})

  const gameSearchEntries = useMemo(
    () => games.map((game) => {
      const team1 = teamsById[game.team1] ?? String(game.team1)
      const team2 = teamsById[game.team2] ?? String(game.team2)
      const label = `#${game.id} ${team1} vs ${team2}`
      const haystack = `${game.id} ${team1} ${team2} ${label}`.toLowerCase()
      return {
        game,
        label,
        haystack,
      }
    }),
    [games],
  )

  const filteredGames = useMemo(() => {
    const query = gameSearch.trim().toLowerCase()
    if (!query) return gameSearchEntries

    const normalizedQuery = query.startsWith('#') ? query.slice(1) : query
    const exactId = Number(normalizedQuery)
    if (!Number.isNaN(exactId) && exactId > 0) {
      const exactMatch = gameSearchEntries.find((entry) => entry.game.id === exactId)
      if (exactMatch) return [exactMatch]
    }

    return gameSearchEntries.filter((entry) => entry.haystack.includes(query))
  }, [gameSearch, gameSearchEntries])

  const getGoals = (gameId: number): [string, string] => goals[gameId] ?? ['', '']

  const setGoal = (gameId: number, team: 0 | 1, value: string) => {
    setGoals((prev) => {
      const current = prev[gameId] ?? ['', '']
      const updated: [string, string] = [...current]
      updated[team] = value
      return { ...prev, [gameId]: updated }
    })
  }

  const autofillVisibleGames = () => {
    if (filteredGames.length === 0) {
      toast.error('No hay partidos visibles para autocompletar.')
      return
    }

    setGoals((prev) => {
      const next = { ...prev }
      for (const { game } of filteredGames) {
        const [team1Goals, team2Goals] = demoScores[Math.floor(Math.random() * demoScores.length)]
        next[game.id] = [String(team1Goals), String(team2Goals)]
      }
      return next
    })

    toast.success(`Se cargaron resultados de prueba para ${filteredGames.length} partido${filteredGames.length === 1 ? '' : 's'}.`)
  }

  const submitResult = (gameId: number) => {
    if (tournamentFinalized) {
      toast.error('This tournament is finalized. Results can no longer be corrected.')
      return
    }

    const [g1, g2] = getGoals(gameId)
    const t1 = Number(g1)
    const t2 = Number(g2)
    if (isNaN(t1) || isNaN(t2) || t1 < 0 || t2 < 0 || !Number.isInteger(t1) || !Number.isInteger(t2)) {
      toast.error('Enter valid goal numbers')
      return
    }

    const existingGame = storedGamesById.get(gameId)
    const hasStoredResult = Boolean(existingGame?.set)

    void execute(
      {
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: hasStoredResult ? 'updateResults' : 'setResults',
        args: [gameId, t1, t2],
      },
      {
        toastId: `admin-set-results-${gameId}`,
        pendingMessage: 'Waiting for result update confirmation...',
        successMessage: hasStoredResult
          ? `Result corrected for game #${gameId}.`
          : `Result saved for game #${gameId}.`,
        revertedMessage: 'Result update was rejected on-chain.',
        logLabel: hasStoredResult ? 'Admin update results' : 'Admin set results',
        onSuccess: async () => {
          await refetchGamesData()
        },
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Results</CardTitle>
        <CardDescription>
          Set actual match results or correct them before the tournament is finalized.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tournamentFinalized && (
          <div className="mb-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            This tournament is finalized. Result corrections are locked.
          </div>
        )}
        <div className="mb-3 space-y-2">
          <div className="flex gap-2">
            <Input
              list="admin-game-search-options"
              value={gameSearch}
              onChange={(e) => setGameSearch(e.target.value)}
              placeholder="Buscar partido por #id, equipo o cruce"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setGameSearch('')}
              disabled={gameSearch.length === 0}
            >
              Limpiar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={autofillVisibleGames}
              disabled={filteredGames.length === 0 || Boolean(tournamentFinalized)}
            >
              Autocompletar
            </Button>
          </div>
          <datalist id="admin-game-search-options">
            {gameSearchEntries.map((entry) => (
              <option key={`game-search-${entry.game.id}`} value={entry.label} />
            ))}
          </datalist>
          <p className="text-xs text-gray-500">
            {filteredGames.length} de {games.length} partidos visibles
          </p>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredGames.map(({ game, label }) => (
            <div key={game.id} className="flex items-center gap-2 text-sm">
              <span className="w-8 text-gray-500">#{game.id}</span>
              <span className="w-28 truncate text-right">{teamsById[game.team1] ?? game.team1}</span>
              <Input
                type="number"
                min={0}
                className="w-14 text-center"
                value={getGoals(game.id)[0]}
                onChange={(e) => setGoal(game.id, 0, e.target.value)}
                placeholder="-"
              />
              <span>vs</span>
              <Input
                type="number"
                min={0}
                className="w-14 text-center"
                value={getGoals(game.id)[1]}
                onChange={(e) => setGoal(game.id, 1, e.target.value)}
                placeholder="-"
              />
              <span className="w-28 truncate">{teamsById[game.team2] ?? game.team2}</span>
              <span className="w-28 text-xs text-gray-500">
                {storedGamesById.get(game.id)?.set
                  ? `${storedGamesById.get(game.id)?.result[0]}-${storedGamesById.get(game.id)?.result[1]}`
                  : 'not set'}
              </span>
              <Button
                size="sm"
                onClick={() => submitResult(game.id)}
                disabled={!isOwner || isBusy || Boolean(tournamentFinalized)}
              >
                {storedGamesById.get(game.id)?.set ? 'Update' : 'Set'}
              </Button>
              <span className="hidden xl:inline w-52 truncate text-xs text-gray-400">{label}</span>
            </div>
          ))}
          {filteredGames.length === 0 && (
            <div className="rounded-md border border-dashed border-gray-300 px-3 py-4 text-sm text-gray-500">
              No se encontraron partidos para esa búsqueda.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// --- Set Official Winners Section ---

function SetOfficialWinnersSection({ isOwner }: { isOwner: boolean }) {
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const { execute, isBusy } = useAdminWrite()
  const teamsAlphabetical = useMemo(
    () => [...teams2026].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })),
    [],
  )

  const { data: officialWinnersData } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'officialWinners',
    query: { refetchInterval: 10_000 },
  })

  const winnersAlreadySet = officialWinnersData
    ? (officialWinnersData as unknown as [number[], boolean])[1]
    : false
  const currentWinners = officialWinnersData
    ? (officialWinnersData as unknown as [number[], boolean])[0]
    : null

  const [selected, setSelected] = useState<[string, string, string, string]>(['', '', '', ''])
  const labels = ['1st', '2nd', '3rd', '4th']

  const setWinner = (index: number, value: string) => {
    setSelected((prev) => {
      const next = [...prev] as [string, string, string, string]
      next[index] = value
      return next
    })
  }

  const submit = () => {
    const ids = selected.map(Number)
    if (ids.some((id) => isNaN(id) || id <= 0 || id > 48)) {
      toast.error('Select valid teams (1-48)')
      return
    }
    const unique = new Set(ids)
    if (unique.size !== 4) {
      toast.error('All 4 teams must be different')
      return
    }
    void execute(
      {
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: 'setOfficialWinners',
        args: [ids as [number, number, number, number]],
      },
      {
        toastId: 'admin-set-official-winners',
        pendingMessage: 'Waiting for official winners confirmation...',
        successMessage: 'Official winners saved.',
        revertedMessage: 'Official winners were rejected on-chain.',
        logLabel: 'Admin set official winners',
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Official Winners</CardTitle>
        <CardDescription>Declare the top 4 teams (one-time, irreversible)</CardDescription>
      </CardHeader>
      <CardContent>
        {winnersAlreadySet && currentWinners ? (
          <div className="space-y-1 text-sm">
            <div className="text-green-600 font-medium mb-2">Winners already set:</div>
            {(currentWinners as number[]).map((id, i) => (
              <div key={i}>
                {labels[i]}: {teamsById[id] ?? `Team ${id}`}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {labels.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-8 font-medium">{label}</span>
                <select
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selected[i]}
                  onChange={(e) => setWinner(i, e.target.value)}
                >
                  <option value="">Select team...</option>
                   {teamsAlphabetical.map((t) => (
                     <option key={t.id} value={t.id}>
                       {t.name} (#{t.id})
                     </option>
                   ))}
                </select>
              </div>
            ))}
            <Button onClick={submit} disabled={!isOwner || isBusy || winnersAlreadySet}>
              {isBusy ? 'Submitting...' : 'Set Winners'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// --- Set Positions Section ---

function SetPositionsSection({ isOwner }: { isOwner: boolean }) {
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const carton = CONTRACT_ADDRESSES.CARTON
  const { execute, isBusy } = useAdminWrite()

  const { data: nextTokenId } = useReadContract({
    address: carton,
    abi: CARTON_ABI,
    functionName: 'nextTokenId',
    query: { refetchInterval: 10_000 },
  })

  const candidateTokenIds = useMemo(() => {
    const upperBound = Number(nextTokenId ?? 1n)
    return Array.from({ length: Math.max(upperBound - 1, 0) }, (_, i) => BigInt(i + 1))
  }, [nextTokenId])

  const { data: positionsVersion } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'positionsVersion',
    query: { refetchInterval: 10_000 },
  })

  const { data: positionData } = useReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'tokenPositions' as const,
      args: [tokenId] as const,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchInterval: 10_000 },
  })

  const { data: positionVersionData } = useReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'tokenPositionsVersion' as const,
      args: [tokenId] as const,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchInterval: 10_000 },
  })

  const [csvInput, setCsvInput] = useState('')

  const submit = () => {
    const { entries, error } = parseLeaderboardCsv(csvInput)
    if (error) {
      toast.error(error)
      return
    }

    const ids = entries.map((entry) => entry.tokenId)
    const points = entries.map((entry) => entry.points)

    void execute(
      {
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: 'setPositions',
        args: [ids, points],
      },
      {
        toastId: 'admin-set-positions',
        pendingMessage: 'Waiting for leaderboard confirmation...',
        successMessage: 'Leaderboard positions saved.',
        revertedMessage: 'Leaderboard positions were rejected on-chain.',
        logLabel: 'Admin set positions',
      },
    )
  }

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

  const parsedPreview = useMemo(() => {
    const { entries, error } = parseLeaderboardCsv(csvInput)
    if (error || entries.length === 0) return []
    return computeSharedRanks(entries)
  }, [csvInput])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Positions</CardTitle>
        <CardDescription>Set leaderboard: tokenId,points per line (descending by points)</CardDescription>
      </CardHeader>
      <CardContent>
        <textarea
          className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
          placeholder={"1,150\n3,120\n2,120\n4,95"}
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
        />
        <Button className="mt-2" onClick={submit} disabled={!isOwner || isBusy}>
          {isBusy ? 'Submitting...' : 'Set Positions'}
        </Button>

        {parsedPreview.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Preview from CSV:</div>
            <div className="text-xs text-gray-600 space-y-0.5">
              {parsedPreview.map((entry) => (
                <div key={`preview-${entry.tokenId.toString()}`}>
                  #{entry.rank} — Token {entry.tokenId.toString()} · {entry.points.toString()} pts
                </div>
              ))}
            </div>
          </div>
        )}

        {positionsArray && positionsArray.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Current leaderboard:</div>
            <div className="text-xs text-gray-600 space-y-0.5">
              {positionsArray.map((entry) => (
                <div key={entry.tokenId.toString()}>#{entry.rank.toString()} — Token {entry.tokenId.toString()}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// --- Close Tournament Section ---

function CloseTournamentSection({ isOwner }: { isOwner: boolean }) {
  const carton = CONTRACT_ADDRESSES.CARTON
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const treasury = CONTRACT_ADDRESSES.TREASURY
  const { address } = useAccount()
  const { execute, isBusy } = useAdminWrite()

  const [tournamentId, setTournamentId] = useState('1')
  const [distributionInput, setDistributionInput] = useState(FIXED_PRIZE_DISTRIBUTION_INPUT)
  const tokenAddress = CONTRACT_ADDRESSES.USDC
  const parsedTournamentId = /^\d+$/.test(tournamentId) ? BigInt(tournamentId) : 0n

  const { data: nextTokenId } = useReadContract({
    address: carton,
    abi: CARTON_ABI,
    functionName: 'nextTokenId',
    query: { refetchInterval: 10_000 },
  })

  const candidateTokenIds = useMemo(() => {
    const upperBound = Number(nextTokenId ?? 1n)
    return Array.from({ length: Math.max(upperBound - 1, 0) }, (_, i) => BigInt(i + 1))
  }, [nextTokenId])

  const { data: positionsVersion } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'positionsVersion',
    query: { refetchInterval: 10_000 },
  })

  const { data: positionData } = useReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'tokenPositions' as const,
      args: [tokenId] as const,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchInterval: 10_000 },
  })

  const { data: positionVersionData } = useReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'tokenPositionsVersion' as const,
      args: [tokenId] as const,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchInterval: 10_000 },
  })

  const { data: managerRole } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'TOURNAMENT_MANAGER_ROLE',
  })

  const { data: hasManagerRole } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'hasRole',
    args: managerRole && address ? [managerRole as `0x${string}`, address] : undefined,
    query: { enabled: !!managerRole && !!address, refetchInterval: 10_000 },
  })

  const { data: salesClosed } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'salesClosed',
    args: [parsedTournamentId],
    query: { refetchInterval: 10_000 },
  })

  const { data: tournamentFinalized } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'tournamentFinalized',
    args: [parsedTournamentId],
    query: { refetchInterval: 10_000 },
  })

  const { data: usdcDistributionSet } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'prizeDistributionSet',
    args: [parsedTournamentId, tokenAddress],
    query: { refetchInterval: 10_000 },
  })

  const { data: prizePool } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'getPrizePool',
    args: [parsedTournamentId, tokenAddress],
    query: { refetchInterval: 10_000 },
  })

  const { data: reservePool } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'getReservePool',
    args: [parsedTournamentId, tokenAddress],
    query: { refetchInterval: 10_000 },
  })

  const { data: finalAmountsReady } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'finalPrizeAmountsReady',
    args: [parsedTournamentId, tokenAddress],
    query: { refetchInterval: 10_000 },
  })

  const { data: finalAmountTotal } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'finalPrizeAmountTotals',
    args: [parsedTournamentId, tokenAddress],
    query: { refetchInterval: 10_000 },
  })

  const leaderboardEntries = useMemo(
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
        })
        .map((entry) => ({ tokenId: entry.tokenId, rank: Number(entry.rank), points: 0n })),
    [candidateTokenIds, positionData, positionVersionData, positionsVersion],
  )

  const parsedDistribution = useMemo(() => parsePrizeDistributionInput(distributionInput), [distributionInput])
  const distributionIsValid = parsedDistribution.length > 0
    && parsedDistribution.every((value) => Number.isInteger(value) && value >= 0 && value <= 100)
    && parsedDistribution.reduce((sum, value) => sum + value, 0) <= 100

  const payoutPreview = useMemo(() => {
    if (!distributionIsValid || prizePool === undefined || leaderboardEntries.length === 0) {
      return null
    }
    return computeFinalPrizeAmounts(leaderboardEntries, prizePool, parsedDistribution)
  }, [distributionIsValid, leaderboardEntries, parsedDistribution, prizePool])

  const nonZeroPayouts = useMemo(
    () => payoutPreview?.payouts.filter((entry) => entry.amount > 0n) ?? [],
    [payoutPreview],
  )

  const closeSales = () => {
    const tid = Number(tournamentId)
    if (isNaN(tid) || tid <= 0) {
      toast.error('Enter a valid tournament ID')
      return
    }
    void execute(
      {
        address: treasury,
        abi: TREASURY_ABI,
        functionName: 'closeSales',
        args: [BigInt(tid)],
      },
      {
        toastId: `admin-close-sales-${tid}`,
        pendingMessage: 'Waiting for sales close confirmation...',
        successMessage: 'Sales closed successfully.',
        revertedMessage: 'Sales close was rejected on-chain.',
        logLabel: 'Admin close sales',
      },
    )
  }

  const setPrizeDistribution = () => {
    const tid = Number(tournamentId)
    if (isNaN(tid) || tid <= 0) {
      toast.error('Enter a valid tournament ID')
      return
    }

    if (!distributionIsValid) {
      toast.error('Enter comma-separated percentages between 0 and 100')
      return
    }

    void execute(
      {
        address: treasury,
        abi: TREASURY_ABI,
        functionName: 'setPrizeDistribution',
        args: [BigInt(tid), tokenAddress, parsedDistribution],
      },
      {
        toastId: `admin-prize-distribution-${tid}-usdc`,
        pendingMessage: 'Waiting for prize distribution confirmation...',
        successMessage: 'USDC prize distribution saved.',
        revertedMessage: 'Prize distribution was rejected on-chain.',
        logLabel: 'Admin set prize distribution',
      },
    )
  }

  const loadFinalPrizes = () => {
    const tid = Number(tournamentId)
    if (isNaN(tid) || tid <= 0) {
      toast.error('Enter a valid tournament ID')
      return
    }
    if (!payoutPreview || nonZeroPayouts.length === 0) {
      toast.error('Set final leaderboard positions first so the final prize amounts can be computed.')
      return
    }

    const tokenIds = nonZeroPayouts.map((entry) => entry.tokenId)
    const amounts = nonZeroPayouts.map((entry) => entry.amount)

    void execute(
      {
        address: treasury,
        abi: TREASURY_ABI,
        functionName: 'setFinalPrizeAmounts',
        args: [BigInt(tid), tokenAddress, tokenIds, amounts],
      },
      {
        toastId: `admin-final-prizes-${tid}-usdc`,
        pendingMessage: 'Saving final USDC prize amounts...',
        successMessage: 'Final USDC prize amounts saved. Sealing now...',
        revertedMessage: 'Final USDC prize amounts were rejected on-chain.',
        logLabel: 'Admin set final prize amounts',
        onSuccess: async () => {
          await execute(
            {
              address: treasury,
              abi: TREASURY_ABI,
              functionName: 'sealFinalPrizeAmounts',
              args: [BigInt(tid), tokenAddress],
            },
            {
              toastId: `admin-seal-final-prizes-${tid}-usdc`,
              pendingMessage: 'Sealing final USDC prize amounts...',
              successMessage: 'Final USDC prize amounts sealed.',
              revertedMessage: 'Sealing final USDC prize amounts was rejected on-chain.',
              logLabel: 'Admin seal final prize amounts',
            },
          )
        },
      },
    )
  }

  const finalizeTournament = () => {
    const tid = Number(tournamentId)
    if (isNaN(tid) || tid <= 0) {
      toast.error('Enter a valid tournament ID')
      return
    }
    void execute(
      {
        address: treasury,
        abi: TREASURY_ABI,
        functionName: 'finalizeTournament',
        args: [BigInt(tid)],
      },
      {
        toastId: `admin-finalize-${tid}`,
        pendingMessage: 'Waiting for tournament finalization...',
        successMessage: 'Tournament finalized successfully.',
        revertedMessage: 'Tournament finalization was rejected on-chain.',
        logLabel: 'Admin finalize tournament',
      },
    )
  }

  const poolDisplay = prizePool !== undefined
    ? `${Number(formatUnits(prizePool, 6)).toFixed(2)} USDC`
    : '—'

  const reserveDisplay = reservePool !== undefined
    ? `${Number(formatUnits(reservePool, 6)).toFixed(2)} USDC`
    : '—'

  const grossSalesDisplay = prizePool !== undefined && reservePool !== undefined
    ? `${Number(formatUnits(prizePool + reservePool, 6)).toFixed(2)} USDC`
    : '—'

  const finalTotalDisplay = finalAmountTotal !== undefined
    ? `${Number(formatUnits(finalAmountTotal, 6)).toFixed(2)} USDC`
    : '—'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tournament Lifecycle</CardTitle>
        <CardDescription>Close sales, set the fixed 32-place pyramid, compute final split amounts, then finalize claims.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
            <span className="font-medium">Has TOURNAMENT_MANAGER_ROLE:</span>{' '}
            <span className={hasManagerRole ? 'text-green-600' : 'text-red-600'}>
              {String(Boolean(hasManagerRole))}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium w-24">Tournament ID</span>
            <Input
              type="number"
              min={1}
              className="w-24"
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
            />
          </div>

          <div className="text-sm space-y-1">
            <div><span className="font-medium">Asset:</span> USDC</div>
            <div><span className="font-medium">Gross Sales:</span> {grossSalesDisplay}</div>
            <div><span className="font-medium">Prizeable Pool:</span> {poolDisplay}</div>
            <div><span className="font-medium">Reserve:</span> {reserveDisplay}</div>
            <div><span className="font-medium">Final Prize Total:</span> {finalTotalDisplay}</div>
            <div>
              <span className="font-medium">Sales Closed:</span>{' '}
              <span className={salesClosed ? 'text-green-600' : 'text-yellow-600'}>
                {String(Boolean(salesClosed))}
              </span>
            </div>
            <div>
              <span className="font-medium">USDC Distribution:</span>{' '}
              <span className={usdcDistributionSet ? 'text-green-600' : 'text-yellow-600'}>
                {String(Boolean(usdcDistributionSet))}
              </span>
            </div>
            <div>
              <span className="font-medium">Final Amounts Ready:</span>{' '}
              <span className={finalAmountsReady ? 'text-green-600' : 'text-yellow-600'}>
                {String(Boolean(finalAmountsReady))}
              </span>
            </div>
            <div>
              <span className="font-medium">Finalized:</span>{' '}
              <span className={tournamentFinalized ? 'text-green-600' : 'text-yellow-600'}>
                {String(Boolean(tournamentFinalized))}
              </span>
            </div>
          </div>

          <Button
            onClick={closeSales}
            disabled={!isOwner || !hasManagerRole || Boolean(salesClosed) || isBusy}
          >
            {isBusy ? 'Closing...' : 'Close Sales'}
          </Button>

          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium w-24">USDC %</span>
            <Input
              value={distributionInput}
              onChange={(e) => setDistributionInput(e.target.value)}
              placeholder={FIXED_PRIZE_DISTRIBUTION_INPUT}
            />
            <Button
              onClick={setPrizeDistribution}
              disabled={!isOwner || !hasManagerRole || !salesClosed || Boolean(tournamentFinalized) || isBusy}
            >
              {isBusy ? 'Saving...' : 'Set Distribution'}
            </Button>
          </div>

          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Default fixed pyramid: {FIXED_PRIZE_DISTRIBUTION_INPUT}
          </div>

          {payoutPreview && (
            <div className="rounded-lg border border-border p-3 space-y-3">
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Shared-rank preview:</span> {leaderboardEntries.length} ranked cartones</div>
                <div><span className="font-medium">Current reserve + dust after sealing:</span> {Number(formatUnits((reservePool ?? 0n) + payoutPreview.reserveAddition, 6)).toFixed(2)} USDC</div>
                <div><span className="font-medium">Assigned to winners:</span> {Number(formatUnits(payoutPreview.totalAssigned, 6)).toFixed(2)} USDC</div>
                <div><span className="font-medium">Extra reserve from empty places / cent rounding:</span> {Number(formatUnits(payoutPreview.reserveAddition, 6)).toFixed(2)} USDC</div>
              </div>

              <div>
                <div className="text-sm font-medium mb-1">Band reference:</div>
                <div className="text-xs text-gray-600 space-y-0.5">
                  {PRIZE_BANDS.map((band) => {
                    const percentage = parsedDistribution[band.start - 1] ?? 0
                    return (
                      <div key={`band-${band.start}`}>
                        {band.label} → {percentage}%
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-1">Final payouts preview:</div>
                <div className="max-h-56 overflow-y-auto text-xs text-gray-600 space-y-0.5">
                  {payoutPreview.payouts.map((entry) => (
                    <div key={`payout-${entry.tokenId.toString()}`}>
                      #{entry.rank} — Token {entry.tokenId.toString()} · {Number(formatUnits(entry.amount, 6)).toFixed(2)} USDC
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={loadFinalPrizes}
            disabled={
              !isOwner
              || !hasManagerRole
              || !salesClosed
              || !usdcDistributionSet
              || Boolean(finalAmountsReady)
              || Boolean(tournamentFinalized)
              || !payoutPreview
              || isBusy
            }
          >
            {isBusy ? 'Saving...' : 'Set Final Prizes'}
          </Button>

          <Button
            onClick={finalizeTournament}
            disabled={!isOwner || !hasManagerRole || !salesClosed || !usdcDistributionSet || !finalAmountsReady || Boolean(tournamentFinalized) || isBusy}
          >
            {isBusy ? 'Finalizing...' : 'Finalize Tournament'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// --- Main Admin Page ---

function AdminPage() {
  const isDev = import.meta.env.DEV
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const { address, isConnected } = useAccount()

  const { data: owner } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'owner',
    query: { refetchInterval: 10_000 },
  })

  const isOwner = useMemo(() => {
    if (!address || !owner) return false
    return address.toLowerCase() === (owner as string).toLowerCase()
  }, [address, owner])

  // Teams hash state
  const { data: onchainTeamsHash } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'teamsHash',
    query: { refetchInterval: 10_000 },
  })
  const { data: isFrozen } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'teamsHashFrozen',
    query: { refetchInterval: 10_000 },
  })
  // totalGames config
  const { data: onchainTotalGames } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'totalGames',
    query: { refetchInterval: 10_000 },
  })
  const { data: predictionsStarted } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'predictionsStarted',
    query: { refetchInterval: 10_000 },
  })
  const [totalGamesLocal, setTotalGamesLocal] = useState<string>('')
  useEffect(() => {
    if (onchainTotalGames !== undefined) {
      setTotalGamesLocal(String(onchainTotalGames))
    }
  }, [onchainTotalGames])

  const [teamsHash, setTeamsHashLocal] = useState<string>('')
  useEffect(() => {
    const zero = '0x0000000000000000000000000000000000000000000000000000000000000000'
    if (onchainTeamsHash && (onchainTeamsHash as string) !== zero) {
      setTeamsHashLocal(onchainTeamsHash as string)
      return
    }

    const run = async () => {
      const local = await computeTeamsHash(teams2026Config)
      setTeamsHashLocal(local)
    }
    run()
  }, [onchainTeamsHash])

  const { execute, isBusy } = useAdminWrite()

  const submitTeamsHash = () => {
    if (!teamsHash || !teamsHash.startsWith('0x') || teamsHash.length !== 66) {
      toast.error('Provide a valid bytes32 (0x... 64 hex chars)')
      return
    }
    void execute(
      {
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: 'setTeamsHash',
        args: [teamsHash as `0x${string}`],
      },
      {
        toastId: 'admin-set-teams-hash',
        pendingMessage: 'Waiting for teams hash confirmation...',
        successMessage: 'Teams hash saved.',
        revertedMessage: 'Teams hash update was rejected on-chain.',
        logLabel: 'Admin set teams hash',
      },
    )
  }

  const freeze = () => {
    void execute(
      { address: predictions, abi: PREDICTIONS_ABI, functionName: 'freezeTeamsHash' },
      {
        toastId: 'admin-freeze-teams-hash',
        pendingMessage: 'Waiting for teams hash freeze confirmation...',
        successMessage: 'Teams hash frozen.',
        revertedMessage: 'Teams hash freeze was rejected on-chain.',
        logLabel: 'Admin freeze teams hash',
      },
    )
  }

  // Deadline
  const { data: deadline } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'submissionDeadline',
    query: { refetchInterval: 10_000 },
  })
  const [deadlineLocal, setDeadlineLocal] = useState<string>('')
  useEffect(() => {
    if (deadline && Number(deadline) > 0) {
      const d = new Date(Number(deadline) * 1000)
      const pad = (n: number) => n.toString().padStart(2, '0')
      const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
      setDeadlineLocal(iso)
    }
  }, [deadline])

  const setDeadline = () => {
    if (!deadlineLocal) return
    const ts = Math.floor(new Date(deadlineLocal).getTime() / 1000)
    if (!ts || isNaN(ts)) { toast.error('Invalid date/time'); return }
    void execute(
      {
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: 'setSubmissionDeadline',
        args: [BigInt(ts)],
      },
      {
        toastId: 'admin-set-deadline',
        pendingMessage: 'Waiting for deadline confirmation...',
        successMessage: 'Submission deadline saved.',
        revertedMessage: 'Deadline update was rejected on-chain.',
        logLabel: 'Admin set submission deadline',
      },
    )
  }

  const setTotalGames = () => {
    const n = Number(totalGamesLocal)
    if (!Number.isInteger(n) || n <= 0 || n > 255) {
      toast.error('Enter a valid integer between 1 and 255')
      return
    }
    if (predictionsStarted) {
      toast.error('Predictions already started; cannot change total games')
      return
    }
    void execute(
      {
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: 'setTotalGames',
        args: [n],
      },
      {
        toastId: 'admin-set-total-games',
        pendingMessage: 'Waiting for total games confirmation...',
        successMessage: 'Total games saved.',
        revertedMessage: 'Total games update was rejected on-chain.',
        logLabel: 'Admin set total games',
      },
    )
  }

  if (!isDev) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription>Admin interface is disabled in production builds.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-300">Run locally (npm run dev) to access this page.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Existing config card */}
      <Card>
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription>Owner-only actions for Predictions contract</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div><span className="font-medium">Connected:</span> {isConnected ? address : 'Not connected'}</div>
            <div><span className="font-medium">Owner:</span> {owner as string || '—'}</div>
            {!isOwner && <div className="text-red-600">Connect with the owner wallet to proceed.</div>}
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <div className="mb-2 font-medium">Teams Hash</div>
              <div className="flex gap-2 items-center">
                <Input value={teamsHash} onChange={(e) => setTeamsHashLocal(e.target.value)} placeholder="0x..." />
                <Button onClick={submitTeamsHash} disabled={!isOwner || Boolean(isFrozen) || isBusy}>
                  {isBusy ? 'Setting...' : 'Set Hash'}
                </Button>
              </div>
              <div className="text-xs text-gray-600 mt-1">Frozen: {String(isFrozen)}</div>
              <Button className="mt-2" variant="secondary" onClick={freeze} disabled={!isOwner || Boolean(isFrozen) || isBusy}>Freeze</Button>
            </div>

            <div>
              <div className="mb-2 font-medium">Submission Deadline</div>
              <div className="flex gap-2 items-center">
                <Input type="datetime-local" value={deadlineLocal} onChange={(e) => setDeadlineLocal(e.target.value)} />
                <Button onClick={setDeadline} disabled={!isOwner || isBusy}>
                  {isBusy ? 'Saving...' : 'Save Deadline'}
                </Button>
              </div>
            </div>

            <div>
              <div className="mb-2 font-medium">Total Games</div>
              <div className="text-xs text-gray-600 mb-1">On-chain: {onchainTotalGames !== undefined ? String(onchainTotalGames) : '—'} • Started: {String(Boolean(predictionsStarted))}</div>
              <div className="flex gap-2 items-center">
                <Input type="number" min={1} max={255} value={totalGamesLocal} onChange={(e) => setTotalGamesLocal(e.target.value)} />
                <Button onClick={setTotalGames} disabled={!isOwner || Boolean(predictionsStarted) || isBusy}>
                  {isBusy ? 'Saving...' : 'Save'}
                </Button>
              </div>
              <div className="text-xs text-gray-600 mt-1">Must be set before first submission. Typically derived from teams count.</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New sections */}
      <SetResultsSection isOwner={isOwner} />
      <SetOfficialWinnersSection isOwner={isOwner} />
      <SetPositionsSection isOwner={isOwner} />
      <CloseTournamentSection isOwner={isOwner} />
    </div>
  )
}
