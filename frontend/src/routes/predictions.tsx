import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../components/ui/button'
import { ConfirmModal } from '../components/ui/modal'
import { TeamInfoSheet } from '../components/TeamInfoSheet'
import { TeamWinnerSelector } from '../components/TeamWinnerSelector'
import { PredictionGroupCarousel } from '../components/PredictionGroupCarousel'
import { ClaimSection } from '../components/ClaimSection'
import { TokenStatusBadge } from '../components/TokenStatusBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useAccount } from 'wagmi'
import { toast } from 'sonner'
import type { Abi, Address } from 'viem'
import { useAppReadContract, useAppReadContracts } from '../hooks/useAppRead'
import { hasOpenfortGasSponsorship, isDevOrTestChain } from '../lib/chains'
import { CARTON_ABI, CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'
import { computeTeamsHash, teams2026, teamsById } from '../lib/teams'
import { teams2026Config } from '../lib/teams2026.config'
import { buildAllGroupGames } from '../lib/games'
import { isImprobableGame } from '../lib/improbable-scores'
import type { Game } from '../lib/types'
import { useSimulatedContractWrite } from '../hooks/useSimulatedContractWrite'
import { useUserBalance } from '../hooks/useBalance'
import { getPredictionStatus, getPredictionStatusPriority, hasWinnersPrediction } from '../lib/prediction-status'
import { mapCombinedPredictionErrorToMessage } from '../lib/transaction-errors'
import { appPublicClient } from '../lib/publicClient'
import { DeadlineBanner } from '../components/DeadlineBanner'

const SHOW_GROUP_STRIP = true

function normalizeCartonParam(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return /^\d+$/.test(trimmed) ? trimmed : undefined
}

function normalizeSubmittedGames(value: unknown): { gameId: number; result: [number, number] }[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((entry) => {
    const rawGameId = Array.isArray(entry)
      ? entry[0]
      : typeof entry === 'object' && entry !== null && 'gameId' in entry
        ? (entry as { gameId?: unknown }).gameId
        : undefined
    const rawResult = Array.isArray(entry)
      ? entry[1]
      : typeof entry === 'object' && entry !== null && 'result' in entry
        ? (entry as { result?: unknown }).result
        : undefined

    if (!Array.isArray(rawResult) || rawResult.length < 2) return []

    const gameId = Number(rawGameId)
    const team1Goals = Number(rawResult[0])
    const team2Goals = Number(rawResult[1])

    if (![gameId, team1Goals, team2Goals].every(Number.isFinite)) return []

    return [{ gameId, result: [team1Goals, team2Goals] as [number, number] }]
  })
}

function normalizeSubmittedWinners(value: unknown): [number, number, number, number] {
  if (!Array.isArray(value)) return [0, 0, 0, 0]

  return [0, 1, 2, 3].map((index) => Number(value[index] ?? 0)) as [number, number, number, number]
}

function normalizeOfficialGameMeta(value: unknown): { id: number; set: boolean } | null {
  if (Array.isArray(value)) {
    const gameId = Number(value[0])
    const isSet = Boolean(value[1])
    return Number.isFinite(gameId) ? { id: gameId, set: isSet } : null
  }

  if (typeof value === 'object' && value !== null && 'id' in value && 'set' in value) {
    const gameId = Number((value as { id?: unknown }).id)
    const isSet = Boolean((value as { set?: unknown }).set)
    return Number.isFinite(gameId) ? { id: gameId, set: isSet } : null
  }

  return null
}

function getPanelStatusMeta(status: 'pending' | 'draft' | 'submitted' | 'expired') {
  switch (status) {
    case 'submitted':
      return {
        label: 'Enviado',
        detail: 'Esta parte ya quedó confirmada para este cartón.',
        bg: 'rgba(0,230,118,0.1)',
        color: 'var(--accent-green)',
      }
    case 'expired':
      return {
        label: 'Vencido',
        detail: 'El plazo cerró antes de completar esta parte.',
        bg: 'rgba(255,77,109,0.1)',
        color: 'var(--accent-red)',
      }
    case 'draft':
      return {
        label: 'Borrador',
        detail: 'Hay selecciones locales, pero todavía falta enviarlas.',
        bg: 'rgba(96,165,250,0.12)',
        color: 'rgb(125, 211, 252)',
      }
    default:
      return {
        label: 'Pendiente',
        detail: 'Todavía no empezaste esta parte para este cartón.',
        bg: 'rgba(255,214,0,0.1)',
        color: 'var(--accent-gold)',
      }
  }
}

type BlockingStateCard = {
  eyebrow: string
  title: string
  detail: string
  tone: 'neutral' | 'warning'
  actionLabel?: string
  actionTo?: '/'
}

type SubmittedScoredGameEntry = {
  gameId: number
  predictionIndex: number
  officialGame: { id: number; set: boolean } | null
}

type PredictionReadContract = {
  address: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
}

function getFlowCalloutToneStyles(tone: 'neutral' | 'success' | 'warning') {
  switch (tone) {
    case 'success':
      return {
        background: 'rgba(0,230,118,0.08)',
        border: '1px solid rgba(0,230,118,0.2)',
        accent: 'var(--accent-green)',
      }
    case 'warning':
      return {
        background: 'rgba(255,214,0,0.08)',
        border: '1px solid rgba(255,214,0,0.2)',
        accent: 'var(--accent-gold)',
      }
    default:
      return {
        background: 'rgba(96,165,250,0.08)',
        border: '1px solid rgba(96,165,250,0.18)',
        accent: 'rgb(125, 211, 252)',
      }
  }
}

export const Route = createFileRoute('/predictions')({
  component: PredictionsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    carton: normalizeCartonParam(search.carton),
  }),
})

const DEADLINE_NOT_SET_MESSAGE =
  'El deadline de envío no está configurado. Pide al admin que lo configure en la consola administrativa.'
const COMBINED_REVERT_MESSAGE = 'La predicción completa fue rechazada en cadena.'
const EMPTY_WINNER_PREDICTION: [number, number, number, number] = [0, 0, 0, 0]

function PredictionsPage() {
  const navigate = useNavigate()
  const { isConnected, address: userAddress } = useAccount()
  const { eth: nativeBalance } = useUserBalance()
  const { carton } = useSearch({ from: '/predictions' })
  const normalizedAddress = userAddress as `0x${string}` | undefined
  const tokenId = useMemo(() => (carton ? BigInt(carton) : undefined), [carton])
  const [activeTournamentId, setActiveTournamentId] = useState<bigint>()
  const [ownedCartons, setOwnedCartons] = useState<bigint[]>([])
  const [ownedCartonTournamentIds, setOwnedCartonTournamentIds] = useState<bigint[]>([])
  const [deadline, setDeadline] = useState<bigint>()
  const [totalGames, setTotalGames] = useState<number>()
  const [onchainTeamsHash, setOnchainTeamsHash] = useState<`0x${string}`>()

  const refetchBasePredictionReads = useCallback(async () => {
    const [nextTournamentId, nextDeadline, nextTotalGames, nextTeamsHash] = await Promise.all([
      appPublicClient.readContract({
        address: CONTRACT_ADDRESSES.CARTON,
        abi: CARTON_ABI,
        functionName: 'activeTournamentId',
      }),
      appPublicClient.readContract({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'submissionDeadline',
      }),
      appPublicClient.readContract({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'totalGames',
      }),
      appPublicClient.readContract({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'teamsHash',
      }),
    ])

    const nextOwnedCartons = normalizedAddress && isConnected
      ? await appPublicClient.readContract({
          address: CONTRACT_ADDRESSES.CARTON,
          abi: CARTON_ABI,
          functionName: 'getUserTokens',
          args: [normalizedAddress],
        })
      : []

    const nextOwnedCartonTournamentIds = await Promise.all(
      nextOwnedCartons.map((ownedTokenId) =>
        appPublicClient.readContract({
          address: CONTRACT_ADDRESSES.CARTON,
          abi: CARTON_ABI,
          functionName: 'tokenTournamentId',
          args: [ownedTokenId],
        })
      ),
    )

    setActiveTournamentId(nextTournamentId)
    setDeadline(nextDeadline)
    setTotalGames(nextTotalGames)
    setOnchainTeamsHash(nextTeamsHash)
    setOwnedCartons(Array.from(nextOwnedCartons))
    setOwnedCartonTournamentIds(nextOwnedCartonTournamentIds)
  }, [isConnected, normalizedAddress])

  useEffect(() => {
    void refetchBasePredictionReads()
  }, [refetchBasePredictionReads])

  const [{ games, groups }, setGameState] = useState(() => buildAllGroupGames())
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [isImprobableScoresModalOpen, setIsImprobableScoresModalOpen] = useState(false)
  const [activeTeamInfoId, setActiveTeamInfoId] = useState<number | null>(null)

  useEffect(() => {
    if (groups.length > 0 && selectedGroup === null) {
      setSelectedGroup(groups[0].groupLabel)
    }
  }, [groups, selectedGroup])

  const [winnerPrediction, setWinnerPrediction] = useState<[number, number, number, number]>(EMPTY_WINNER_PREDICTION)

  const resetPredictionDraft = ({ games: resetGames = true, winners: resetWinners = true }: { games?: boolean; winners?: boolean } = {}) => {
    if (resetGames) {
      setGameState(buildAllGroupGames())
      setSelectedGroup(null)
      setIsImprobableScoresModalOpen(false)
      setActiveTeamInfoId(null)
    }
    if (resetWinners) {
      setWinnerPrediction(EMPTY_WINNER_PREDICTION)
    }
  }

  const updateWinnerPrediction = (position: 1 | 2 | 3 | 4, teamId: number) => {
    setWinnerPrediction((prev) => {
      const updated = [...prev] as [number, number, number, number]
      updated[position - 1] = teamId
      return updated
    })
  }

  const hasValidWinners = useMemo(() => {
    const nonZero = winnerPrediction.filter((teamId) => teamId !== 0)
    return new Set(nonZero).size === winnerPrediction.length && nonZero.length === 4
  }, [winnerPrediction])

  const activeTournamentOwnedCartons = useMemo(() => {
    if (!ownedCartons.length || activeTournamentId === undefined) return []

    return ownedCartons.filter(
      (_, index) => (ownedCartonTournamentIds[index] ?? 0n) === activeTournamentId,
    )
  }, [activeTournamentId, ownedCartonTournamentIds, ownedCartons])

  const selectedCartonIsWalletOwned = useMemo(
    () => tokenId !== undefined && ownedCartons.some((id) => id === tokenId),
    [ownedCartons, tokenId],
  )

  const selectedCartonIsOwned = useMemo(
    () => tokenId !== undefined && activeTournamentOwnedCartons.some((id) => id === tokenId),
    [activeTournamentOwnedCartons, tokenId],
  )
  const hasAnyOwnedCartons = ownedCartons.length > 0
  const hasOwnedCartons = activeTournamentOwnedCartons.length > 0

  const { data: cartonGroupsState, refetch: refetchCartonUsedState } = useAppReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'used',
    args: [tokenId ?? 0n],
    query: { enabled: tokenId !== undefined, refetchInterval: 10000, refetchOnWindowFocus: true },
  })

  const { data: cartonWinnersState, refetch: refetchCartonWinnersState } = useAppReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'winnersPredictions',
    args: [tokenId ?? 0n],
    query: { enabled: tokenId !== undefined, refetchInterval: 10000, refetchOnWindowFocus: true },
  })

  const { data: submittedGames, refetch: refetchSubmittedGames } = useAppReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'getPrediction',
    args: [tokenId ?? 0n],
    query: {
      enabled: tokenId !== undefined && !!cartonGroupsState,
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    },
  })

  const { data: submittedWinners, refetch: refetchSubmittedWinners } = useAppReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'getWinnersPrediction',
    args: [tokenId ?? 0n],
    query: {
      enabled: tokenId !== undefined && hasWinnersPrediction(cartonWinnersState),
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    },
  })

  const updateGameScore = (gameId: number, team: 0 | 1, score: number | null) => {
    setGameState((prev) => {
      const updatedGames = prev.games.map((g) =>
        g.id === gameId
          ? { ...g, result: (team === 0 ? [score, g.result[1]] : [g.result[0], score]) as [number, number] }
          : g
      )
      const updatedGroups = prev.groups.map((group) => ({
        ...group,
        games: group.games.map((g) =>
          g.id === gameId
            ? { ...g, result: (team === 0 ? [score, g.result[1]] : [g.result[0], score]) as [number, number] }
            : g
        ),
      }))
      return { games: updatedGames, groups: updatedGroups }
    })
  }

  const fillRandomScores = () => {
    setGameState((prev) => {
      const randomize = (g: Game): Game => ({
        ...g,
        result: [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)],
      })
      return {
        games: prev.games.map(randomize),
        groups: prev.groups.map((group) => ({ ...group, games: group.games.map(randomize) })),
      }
    })
  }

  const combinedWrite = useSimulatedContractWrite()
  const predictionsPayload = useMemo(() => games.map((g) => ({ gameId: g.id, result: g.result })), [games])

  useEffect(() => {
    resetPredictionDraft()
  }, [tokenId])

  const submitPredictionAndWinners = () => {
    if (!tokenId) return
    if (combinedSubmitBlockedMessage) {
      toast.error(combinedSubmitBlockedMessage, { id: 'submit-combined-prediction' })
      return
    }

    void combinedWrite.simulateAndSend(
      {
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'submitPredictionAndWinners',
        args: [tokenId, predictionsPayload, winnerPrediction],
      },
      {
        toastId: 'submit-combined-prediction',
        pendingMessage: 'Esperando confirmación…',
        successMessage: '¡Predicción completa enviada!',
        revertedMessage: COMBINED_REVERT_MESSAGE,
        mapError: mapCombinedPredictionErrorToMessage,
        onSuccess: async () => {
          resetPredictionDraft()
          await Promise.all([
            refetchCartonUsedState(),
            refetchSubmittedGames(),
            refetchCartonWinnersState(),
            refetchSubmittedWinners(),
          ])
        },
        logLabel: 'Submit full prediction',
      },
    )
  }

  const improbableScoreSummaries = useMemo(() => {
    return games
      .filter((game) => isImprobableGame(game))
      .map((game) => `${teamsById[game.team1]} ${game.result[0] ?? '?'}-${game.result[1] ?? '?'} ${teamsById[game.team2]}`)
  }, [games])

  const handleSubmitCombinedClick = () => {
    if (combinedSubmitBlockedMessage) {
      toast.error(combinedSubmitBlockedMessage, { id: 'submit-combined-prediction' })
      return
    }

    if (improbableScoreSummaries.length > 0) {
      setIsImprobableScoresModalOpen(true)
      return
    }

    submitPredictionAndWinners()
  }

  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  const deadlineValue = deadline !== undefined ? Number(deadline) : undefined
  const hasDeadlineConfigured = deadlineValue !== undefined && deadlineValue > 0
  const remaining = useMemo(
    () => (hasDeadlineConfigured && deadlineValue !== undefined ? deadlineValue - now : undefined),
    [deadlineValue, hasDeadlineConfigured, now],
  )
  const isExpired = remaining !== undefined && remaining <= 0
  const selectedCartonGamesSubmitted = Boolean(cartonGroupsState)
  const selectedCartonWinnersSubmitted = hasWinnersPrediction(cartonWinnersState)
  const normalizedSubmittedGames = useMemo(() => normalizeSubmittedGames(submittedGames), [submittedGames])
  const normalizedSubmittedWinners = useMemo(() => normalizeSubmittedWinners(submittedWinners), [submittedWinners])
  const submittedOfficialGameContracts = useMemo(
    () =>
      normalizedSubmittedGames.map((entry) => ({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'games' as const,
        args: [entry.gameId] as const,
      })),
    [normalizedSubmittedGames],
  )
  const { data: submittedOfficialGamesData, refetch: refetchSubmittedOfficialGamesData } = useAppReadContracts({
    contracts: submittedOfficialGameContracts,
    query: {
      enabled: tokenId !== undefined && Boolean(cartonGroupsState) && submittedOfficialGameContracts.length > 0,
      refetchOnWindowFocus: false,
    },
  })
  const submittedScoredGameEntries = useMemo(() => {
    const entries: SubmittedScoredGameEntry[] = []
    normalizedSubmittedGames.forEach((entry, index) => {
      const officialGame = normalizeOfficialGameMeta(submittedOfficialGamesData?.[index]?.result)
      if (!officialGame?.set) return
      entries.push({ gameId: entry.gameId, predictionIndex: index, officialGame })
    })
    return entries
  }, [normalizedSubmittedGames, submittedOfficialGamesData])

  const submittedGamePointsContracts: PredictionReadContract[] = []

  if (tokenId && cartonGroupsState) {
    for (const entry of submittedScoredGameEntries) {
      submittedGamePointsContracts.push({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'calculatePoints',
        args: [tokenId, entry.predictionIndex],
      })
    }
  }
  const { data: submittedGamePointsData, refetch: refetchSubmittedGamePointsData } = useAppReadContracts({
    contracts: submittedGamePointsContracts,
    query: {
      enabled: tokenId !== undefined && Boolean(cartonGroupsState) && submittedGamePointsContracts.length > 0,
      refetchOnWindowFocus: false,
    },
  })
  const { data: selectedCartonTotalPoints, refetch: refetchSelectedCartonTotalPoints } = useAppReadContract<bigint>({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'calculateTotalPoints',
    args: [tokenId ?? 0n],
    query: {
      enabled: tokenId !== undefined && Boolean(cartonGroupsState),
      refetchOnWindowFocus: false,
    },
  })
  const submittedOfficialGamesKey = normalizedSubmittedGames.map((entry) => entry.gameId).join(',')

  useEffect(() => {
    if (!tokenId || !cartonGroupsState || !submittedOfficialGameContracts.length) return

    void refetchSubmittedOfficialGamesData()
  }, [cartonGroupsState, deadlineValue, refetchSubmittedOfficialGamesData, submittedOfficialGameContracts.length, submittedOfficialGamesKey, tokenId])
  const submittedPointsByGameId: Record<number, bigint> = {}

  submittedScoredGameEntries.forEach((entry, index) => {
    submittedPointsByGameId[entry.gameId] = (submittedGamePointsData?.[index]?.result as bigint | undefined) ?? 0n
  })
  const submittedGameState = useMemo(() => {
    if (!normalizedSubmittedGames.length) return null

    const baseState = buildAllGroupGames()
    const predictionsByGameId = new Map(normalizedSubmittedGames.map((entry) => [entry.gameId, entry.result]))

    return {
      games: baseState.games.map((game) => ({
        ...game,
        result: predictionsByGameId.get(game.id) ?? game.result,
      })),
      groups: baseState.groups.map((group) => ({
        ...group,
        games: group.games.map((game) => ({
          ...game,
          result: predictionsByGameId.get(game.id) ?? game.result,
        })),
      })),
    }
  }, [normalizedSubmittedGames])
  const displayGameState = selectedCartonGamesSubmitted && submittedGameState ? submittedGameState : { games, groups }
  const displayGames = displayGameState.games
  const displayGroups = displayGameState.groups
  const currentGroupIndex = useMemo(() => {
    const matchedIndex = displayGroups.findIndex((group) => group.groupLabel === selectedGroup)
    return matchedIndex >= 0 ? matchedIndex : 0
  }, [displayGroups, selectedGroup])

  const setGroupByIndex = useCallback(
    (index: number) => {
      const nextGroup = displayGroups[index]
      if (!nextGroup) return
      setSelectedGroup(nextGroup.groupLabel)
    },
    [displayGroups],
  )

  const displayWinnerPrediction = selectedCartonWinnersSubmitted ? normalizedSubmittedWinners : winnerPrediction
  const hasPartialSubmission = (selectedCartonGamesSubmitted || selectedCartonWinnersSubmitted)
    && !(selectedCartonGamesSubmitted && selectedCartonWinnersSubmitted)
  const selectedCartonStatus = getPredictionStatus({
    gamesSubmitted: selectedCartonGamesSubmitted,
    winnersSubmitted: selectedCartonWinnersSubmitted,
    deadline: deadlineValue,
    now,
  })
  const canEditSelectedCarton = Boolean(isConnected && selectedCartonIsOwned && !isExpired && !hasPartialSubmission)
  const completedGamesCount = useMemo(
    () => games.filter((game) => game.result[0] !== null && game.result[1] !== null).length,
    [games],
  )
  const remainingGamesCount = games.length - completedGamesCount
  const hasCompleteGamePredictions = games.length > 0 && remainingGamesCount === 0
  const hasGameDraft = completedGamesCount > 0
  const hasWinnerDraft = winnerPrediction.some((teamId) => teamId !== 0)
  const gamesPanelStatus = selectedCartonGamesSubmitted ? 'submitted' : isExpired ? 'expired' : hasGameDraft ? 'draft' : 'pending'
  const winnersPanelStatus = selectedCartonWinnersSubmitted ? 'submitted' : isExpired ? 'expired' : hasWinnerDraft ? 'draft' : 'pending'
  const gamesPanelMeta = getPanelStatusMeta(gamesPanelStatus)
  const winnersPanelMeta = getPanelStatusMeta(winnersPanelStatus)
  const canAttemptCombinedSubmit = tokenId !== undefined && selectedCartonIsOwned && !selectedCartonGamesSubmitted && !selectedCartonWinnersSubmitted

  const submittedScoredGamesKey = useMemo(
    () => submittedScoredGameEntries.map((entry) => `${entry.gameId}:${entry.predictionIndex}`).join(','),
    [submittedScoredGameEntries],
  )

  useEffect(() => {
    if (!tokenId || !cartonGroupsState) return

    if (submittedGamePointsContracts.length > 0) {
      void refetchSubmittedGamePointsData()
    }

    void refetchSelectedCartonTotalPoints()
  }, [cartonGroupsState, deadlineValue, refetchSelectedCartonTotalPoints, refetchSubmittedGamePointsData, submittedGamePointsContracts.length, submittedScoredGamesKey, tokenId])

  const ownedCartonStatusContracts: PredictionReadContract[] = []

  for (const ownedTokenId of activeTournamentOwnedCartons) {
    ownedCartonStatusContracts.push(
      {
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'used',
        args: [ownedTokenId],
      },
      {
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'winnersPredictions',
        args: [ownedTokenId],
      },
    )
  }

  const { data: ownedCartonStatusResults, refetch: refetchOwnedCartonStatusResults } = useAppReadContracts({
    contracts: ownedCartonStatusContracts,
    query: {
      enabled: ownedCartonStatusContracts.length > 0,
      refetchOnWindowFocus: false,
    },
  })

  const ownedCartonStatusKey = activeTournamentOwnedCartons.map((ownedTokenId) => ownedTokenId.toString()).join(',')

  useEffect(() => {
    if (!ownedCartonStatusContracts.length) return

    void refetchOwnedCartonStatusResults()
  }, [deadlineValue, ownedCartonStatusContracts.length, ownedCartonStatusKey, refetchOwnedCartonStatusResults])

  const ownedCartonEntries = useMemo(() => {
    if (!activeTournamentOwnedCartons.length) return []

    return activeTournamentOwnedCartons.map((ownedTokenId, index) => {
      const gamesSubmitted = Boolean(ownedCartonStatusResults?.[index * 2]?.result)
      const winnersSubmitted = hasWinnersPrediction(ownedCartonStatusResults?.[index * 2 + 1]?.result)
      const status = getPredictionStatus({ gamesSubmitted, winnersSubmitted, deadline: deadlineValue, now })

      return { tokenId: ownedTokenId, status, gamesSubmitted, winnersSubmitted }
    })
  }, [activeTournamentOwnedCartons, deadlineValue, now, ownedCartonStatusResults])

  const orderedOwnedCartons = useMemo(() => {
    return [...ownedCartonEntries].sort((a, b) => {
      const priorityDiff = getPredictionStatusPriority(a.status) - getPredictionStatusPriority(b.status)
      if (priorityDiff !== 0) return priorityDiff
      if (a.tokenId === b.tokenId) return 0
      return a.tokenId > b.tokenId ? -1 : 1
    })
  }, [ownedCartonEntries])

  const selectedCartonEntry = useMemo(
    () => orderedOwnedCartons.find((entry) => entry.tokenId === tokenId),
    [orderedOwnedCartons, tokenId],
  )

  useEffect(() => {
    if (tokenId !== undefined || orderedOwnedCartons.length === 0) return
    navigate({ to: '/predictions', search: { carton: orderedOwnedCartons[0].tokenId.toString() }, replace: true })
  }, [navigate, orderedOwnedCartons, tokenId])

  const [teamsHashStatus, setTeamsHashStatus] = useState<'unknown' | 'match' | 'mismatch' | 'unset'>('unknown')
  useEffect(() => {
    const run = async () => {
      try {
        if (!onchainTeamsHash) { setTeamsHashStatus('unset'); return }
        if (!teams2026Config.length) { setTeamsHashStatus('unknown'); return }
        const local = await computeTeamsHash(teams2026Config)
        setTeamsHashStatus(local.toLowerCase() === (onchainTeamsHash as string).toLowerCase() ? 'match' : 'mismatch')
      } catch { setTeamsHashStatus('unknown') }
    }
    run()
  }, [onchainTeamsHash])

  const totalGamesMismatch = totalGames !== undefined && Number(totalGames) !== games.length
  const tournamentReadyForSubmission = hasDeadlineConfigured && teamsHashStatus === 'match' && !totalGamesMismatch
  const checklistItems = [
    {
      key: 'carton',
      label: 'Selecciona un carton',
      done: tokenId !== undefined && selectedCartonIsOwned,
      detail: !isConnected
        ? 'Conéctate para cargar tus cartones'
        : !hasOwnedCartons
          ? 'Compra un carton para comenzar'
          : tokenId !== undefined && selectedCartonIsOwned
            ? `Carton #${tokenId.toString()} listo`
            : 'Elige con cual vas a jugar',
    },
    {
      key: 'games',
      label: 'Completa todos los partidos',
      done: selectedCartonGamesSubmitted || hasCompleteGamePredictions,
      detail: !tokenId || !selectedCartonIsOwned
        ? 'Primero selecciona un carton valido'
        : !tournamentReadyForSubmission
          ? 'Esperando configuracion completa del torneo'
          : selectedCartonGamesSubmitted
            ? 'Partidos ya enviados'
            : `${completedGamesCount}/${games.length} resultados completos`,
    },
    {
      key: 'winners',
      label: 'Elige a los 4 primeros',
      done: selectedCartonWinnersSubmitted || hasValidWinners,
      detail: !tokenId || !selectedCartonIsOwned
        ? 'Primero selecciona un carton valido'
        : !tournamentReadyForSubmission
          ? 'Esperando configuracion completa del torneo'
          : selectedCartonWinnersSubmitted
            ? 'Top 4 ya enviado'
            : hasValidWinners
              ? 'Top 4 listo para enviar'
              : 'Falta elegir 1°, 2°, 3° y 4° puesto',
    },
  ] as const

  const combinedSubmitBlockedMessage = (() => {
    if (!isConnected) return 'Conecta tu wallet para enviar la predicción completa.'
    if (!hasOwnedCartons) {
      return hasAnyOwnedCartons
        ? 'Esta wallet no tiene cartones del torneo activo.'
        : 'Compra un cartón antes de enviar predicciones.'
    }
    if (!tokenId) return 'Selecciona un cartón para enviar predicciones.'
    if (!selectedCartonIsWalletOwned) return 'El cartón seleccionado no pertenece a esta wallet.'
    if (!selectedCartonIsOwned) return 'El cartón seleccionado pertenece a otro torneo y no puede editarse desde este motor activo.'
    if (!hasDeadlineConfigured) return DEADLINE_NOT_SET_MESSAGE
    if (isExpired) return 'Las predicciones ya están cerradas para este torneo.'
    if (teamsHashStatus === 'unset') return 'Los equipos no están configurados en cadena aún.'
    if (teamsHashStatus === 'mismatch') return 'La configuración de equipos está desincronizada.'
    if (totalGamesMismatch) return `Desincronización de partidos — cadena espera ${String(totalGames)}, UI tiene ${games.length}.`
    if (selectedCartonGamesSubmitted) return 'Las predicciones de partidos ya fueron enviadas para este cartón.'
    if (selectedCartonWinnersSubmitted) return 'El top 4 ya fue enviado para este cartón.'
    if (!hasCompleteGamePredictions) {
      return `Completa los ${remainingGamesCount} partido${remainingGamesCount === 1 ? '' : 's'} restante${remainingGamesCount === 1 ? '' : 's'} antes de enviar todo.`
    }
    if (!hasValidWinners) return 'Elige 4 equipos distintos para 1°, 2°, 3° y 4° antes de enviar.'
    if (combinedWrite.isSimulating) return 'Verificando predicción completa contra el contrato…'
    if (combinedWrite.isPending) return 'Confirma la transacción en tu wallet.'
    if (combinedWrite.isConfirming) return 'Confirmando en cadena…'
    return null
  })()

  const canSubmitCombined = combinedSubmitBlockedMessage === null
  const blockingState: BlockingStateCard | null = (() => {
    if (!isConnected) {
      return {
        eyebrow: 'Wallet desconectada',
        title: 'Necesitas conectar tu wallet para comenzar.',
        detail: 'Cuando la conectes, esta pantalla cargara tus cartones y habilitara el flujo de envio.',
        tone: 'neutral',
      }
    }

    if (!hasOwnedCartons) {
      return {
        eyebrow: hasAnyOwnedCartons ? 'Otro torneo activo' : 'Sin cartones',
        title: hasAnyOwnedCartons ? 'Esta wallet no tiene cartones del torneo activo.' : 'Esta wallet todavia no tiene cartones.',
        detail: hasAnyOwnedCartons
          ? 'Tus cartones existentes pertenecen a otro torneo. Esta pantalla solo edita el torneo activo.'
          : 'Compra uno primero y luego vuelve aquí para completar partidos y top 4.',
        tone: 'neutral',
        actionLabel: 'Ir al inicio',
        actionTo: '/',
      }
    }

    if (tokenId !== undefined && !selectedCartonIsWalletOwned) {
      return {
        eyebrow: 'Carton invalido',
        title: 'El carton seleccionado no pertenece a esta wallet.',
        detail: 'Cambia a un carton propio para volver a editar o revisar una prediccion valida.',
        tone: 'warning',
      }
    }

    if (tokenId !== undefined && !selectedCartonIsOwned) {
      return {
        eyebrow: 'Otro torneo',
        title: 'El cartón seleccionado no pertenece al torneo activo.',
        detail: 'Puedes reclamar premios si corresponde, pero esta pantalla solo permite editar cartones del torneo actualmente conectado al motor de predicciones.',
        tone: 'warning',
      }
    }

    if (!hasDeadlineConfigured) {
      return {
        eyebrow: 'Torneo incompleto',
        title: 'El deadline de envio todavia no esta configurado.',
        detail: 'Hasta que exista una fecha valida, la app mantiene bloqueado el envio para evitar estados ambiguos.',
        tone: 'warning',
        actionLabel: undefined,
        actionTo: undefined,
      }
    }

    if (teamsHashStatus === 'unset') {
      return {
        eyebrow: 'Equipos no cargados',
        title: 'Falta publicar la configuracion de equipos en cadena.',
        detail: 'La pantalla puede mostrar el fixture local, pero no deberia permitir envios hasta que ambos lados coincidan.',
        tone: 'warning',
        actionLabel: undefined,
        actionTo: undefined,
      }
    }

    if (teamsHashStatus === 'mismatch') {
      return {
        eyebrow: 'Desincronizacion',
        title: 'La lista de equipos local no coincide con la version onchain.',
        detail: 'No es posible enviar la predicción porque hubo falta sincronizar una configuración, intentá nuevamente más tarde.',
        tone: 'warning',
        actionLabel: undefined,
        actionTo: undefined,
      }
    }

    if (totalGamesMismatch) {
      return {
        eyebrow: 'Fixture inconsistente',
        title: 'La cantidad de partidos no coincide entre UI y contrato.',
        detail: 'Mientras ese numero no cierre, la app mantiene bloqueado el envio para no grabar una prediccion incompleta o mal indexada.',
        tone: 'warning',
      }
    }

    if (isExpired && !(selectedCartonGamesSubmitted && selectedCartonWinnersSubmitted)) {
      return {
        eyebrow: 'Plazo cerrado',
        title: 'Este carton ya no puede seguir editandose.',
        detail: 'Puedes revisar lo que alcanzo a quedar cargado, pero el torneo ya cerro el periodo de envio.',
        tone: 'warning',
      }
    }

    return null
  })()

  const gasReadinessNotice = (() => {
    if (!isConnected || nativeBalance.isLoading || nativeBalance.value === undefined || !hasOwnedCartons || isExpired) return null
    if (hasOpenfortGasSponsorship) return null
    if (nativeBalance.value > 0n) return null

    return {
      title: `Te falta ${nativeBalance.symbol} para gas`,
      description:
        `Aunque el juego sea USDC-only, todavía necesitas ${nativeBalance.symbol} para enviar predicciones y reclamar premios.`,
    }
  })()

  const handleCartonChange = (value: string) => {
    navigate({ to: '/predictions', search: { carton: value } })
  }

  const handleRouteNavigation = (to?: BlockingStateCard['actionTo']) => {
    if (!to) return
    navigate({ to })
  }

  const selectorEmptyStyles = getFlowCalloutToneStyles(!isConnected || !hasOwnedCartons ? 'neutral' : 'warning')
  const blockingStateStyles = blockingState ? getFlowCalloutToneStyles(blockingState.tone) : null
  const checklistToneStyles = blockingState ? blockingStateStyles : null
  const passivePanelTone = !isConnected || !hasOwnedCartons || !tokenId ? 'neutral' : 'warning'
  const gamesPanelNoticeTone = hasCompleteGamePredictions ? 'success' : passivePanelTone
  const winnersPanelNoticeTone = canSubmitCombined ? 'success' : passivePanelTone
  const gamesPanelNoticeStyles = getFlowCalloutToneStyles(gamesPanelNoticeTone)
  const winnersPanelNoticeStyles = getFlowCalloutToneStyles(winnersPanelNoticeTone)
  const gamesPanelNotice = selectedCartonGamesSubmitted
    ? null
    : hasPartialSubmission
      ? 'Este cartón quedó en un estado parcial inesperado y ya no puede seguir editándose desde esta UI.'
    : !tokenId || !selectedCartonIsOwned
      ? 'Selecciona un cartón válido para comenzar a completar esta parte.'
      : !hasCompleteGamePredictions
        ? `Completa los ${remainingGamesCount} partido${remainingGamesCount === 1 ? '' : 's'} restante${remainingGamesCount === 1 ? '' : 's'}.`
        : 'Partidos completos. Sigue con el top 4 para habilitar el envío completo.'
  const winnersPanelNotice = selectedCartonWinnersSubmitted
    ? null
    : hasPartialSubmission
      ? 'Este cartón quedó en un estado parcial inesperado y ya no puede seguir editándose desde esta UI.'
    : combinedSubmitBlockedMessage ?? 'El top 4 está listo. Cuando revises todo, envía la predicción completa en una sola transacción.'

  const shouldShowSubmissionChecklist = !(
    tokenId !== undefined
    && selectedCartonIsOwned
    && selectedCartonGamesSubmitted
    && selectedCartonWinnersSubmitted
  )


  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* ─── Page header ─── */}
      <div>
        <h1 className="font-display text-2xl font-black uppercase tracking-wide sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
          Predicciones
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Predice resultados y el top 4 del torneo
        </p>
      </div>

      {/* ─── Status banners ─── */}
      {teamsHashStatus === 'mismatch' && (
        <div className="rounded-lg px-4 py-2.5 text-sm" style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.25)', color: 'var(--accent-red)' }}>
          ⚠ Configuración de equipos desincronizada — revisa la lista
        </div>
      )}
      {teamsHashStatus === 'unset' && (
        <div className="rounded-lg px-4 py-2.5 text-sm" style={{ background: 'rgba(255,214,0,0.08)', border: '1px solid rgba(255,214,0,0.2)', color: 'var(--accent-gold)' }}>
          ⚠ Hash de equipos no configurado en cadena
        </div>
      )}
      {totalGamesMismatch && (
        <div className="rounded-lg px-4 py-2.5 text-sm" style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.25)', color: 'var(--accent-red)' }}>
          ⚠ Desincronización de partidos — cadena: {String(totalGames)}, UI: {games.length}
        </div>
      )}

      {/* ─── Deadline banner ─── */}
      <DeadlineBanner deadline={deadline} />

      {gasReadinessNotice && (
        <div
          className="rounded-lg px-4 py-3 space-y-1"
          style={{
            background: 'rgba(255,77,109,0.08)',
            border: '1px solid rgba(255,77,109,0.22)',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--accent-red)' }}>
            {gasReadinessNotice.title}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {gasReadinessNotice.description}
          </p>
        </div>
      )}

      {/* ─── Carton selector ─── */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
          Seleccionar Cartón
        </p>
        {!isConnected ? (
          <div
            className="rounded-lg px-4 py-4 space-y-2"
            style={{ background: selectorEmptyStyles.background, border: selectorEmptyStyles.border }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Conéctate para ver tus cartones.
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Apenas la conectes, esta pantalla prioriza el carton mas accionable y te muestra el siguiente paso para terminarlo.
            </p>
          </div>
        ) : !hasOwnedCartons ? (
          <div
            className="rounded-lg px-4 py-4 space-y-3"
            style={{ background: selectorEmptyStyles.background, border: selectorEmptyStyles.border }}
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {hasAnyOwnedCartons ? 'No tienes cartones para este torneo activo.' : 'Esta wallet no tiene cartones aun.'}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {hasAnyOwnedCartons
                  ? 'Tus otros cartones pertenecen a torneos anteriores o distintos. Compra uno del torneo activo para usar esta pantalla de predicciones.'
                  : 'El flujo de predicciones empieza cuando compras uno. Después vuelves aquí para completar partidos y top 4.'}
              </p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleRouteNavigation('/')}>
              Ir al inicio
            </Button>
          </div>
        ) : (
          <>
            <Select value={tokenId?.toString()} onValueChange={handleCartonChange}>
              <SelectTrigger className="w-full sm:max-w-xs">
                <SelectValue placeholder="Selecciona un cartón" />
              </SelectTrigger>
              <SelectContent>
                {orderedOwnedCartons.map((entry) => (
                  <SelectItem key={entry.tokenId.toString()} value={entry.tokenId.toString()}>
                    Carton #{entry.tokenId.toString()} · {entry.status === 'partial' ? 'pendiente' : entry.status === 'none' ? 'pendiente' : entry.status === 'complete' ? 'completo' : 'vencido'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tokenId !== undefined && !selectedCartonIsWalletOwned && (
              <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
                Este cartón no pertenece a la wallet conectada.
              </p>
            )}
            {tokenId !== undefined && selectedCartonIsWalletOwned && !selectedCartonIsOwned && (
              <p className="text-sm" style={{ color: 'var(--accent-gold)' }}>
                Este cartón pertenece a otro torneo. Aquí solo se edita el torneo activo.
              </p>
            )}
            {tokenId !== undefined && selectedCartonIsOwned && selectedCartonEntry && (
              <div
                className="flex flex-col gap-3 rounded-lg px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <TokenStatusBadge status={selectedCartonStatus} />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {selectedCartonEntry.gamesSubmitted && selectedCartonEntry.winnersSubmitted
                      ? 'Este carton ya esta completo.'
                      : selectedCartonEntry.gamesSubmitted || selectedCartonEntry.winnersSubmitted
                        ? 'Este cartón quedó en un estado parcial fuera del flujo principal.'
                        : 'Siguiente paso: completar partidos y elegir a los 4 primeros.'}
                  </span>
                </div>
                {selectedCartonEntry.gamesSubmitted && selectedCartonTotalPoints !== undefined && (
                  <div className="self-start rounded-md px-3 py-2 sm:self-auto sm:text-right" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em]" style={{ color: 'var(--text-secondary)' }}>
                      Puntaje actual
                    </p>
                    <p
                      className="font-display text-2xl font-black leading-none tabular-nums"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono-custom)' }}
                    >
                      {selectedCartonTotalPoints.toString()}
                      <span className="ml-1 text-sm font-sans font-medium" style={{ color: 'var(--text-secondary)' }}>
                        pts
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {blockingState && blockingStateStyles && (
        <div
          className="rounded-xl p-4 sm:p-5"
          style={{ background: blockingStateStyles.background, border: blockingStateStyles.border }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: blockingStateStyles.accent }}>
                {blockingState.eyebrow}
              </p>
              <p className="text-base font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {blockingState.title}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {blockingState.detail}
              </p>
            </div>
            {blockingState.actionLabel && blockingState.actionTo && (
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleRouteNavigation(blockingState.actionTo)}>
                {blockingState.actionLabel}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ─── Submission checklist ─── */}
      {shouldShowSubmissionChecklist && (
        <div
          className="rounded-xl p-4 space-y-3"
          style={{
            background: checklistToneStyles ? checklistToneStyles.background : 'var(--bg-card)',
            border: checklistToneStyles ? checklistToneStyles.border : '1px solid var(--border-color)',
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                Checklist de envío
              </p>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {blockingState
                  ? blockingState.title
                  : selectedCartonGamesSubmitted || selectedCartonWinnersSubmitted
                    ? 'Este cartón quedó en un estado parcial fuera del flujo principal de la app.'
                    : canAttemptCombinedSubmit && canSubmitCombined
                      ? 'Ya puedes enviar la predicción completa en una sola transacción.'
                      : 'Completa estos 3 puntos antes de enviar la predicción completa.'}
              </p>
              {blockingState && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {blockingState.detail}
                </p>
              )}
            </div>
            {tokenId !== undefined && selectedCartonIsOwned && (
              <span className="text-xs sm:self-start" style={{ color: 'var(--text-secondary)' }}>
                Carton #{tokenId.toString()}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {checklistItems.map((item, index) => {
              return (
                <div
                  key={item.key}
                  className="rounded-lg px-3 py-2"
                  style={{
                    border: `1px solid ${item.done ? 'rgba(0,230,118,0.22)' : 'var(--border-color)'}`,
                    background: item.done ? 'rgba(0,230,118,0.06)' : 'var(--bg-elevated)',
                  }}
                >
                  <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: item.done ? 'var(--accent-green)' : 'var(--text-disabled)' }}>
                    {item.done ? 'Listo' : `Paso ${index + 1}`}
                  </p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {item.detail}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Game Predictions ─── */}
      <div
        id="games-panel"
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border-color)' }}
      >
        {/* Section header */}
        <div
          className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
          style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)' }}
        >
          <div>
            <p className="font-display text-base font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Partidos
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {displayGames.length} partidos de fase de grupos
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {gamesPanelMeta.detail}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full px-2 py-1 text-xs" style={{ background: gamesPanelMeta.bg, color: gamesPanelMeta.color }}>
              {gamesPanelMeta.label}
            </span>
            {!selectedCartonGamesSubmitted && tokenId !== undefined && selectedCartonIsOwned && (
              <span
                className="rounded-full px-2 py-1 text-xs"
                style={{
                  background: hasCompleteGamePredictions ? 'rgba(0,230,118,0.1)' : 'rgba(255,214,0,0.12)',
                  color: hasCompleteGamePredictions ? 'var(--accent-green)' : 'var(--accent-gold)',
                }}
              >
                {completedGamesCount}/{games.length} completos
              </span>
            )}
            {isDevOrTestChain && (
              <Button variant="ghost" size="sm" onClick={fillRandomScores} disabled={selectedCartonGamesSubmitted || isExpired}>
                Aleatorio
              </Button>
            )}
          </div>
        </div>

        {SHOW_GROUP_STRIP && (
          <div className="hidden p-4 md:block" style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex w-full items-center justify-between gap-1.5 rounded-lg p-1" style={{ background: 'var(--bg-card)' }}>
              {displayGroups.map((group) => (
                <button
                  key={group.groupLabel}
                  onClick={() => setSelectedGroup(group.groupLabel)}
                  className="shrink-0 rounded-full px-2.5 py-1 text-sm font-medium transition-all"
                  style={{
                    background: selectedGroup === group.groupLabel ? 'var(--accent-green)' : 'transparent',
                    color: selectedGroup === group.groupLabel ? 'var(--bg-base)' : 'var(--text-secondary)',
                    border: `1px solid ${selectedGroup === group.groupLabel ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {group.groupLabel}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Group matches */}
        <div className="p-3">
          {gamesPanelNotice && (
            <div
              className="mb-3 rounded-lg px-3 py-2 text-sm"
              style={{
                background: gamesPanelNoticeStyles.background,
                border: gamesPanelNoticeStyles.border,
                color: gamesPanelNoticeStyles.accent,
              }}
            >
              {gamesPanelNotice}
            </div>
          )}
          <PredictionGroupCarousel
            groups={displayGroups}
            currentGroupIndex={currentGroupIndex}
            disabled={!canEditSelectedCarton || selectedCartonGamesSubmitted}
            readOnlyAppearance={selectedCartonGamesSubmitted}
            onScoreChange={updateGameScore}
            pointsByGameId={selectedCartonGamesSubmitted ? submittedPointsByGameId : undefined}
            onOpenTeamInfo={setActiveTeamInfoId}
            onSelectGroupIndex={setGroupByIndex}
          />
        </div>

        {/* Submit games */}
        <div
          className="px-4 py-3 space-y-2"
          style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-color)' }}
        >
          {selectedCartonGamesSubmitted ? (
            <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
              {selectedCartonWinnersSubmitted
                ? 'Partidos confirmados. Este carton ya quedo cerrado y aqui solo ves el resumen enviado.'
                : 'Partidos confirmados. Este cartón quedó en un estado parcial que la app ya no promueve.'}
            </p>
          ) : (
            <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
              Los partidos forman parte del envío completo. Revisa esta sección y luego cierra todo desde el panel del top 4.
            </p>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isImprobableScoresModalOpen}
        onClose={() => setIsImprobableScoresModalOpen(false)}
        title="Confirmar marcadores poco habituales"
        message={`Tenes ${improbableScoreSummaries.length} partido${improbableScoreSummaries.length === 1 ? '' : 's'} con resultados de goleada historica: ${improbableScoreSummaries.join(', ')}. ¿Confirmas que queres enviar estas predicciones?`}
        confirmLabel="Sí, enviar la predicción"
        variant="warning"
        onConfirm={submitPredictionAndWinners}
      />

      <TeamInfoSheet teamId={activeTeamInfoId} onClose={() => setActiveTeamInfoId(null)} />

      {/* ─── Winner Predictions ─── */}
      <div
        id="winners-panel"
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border-color)' }}
      >
        <div
          className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
          style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)' }}
        >
          <div>
              <p className="font-display text-base font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Top 4 del Torneo
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Elige 1°, 2°, 3° y 4° puesto
              </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {winnersPanelMeta.detail}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full px-2 py-1 text-xs" style={{ background: winnersPanelMeta.bg, color: winnersPanelMeta.color }}>
              {winnersPanelMeta.label}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {winnersPanelNotice && (
            <div
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: winnersPanelNoticeStyles.background,
                border: winnersPanelNoticeStyles.border,
                color: winnersPanelNoticeStyles.accent,
              }}
            >
              {winnersPanelNotice}
            </div>
          )}
          <TeamWinnerSelector label="1er Lugar" teams={teams2026} selectedTeams={displayWinnerPrediction} currentPosition={1} disabled={!canEditSelectedCarton || selectedCartonWinnersSubmitted} readOnlyAppearance={selectedCartonWinnersSubmitted} onChange={(teamId) => updateWinnerPrediction(1, teamId)} />
          <TeamWinnerSelector label="2do Lugar" teams={teams2026} selectedTeams={displayWinnerPrediction} currentPosition={2} disabled={!canEditSelectedCarton || selectedCartonWinnersSubmitted} readOnlyAppearance={selectedCartonWinnersSubmitted} onChange={(teamId) => updateWinnerPrediction(2, teamId)} />
          <TeamWinnerSelector label="3er Lugar" teams={teams2026} selectedTeams={displayWinnerPrediction} currentPosition={3} disabled={!canEditSelectedCarton || selectedCartonWinnersSubmitted} readOnlyAppearance={selectedCartonWinnersSubmitted} onChange={(teamId) => updateWinnerPrediction(3, teamId)} />
          <TeamWinnerSelector label="4to Lugar" teams={teams2026} selectedTeams={displayWinnerPrediction} currentPosition={4} disabled={!canEditSelectedCarton || selectedCartonWinnersSubmitted} readOnlyAppearance={selectedCartonWinnersSubmitted} onChange={(teamId) => updateWinnerPrediction(4, teamId)} />
        </div>

        <div
          className="px-4 py-3 space-y-2"
          style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-color)' }}
        >
          {selectedCartonWinnersSubmitted ? (
            <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
              {selectedCartonGamesSubmitted
                ? 'Top 4 confirmado. Este carton ya no requiere mas acciones y queda a la espera de resultados.'
                : 'Top 4 confirmado. Puedes revisar arriba los equipos que quedaron guardados.'}
            </p>
          ) : selectedCartonGamesSubmitted || selectedCartonWinnersSubmitted ? (
            <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
              Este cartón quedó en un estado parcial inesperado. El flujo principal de la app ahora exige envío completo en una sola transacción.
            </p>
          ) : (
            <>
              <Button
                className="w-full h-11 text-base font-semibold"
                disabled={!canSubmitCombined}
                onClick={handleSubmitCombinedClick}
                style={canSubmitCombined ? { boxShadow: 'var(--glow-green)' } : undefined}
              >
                {combinedWrite.isSimulating
                  ? 'Verificando…'
                  : combinedWrite.isPending
                    ? 'Confirmando…'
                  : combinedWrite.isConfirming
                    ? 'Procesando…'
                      : 'Enviar predicción'}
              </Button>
              <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                {combinedSubmitBlockedMessage ?? 'Este es el único camino del producto: partidos + top 4 en una sola transacción.'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* ─── Prize Claims ─── */}
      {tokenId !== undefined && <ClaimSection tokenId={tokenId} />}
    </div>
  )
}
