import { useEffect, useMemo, useState } from 'react'
import { useAccount, useReadContract, useReadContracts } from './lib/wallet'
import { formatUnits, keccak256, parseUnits, toBytes, type Abi, type Address } from 'viem'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { CARTON_ABI, CONTRACT_ADDRESSES, PREDICTIONS_ABI, TREASURY_ABI, USDC_ABI } from '../../frontend/src/lib/contracts'
import { toast } from 'sonner'
import { computeTeamsHash, teams2026, teamsById } from '../../frontend/src/lib/teams'
import { teams2026Config } from '../../frontend/src/lib/teams2026.config'
import { buildAllGroupGames } from '../../frontend/src/lib/games'
import { useSimulatedContractWrite } from './hooks/useSimulatedContractWrite'
import {
  FIXED_PRIZE_DISTRIBUTION_INPUT,
  PRIZE_BANDS,
  computeFinalPrizeAmounts,
  computeSharedRanks,
  parseLeaderboardCsv,
  parsePrizeDistributionInput,
} from '../../frontend/src/lib/prize-payout'
import { mapAdminError } from '../../frontend/src/lib/transaction-errors'

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

type AdminPermissions = {
  predictionsOwner?: Address
  isPredictionsOwner: boolean
  cartonAdminRole?: `0x${string}`
  hasCartonAdminRole: boolean
  cartonMinterRole?: `0x${string}`
  treasuryAdminRole?: `0x${string}`
  hasTreasuryAdminRole: boolean
  treasuryFundDepositorRole?: `0x${string}`
  hasTreasuryFundDepositorRole: boolean
  treasuryManagerRole?: `0x${string}`
  hasTreasuryManagerRole: boolean
}

type AdminCapability = {
  label: string
  detail: string
  required: string
  allowed: boolean
}

type AdminSectionId = 'overview' | 'results' | 'winners' | 'positions' | 'roles' | 'tokens' | 'funding' | 'lifecycle' | 'metadata'

type BatchedReadResult = {
  result: unknown
}

type BatchedReadContract = {
  address: Address
  abi: Abi
  functionName: string
  args?: readonly unknown[]
}

const ADMIN_SECTION_OPTIONS: Array<{ id: AdminSectionId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'results', label: 'Results' },
  { id: 'winners', label: 'Winners' },
  { id: 'positions', label: 'Positions' },
  { id: 'roles', label: 'Roles' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'funding', label: 'Funding' },
  { id: 'lifecycle', label: 'Lifecycle' },
  { id: 'metadata', label: 'Metadata' },
]

function getBatchedResult<T>(results: BatchedReadResult[] | undefined, index: number) {
  return results?.[index]?.result as T | undefined
}

function parseOfficialWinners(value: unknown) {
  if (!value) return { teamIds: [] as number[], isSet: false }

  if (Array.isArray(value)) {
    const teamIds = Array.isArray(value[0]) ? value[0].map((teamId) => Number(teamId)) : []
    return { teamIds, isSet: Boolean(value[1]) }
  }

  if (typeof value === 'object') {
    const record = value as { teams?: unknown; set?: unknown }
    const teamIds = Array.isArray(record.teams) ? record.teams.map((teamId) => Number(teamId)) : []
    return { teamIds, isSet: Boolean(record.set) }
  }

  return { teamIds: [] as number[], isSet: false }
}

function truncateAddress(address?: string) {
  if (!address) return '—'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function parseUsdcAmount(value: string) {
  const trimmed = value.trim()
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return undefined

  try {
    const parsed = parseUnits(trimmed, 6)
    return parsed > 0n ? parsed : undefined
  } catch {
    return undefined
  }
}

function formatUsdc(value?: bigint) {
  if (value === undefined) return '—'
  return `${Number(formatUnits(value, 6)).toFixed(2)} USDC`
}

function CapabilityBadge({ allowed }: { allowed: boolean }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      style={{
        background: allowed ? 'rgba(0, 230, 118, 0.12)' : 'rgba(255, 77, 109, 0.12)',
        color: allowed ? 'var(--accent-green)' : 'var(--accent-red)',
      }}
    >
      {allowed ? 'Allowed' : 'Blocked'}
    </span>
  )
}

function RoleIdDisplay({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <div className="font-medium">{label}</div>
      <div className="rounded-md border px-2 py-1 font-mono text-xs break-all" style={{ borderColor: 'var(--border-color)' }}>
        {value ?? '—'}
      </div>
    </div>
  )
}

// --- Set Results Section ---

function SetResultsSection({ canManagePredictions }: { canManagePredictions: boolean }) {
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const carton = CONTRACT_ADDRESSES.CARTON
  const treasury = CONTRACT_ADDRESSES.TREASURY
  const { execute, isBusy } = useAdminWrite()
  const { chainId } = useAccount()
  const { games } = useMemo(() => buildAllGroupGames(), [])
  const [gameSearch, setGameSearch] = useState('')
  const demoScores = useMemo<[number, number][]>(
    () => {
      const scores: [number, number][] = []
      for (let team1Goals = 0; team1Goals <= 7; team1Goals += 1) {
        for (let team2Goals = 0; team2Goals <= 7 - team1Goals; team2Goals += 1) {
          scores.push([team1Goals, team2Goals])
        }
      }
      return scores
    },
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

  const { data: gamesStatusData, refetch: refetchGamesStatus } = useReadContracts({
    contracts: games.map((game) => ({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'games' as const,
      args: [game.id] as const,
    })),
    query: { enabled: games.length > 0, refetchInterval: 10_000 },
  })

  const { data: gameResultsData, refetch: refetchGameResults } = useReadContracts({
    contracts: games.map((game) => ({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'getGameResults' as const,
      args: [game.id] as const,
    })),
    query: { enabled: games.length > 0, refetchInterval: 10_000 },
  })

  const storedGamesById = useMemo(() => {
    return new Map(
      games.map((game, index) => {
        const rawStatus = gamesStatusData?.[index]?.result as [number, boolean] | { id?: number; set?: boolean } | undefined
        const rawResult = gameResultsData?.[index]?.result as [number, number] | undefined
        const resultErrorMessage = gameResultsData?.[index]?.errorMessage as string | undefined

        const isSet = Array.isArray(rawStatus) ? Boolean(rawStatus[1]) : Boolean(rawStatus?.set)
        const result = Array.isArray(rawResult) ? rawResult : undefined
        const resultReadFailed = Boolean(gameResultsData?.[index]?.error)

        return [
          game.id,
          {
            result,
            set: isSet,
            resultReadFailed,
            resultErrorMessage,
          },
        ]
      }),
    )
  }, [games, gameResultsData, gamesStatusData])

  const getStoredResultErrorLabel = (errorMessage?: string) => {
    const message = errorMessage?.toLowerCase() ?? ''
    if (!message) return 'read error'
    if (message.includes('fetch failed') || message.includes('failed to fetch') || message.includes('network')) return 'rpc/network error'
    if (message.includes('429') || message.includes('too many requests') || message.includes('rate limit')) return 'rpc rate limit'
    if (message.includes('timeout')) return 'rpc timeout'
    if (message.includes('invalid game id')) return 'invalid game id'
    return 'read error'
  }

  const getStoredResultLabel = (gameId: number) => {
    const storedGame = storedGamesById.get(gameId)

    if (!storedGame?.set) return 'not set'
    if (storedGame.result) return `${storedGame.result[0]}-${storedGame.result[1]}`
    if (storedGame.resultReadFailed) return getStoredResultErrorLabel(storedGame.resultErrorMessage)

    return 'loading...'
  }

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

  const setGamesCount = useMemo(
    () => games.reduce((count, game) => count + (storedGamesById.get(game.id)?.set ? 1 : 0), 0),
    [games, storedGamesById],
  )

  const showBatchHelper = chainId === 31337 || chainId === 84532

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
          await Promise.all([refetchGamesStatus(), refetchGameResults()])
        },
      },
    )
  }

  const batchPayload = useMemo(() => {
    const gameIds: number[] = []
    const team1Goals: number[] = []
    const team2Goals: number[] = []
    const invalidGameIds: number[] = []

    for (const { game } of filteredGames) {
      if (storedGamesById.get(game.id)?.set) continue

      const [g1, g2] = getGoals(game.id)
      const hasAnyValue = g1.trim() !== '' || g2.trim() !== ''
      if (!hasAnyValue) continue

      const t1 = Number(g1)
      const t2 = Number(g2)
      const invalid = isNaN(t1) || isNaN(t2) || t1 < 0 || t2 < 0 || !Number.isInteger(t1) || !Number.isInteger(t2)
      if (invalid) {
        invalidGameIds.push(game.id)
        continue
      }

      gameIds.push(game.id)
      team1Goals.push(t1)
      team2Goals.push(t2)
    }

    return { gameIds, team1Goals, team2Goals, invalidGameIds }
  }, [filteredGames, goals, storedGamesById])

  const submitBatchResults = () => {
    if (!showBatchHelper) {
      toast.error('Batch result loading is available only on Anvil or Base Sepolia.')
      return
    }

    if (tournamentFinalized) {
      toast.error('This tournament is finalized. Results can no longer be corrected.')
      return
    }

    if (batchPayload.invalidGameIds.length > 0) {
      toast.error(`Fix invalid goals for games: ${batchPayload.invalidGameIds.join(', ')}`)
      return
    }

    if (batchPayload.gameIds.length === 0) {
      toast.error('No visible unset results with valid goals to send in batch.')
      return
    }

    void execute(
      {
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: 'setResultsBatch',
        args: [batchPayload.gameIds, batchPayload.team1Goals, batchPayload.team2Goals],
      },
      {
        toastId: 'admin-set-results-batch',
        pendingMessage: `Waiting for batch confirmation (${batchPayload.gameIds.length} games)...`,
        successMessage: `Saved ${batchPayload.gameIds.length} results in batch.`,
        revertedMessage: 'Batch result update was rejected on-chain.',
        logLabel: 'Admin set results batch',
        onSuccess: async () => {
          await Promise.all([refetchGamesStatus(), refetchGameResults()])
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
            {filteredGames.length} de {games.length} partidos visibles · {setGamesCount} / {games.length} con resultado
          </p>
          {showBatchHelper && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Dev helper: batch result loading is enabled only on Anvil or Base Sepolia, and only sets visible games with valid loaded goals.
            </div>
          )}
          {showBatchHelper && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={submitBatchResults}
                disabled={!canManagePredictions || isBusy || Boolean(tournamentFinalized) || batchPayload.gameIds.length === 0}
              >
                Set Batch ({batchPayload.gameIds.length})
              </Button>
              <span className="text-xs text-gray-500">
                Skips already set games and empty rows.
              </span>
            </div>
          )}
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredGames.map(({ game }) => (
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
              <span
                className="w-28 text-xs text-gray-500"
                title={storedGamesById.get(game.id)?.resultErrorMessage}
              >
                {getStoredResultLabel(game.id)}
              </span>
              <Button
                size="sm"
                onClick={() => submitResult(game.id)}
                disabled={!canManagePredictions || isBusy || Boolean(tournamentFinalized)}
              >
                {storedGamesById.get(game.id)?.set ? 'Update' : 'Set'}
              </Button>
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

function SetOfficialWinnersSection({ canManagePredictions }: { canManagePredictions: boolean }) {
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const { execute, isBusy } = useAdminWrite()
  const teamsAlphabetical = useMemo(
    () => [...teams2026].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })),
    [],
  )

  const { data: officialWinnersData, refetch: refetchOfficialWinners } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'getOfficialWinners',
  })

  const { teamIds: currentWinners, isSet: winnersAlreadySet } = parseOfficialWinners(officialWinnersData)
  const hasLoadedOfficialWinners = officialWinnersData !== undefined

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
        onSuccess: async () => {
          await refetchOfficialWinners()
        },
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Official Winners</CardTitle>
        <CardDescription>Declare the top 4 teams (one-time, irreversible)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
          {!hasLoadedOfficialWinners && <div className="text-gray-500">Loading official winners...</div>}
          {hasLoadedOfficialWinners && winnersAlreadySet && currentWinners.length > 0 && (
            <div className="space-y-1">
              <div className="text-green-600 font-medium mb-2">Official winners loaded:</div>
              {currentWinners.map((id, i) => (
                <div key={`summary-${i}`}>
                  <span className="font-medium">{labels[i]}:</span> {teamsById[id] ?? `Team ${id}`}
                </div>
              ))}
            </div>
          )}
          {hasLoadedOfficialWinners && !winnersAlreadySet && (
            <div className="text-yellow-600">Official winners are not set yet.</div>
          )}
        </div>
        {winnersAlreadySet && currentWinners.length > 0 ? (
          <div className="space-y-1 text-sm">
            <div className="text-green-600 font-medium mb-2">Winners already set:</div>
            {currentWinners.map((id, i) => (
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
            <Button onClick={submit} disabled={!canManagePredictions || isBusy || winnersAlreadySet}>
              {isBusy ? 'Submitting...' : 'Set Winners'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// --- Set Positions Section ---

const POSITION_BATCH_SIZE = 250

function SetPositionsSection({ canManagePredictions }: { canManagePredictions: boolean }) {
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const carton = CONTRACT_ADDRESSES.CARTON
  const { execute, isBusy } = useAdminWrite()
  const [csvInput, setCsvInput] = useState('')
  const [manualOverrideEnabled, setManualOverrideEnabled] = useState(false)

  const positionsBaseContracts = useMemo(
    () => {
      const contracts: BatchedReadContract[] = [
        { address: carton, abi: CARTON_ABI, functionName: 'activeTournamentId' },
        { address: carton, abi: CARTON_ABI, functionName: 'nextTokenId' },
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'positionsVersion' },
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'positionsUpdateInProgress' },
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'pendingTournamentId' },
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'pendingExpectedEntries' },
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'pendingProcessedEntries' },
      ]

      return contracts
    },
    [carton, predictions],
  )

  const { data: positionsBaseData, refetch: refetchPositionsBaseData } = useReadContracts({
    contracts: positionsBaseContracts,
    query: { refetchInterval: 10_000 },
  })

  const tournamentId = getBatchedResult<bigint>(positionsBaseData, 0) ?? 0n
  const nextTokenId = getBatchedResult<bigint>(positionsBaseData, 1)

  const { data: mintedTournamentCount } = useReadContract({
    address: carton,
    abi: CARTON_ABI,
    functionName: 'mintedByTournament',
    args: tournamentId > 0n ? [tournamentId] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10_000 },
  })

  const candidateTokenIds = useMemo(() => {
    const upperBound = Number(nextTokenId ?? 1n)
    return Array.from({ length: Math.max(upperBound - 1, 0) }, (_, i) => BigInt(i + 1))
  }, [nextTokenId])

  const positionsVersion = getBatchedResult<bigint>(positionsBaseData, 2)

  const { data: positionData, refetch: refetchPositionData } = useReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'tokenPositions' as const,
      args: [tokenId] as const,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchInterval: 10_000 },
  })

  const { data: positionVersionData, refetch: refetchPositionVersionData } = useReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'tokenPositionsVersion' as const,
      args: [tokenId] as const,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchInterval: 10_000 },
  })

  const { data: usedData } = useReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'used' as const,
      args: [tokenId] as const,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchInterval: 10_000 },
  })

  const { data: tokenTournamentData } = useReadContracts({
    contracts: candidateTokenIds.map((tokenId) => ({
      address: carton,
      abi: CARTON_ABI,
      functionName: 'tokenTournamentId' as const,
      args: [tokenId] as const,
    })),
    query: { enabled: candidateTokenIds.length > 0, refetchInterval: 10_000 },
  })

  const tournamentScopedTokenIds = useMemo(
    () => candidateTokenIds.filter((_, index) => (tokenTournamentData?.[index]?.result as bigint | undefined) === tournamentId),
    [candidateTokenIds, tokenTournamentData, tournamentId],
  )

  const usedTokenIds = useMemo(
    () =>
      tournamentScopedTokenIds.filter((tokenId) => {
        const candidateIndex = candidateTokenIds.findIndex((candidateTokenId) => candidateTokenId === tokenId)
        return candidateIndex >= 0 && Boolean(usedData?.[candidateIndex]?.result)
      }),
    [candidateTokenIds, tournamentScopedTokenIds, usedData],
  )

  const onchainPointsContracts = useMemo(
    () =>
      usedTokenIds.map((tokenId) => ({
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: 'calculateTotalPoints' as const,
        args: [tokenId] as const,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [usedTokenIds.map((tokenId) => tokenId.toString()).join(',')],
  )

  const { data: onchainPointsData } = useReadContracts({
    contracts: onchainPointsContracts,
    query: { enabled: onchainPointsContracts.length > 0, refetchInterval: 10_000 },
  })

  const { data: submittedCount, refetch: refetchSubmittedCount } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'submittedCountByTournament',
    args: tournamentId > 0n ? [tournamentId] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10_000 },
  })

  const positionsUpdateInProgress = getBatchedResult<boolean>(positionsBaseData, 3)
  const pendingTournamentId = getBatchedResult<bigint>(positionsBaseData, 4)
  const pendingExpectedEntries = getBatchedResult<bigint>(positionsBaseData, 5)
  const pendingProcessedEntries = getBatchedResult<bigint>(positionsBaseData, 6)

  const onchainPointEntries = useMemo(
    () =>
      usedTokenIds
        .map((tokenId, index) => ({
          tokenId,
          points: (onchainPointsData?.[index]?.result as bigint | undefined) ?? 0n,
        }))
        .sort((a, b) => {
          if (a.points !== b.points) return a.points > b.points ? -1 : 1
          if (a.tokenId === b.tokenId) return 0
          return a.tokenId < b.tokenId ? -1 : 1
        }),
    [onchainPointsData, usedTokenIds],
  )

  const canFillFromOnchain = tournamentId > 0n && usedTokenIds.length > 0 && onchainPointsData?.length === usedTokenIds.length
  const activePendingUpdateMatchesTournament = Boolean(positionsUpdateInProgress && pendingTournamentId === tournamentId)
  const canChangePositionSource = !activePendingUpdateMatchesTournament

  const fillFromOnchain = () => {
    if (tournamentId === 0n) {
      toast.error('Set an active tournament first.')
      return
    }

    if (usedTokenIds.length === 0) {
      toast.error('There are no submitted cartones for the active tournament yet.')
      return
    }

    if (!canFillFromOnchain) {
      toast.error('Still loading on-chain points. Try again in a moment.')
      return
    }

    setCsvInput(onchainPointEntries.map((entry) => `${entry.tokenId.toString()},${entry.points.toString()}`).join('\n'))
    toast.success(`Loaded ${onchainPointEntries.length} cartone${onchainPointEntries.length === 1 ? '' : 's'} from on-chain points.`)
  }

  const enableManualOverride = () => {
    if (!canChangePositionSource) {
      toast.error('Finish or cancel the open leaderboard draft before changing the source.')
      return
    }

    if (canFillFromOnchain && csvInput.trim().length === 0) {
      setCsvInput(onchainPointEntries.map((entry) => `${entry.tokenId.toString()},${entry.points.toString()}`).join('\n'))
    }

    setManualOverrideEnabled(true)
  }

  const disableManualOverride = () => {
    if (!canChangePositionSource) {
      toast.error('Finish or cancel the open leaderboard draft before changing the source.')
      return
    }

    setManualOverrideEnabled(false)
  }

  const refreshPositionsReads = async () => {
    await Promise.all([refetchPositionsBaseData(), refetchSubmittedCount(), refetchPositionData(), refetchPositionVersionData()])
  }

  const buildValidatedEntries = () => {
    if (tournamentId === 0n) {
      toast.error('Set an active tournament first.')
      return null
    }

    if (!manualOverrideEnabled) {
      if (usedTokenIds.length === 0) {
        toast.error('There are no submitted cartones for the active tournament yet.')
        return null
      }

      if (!canFillFromOnchain) {
        toast.error('Still loading on-chain points. Try again in a moment.')
        return null
      }

      const entries = onchainPointEntries.map((entry) => ({ tokenId: entry.tokenId, points: entry.points }))
      const expectedEntries = Number(submittedCount ?? 0n)
      if (entries.length !== expectedEntries) {
        toast.error(`On-chain points loaded ${entries.length} entries, but tournament ${tournamentId.toString()} has ${expectedEntries} submitted cartones.`)
        return null
      }

      return entries
    }

    const { entries, error } = parseLeaderboardCsv(csvInput)
    if (error) {
      toast.error(error)
      return null
    }

    if (entries.length === 0) {
      toast.error('There are no leaderboard entries to upload.')
      return null
    }

    const expectedEntries = Number(submittedCount ?? 0n)
    if (entries.length !== expectedEntries) {
      toast.error(`The CSV contains ${entries.length} entries, but tournament ${tournamentId.toString()} has ${expectedEntries} submitted cartones.`)
      return null
    }

    const entryTokenIdSet = new Set(entries.map((entry) => entry.tokenId.toString()))
    const missingTournamentToken = usedTokenIds.find((tokenId) => !entryTokenIdSet.has(tokenId.toString()))
    if (missingTournamentToken) {
      toast.error(`Carton #${missingTournamentToken.toString()} from the active tournament is missing from the CSV.`)
      return null
    }

    return entries
  }

  const openPositionsDraft = () => {
    const entries = buildValidatedEntries()
    if (!entries) return

    if (positionsUpdateInProgress) {
      toast.error('There is already a leaderboard draft in progress. Append it or cancel it first.')
      return
    }

    void execute(
      {
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: 'beginPositionsUpdate',
        args: [BigInt(entries.length)],
      },
      {
        toastId: 'admin-begin-positions-update',
        pendingMessage: 'Opening leaderboard draft...',
        successMessage: 'Leaderboard draft opened.',
        revertedMessage: 'Could not open leaderboard draft on-chain.',
        logLabel: 'Admin begin positions update',
        onSuccess: refreshPositionsReads,
      },
    )
  }

  const appendNextBatch = () => {
    const entries = buildValidatedEntries()
    if (!entries) return

    if (!activePendingUpdateMatchesTournament) {
      toast.error('Open a leaderboard draft first.')
      return
    }

    const expectedPendingEntries = Number(pendingExpectedEntries ?? 0n)
    const processedEntriesCount = Number(pendingProcessedEntries ?? 0n)
    if (entries.length !== expectedPendingEntries) {
      toast.error(`The open draft expects ${expectedPendingEntries} entries, but the CSV has ${entries.length}.`)
      return
    }

    if (processedEntriesCount >= expectedPendingEntries) {
      toast.error('All draft entries were already uploaded. Finalize the draft to publish the leaderboard.')
      return
    }

    const chunk = entries.slice(processedEntriesCount, processedEntriesCount + POSITION_BATCH_SIZE)
    const currentBatchNumber = Math.floor(processedEntriesCount / POSITION_BATCH_SIZE) + 1
    const totalBatches = Math.ceil(expectedPendingEntries / POSITION_BATCH_SIZE)

    void execute(
      {
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: 'appendPositionsBatch',
        args: [chunk.map((entry) => entry.tokenId), chunk.map((entry) => entry.points)],
      },
      {
        toastId: `admin-set-positions-batch-${currentBatchNumber}`,
        pendingMessage: `Uploading leaderboard batch ${currentBatchNumber}/${totalBatches}...`,
        successMessage: `Batch ${currentBatchNumber}/${totalBatches} saved.`,
        revertedMessage: 'Leaderboard batch was rejected on-chain.',
        logLabel: 'Admin append positions batch',
        onSuccess: refreshPositionsReads,
      },
    )
  }

  const finalizePositionsDraft = () => {
    if (!activePendingUpdateMatchesTournament) {
      toast.error('Open a leaderboard draft first.')
      return
    }

    if ((pendingProcessedEntries ?? 0n) !== (pendingExpectedEntries ?? 0n)) {
      toast.error('Upload all draft entries before finalizing the leaderboard.')
      return
    }

    void execute(
      {
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: 'finalizePositionsUpdate',
      },
      {
        toastId: 'admin-finalize-positions-batch',
        pendingMessage: 'Finalizing leaderboard version...',
        successMessage: 'Leaderboard positions saved.',
        revertedMessage: 'Leaderboard finalization was rejected on-chain.',
        logLabel: 'Admin finalize positions update',
        onSuccess: refreshPositionsReads,
      },
    )
  }

  const cancelPendingUpdate = () => {
    void execute(
      {
        address: predictions,
        abi: PREDICTIONS_ABI,
        functionName: 'cancelPositionsUpdate',
      },
      {
        toastId: 'admin-cancel-positions-update',
        pendingMessage: 'Cancelling leaderboard draft...',
        successMessage: 'Leaderboard draft cancelled.',
        revertedMessage: 'Could not cancel the leaderboard draft.',
        logLabel: 'Admin cancel positions update',
        onSuccess: refreshPositionsReads,
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

  const onchainPreview = useMemo(() => {
    if (!canFillFromOnchain) return []
    return computeSharedRanks(onchainPointEntries)
  }, [canFillFromOnchain, onchainPointEntries])

  const previewEntries = manualOverrideEnabled ? parsedPreview : onchainPreview

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Positions</CardTitle>
        <CardDescription>Publish the active tournament leaderboard in batches. Default source is on-chain total points; manual CSV override is emergency-only.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3 text-sm space-y-1">
          <div><span className="font-medium">Active tournament:</span> {tournamentId > 0n ? tournamentId.toString() : '—'}</div>
          <div><span className="font-medium">Tournament cartones:</span> {mintedTournamentCount?.toString() ?? '—'}</div>
          <div><span className="font-medium">Submitted cartones:</span> {submittedCount?.toString() ?? '—'}</div>
          <div><span className="font-medium">Batch size:</span> {POSITION_BATCH_SIZE}</div>
          <div><span className="font-medium">Position source:</span> {manualOverrideEnabled ? 'Manual override' : 'On-chain totals'}</div>
          <div><span className="font-medium">Draft in progress:</span> {String(Boolean(positionsUpdateInProgress))}</div>
          {activePendingUpdateMatchesTournament && (
            <div><span className="font-medium">Draft progress:</span> {(pendingProcessedEntries ?? 0n).toString()} / {(pendingExpectedEntries ?? 0n).toString()}</div>
          )}
        </div>

        {!manualOverrideEnabled && (
          <div className="rounded-lg border border-border p-3 text-sm space-y-2 mb-3">
            <div className="font-medium">Default flow: on-chain totals</div>
            <div style={{ color: 'var(--text-secondary)' }}>
              `Open Draft` and `Append Next Batch` will use `calculateTotalPoints(tokenId)` for every submitted carton in the active tournament.
            </div>
          </div>
        )}

        {manualOverrideEnabled && (
          <div className="rounded-lg border border-amber-300 bg-amber-50/40 p-3 space-y-3 mb-3">
            <div className="text-sm font-medium">Manual CSV override</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Use this only as an operational fallback. The normal path is on-chain totals.
            </div>
            <textarea
              className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              placeholder={"1,150\n3,120\n2,120\n4,95"}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
            />
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {manualOverrideEnabled ? (
            <>
              <Button type="button" variant="outline" onClick={fillFromOnchain} disabled={!canManagePredictions || isBusy || usedTokenIds.length === 0 || !canChangePositionSource}>
                Load On-Chain Into Editor
              </Button>
              <Button type="button" variant="outline" onClick={disableManualOverride} disabled={!canManagePredictions || isBusy || !canChangePositionSource}>
                Use On-Chain Totals
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" onClick={enableManualOverride} disabled={!canManagePredictions || isBusy || !canChangePositionSource}>
              Enable Manual Override
            </Button>
          )}
          <Button type="button" onClick={openPositionsDraft} disabled={!canManagePredictions || isBusy || Boolean(positionsUpdateInProgress)}>
            {isBusy ? 'Working...' : '1. Open Draft'}
          </Button>
          <Button type="button" variant="secondary" onClick={appendNextBatch} disabled={!canManagePredictions || isBusy || !activePendingUpdateMatchesTournament}>
            {isBusy ? 'Working...' : '2. Append Next Batch'}
          </Button>
          <Button type="button" variant="secondary" onClick={finalizePositionsDraft} disabled={!canManagePredictions || isBusy || !activePendingUpdateMatchesTournament || (pendingProcessedEntries ?? 0n) !== (pendingExpectedEntries ?? 0n)}>
            {isBusy ? 'Working...' : '3. Finalize Positions'}
          </Button>
          {activePendingUpdateMatchesTournament && (
            <Button type="button" variant="outline" onClick={cancelPendingUpdate} disabled={!canManagePredictions || isBusy}>
              Cancel Pending Update
            </Button>
          )}
        </div>

        <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {manualOverrideEnabled
            ? 'Manual override habilitado. El draft usara exactamente el CSV visible arriba.'
            : usedTokenIds.length === 0
              ? 'No hay cartones enviados todavía para el torneo activo.'
              : canFillFromOnchain
                ? `El draft usara ${usedTokenIds.length} cartón${usedTokenIds.length === 1 ? '' : 'es'} enviados del torneo activo, ordenados por puntos onchain.`
                : 'Cargando puntos onchain para preparar el ranking por defecto...'}
        </p>

        {!canChangePositionSource && (
          <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            La fuente del leaderboard queda bloqueada mientras haya un draft abierto para no mezclar batches de distintos orígenes.
          </p>
        )}

        {activePendingUpdateMatchesTournament && (
          <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {(pendingProcessedEntries ?? 0n) === 0n
              ? 'Draft abierto on-chain. El siguiente paso es subir el primer batch.'
              : (pendingProcessedEntries ?? 0n) < (pendingExpectedEntries ?? 0n)
                ? 'Draft abierto on-chain. Sigue subiendo los batches restantes antes de finalizar.'
                : 'Todos los entries del draft ya están cargados. Finaliza para publicar el leaderboard.'}
          </p>
        )}

        {previewEntries.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">{manualOverrideEnabled ? 'Preview from manual CSV:' : 'Preview from on-chain totals:'}</div>
            <div className="text-xs text-gray-600 space-y-0.5">
              {previewEntries.map((entry) => (
                <div key={`preview-${entry.tokenId.toString()}`}>
                  #{entry.rank} — Token {entry.tokenId.toString()} · {entry.points.toString()} pts
                </div>
              ))}
            </div>
          </div>
        )}

        {positionsArray.length > 0 && (
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

function TreasuryFundingSection({
  permissions,
}: {
  permissions: Pick<AdminPermissions, 'hasTreasuryAdminRole' | 'hasTreasuryFundDepositorRole'>
}) {
  const treasury = CONTRACT_ADDRESSES.TREASURY
  const tokenAddress = CONTRACT_ADDRESSES.USDC
  const { address } = useAccount()
  const { execute, isBusy } = useAdminWrite()

  const [tournamentId, setTournamentId] = useState('1')
  const [amountInput, setAmountInput] = useState('')

  const parsedTournamentId = /^\d+$/.test(tournamentId) ? BigInt(tournamentId) : 0n
  const parsedAmount = useMemo(() => parseUsdcAmount(amountInput), [amountInput])

  const { data: mintedTournamentCount } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'mintedByTournament',
    args: parsedTournamentId > 0n ? [parsedTournamentId] : undefined,
    query: { enabled: parsedTournamentId > 0n, refetchInterval: 10_000 },
  })

  const fundingContracts = useMemo(() => {
    const contracts: BatchedReadContract[] = [
      { address: treasury, abi: TREASURY_ABI, functionName: 'RESERVE_BPS', args: [] },
      { address: treasury, abi: TREASURY_ABI, functionName: 'salesClosed', args: [parsedTournamentId] },
      { address: treasury, abi: TREASURY_ABI, functionName: 'tournamentFinalized', args: [parsedTournamentId] },
      { address: treasury, abi: TREASURY_ABI, functionName: 'getPrizePool', args: [parsedTournamentId, tokenAddress] },
      { address: treasury, abi: TREASURY_ABI, functionName: 'getGlobalReserve', args: [tokenAddress] },
    ]

    if (address) {
      contracts.push(
        { address: tokenAddress, abi: USDC_ABI, functionName: 'balanceOf', args: [address] },
        { address: tokenAddress, abi: USDC_ABI, functionName: 'allowance', args: [address, treasury] },
      )
    }

    return contracts
  }, [address, parsedTournamentId, tokenAddress, treasury])

  const { data: fundingReadData, refetch: refetchFundingReads } = useReadContracts({
    contracts: fundingContracts,
    query: { refetchInterval: 10_000 },
  })

  const reserveBps = getBatchedResult<bigint>(fundingReadData, 0)
  const salesClosed = getBatchedResult<boolean>(fundingReadData, 1)
  const tournamentFinalized = getBatchedResult<boolean>(fundingReadData, 2)
  const prizePool = getBatchedResult<bigint>(fundingReadData, 3)
  const reservePool = getBatchedResult<bigint>(fundingReadData, 4)
  const walletBalance = address ? getBatchedResult<bigint>(fundingReadData, 5) : undefined
  const allowance = address ? getBatchedResult<bigint>(fundingReadData, 6) : undefined

  const reserveBpsValue = Number(reserveBps ?? 0n)
  const reserveCut = parsedAmount ? (parsedAmount * BigInt(reserveBpsValue)) / 10_000n : 0n
  const prizePoolCut = parsedAmount ? parsedAmount - reserveCut : 0n
  const needsApproval = parsedAmount !== undefined && (allowance ?? 0n) < parsedAmount
  const hasEnoughWalletBalance = parsedAmount !== undefined && (walletBalance ?? 0n) >= parsedAmount
  const hasEnoughReserve = parsedAmount !== undefined && (reservePool ?? 0n) >= parsedAmount

  const refreshFundingReads = async () => {
    await refetchFundingReads()
  }

  const approveUsdc = () => {
    if (!parsedAmount) {
      toast.error('Enter a valid USDC amount greater than zero.')
      return
    }

    void execute(
      {
        address: tokenAddress,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [treasury, parsedAmount],
      },
      {
        toastId: 'admin-approve-treasury-usdc',
        pendingMessage: 'Waiting for USDC approval confirmation...',
        successMessage: 'USDC approval saved for Treasury.',
        revertedMessage: 'USDC approval was rejected on-chain.',
        onSuccess: refreshFundingReads,
        logLabel: 'Admin approve Treasury USDC',
      },
    )
  }

  const depositExternalUsdc = () => {
    if (parsedTournamentId === 0n) {
      toast.error('Enter a valid tournament ID.')
      return
    }
    if (!parsedAmount) {
      toast.error('Enter a valid USDC amount greater than zero.')
      return
    }
    if (!hasEnoughWalletBalance) {
      toast.error('Connected wallet does not have enough USDC for this deposit.')
      return
    }
    if (needsApproval) {
      toast.error('Approve USDC for Treasury before depositing.')
      return
    }

    void execute(
      {
        address: treasury,
        abi: TREASURY_ABI,
        functionName: 'depositFromSalesERC20',
        args: [parsedTournamentId, tokenAddress, parsedAmount],
      },
      {
        toastId: `admin-treasury-deposit-${parsedTournamentId.toString()}`,
        pendingMessage: 'Depositing external USDC into Treasury...',
        successMessage: 'External USDC deposited into Treasury.',
        revertedMessage: 'Treasury USDC deposit was rejected on-chain.',
        onSuccess: refreshFundingReads,
        logLabel: 'Admin Treasury external USDC deposit',
      },
    )
  }

  const seedFromReserve = () => {
    if (parsedTournamentId === 0n) {
      toast.error('Enter a valid tournament ID.')
      return
    }
    if (!parsedAmount) {
      toast.error('Enter a valid USDC amount greater than zero.')
      return
    }
    if (!hasEnoughReserve) {
      toast.error('Global reserve does not have enough USDC for this seed.')
      return
    }

    void execute(
      {
        address: treasury,
        abi: TREASURY_ABI,
        functionName: 'seedTournamentFromReserve',
        args: [parsedTournamentId, tokenAddress, parsedAmount],
      },
        {
          toastId: `admin-seed-reserve-${parsedTournamentId.toString()}`,
          pendingMessage: 'Seeding tournament pool from reserve...',
          successMessage: 'Tournament pool seeded from global reserve.',
          revertedMessage: 'Reserve seeding was rejected on-chain.',
          onSuccess: refreshFundingReads,
          logLabel: 'Admin seed tournament from reserve',
        },
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treasury Funding</CardTitle>
        <CardDescription>Top up the USDC pool from the connected wallet before sales close, or move already-retained reserve into a tournament pool.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
            <span className="font-medium">Has FUND_DEPOSITOR_ROLE:</span>{' '}
            <span className={permissions.hasTreasuryFundDepositorRole ? 'text-green-600' : 'text-red-600'}>
              {String(permissions.hasTreasuryFundDepositorRole)}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Has Treasury DEFAULT_ADMIN_ROLE:</span>{' '}
            <span className={permissions.hasTreasuryAdminRole ? 'text-green-600' : 'text-red-600'}>
              {String(permissions.hasTreasuryAdminRole)}
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

          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium w-24">USDC Amount</span>
            <Input
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="100.00"
            />
          </div>

          <div className="text-sm space-y-1">
            <div><span className="font-medium">Minted cartones:</span> {mintedTournamentCount?.toString() ?? '—'}</div>
            <div><span className="font-medium">Wallet USDC:</span> {formatUsdc(walletBalance)}</div>
            <div><span className="font-medium">Allowance to Treasury:</span> {formatUsdc(allowance)}</div>
            <div><span className="font-medium">Prizeable Pool:</span> {formatUsdc(prizePool)}</div>
            <div><span className="font-medium">Global Reserve:</span> {formatUsdc(reservePool)}</div>
            <div><span className="font-medium">Reserve split:</span> {reserveBpsValue / 100}%</div>
            <div>
              <span className="font-medium">Sales Closed:</span>{' '}
              <span className={salesClosed ? 'text-yellow-600' : 'text-green-600'}>
                {String(Boolean(salesClosed))}
              </span>
            </div>
            <div>
              <span className="font-medium">Finalized:</span>{' '}
              <span className={tournamentFinalized ? 'text-green-600' : 'text-yellow-600'}>
                {String(Boolean(tournamentFinalized))}
              </span>
            </div>
          </div>

          {parsedAmount && (
            <div className="rounded-lg border border-border p-3 text-xs space-y-1">
              <div><span className="font-medium">Deposit split preview:</span> {formatUsdc(prizePoolCut)} to prize pool + {formatUsdc(reserveCut)} to global reserve.</div>
              <div><span className="font-medium">Reserve seed preview:</span> {formatUsdc(parsedAmount)} moved 1:1 from global reserve into the tournament pool.</div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={approveUsdc}
              disabled={!parsedAmount || !address || !needsApproval || isBusy}
            >
              {isBusy ? 'Working...' : needsApproval ? 'Approve USDC' : 'USDC Approved'}
            </Button>
            <Button
              onClick={depositExternalUsdc}
              disabled={
                !permissions.hasTreasuryFundDepositorRole
                || parsedTournamentId === 0n
                || !parsedAmount
                || !hasEnoughWalletBalance
                || needsApproval
                || Boolean(salesClosed)
                || Boolean(tournamentFinalized)
                || isBusy
              }
            >
              {isBusy ? 'Depositing...' : 'Deposit External USDC'}
            </Button>
            <Button
              variant="secondary"
              onClick={seedFromReserve}
              disabled={
                !permissions.hasTreasuryAdminRole
                || parsedTournamentId === 0n
                || !parsedAmount
                || !hasEnoughReserve
                || Boolean(tournamentFinalized)
                || isBusy
              }
            >
              {isBusy ? 'Seeding...' : 'Seed From Reserve'}
            </Button>
          </div>

          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            `Deposit External USDC` calls `depositFromSalesERC20`, so the configured reserve split still applies. After sales close, use `Seed From Reserve` instead.
          </div>

          {!permissions.hasTreasuryFundDepositorRole && (
            <div className="text-sm text-red-600">External USDC deposits require `Treasury.FUND_DEPOSITOR_ROLE`.</div>
          )}
          {!permissions.hasTreasuryAdminRole && (
            <div className="text-sm text-red-600">Seeding a tournament from reserve requires `Treasury.DEFAULT_ADMIN_ROLE`.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// --- Close Tournament Section ---

function CloseTournamentSection({
  permissions,
}: {
  permissions: Pick<AdminPermissions, 'hasTreasuryAdminRole' | 'hasTreasuryManagerRole'>
}) {
  const carton = CONTRACT_ADDRESSES.CARTON
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const treasury = CONTRACT_ADDRESSES.TREASURY
  const { execute, isBusy } = useAdminWrite()

  const [tournamentId, setTournamentId] = useState('1')
  const [distributionInput, setDistributionInput] = useState(FIXED_PRIZE_DISTRIBUTION_INPUT)
  const tokenAddress = CONTRACT_ADDRESSES.USDC
  const parsedTournamentId = /^\d+$/.test(tournamentId) ? BigInt(tournamentId) : 0n

  const { data: mintedTournamentCount } = useReadContract({
    address: carton,
    abi: CARTON_ABI,
    functionName: 'mintedByTournament',
    args: parsedTournamentId > 0n ? [parsedTournamentId] : undefined,
    query: { enabled: parsedTournamentId > 0n, refetchInterval: 10_000 },
  })

  const lifecycleContracts = useMemo(
    () => {
      const contracts: BatchedReadContract[] = [
        { address: carton, abi: CARTON_ABI, functionName: 'nextTokenId' },
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'positionsVersion' },
        { address: treasury, abi: TREASURY_ABI, functionName: 'salesClosed', args: [parsedTournamentId] },
        { address: treasury, abi: TREASURY_ABI, functionName: 'tournamentFinalized', args: [parsedTournamentId] },
        { address: treasury, abi: TREASURY_ABI, functionName: 'prizeDistributionSet', args: [parsedTournamentId, tokenAddress] },
        { address: treasury, abi: TREASURY_ABI, functionName: 'getPrizePool', args: [parsedTournamentId, tokenAddress] },
        { address: treasury, abi: TREASURY_ABI, functionName: 'getGlobalReserve', args: [tokenAddress] },
        { address: treasury, abi: TREASURY_ABI, functionName: 'finalPrizeAmountsReady', args: [parsedTournamentId, tokenAddress] },
        { address: treasury, abi: TREASURY_ABI, functionName: 'finalPrizeAmountTotals', args: [parsedTournamentId, tokenAddress] },
      ]

      return contracts
    },
    [carton, parsedTournamentId, predictions, tokenAddress, treasury],
  )

  const { data: lifecycleReadData, refetch: refetchLifecycleReads } = useReadContracts({
    contracts: lifecycleContracts,
    query: { refetchInterval: 10_000 },
  })

  const nextTokenId = getBatchedResult<bigint>(lifecycleReadData, 0)

  const candidateTokenIds = useMemo(() => {
    const upperBound = Number(nextTokenId ?? 1n)
    return Array.from({ length: Math.max(upperBound - 1, 0) }, (_, i) => BigInt(i + 1))
  }, [nextTokenId])

  const positionsVersion = getBatchedResult<bigint>(lifecycleReadData, 1)

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

  const salesClosed = getBatchedResult<boolean>(lifecycleReadData, 2)
  const tournamentFinalized = getBatchedResult<boolean>(lifecycleReadData, 3)
  const usdcDistributionSet = getBatchedResult<boolean>(lifecycleReadData, 4)
  const prizePool = getBatchedResult<bigint>(lifecycleReadData, 5)
  const reservePool = getBatchedResult<bigint>(lifecycleReadData, 6)
  const finalAmountsReady = getBatchedResult<boolean>(lifecycleReadData, 7)
  const finalAmountTotal = getBatchedResult<bigint>(lifecycleReadData, 8)

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

  const leaderboardTokenIds = useMemo(() => leaderboardEntries.map((entry) => entry.tokenId), [leaderboardEntries])

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

  const { data: claimablePrizeData, refetch: refetchClaimablePrizes } = useReadContracts({
    contracts: leaderboardTokenIds.map((tokenId) => ({
      address: treasury,
      abi: TREASURY_ABI,
      functionName: 'getClaimablePrizeAmount' as const,
      args: [parsedTournamentId, tokenId, tokenAddress] as const,
    })),
    query: {
      enabled: parsedTournamentId > 0n && leaderboardTokenIds.length > 0,
      refetchInterval: 10_000,
    },
  })

  const onchainFinalPayouts = useMemo(() => {
    return leaderboardEntries.map((entry, index) => ({
      ...entry,
      amount: (claimablePrizeData?.[index]?.result as bigint | undefined) ?? 0n,
    }))
  }, [claimablePrizeData, leaderboardEntries])

  const hasLoadedFinalAmounts = (finalAmountTotal ?? 0n) > 0n
  const displayedPayouts = hasLoadedFinalAmounts ? onchainFinalPayouts : (payoutPreview?.payouts ?? [])
  const displayedAssignedTotal = hasLoadedFinalAmounts
    ? onchainFinalPayouts.reduce((sum, entry) => sum + entry.amount, 0n)
    : (payoutPreview?.totalAssigned ?? 0n)

  const finalPrizePayload = useMemo(() => {
    if (!payoutPreview || candidateTokenIds.length === 0) return null

    const amountByTokenId = new Map(payoutPreview.payouts.map((entry) => [entry.tokenId.toString(), entry.amount]))

    return {
      tokenIds: candidateTokenIds,
      amounts: candidateTokenIds.map((tokenId) => amountByTokenId.get(tokenId.toString()) ?? 0n),
    }
  }, [candidateTokenIds, payoutPreview])

  const refreshLifecycleReads = async () => {
    await Promise.all([refetchLifecycleReads(), refetchClaimablePrizes()])
  }

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
        onSuccess: refreshLifecycleReads,
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
        onSuccess: refreshLifecycleReads,
      },
    )
  }

  const loadFinalPrizes = () => {
    const tid = Number(tournamentId)
    if (isNaN(tid) || tid <= 0) {
      toast.error('Enter a valid tournament ID')
      return
    }
    if (!payoutPreview || !finalPrizePayload) {
      toast.error('Set final leaderboard positions first so the final prize amounts can be computed.')
      return
    }

    void execute(
      {
        address: treasury,
        abi: TREASURY_ABI,
        functionName: 'setFinalPrizeAmounts',
        args: [BigInt(tid), tokenAddress, finalPrizePayload.tokenIds, finalPrizePayload.amounts],
      },
      {
        toastId: `admin-final-prizes-${tid}-usdc`,
        pendingMessage: 'Saving final USDC prize amounts...',
        successMessage: 'Final USDC prize amounts saved. Review them and seal when ready.',
        revertedMessage: 'Final USDC prize amounts were rejected on-chain.',
        logLabel: 'Admin set final prize amounts',
        onSuccess: refreshLifecycleReads,
      },
    )
  }

  const sealFinalPrizes = () => {
    const tid = Number(tournamentId)
    if (isNaN(tid) || tid <= 0) {
      toast.error('Enter a valid tournament ID')
      return
    }

    void execute(
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
        onSuccess: refreshLifecycleReads,
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
        onSuccess: refreshLifecycleReads,
      },
    )
  }

  const poolDisplay = prizePool !== undefined
    ? `${Number(formatUnits(prizePool, 6)).toFixed(2)} USDC`
    : '—'

  const reserveDisplay = reservePool !== undefined
    ? `${Number(formatUnits(reservePool, 6)).toFixed(2)} USDC`
    : '—'

  const finalTotalDisplay = finalAmountTotal !== undefined
    ? `${Number(formatUnits(finalAmountTotal, 6)).toFixed(2)} USDC`
    : '—'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tournament Lifecycle</CardTitle>
        <CardDescription>Close sales, set the fixed 32-place pyramid, load exact per-carton prizes, review/correct if needed, then seal and finalize claims.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
              <span className="font-medium">Has TOURNAMENT_MANAGER_ROLE:</span>{' '}
              <span className={permissions.hasTreasuryManagerRole ? 'text-green-600' : 'text-red-600'}>
                {String(permissions.hasTreasuryManagerRole)}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Has Treasury DEFAULT_ADMIN_ROLE:</span>{' '}
              <span className={permissions.hasTreasuryAdminRole ? 'text-green-600' : 'text-red-600'}>
                {String(permissions.hasTreasuryAdminRole)}
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
            <div><span className="font-medium">Minted cartones:</span> {mintedTournamentCount?.toString() ?? '—'}</div>
            <div><span className="font-medium">Prizeable Pool:</span> {poolDisplay}</div>
            <div><span className="font-medium">Global Reserve:</span> {reserveDisplay}</div>
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
            disabled={!permissions.hasTreasuryManagerRole || Boolean(salesClosed) || isBusy}
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
              disabled={!permissions.hasTreasuryAdminRole || !salesClosed || Boolean(tournamentFinalized) || isBusy}
            >
              {isBusy ? 'Saving...' : 'Set Distribution'}
            </Button>
          </div>

          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Default fixed pyramid: {FIXED_PRIZE_DISTRIBUTION_INPUT}
          </div>

          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            `Load Final Prizes` can be rerun before sealing. It overwrites every minted token for this tournament context, including prizes that now become `0`.
          </div>

          {(payoutPreview || hasLoadedFinalAmounts) && (
            <div className="rounded-lg border border-border p-3 space-y-3">
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Shared-rank preview:</span> {leaderboardEntries.length} ranked cartones</div>
                <div><span className="font-medium">Tokens overwritten on load:</span> {candidateTokenIds.length}</div>
                <div><span className="font-medium">Assigned to winners:</span> {Number(formatUnits(displayedAssignedTotal, 6)).toFixed(2)} USDC</div>
                {!hasLoadedFinalAmounts && payoutPreview && (
                  <>
                    <div><span className="font-medium">Global reserve after sealing:</span> {Number(formatUnits((reservePool ?? 0n) + payoutPreview.reserveAddition, 6)).toFixed(2)} USDC</div>
                    <div><span className="font-medium">Extra reserve from empty places / cent rounding:</span> {Number(formatUnits(payoutPreview.reserveAddition, 6)).toFixed(2)} USDC</div>
                  </>
                )}
                {hasLoadedFinalAmounts && (
                  <div className="text-xs text-gray-600">
                    Showing exact on-chain final prize amounts loaded for each token. This no longer simulates payouts from the current pool.
                  </div>
                )}
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
                <div className="text-sm font-medium mb-1">{hasLoadedFinalAmounts ? 'Final payouts loaded on-chain:' : 'Final payouts preview:'}</div>
                <div className="max-h-56 overflow-y-auto text-xs text-gray-600 space-y-0.5">
                  {displayedPayouts.map((entry) => (
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
                !permissions.hasTreasuryAdminRole
                || !salesClosed
                || !usdcDistributionSet
                || Boolean(finalAmountsReady)
              || Boolean(tournamentFinalized)
              || !finalPrizePayload
              || isBusy
            }
          >
            {isBusy ? 'Saving...' : 'Load Final Prizes'}
          </Button>

          <Button
            onClick={sealFinalPrizes}
            disabled={
                !permissions.hasTreasuryAdminRole
                || !salesClosed
                || !usdcDistributionSet
                || Boolean(finalAmountsReady)
              || Boolean(tournamentFinalized)
              || (finalAmountTotal ?? 0n) === 0n
              || isBusy
            }
          >
            {isBusy ? 'Sealing...' : 'Seal Final Prizes'}
          </Button>

          <Button
            onClick={finalizeTournament}
            disabled={!permissions.hasTreasuryManagerRole || !salesClosed || !usdcDistributionSet || !finalAmountsReady || Boolean(tournamentFinalized) || isBusy}
          >
            {isBusy ? 'Finalizing...' : 'Finalize Tournament'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// --- Main Admin Page ---

function isAddressLike(value: string): value is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(value)
}

const URI_SETTER_ROLE = keccak256(toBytes('URI_SETTER_ROLE')) as `0x${string}`

function MetadataSection({
  permissions,
}: {
  permissions: Pick<AdminPermissions, 'hasCartonAdminRole'>
}) {
  const carton = CONTRACT_ADDRESSES.CARTON
  const { execute, isBusy } = useAdminWrite()
  const { address } = useAccount()

  const [variantCount, setVariantCount] = useState('')
  const [grantAddress, setGrantAddress] = useState('')
  const [newUri, setNewUri] = useState('')

  const normalizedGrantAddress = useMemo(() => {
    const trimmed = grantAddress.trim()
    return isAddressLike(trimmed) ? (trimmed as Address) : undefined
  }, [grantAddress])

  const { data: metadataData, refetch: refetchMetadata } = useReadContracts({
    contracts: [
      { address: carton, abi: CARTON_ABI, functionName: 'metadataVariantCount' as const },
      { address: carton, abi: CARTON_ABI, functionName: 'uri' as const, args: [0n] as const },
      ...(address ? [{ address: carton, abi: CARTON_ABI, functionName: 'hasRole' as const, args: [URI_SETTER_ROLE, address] as const }] : []),
    ],
    query: { refetchInterval: 10_000 },
  })

  const currentVariantCount = getBatchedResult<number>(metadataData, 0)
  const currentUri = getBatchedResult<string>(metadataData, 1)
  const hasUriSetterRole = Boolean(getBatchedResult<boolean>(metadataData, 2))

  const handleSetVariantCount = () => {
    const count = parseInt(variantCount, 10)
    if (!Number.isFinite(count) || count < 0 || count > 65535) {
      toast.error('Ingresa un número entre 0 y 65535.')
      return
    }
    void execute(
      { address: carton, abi: CARTON_ABI, functionName: 'setMetadataVariantCount', args: [count] },
      {
        toastId: 'admin-set-variant-count',
        pendingMessage: 'Seteando cantidad de variantes...',
        successMessage: 'Cantidad de variantes actualizada.',
        revertedMessage: 'Rechazado en cadena.',
        logLabel: 'Admin set metadata variant count',
        onSuccess: () => { void refetchMetadata() },
      },
    )
  }

  const handleGrantUriSetterRole = () => {
    if (!normalizedGrantAddress) {
      toast.error('Dirección inválida.')
      return
    }
    void execute(
      { address: carton, abi: CARTON_ABI, functionName: 'grantRole', args: [URI_SETTER_ROLE, normalizedGrantAddress] },
      {
        toastId: `admin-grant-uri-setter-${normalizedGrantAddress}`,
        pendingMessage: 'Otorgando URI_SETTER_ROLE...',
        successMessage: 'URI_SETTER_ROLE otorgado.',
        revertedMessage: 'Rechazado en cadena.',
        logLabel: 'Admin grant carton URI setter role',
        onSuccess: () => { void refetchMetadata() },
      },
    )
  }

  const handleSetUri = () => {
    if (!newUri.trim()) {
      toast.error('Ingresa una URI.')
      return
    }
    void execute(
      { address: carton, abi: CARTON_ABI, functionName: 'setURI', args: [newUri.trim()] },
      {
        toastId: 'admin-set-uri',
        pendingMessage: 'Actualizando URI...',
        successMessage: 'URI actualizada.',
        revertedMessage: 'Rechazado en cadena.',
        logLabel: 'Admin set carton URI',
        onSuccess: () => { void refetchMetadata() },
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata del Cartón</CardTitle>
        <CardDescription>Configurá la cantidad de variantes y la URI base de los tokens.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <div>
            <span className="font-medium">metadataVariantCount:</span>{' '}
            <span className="font-mono">{currentVariantCount !== undefined ? String(currentVariantCount) : '—'}</span>
          </div>
          <div>
            <span className="font-medium">URI actual:</span>{' '}
            <span className="font-mono break-all">{currentUri || '(vacía)'}</span>
          </div>
          <div>
            <span className="font-medium">Wallet tiene URI_SETTER_ROLE:</span>{' '}
            <span className={hasUriSetterRole ? 'text-green-600' : 'text-red-600'}>{String(hasUriSetterRole)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Setear cantidad de variantes (DEFAULT_ADMIN_ROLE)</div>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min={0}
              max={65535}
              value={variantCount}
              onChange={(e) => setVariantCount(e.target.value)}
              placeholder="ej: 48"
              className="max-w-40"
            />
            <Button onClick={handleSetVariantCount} disabled={!permissions.hasCartonAdminRole || !variantCount || isBusy}>
              {isBusy ? 'Enviando...' : 'Setear variantes'}
            </Button>
          </div>
          {!permissions.hasCartonAdminRole && (
            <div className="text-sm text-red-600">Requiere `Carton.DEFAULT_ADMIN_ROLE`.</div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Otorgar URI_SETTER_ROLE (DEFAULT_ADMIN_ROLE)</div>
          <div className="flex gap-2 items-center">
            <Input
              value={grantAddress}
              onChange={(e) => setGrantAddress(e.target.value)}
              placeholder="0x... (wallet que podrá setear la URI)"
            />
            <Button onClick={handleGrantUriSetterRole} disabled={!permissions.hasCartonAdminRole || !normalizedGrantAddress || isBusy}>
              {isBusy ? 'Enviando...' : 'Otorgar rol'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Setear URI base (URI_SETTER_ROLE)</div>
          <div className="flex gap-2 items-center">
            <Input
              value={newUri}
              onChange={(e) => setNewUri(e.target.value)}
              placeholder="https://metadata.example.com/{id}.json"
            />
            <Button onClick={handleSetUri} disabled={!hasUriSetterRole || !newUri.trim() || isBusy}>
              {isBusy ? 'Enviando...' : 'Setear URI'}
            </Button>
          </div>
          {!hasUriSetterRole && (
            <div className="text-sm text-yellow-600">Otorgá URI_SETTER_ROLE a tu wallet antes de setear la URI.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function MinterRoleSection({
  permissions,
}: {
  permissions: Pick<AdminPermissions, 'hasCartonAdminRole' | 'cartonAdminRole' | 'cartonMinterRole'>
}) {
  const carton = CONTRACT_ADDRESSES.CARTON
  const { execute, isBusy } = useAdminWrite()
  const { address } = useAccount()
  const [targetAddress, setTargetAddress] = useState('')

  const normalizedTargetAddress = useMemo(() => {
    const trimmed = targetAddress.trim()
    return isAddressLike(trimmed) ? (trimmed as Address) : undefined
  }, [targetAddress])

  const { data: targetHasMinterRole = false, refetch: refetchTargetHasMinterRole } = useReadContract<boolean>({
    address: carton,
    abi: CARTON_ABI,
    functionName: 'hasRole',
    args: permissions.cartonMinterRole && normalizedTargetAddress ? [permissions.cartonMinterRole, normalizedTargetAddress] : undefined,
    query: { enabled: Boolean(permissions.cartonMinterRole && normalizedTargetAddress) },
  })

  const { data: connectedHasMinterRole = false, refetch: refetchConnectedHasMinterRole } = useReadContract<boolean>({
    address: carton,
    abi: CARTON_ABI,
    functionName: 'hasRole',
    args: permissions.cartonMinterRole && address ? [permissions.cartonMinterRole, address] : undefined,
    query: { enabled: Boolean(permissions.cartonMinterRole && address) },
  })

  const refreshRoleState = async () => {
    await Promise.all([refetchTargetHasMinterRole(), refetchConnectedHasMinterRole()])
  }

  const grantMinterRole = () => {
    if (!permissions.cartonMinterRole || !normalizedTargetAddress) {
      toast.error('Provide a valid target wallet address.')
      return
    }

    void execute(
      {
        address: carton,
        abi: CARTON_ABI,
        functionName: 'grantRole',
        args: [permissions.cartonMinterRole, normalizedTargetAddress],
      },
      {
        toastId: `admin-grant-minter-${normalizedTargetAddress}`,
        pendingMessage: 'Waiting for MINTER_ROLE grant confirmation...',
        successMessage: 'MINTER_ROLE granted.',
        revertedMessage: 'MINTER_ROLE grant was rejected on-chain.',
        logLabel: 'Admin grant carton minter role',
        onSuccess: refreshRoleState,
      },
    )
  }

  const revokeMinterRole = () => {
    if (!permissions.cartonMinterRole || !normalizedTargetAddress) {
      toast.error('Provide a valid target wallet address.')
      return
    }

    void execute(
      {
        address: carton,
        abi: CARTON_ABI,
        functionName: 'revokeRole',
        args: [permissions.cartonMinterRole, normalizedTargetAddress],
      },
      {
        toastId: `admin-revoke-minter-${normalizedTargetAddress}`,
        pendingMessage: 'Waiting for MINTER_ROLE revoke confirmation...',
        successMessage: 'MINTER_ROLE revoked.',
        revertedMessage: 'MINTER_ROLE revoke was rejected on-chain.',
        logLabel: 'Admin revoke carton minter role',
        onSuccess: refreshRoleState,
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carton Roles</CardTitle>
        <CardDescription>Grant or revoke `MINTER_ROLE` for the wallet that will issue cartones.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <div>
            <span className="font-medium">Carton DEFAULT_ADMIN_ROLE:</span>{' '}
            <span className={permissions.hasCartonAdminRole ? 'text-green-600' : 'text-red-600'}>
              {String(permissions.hasCartonAdminRole)}
            </span>
          </div>
          <div>
            <span className="font-medium">Connected wallet has MINTER_ROLE:</span>{' '}
            <span className={connectedHasMinterRole ? 'text-green-600' : 'text-red-600'}>
              {String(connectedHasMinterRole)}
            </span>
          </div>
          <RoleIdDisplay label="Carton admin role id" value={permissions.cartonAdminRole} />
          <RoleIdDisplay label="Carton minter role id" value={permissions.cartonMinterRole} />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Target wallet</div>
          <div className="flex gap-2 items-center">
            <Input
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              placeholder="0x..."
            />
            <Button onClick={grantMinterRole} disabled={!permissions.hasCartonAdminRole || !normalizedTargetAddress || isBusy}>
              {isBusy ? 'Granting...' : 'Grant MINTER_ROLE'}
            </Button>
            <Button variant="secondary" onClick={revokeMinterRole} disabled={!permissions.hasCartonAdminRole || !normalizedTargetAddress || isBusy}>
              {isBusy ? 'Revoking...' : 'Revoke'}
            </Button>
          </div>
          <div className="text-xs text-gray-600">
            {normalizedTargetAddress
              ? `Target has MINTER_ROLE: ${String(targetHasMinterRole)}`
              : 'Enter a valid wallet address to inspect and manage its role.'}
          </div>
          {!permissions.hasCartonAdminRole && (
            <div className="text-sm text-red-600">Granting or revoking `MINTER_ROLE` requires `Carton.DEFAULT_ADMIN_ROLE`.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TokenSupportSection({
  permissions,
}: {
  permissions: Pick<AdminPermissions, 'hasTreasuryAdminRole' | 'hasCartonAdminRole'>
}) {
  const treasury = CONTRACT_ADDRESSES.TREASURY
  const carton = CONTRACT_ADDRESSES.CARTON
  const { execute, isBusy } = useAdminWrite()
  const [tokenAddressInput, setTokenAddressInput] = useState<string>(CONTRACT_ADDRESSES.USDC)
  const [reviewConfirmed, setReviewConfirmed] = useState(false)

  const normalizedTokenAddress = useMemo(() => {
    const trimmed = tokenAddressInput.trim()
    return isAddressLike(trimmed) ? (trimmed as Address) : undefined
  }, [tokenAddressInput])

  const tokenContracts = useMemo(() => {
    if (!normalizedTokenAddress) return []

    return [
      { address: normalizedTokenAddress, abi: USDC_ABI, functionName: 'name' as const },
      { address: normalizedTokenAddress, abi: USDC_ABI, functionName: 'symbol' as const },
      { address: normalizedTokenAddress, abi: USDC_ABI, functionName: 'decimals' as const },
      { address: treasury, abi: TREASURY_ABI, functionName: 'supportedPrizeTokens' as const, args: [normalizedTokenAddress] as const },
      { address: carton, abi: CARTON_ABI, functionName: 'acceptedTokens' as const, args: [normalizedTokenAddress] as const },
    ]
  }, [carton, normalizedTokenAddress, treasury])

  const { data: tokenReadData, refetch: refetchTokenReads } = useReadContracts({
    contracts: tokenContracts,
    query: { enabled: tokenContracts.length > 0, refetchInterval: 10_000 },
  })

  const tokenName = getBatchedResult<string>(tokenReadData, 0)
  const tokenSymbol = getBatchedResult<string>(tokenReadData, 1)
  const tokenDecimals = getBatchedResult<number>(tokenReadData, 2)
  const treasurySupported = Boolean(getBatchedResult<boolean>(tokenReadData, 3))
  const cartonAccepted = Boolean(getBatchedResult<boolean>(tokenReadData, 4))

  const refreshTokenReads = async () => {
    await refetchTokenReads()
  }

  const setTreasurySupport = (supported: boolean) => {
    if (!normalizedTokenAddress) {
      toast.error('Provide a valid token address.')
      return
    }

    if (supported && !reviewConfirmed) {
      toast.error('Confirm the standard-ERC20 checklist before supporting a token.')
      return
    }

    void execute(
      {
        address: treasury,
        abi: TREASURY_ABI,
        functionName: 'setSupportedPrizeToken',
        args: [normalizedTokenAddress, supported],
      },
      {
        toastId: `admin-supported-token-${normalizedTokenAddress}-${String(supported)}`,
        pendingMessage: supported ? 'Adding token to Treasury allowlist...' : 'Removing token from Treasury allowlist...',
        successMessage: supported ? 'Token added to Treasury allowlist.' : 'Token removed from Treasury allowlist.',
        revertedMessage: supported ? 'Treasury token allowlist update was rejected on-chain.' : 'Treasury token removal was rejected on-chain.',
        logLabel: supported ? 'Admin support treasury prize token' : 'Admin unsupport treasury prize token',
        onSuccess: refreshTokenReads,
      },
    )
  }

  const setCartonAcceptance = (accepted: boolean) => {
    if (!normalizedTokenAddress) {
      toast.error('Provide a valid token address.')
      return
    }

    if (accepted && !reviewConfirmed) {
      toast.error('Confirm the standard-ERC20 checklist before accepting a token.')
      return
    }

    if (accepted && !treasurySupported) {
      toast.error('Support the token in Treasury before enabling it in Carton.')
      return
    }

    void execute(
      {
        address: carton,
        abi: CARTON_ABI,
        functionName: 'setAcceptedToken',
        args: [normalizedTokenAddress, accepted],
      },
      {
        toastId: `admin-accepted-token-${normalizedTokenAddress}-${String(accepted)}`,
        pendingMessage: accepted ? 'Enabling token in Carton...' : 'Disabling token in Carton...',
        successMessage: accepted ? 'Token enabled in Carton.' : 'Token disabled in Carton.',
        revertedMessage: accepted ? 'Carton token enable was rejected on-chain.' : 'Carton token disable was rejected on-chain.',
        logLabel: accepted ? 'Admin accept carton token' : 'Admin unaccept carton token',
        onSuccess: refreshTokenReads,
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Allowlist</CardTitle>
        <CardDescription>
          Manage which ERC20s Treasury supports for prize accounting and which of those Carton can sell.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Configured USDC:</span>{' '}
            <span className="font-mono break-all">{CONTRACT_ADDRESSES.USDC}</span>
          </div>
          <div>
            <span className="font-medium">Treasury DEFAULT_ADMIN_ROLE:</span>{' '}
            <span className={permissions.hasTreasuryAdminRole ? 'text-green-600' : 'text-red-600'}>
              {String(permissions.hasTreasuryAdminRole)}
            </span>
          </div>
          <div>
            <span className="font-medium">Carton DEFAULT_ADMIN_ROLE:</span>{' '}
            <span className={permissions.hasCartonAdminRole ? 'text-green-600' : 'text-red-600'}>
              {String(permissions.hasCartonAdminRole)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Token address</div>
          <div className="flex flex-wrap gap-2">
            <Input
              value={tokenAddressInput}
              onChange={(e) => setTokenAddressInput(e.target.value)}
              placeholder="0x..."
              className="font-mono"
            />
            <Button variant="outline" type="button" onClick={() => setTokenAddressInput(CONTRACT_ADDRESSES.USDC)}>
              Use configured USDC
            </Button>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            This admin flow can whitelist any standard ERC20, but the public player UI still assumes USDC for prices, pool display, and claims.
          </div>
        </div>

        <div
          className="rounded-lg border p-3 text-sm space-y-2"
          style={{ borderColor: 'var(--border-color)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="font-medium">Standard ERC20 review checklist</div>
          <div className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <div>Automatic detection is not reliable from just a token address.</div>
            <div>Before enabling a token, manually verify: no fee-on-transfer, no rebasing, and `transferFrom` credits the receiver with the exact requested amount.</div>
            <div>Also verify standard `approve`, `transfer`, and `balanceOf` behavior.</div>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={reviewConfirmed}
              onChange={(e) => setReviewConfirmed(e.target.checked)}
              className="mt-1"
            />
            <span>I manually reviewed this token and confirmed it is a standard ERC20 without fee-on-transfer or rebasing behavior.</span>
          </label>
        </div>

        <div className="grid gap-2 text-sm md:grid-cols-2">
          <div>
            <span className="font-medium">Name:</span> {tokenName ?? '—'}
          </div>
          <div>
            <span className="font-medium">Symbol:</span> {tokenSymbol ?? '—'}
          </div>
          <div>
            <span className="font-medium">Decimals:</span> {tokenDecimals ?? '—'}
          </div>
          <div>
            <span className="font-medium">Valid address:</span>{' '}
            <span className={normalizedTokenAddress ? 'text-green-600' : 'text-red-600'}>
              {String(Boolean(normalizedTokenAddress))}
            </span>
          </div>
          <div>
            <span className="font-medium">Treasury supported:</span>{' '}
            <span className={treasurySupported ? 'text-green-600' : 'text-yellow-600'}>
              {String(treasurySupported)}
            </span>
          </div>
          <div>
            <span className="font-medium">Carton accepted:</span>{' '}
            <span className={cartonAccepted ? 'text-green-600' : 'text-yellow-600'}>
              {String(cartonAccepted)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => setTreasurySupport(true)}
            disabled={!permissions.hasTreasuryAdminRole || !normalizedTokenAddress || treasurySupported || isBusy}
          >
            {isBusy ? 'Working...' : 'Support In Treasury'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setCartonAcceptance(true)}
            disabled={!permissions.hasCartonAdminRole || !normalizedTokenAddress || !treasurySupported || cartonAccepted || isBusy}
          >
            {isBusy ? 'Working...' : 'Enable In Carton'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setCartonAcceptance(false)}
            disabled={!permissions.hasCartonAdminRole || !normalizedTokenAddress || !cartonAccepted || isBusy}
          >
            {isBusy ? 'Working...' : 'Disable In Carton'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setTreasurySupport(false)}
            disabled={!permissions.hasTreasuryAdminRole || !normalizedTokenAddress || !treasurySupported || isBusy}
          >
            {isBusy ? 'Working...' : 'Remove From Treasury'}
          </Button>
        </div>

        <div className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
          <div>Recommended order: 1) Support in Treasury, 2) Enable in Carton.</div>
          <div>Recommended removal order: 1) Disable in Carton, 2) Remove from Treasury.</div>
        </div>

        {!permissions.hasTreasuryAdminRole && (
          <div className="text-sm text-red-600">Adding or removing supported prize tokens requires `Treasury.DEFAULT_ADMIN_ROLE`.</div>
        )}
        {!permissions.hasCartonAdminRole && (
          <div className="text-sm text-red-600">Enabling or disabling accepted sale tokens requires `Carton.DEFAULT_ADMIN_ROLE`.</div>
        )}
      </CardContent>
    </Card>
  )
}

function AdminOverviewSection({
  permissions,
  capabilities,
  address,
  isConnected,
}: {
  permissions: AdminPermissions
  capabilities: AdminCapability[]
  address?: Address
  isConnected: boolean
}) {
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS

  const overviewContracts = useMemo(
    () => {
      const contracts: BatchedReadContract[] = [
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'teamsHash' },
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'teamsHashFrozen' },
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'totalGames' },
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'predictionsStarted' },
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'submissionDeadline' },
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'officialWinnersSet' },
      ]

      return contracts
    },
    [predictions],
  )

  const { data: overviewData, refetch: refetchOverviewData } = useReadContracts({
    contracts: overviewContracts,
  })

  const onchainTeamsHash = getBatchedResult<string>(overviewData, 0)
  const isFrozen = getBatchedResult<boolean>(overviewData, 1)
  const onchainTotalGames = getBatchedResult<bigint>(overviewData, 2)
  const predictionsStarted = getBatchedResult<boolean>(overviewData, 3)
  const deadline = getBatchedResult<bigint>(overviewData, 4)
  const officialWinnersSet = Boolean(getBatchedResult<boolean>(overviewData, 5))

  const { data: overviewOfficialWinnersData } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'getOfficialWinners',
    query: { enabled: officialWinnersSet },
  })

  const officialWinners = parseOfficialWinners(overviewOfficialWinnersData).teamIds

  const [totalGamesLocal, setTotalGamesLocal] = useState<string>('')
  useEffect(() => {
    if (onchainTotalGames !== undefined) {
      setTotalGamesLocal(String(onchainTotalGames))
    }
  }, [onchainTotalGames])

  const [teamsHash, setTeamsHashLocal] = useState<string>('')
  useEffect(() => {
    const zero = '0x0000000000000000000000000000000000000000000000000000000000000000'
    if (onchainTeamsHash && onchainTeamsHash !== zero) {
      setTeamsHashLocal(onchainTeamsHash)
      return
    }

    const run = async () => {
      const local = await computeTeamsHash(teams2026Config)
      setTeamsHashLocal(local)
    }
    run()
  }, [onchainTeamsHash])

  const [deadlineLocal, setDeadlineLocal] = useState<string>('')
  useEffect(() => {
    if (deadline && Number(deadline) > 0) {
      const d = new Date(Number(deadline) * 1000)
      const pad = (n: number) => n.toString().padStart(2, '0')
      const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
      setDeadlineLocal(iso)
    }
  }, [deadline])

  const { execute, isBusy } = useAdminWrite()

  const refreshOverview = async () => {
    await refetchOverviewData()
  }

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
        onSuccess: refreshOverview,
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
        onSuccess: refreshOverview,
      },
    )
  }

  const setDeadline = () => {
    if (!deadlineLocal) return
    const ts = Math.floor(new Date(deadlineLocal).getTime() / 1000)
    if (!ts || isNaN(ts)) {
      toast.error('Invalid date/time')
      return
    }
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
        onSuccess: refreshOverview,
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
        onSuccess: refreshOverview,
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin</CardTitle>
        <CardDescription>Permission-aware controls for Predictions and Treasury</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div><span className="font-medium">Connected:</span> {isConnected ? address : 'Not connected'}</div>
          <div><span className="font-medium">Predictions owner:</span> {permissions.predictionsOwner ?? '—'}</div>
          <div><span className="font-medium">Predictions owner (short):</span> {truncateAddress(permissions.predictionsOwner)}</div>
          <div><span className="font-medium">Connected (short):</span> {truncateAddress(address)}</div>
          <div>
            <span className="font-medium">Can manage predictions:</span>{' '}
            <span className={permissions.isPredictionsOwner ? 'text-green-600' : 'text-red-600'}>
              {String(permissions.isPredictionsOwner)}
            </span>
          </div>
          <div>
            <span className="font-medium">Carton DEFAULT_ADMIN_ROLE:</span>{' '}
            <span className={permissions.hasCartonAdminRole ? 'text-green-600' : 'text-red-600'}>
              {String(permissions.hasCartonAdminRole)}
            </span>
          </div>
          <div>
            <span className="font-medium">Treasury DEFAULT_ADMIN_ROLE:</span>{' '}
            <span className={permissions.hasTreasuryAdminRole ? 'text-green-600' : 'text-red-600'}>
              {String(permissions.hasTreasuryAdminRole)}
            </span>
          </div>
          <div>
            <span className="font-medium">Treasury FUND_DEPOSITOR_ROLE:</span>{' '}
            <span className={permissions.hasTreasuryFundDepositorRole ? 'text-green-600' : 'text-red-600'}>
              {String(permissions.hasTreasuryFundDepositorRole)}
            </span>
          </div>
          <div>
            <span className="font-medium">Treasury TOURNAMENT_MANAGER_ROLE:</span>{' '}
            <span className={permissions.hasTreasuryManagerRole ? 'text-green-600' : 'text-red-600'}>
              {String(permissions.hasTreasuryManagerRole)}
            </span>
          </div>
          <div>
            <span className="font-medium">Official winners set:</span>{' '}
            <span className={officialWinnersSet ? 'text-green-600' : 'text-yellow-600'}>
              {String(officialWinnersSet)}
            </span>
          </div>
          {officialWinnersSet && officialWinners.length > 0 && (
            <div>
              <span className="font-medium">Official winners:</span>{' '}
              {officialWinners.map((teamId, index) => `${index + 1}. ${teamsById[teamId] ?? `Team ${teamId}`}`).join(' · ')}
            </div>
          )}
          <RoleIdDisplay label="Carton admin role id" value={permissions.cartonAdminRole} />
          <RoleIdDisplay label="Carton minter role id" value={permissions.cartonMinterRole} />
          <RoleIdDisplay label="Treasury admin role id" value={permissions.treasuryAdminRole} />
          <RoleIdDisplay label="Treasury fund depositor role id" value={permissions.treasuryFundDepositorRole} />
          <RoleIdDisplay label="Treasury manager role id" value={permissions.treasuryManagerRole} />
          {!permissions.isPredictionsOwner && <div className="text-red-600">Predictions config, results, winners, and positions require the `Predictions.owner()` wallet.</div>}
          {!permissions.hasCartonAdminRole && <div className="text-red-600">Mint wallet role management requires `Carton.DEFAULT_ADMIN_ROLE`.</div>}
          {!permissions.hasTreasuryFundDepositorRole && <div className="text-red-600">External USDC deposits require `Treasury.FUND_DEPOSITOR_ROLE`.</div>}
          {!permissions.hasTreasuryAdminRole && <div className="text-red-600">Reserve seeding, prize distribution, final prize loading, and sealing require `Treasury.DEFAULT_ADMIN_ROLE`.</div>}
          {!permissions.hasTreasuryManagerRole && <div className="text-red-600">Closing sales and finalizing the tournament require `Treasury.TOURNAMENT_MANAGER_ROLE`.</div>}
        </div>

        <div className="mt-6 space-y-3">
          <div className="text-sm font-medium">Wallet Capabilities</div>
          <div className="grid gap-3">
            {capabilities.map((capability) => (
              <div
                key={capability.label}
                className="rounded-lg border p-3"
                style={{ borderColor: 'var(--border-color)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">{capability.label}</div>
                  <CapabilityBadge allowed={capability.allowed} />
                </div>
                <div className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {capability.detail}
                </div>
                <div className="mt-1 text-xs" style={{ color: 'var(--text-disabled)' }}>
                  Requires {capability.required}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <div className="mb-2 font-medium">Teams Hash</div>
            <div className="flex gap-2 items-center">
              <Input value={teamsHash} onChange={(e) => setTeamsHashLocal(e.target.value)} placeholder="0x..." />
              <Button onClick={submitTeamsHash} disabled={!permissions.isPredictionsOwner || Boolean(isFrozen) || isBusy}>
                {isBusy ? 'Setting...' : 'Set Hash'}
              </Button>
            </div>
            <div className="text-xs text-gray-600 mt-1">Frozen: {String(Boolean(isFrozen))}</div>
            <Button className="mt-2" variant="secondary" onClick={freeze} disabled={!permissions.isPredictionsOwner || Boolean(isFrozen) || isBusy}>Freeze</Button>
          </div>

          <div>
            <div className="mb-2 font-medium">Submission Deadline</div>
            <div className="flex gap-2 items-center">
              <Input type="datetime-local" value={deadlineLocal} onChange={(e) => setDeadlineLocal(e.target.value)} />
              <Button onClick={setDeadline} disabled={!permissions.isPredictionsOwner || isBusy}>
                {isBusy ? 'Saving...' : 'Save Deadline'}
              </Button>
            </div>
          </div>

          <div>
            <div className="mb-2 font-medium">Total Games</div>
            <div className="text-xs text-gray-600 mb-1">On-chain: {onchainTotalGames !== undefined ? String(onchainTotalGames) : '—'} • Started: {String(Boolean(predictionsStarted))}</div>
            <div className="flex gap-2 items-center">
              <Input type="number" min={1} max={255} value={totalGamesLocal} onChange={(e) => setTotalGamesLocal(e.target.value)} />
              <Button onClick={setTotalGames} disabled={!permissions.isPredictionsOwner || Boolean(predictionsStarted) || isBusy}>
                {isBusy ? 'Saving...' : 'Save'}
              </Button>
            </div>
            <div className="text-xs text-gray-600 mt-1">Must be set before first submission. Typically derived from teams count.</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AdminPage() {
  const carton = CONTRACT_ADDRESSES.CARTON
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const treasury = CONTRACT_ADDRESSES.TREASURY
  const { address, isConnected } = useAccount()

  const [activeSection, setActiveSection] = useState<AdminSectionId>('overview')

  const permissionMetadataContracts = useMemo(
    () => {
      const contracts: BatchedReadContract[] = [
        { address: predictions, abi: PREDICTIONS_ABI, functionName: 'owner' },
        { address: treasury, abi: TREASURY_ABI, functionName: 'DEFAULT_ADMIN_ROLE' },
        { address: carton, abi: CARTON_ABI, functionName: 'DEFAULT_ADMIN_ROLE' },
        { address: carton, abi: CARTON_ABI, functionName: 'MINTER_ROLE' },
        { address: treasury, abi: TREASURY_ABI, functionName: 'TOURNAMENT_MANAGER_ROLE' },
        { address: treasury, abi: TREASURY_ABI, functionName: 'FUND_DEPOSITOR_ROLE' },
      ]

      return contracts
    },
    [carton, predictions, treasury],
  )

  const { data: permissionMetadataData } = useReadContracts({
    contracts: permissionMetadataContracts,
  })

  const owner = getBatchedResult<Address>(permissionMetadataData, 0)
  const treasuryAdminRole = getBatchedResult<`0x${string}`>(permissionMetadataData, 1)
  const cartonAdminRole = getBatchedResult<`0x${string}`>(permissionMetadataData, 2)
  const cartonMinterRole = getBatchedResult<`0x${string}`>(permissionMetadataData, 3)
  const treasuryManagerRole = getBatchedResult<`0x${string}`>(permissionMetadataData, 4)
  const treasuryFundDepositorRole = getBatchedResult<`0x${string}`>(permissionMetadataData, 5)

  const isPredictionsOwner = useMemo(() => {
    if (!address || !owner) return false
    return address.toLowerCase() === owner.toLowerCase()
  }, [address, owner])

  const permissionCheckContracts = useMemo(() => {
    if (!address || !treasuryAdminRole || !cartonAdminRole || !treasuryManagerRole || !treasuryFundDepositorRole) {
      return []
    }

    const contracts: BatchedReadContract[] = [
      { address: treasury, abi: TREASURY_ABI, functionName: 'hasRole', args: [treasuryAdminRole, address] },
      { address: carton, abi: CARTON_ABI, functionName: 'hasRole', args: [cartonAdminRole, address] },
      { address: treasury, abi: TREASURY_ABI, functionName: 'hasRole', args: [treasuryManagerRole, address] },
      { address: treasury, abi: TREASURY_ABI, functionName: 'hasRole', args: [treasuryFundDepositorRole, address] },
    ]

    return contracts
  }, [address, carton, cartonAdminRole, treasury, treasuryAdminRole, treasuryFundDepositorRole, treasuryManagerRole])

  const { data: permissionCheckData } = useReadContracts({
    contracts: permissionCheckContracts,
    query: { enabled: permissionCheckContracts.length > 0 },
  })

  const hasTreasuryAdminRole = Boolean(getBatchedResult<boolean>(permissionCheckData, 0))
  const hasCartonAdminRole = Boolean(getBatchedResult<boolean>(permissionCheckData, 1))
  const hasTreasuryManagerRole = Boolean(getBatchedResult<boolean>(permissionCheckData, 2))
  const hasTreasuryFundDepositorRole = Boolean(getBatchedResult<boolean>(permissionCheckData, 3))

  const permissions = useMemo<AdminPermissions>(
    () => ({
      predictionsOwner: owner,
      isPredictionsOwner,
      cartonAdminRole,
      hasCartonAdminRole,
      cartonMinterRole,
      treasuryAdminRole,
      hasTreasuryAdminRole,
      treasuryFundDepositorRole,
      hasTreasuryFundDepositorRole,
      treasuryManagerRole,
      hasTreasuryManagerRole,
    }),
    [cartonAdminRole, cartonMinterRole, hasCartonAdminRole, hasTreasuryAdminRole, hasTreasuryFundDepositorRole, hasTreasuryManagerRole, isPredictionsOwner, owner, treasuryAdminRole, treasuryFundDepositorRole, treasuryManagerRole],
  )

  const capabilities = useMemo<AdminCapability[]>(
    () => [
      {
        label: 'Predictions config',
        detail: 'teams hash, freeze, deadline, total games',
        required: 'Predictions.owner()',
        allowed: permissions.isPredictionsOwner,
      },
      {
        label: 'Results and winners',
        detail: 'set/update results, official winners',
        required: 'Predictions.owner()',
        allowed: permissions.isPredictionsOwner,
      },
      {
        label: 'Leaderboard positions',
        detail: 'manual upload, batches, cancel, fill from onchain',
        required: 'Predictions.owner()',
        allowed: permissions.isPredictionsOwner,
      },
      {
        label: 'Carton minter role management',
        detail: 'grant/revoke `MINTER_ROLE` for minting wallets',
        required: 'Carton.DEFAULT_ADMIN_ROLE',
        allowed: permissions.hasCartonAdminRole,
      },
      {
        label: 'Token allowlist management',
        detail: 'support ERC20s in Treasury and enable them in Carton after manual review',
        required: 'Treasury.DEFAULT_ADMIN_ROLE; Carton.DEFAULT_ADMIN_ROLE to sell in Carton',
        allowed: permissions.hasTreasuryAdminRole || permissions.hasCartonAdminRole,
      },
      {
        label: 'Treasury external funding',
        detail: 'approve USDC and deposit external funds before sales close',
        required: 'Treasury.FUND_DEPOSITOR_ROLE',
        allowed: permissions.hasTreasuryFundDepositorRole,
      },
      {
        label: 'Treasury distribution',
        detail: 'seed reserve, set distribution, load final prizes, seal final prizes',
        required: 'Treasury.DEFAULT_ADMIN_ROLE',
        allowed: permissions.hasTreasuryAdminRole,
      },
      {
        label: 'Tournament lifecycle',
        detail: 'close sales, finalize tournament',
        required: 'Treasury.TOURNAMENT_MANAGER_ROLE',
        allowed: permissions.hasTreasuryManagerRole,
      },
    ],
    [permissions.hasCartonAdminRole, permissions.hasTreasuryAdminRole, permissions.hasTreasuryFundDepositorRole, permissions.hasTreasuryManagerRole, permissions.isPredictionsOwner],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {ADMIN_SECTION_OPTIONS.map((section) => (
          <Button
            key={section.id}
            type="button"
            variant={activeSection === section.id ? 'default' : 'outline'}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </Button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <AdminOverviewSection
          permissions={permissions}
          capabilities={capabilities}
          address={address}
          isConnected={isConnected}
        />
      )}
      {activeSection === 'results' && <SetResultsSection canManagePredictions={permissions.isPredictionsOwner} />}
      {activeSection === 'winners' && <SetOfficialWinnersSection canManagePredictions={permissions.isPredictionsOwner} />}
      {activeSection === 'positions' && <SetPositionsSection canManagePredictions={permissions.isPredictionsOwner} />}
      {activeSection === 'roles' && <MinterRoleSection permissions={permissions} />}
      {activeSection === 'tokens' && <TokenSupportSection permissions={permissions} />}
      {activeSection === 'funding' && <TreasuryFundingSection permissions={permissions} />}
      {activeSection === 'lifecycle' && <CloseTournamentSection permissions={permissions} />}
      {activeSection === 'metadata' && <MetadataSection permissions={permissions} />}
    </div>
  )
}
