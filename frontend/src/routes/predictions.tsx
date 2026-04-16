import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { ConfirmModal } from '../components/ui/modal'
import { TeamWinnerSelector } from '../components/TeamWinnerSelector'
import { GroupsView } from '../components/GroupsView'
import { ClaimSection } from '../components/ClaimSection'
import { TokenStatusBadge } from '../components/TokenStatusBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { toast } from 'sonner'
import { CARTON_ABI, CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'
import { computeTeamsHash, teams2026, teamsById } from '../lib/teams'
import { teams2026Config } from '../lib/teams2026.config'
import { buildAllGroupGames } from '../lib/games'
import type { Game } from '../lib/types'
import { useSimulatedContractWrite } from '../hooks/useSimulatedContractWrite'
import { getPredictionStatus, getPredictionStatusPriority, hasWinnersPrediction } from '../lib/prediction-status'
import { mapCombinedPredictionErrorToMessage, mapPredictionErrorToMessage, mapWinnersErrorToMessage } from '../lib/transaction-errors'

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

function getPanelStatusMeta(status: 'pending' | 'draft' | 'submitted' | 'expired') {
  switch (status) {
    case 'submitted':
      return {
        label: 'Enviado onchain',
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
        detail: 'Hay selecciones locales, pero todavía falta enviarlas onchain.',
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

export const Route = createFileRoute('/predictions')({
  component: PredictionsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    carton: normalizeCartonParam(search.carton),
  }),
})

const DEADLINE_NOT_SET_MESSAGE =
  'El deadline de envío no está configurado. Pide al admin que lo configure en /admin/dev.'
const PREDICTION_REVERT_MESSAGE = 'Las predicciones de partidos fueron rechazadas en cadena.'
const COMBINED_REVERT_MESSAGE = 'La predicción completa fue rechazada en cadena.'
const WINNERS_REVERT_MESSAGE = 'Las predicciones de ganadores fueron rechazadas en cadena.'
// TODO: Revisar este criterio con producto. Hoy se marca como "poco habitual"
// cuando un equipo llega a 10+ goles, pero tal vez deba basarse en goles
// totales del partido (por ejemplo, 6-5).
const IMPROBABLE_SCORE_THRESHOLD = 10
const EMPTY_WINNER_PREDICTION: [number, number, number, number] = [0, 0, 0, 0]

function PredictionsPage() {
  const navigate = useNavigate()
  const { isConnected, address: userAddress } = useAccount()
  const { carton } = useSearch({ from: '/predictions' })
  const normalizedAddress = userAddress as `0x${string}` | undefined
  const tokenId = useMemo(() => (carton ? BigInt(carton) : undefined), [carton])

  const [{ games, groups }, setGameState] = useState(() => buildAllGroupGames())
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [isImprobableScoresModalOpen, setIsImprobableScoresModalOpen] = useState(false)
  const [pendingGameSubmitMode, setPendingGameSubmitMode] = useState<'games' | 'combined'>('games')

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
      setPendingGameSubmitMode('games')
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

  const { data: ownedCartons } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'getUserTokens',
    args: normalizedAddress ? [normalizedAddress] : undefined,
    query: {
      enabled: Boolean(normalizedAddress) && isConnected,
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    },
  })

  const selectedCartonIsOwned = useMemo(
    () => tokenId !== undefined && (ownedCartons?.some((id) => id === tokenId) ?? false),
    [ownedCartons, tokenId],
  )
  const hasOwnedCartons = (ownedCartons?.length ?? 0) > 0

  const { data: cartonGroupsState, refetch: refetchCartonUsedState } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'used',
    args: [tokenId ?? 0n],
    query: { enabled: tokenId !== undefined, refetchInterval: 10000, refetchOnWindowFocus: true },
  })

  const { data: cartonWinnersState, refetch: refetchCartonWinnersState } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'winnersPredictions',
    args: [tokenId ?? 0n],
    query: { enabled: tokenId !== undefined, refetchInterval: 10000, refetchOnWindowFocus: true },
  })

  const { data: submittedGames, refetch: refetchSubmittedGames } = useReadContract({
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

  const { data: submittedWinners, refetch: refetchSubmittedWinners } = useReadContract({
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

  const predictionWrite = useSimulatedContractWrite()
  const combinedWrite = useSimulatedContractWrite()
  const winnersWrite = useSimulatedContractWrite()
  const predictionsPayload = useMemo(() => games.map((g) => ({ gameId: g.id, result: g.result })), [games])

  useEffect(() => {
    resetPredictionDraft()
  }, [tokenId])

  const submitPrediction = () => {
    if (!tokenId) return
    if (predictionSubmitBlockedMessage) {
      toast.error(predictionSubmitBlockedMessage, { id: 'submit-prediction' })
      return
    }
    void predictionWrite.simulateAndSend(
      { address: CONTRACT_ADDRESSES.PREDICTIONS, abi: PREDICTIONS_ABI, functionName: 'submitPrediction', args: [tokenId, predictionsPayload] },
      {
        toastId: 'submit-prediction',
        pendingMessage: 'Esperando confirmación…',
        successMessage: '¡Predicciones de partidos enviadas!',
        revertedMessage: PREDICTION_REVERT_MESSAGE,
        mapError: mapPredictionErrorToMessage,
        onSuccess: async () => {
          resetPredictionDraft({ games: true, winners: false })
          await Promise.all([refetchCartonUsedState(), refetchSubmittedGames()])
        },
        logLabel: 'Submit game predictions',
      },
    )
  }

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
      .filter((game) => game.result.some((score) => score !== null && score >= IMPROBABLE_SCORE_THRESHOLD))
      .map((game) => `${teamsById[game.team1]} ${game.result[0] ?? '?'}-${game.result[1] ?? '?'} ${teamsById[game.team2]}`)
  }, [games])

  const handleSubmitPredictionClick = () => {
    if (predictionSubmitBlockedMessage) {
      toast.error(predictionSubmitBlockedMessage, { id: 'submit-prediction' })
      return
    }

    if (improbableScoreSummaries.length > 0) {
      setPendingGameSubmitMode('games')
      setIsImprobableScoresModalOpen(true)
      return
    }

    submitPrediction()
  }

  const handleSubmitCombinedClick = () => {
    if (combinedSubmitBlockedMessage) {
      toast.error(combinedSubmitBlockedMessage, { id: 'submit-combined-prediction' })
      return
    }

    if (improbableScoreSummaries.length > 0) {
      setPendingGameSubmitMode('combined')
      setIsImprobableScoresModalOpen(true)
      return
    }

    submitPredictionAndWinners()
  }

  const submitWinners = () => {
    if (!tokenId) return
    if (winnersSubmitBlockedMessage) {
      toast.error(winnersSubmitBlockedMessage, { id: 'submit-winners' })
      return
    }
    void winnersWrite.simulateAndSend(
      { address: CONTRACT_ADDRESSES.PREDICTIONS, abi: PREDICTIONS_ABI, functionName: 'predictWinners', args: [tokenId, winnerPrediction] },
      {
        toastId: 'submit-winners',
        pendingMessage: 'Esperando confirmación…',
        successMessage: '¡Predicciones de ganadores enviadas!',
        revertedMessage: WINNERS_REVERT_MESSAGE,
        mapError: mapWinnersErrorToMessage,
        onSuccess: async () => {
          resetPredictionDraft({ games: false, winners: true })
          await Promise.all([refetchCartonWinnersState(), refetchSubmittedWinners()])
        },
        logLabel: 'Submit winner predictions',
      },
    )
  }

  const { data: deadline } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'submissionDeadline',
    query: { refetchInterval: 10000, refetchOnWindowFocus: true },
  })
  const { data: totalGames } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'totalGames',
    query: { refetchInterval: 10000, refetchOnWindowFocus: true },
  })

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
  const displayWinnerPrediction = selectedCartonWinnersSubmitted ? normalizedSubmittedWinners : winnerPrediction
  const selectedCartonStatus = getPredictionStatus({
    gamesSubmitted: selectedCartonGamesSubmitted,
    winnersSubmitted: selectedCartonWinnersSubmitted,
    deadline: deadlineValue,
    now,
  })
  const canEditSelectedCarton = Boolean(isConnected && selectedCartonIsOwned && !isExpired)
  const completedGamesCount = useMemo(
    () => games.filter((game) => game.result[0] !== null && game.result[1] !== null).length,
    [games],
  )
  const remainingGamesCount = games.length - completedGamesCount
  const hasCompleteGamePredictions = games.length > 0 && remainingGamesCount === 0
  const hasGameDraft = completedGamesCount > 0
  const hasWinnerDraft = winnerPrediction.some((teamId) => teamId !== 0)
  const selectedGroupPendingGames = useMemo(() => {
    if (!selectedGroup) return 0
    const group = groups.find((entry) => entry.groupLabel === selectedGroup)
    if (!group) return 0
    return group.games.filter((game) => game.result[0] === null || game.result[1] === null).length
  }, [groups, selectedGroup])
  const gamesPanelStatus = selectedCartonGamesSubmitted ? 'submitted' : isExpired ? 'expired' : hasGameDraft ? 'draft' : 'pending'
  const winnersPanelStatus = selectedCartonWinnersSubmitted ? 'submitted' : isExpired ? 'expired' : hasWinnerDraft ? 'draft' : 'pending'
  const gamesPanelMeta = getPanelStatusMeta(gamesPanelStatus)
  const winnersPanelMeta = getPanelStatusMeta(winnersPanelStatus)
  const canAttemptCombinedSubmit = tokenId !== undefined && selectedCartonIsOwned && !selectedCartonGamesSubmitted && !selectedCartonWinnersSubmitted
  const checklistItems = [
    {
      key: 'carton',
      label: 'Selecciona un carton',
      done: tokenId !== undefined && selectedCartonIsOwned,
      detail: tokenId !== undefined && selectedCartonIsOwned ? `Carton #${tokenId.toString()} listo` : 'Elige con cuál vas a jugar',
    },
    {
      key: 'games',
      label: 'Completa todos los partidos',
      done: selectedCartonGamesSubmitted || hasCompleteGamePredictions,
      detail: selectedCartonGamesSubmitted ? 'Partidos ya enviados onchain' : `${completedGamesCount}/${games.length} resultados completos`,
    },
    {
      key: 'winners',
      label: 'Elige 4 ganadores distintos',
      done: selectedCartonWinnersSubmitted || hasValidWinners,
      detail: selectedCartonWinnersSubmitted
        ? 'Ganadores ya enviados onchain'
        : hasValidWinners
          ? 'Ganadores listos para enviar'
          : 'Faltan tus 4 ganadores del torneo',
    },
  ] as const

  const ownedCartonStatusContracts = useMemo(() => {
    if (!ownedCartons?.length) return []

    return ownedCartons.flatMap((ownedTokenId) => [
      {
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'used',
        args: [ownedTokenId],
      } as const,
      {
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'winnersPredictions',
        args: [ownedTokenId],
      } as const,
    ])
  }, [ownedCartons])

  const { data: ownedCartonStatusResults } = useReadContracts({
    contracts: ownedCartonStatusContracts,
    query: {
      enabled: ownedCartonStatusContracts.length > 0,
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    },
  })

  const ownedCartonEntries = useMemo(() => {
    if (!ownedCartons?.length) return []

    return ownedCartons.map((ownedTokenId, index) => {
      const gamesSubmitted = Boolean(ownedCartonStatusResults?.[index * 2]?.result)
      const winnersSubmitted = hasWinnersPrediction(ownedCartonStatusResults?.[index * 2 + 1]?.result)
      const status = getPredictionStatus({ gamesSubmitted, winnersSubmitted, deadline: deadlineValue, now })

      return { tokenId: ownedTokenId, status, gamesSubmitted, winnersSubmitted }
    })
  }, [deadlineValue, now, ownedCartons, ownedCartonStatusResults])

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

  const { data: onchainTeamsHash } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'teamsHash',
  })

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

  const predictionSubmitBlockedMessage = (() => {
    if (!isConnected) return 'Conecta tu wallet para enviar predicciones de partidos.'
    if (!hasOwnedCartons) return 'Compra un cartón antes de enviar predicciones.'
    if (!tokenId) return 'Selecciona un cartón para enviar predicciones.'
    if (!selectedCartonIsOwned) return 'El cartón seleccionado no pertenece a esta wallet.'
    if (!hasDeadlineConfigured) return DEADLINE_NOT_SET_MESSAGE
    if (isExpired) return 'Las predicciones ya están cerradas para este torneo.'
    if (teamsHashStatus === 'unset') return 'Los equipos no están configurados en cadena aún.'
    if (teamsHashStatus === 'mismatch') return 'La configuración de equipos está desincronizada.'
    if (totalGamesMismatch) return `Desincronización de partidos — cadena espera ${String(totalGames)}, UI tiene ${games.length}.`
    if (selectedCartonGamesSubmitted) return 'Las predicciones de partidos ya fueron enviadas para este cartón.'
    if (!hasCompleteGamePredictions) {
      return `Completa los ${remainingGamesCount} partido${remainingGamesCount === 1 ? '' : 's'} restante${remainingGamesCount === 1 ? '' : 's'} antes de enviar.`
    }
    if (predictionWrite.isSimulating) return 'Verificando predicciones contra el contrato…'
    if (predictionWrite.isPending) return 'Confirma la transacción en tu wallet.'
    if (predictionWrite.isConfirming) return 'Confirmando en cadena…'
    return null
  })()

  const winnersSubmitBlockedMessage = (() => {
    if (!isConnected) return 'Conecta tu wallet para enviar predicciones de ganadores.'
    if (!hasOwnedCartons) return 'Compra un cartón antes de enviar predicciones.'
    if (!tokenId) return 'Selecciona un cartón para enviar predicciones.'
    if (!selectedCartonIsOwned) return 'El cartón seleccionado no pertenece a esta wallet.'
    if (!hasDeadlineConfigured) return DEADLINE_NOT_SET_MESSAGE
    if (isExpired) return 'Las predicciones ya están cerradas para este torneo.'
    if (teamsHashStatus === 'unset') return 'Los equipos no están configurados en cadena aún.'
    if (teamsHashStatus === 'mismatch') return 'La configuración de equipos está desincronizada.'
    if (!hasValidWinners) return 'Elige 4 equipos distintos antes de enviar.'
    if (selectedCartonWinnersSubmitted) return 'Las predicciones de ganadores ya fueron enviadas para este cartón.'
    if (winnersWrite.isSimulating) return 'Verificando predicciones contra el contrato…'
    if (winnersWrite.isPending) return 'Confirma la transacción en tu wallet.'
    if (winnersWrite.isConfirming) return 'Confirmando en cadena…'
    return null
  })()

  const combinedSubmitBlockedMessage = (() => {
    if (!isConnected) return 'Conecta tu wallet para enviar la predicción completa.'
    if (!hasOwnedCartons) return 'Compra un cartón antes de enviar predicciones.'
    if (!tokenId) return 'Selecciona un cartón para enviar predicciones.'
    if (!selectedCartonIsOwned) return 'El cartón seleccionado no pertenece a esta wallet.'
    if (!hasDeadlineConfigured) return DEADLINE_NOT_SET_MESSAGE
    if (isExpired) return 'Las predicciones ya están cerradas para este torneo.'
    if (teamsHashStatus === 'unset') return 'Los equipos no están configurados en cadena aún.'
    if (teamsHashStatus === 'mismatch') return 'La configuración de equipos está desincronizada.'
    if (totalGamesMismatch) return `Desincronización de partidos — cadena espera ${String(totalGames)}, UI tiene ${games.length}.`
    if (selectedCartonGamesSubmitted) return 'Las predicciones de partidos ya fueron enviadas para este cartón.'
    if (selectedCartonWinnersSubmitted) return 'Las predicciones de ganadores ya fueron enviadas para este cartón.'
    if (!hasCompleteGamePredictions) {
      return `Completa los ${remainingGamesCount} partido${remainingGamesCount === 1 ? '' : 's'} restante${remainingGamesCount === 1 ? '' : 's'} antes de enviar todo.`
    }
    if (!hasValidWinners) return 'Elige 4 equipos distintos antes de enviar todo.'
    if (combinedWrite.isSimulating) return 'Verificando predicción completa contra el contrato…'
    if (combinedWrite.isPending) return 'Confirma la transacción en tu wallet.'
    if (combinedWrite.isConfirming) return 'Confirmando en cadena…'
    return null
  })()

  const canSubmitGames = predictionSubmitBlockedMessage === null
  const canSubmitCombined = combinedSubmitBlockedMessage === null
  const canSubmitWinners = winnersSubmitBlockedMessage === null

  const handleCartonChange = (value: string) => {
    navigate({ to: '/predictions', search: { carton: value } })
  }

  const formatCountdown = (secs?: number) => {
    if (secs === undefined) return '—'
    const s = Math.max(0, secs)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const ss = s % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(h)}h ${pad(m)}m ${pad(ss)}s`
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* ─── Page header ─── */}
      <div>
        <h1 className="font-display text-3xl font-black uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
          Predicciones
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Predice resultados y ganadores del torneo
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
      <div
        className="rounded-lg px-4 py-2.5 flex items-center justify-between text-sm"
        role="status"
        aria-live="polite"
        style={{
          background: !hasDeadlineConfigured ? 'rgba(255,214,0,0.08)' : isExpired ? 'rgba(255,77,109,0.1)' : 'rgba(255,214,0,0.08)',
          border: `1px solid ${!hasDeadlineConfigured ? 'rgba(255,214,0,0.2)' : isExpired ? 'rgba(255,77,109,0.25)' : 'rgba(255,214,0,0.2)'}`,
          color: isExpired ? 'var(--accent-red)' : 'var(--accent-gold)',
        }}
      >
        <span>
          {hasDeadlineConfigured && deadlineValue !== undefined ? (
            isExpired
              ? `🔒 Cerrado · ${new Date(deadlineValue * 1000).toLocaleDateString()}`
              : `⏱ Cierra el ${new Date(deadlineValue * 1000).toLocaleDateString()}`
          ) : (
            '⚠ Deadline no configurado'
          )}
        </span>
        {!isExpired && remaining !== undefined && (
          <span style={{ fontFamily: 'var(--font-mono-custom)', fontWeight: 600 }}>
            {formatCountdown(remaining)}
          </span>
        )}
      </div>

      {/* ─── Carton selector ─── */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
          Seleccionar Cartón
        </p>
        {!isConnected ? (
          <p className="text-sm" style={{ color: 'var(--text-disabled)' }}>Conecta tu wallet para ver tus cartones.</p>
        ) : !hasOwnedCartons ? (
          <p className="text-sm" style={{ color: 'var(--text-disabled)' }}>Esta wallet no tiene cartones aún.</p>
        ) : (
          <>
            <Select value={tokenId?.toString()} onValueChange={handleCartonChange}>
              <SelectTrigger className="w-full sm:max-w-xs">
                <SelectValue placeholder="Selecciona un cartón" />
              </SelectTrigger>
              <SelectContent>
                {orderedOwnedCartons.map((entry) => (
                  <SelectItem key={entry.tokenId.toString()} value={entry.tokenId.toString()}>
                    Carton #{entry.tokenId.toString()} · {entry.status === 'partial' ? 'pendiente' : entry.status === 'none' ? 'sin empezar' : entry.status === 'complete' ? 'completo' : 'vencido'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tokenId !== undefined && !selectedCartonIsOwned && (
              <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
                Este cartón no pertenece a la wallet conectada.
              </p>
            )}
            {tokenId !== undefined && selectedCartonIsOwned && selectedCartonEntry && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <TokenStatusBadge status={selectedCartonStatus} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {!selectedCartonEntry.gamesSubmitted
                    ? 'Siguiente paso: enviar los partidos.'
                    : !selectedCartonEntry.winnersSubmitted
                      ? 'Siguiente paso: elegir los 4 ganadores.'
                      : selectedCartonStatus === 'expired'
                        ? 'Este carton quedo incompleto al cerrar el plazo.'
                        : 'Este carton ya esta completo.'}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Submission checklist ─── */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Checklist de envío
            </p>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              {canAttemptCombinedSubmit && canSubmitCombined
                ? 'Ya puedes enviar todo en una sola transacción.'
                : 'Completa estos 3 puntos antes de cerrar la predicción completa.'}
            </p>
          </div>
          {tokenId !== undefined && selectedCartonIsOwned && (
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
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

      {/* ─── Game Predictions ─── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border-color)' }}
      >
        {/* Section header */}
        <div
          className="px-4 py-3 flex items-center justify-between"
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
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: gamesPanelMeta.bg, color: gamesPanelMeta.color }}>
              {gamesPanelMeta.label}
            </span>
            {!selectedCartonGamesSubmitted && tokenId !== undefined && selectedCartonIsOwned && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: hasCompleteGamePredictions ? 'rgba(0,230,118,0.1)' : 'rgba(255,214,0,0.12)',
                  color: hasCompleteGamePredictions ? 'var(--accent-green)' : 'var(--accent-gold)',
                }}
              >
                {completedGamesCount}/{games.length} completos
              </span>
            )}
            {import.meta.env.DEV && (
              <Button variant="ghost" size="sm" onClick={fillRandomScores} disabled={selectedCartonGamesSubmitted || isExpired}>
                Aleatorio
              </Button>
            )}
          </div>
        </div>

        {/* Group tabs */}
        <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto" style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)' }}>
          <button onClick={() => { const idx = displayGroups.findIndex(g => g.groupLabel === selectedGroup); if (idx > 0) setSelectedGroup(displayGroups[idx - 1].groupLabel) }} disabled={!selectedGroup || displayGroups.findIndex(g => g.groupLabel === selectedGroup) <= 0} className="shrink-0 p-1 rounded hover:bg-bg-card disabled:opacity-30" title="Anterior"><ChevronLeft size={16} /></button>
          <div className="flex gap-1.5 rounded-lg p-1 flex-1" style={{ background: 'var(--bg-card)' }}>
            {displayGroups.map((group) => (<button key={group.groupLabel} onClick={() => setSelectedGroup(group.groupLabel)} className="flex-shrink-0 px-3 py-1 text-sm font-medium rounded-full transition-all" style={{ background: selectedGroup === group.groupLabel ? 'var(--accent-green)' : 'transparent', color: selectedGroup === group.groupLabel ? 'var(--bg-base)' : 'var(--text-secondary)', border: `1px solid ${selectedGroup === group.groupLabel ? 'transparent' : 'rgba(255,255,255,0.08)'}` }}>{group.groupLabel}</button>))}
          </div>
          <button onClick={() => { const idx = displayGroups.findIndex(g => g.groupLabel === selectedGroup); if (idx < displayGroups.length - 1) setSelectedGroup(displayGroups[idx + 1].groupLabel) }} disabled={!selectedGroup || displayGroups.findIndex(g => g.groupLabel === selectedGroup) >= displayGroups.length - 1} className="shrink-0 p-1 rounded hover:bg-bg-card disabled:opacity-30" title="Siguiente"><ChevronRight size={16} /></button>
        </div>

        {/* Group matches */}
        <div className="p-3">
          {!selectedCartonGamesSubmitted && tokenId !== undefined && selectedCartonIsOwned && (
            <div
              className="mb-3 rounded-lg px-3 py-2 text-sm"
              style={{
                background: hasCompleteGamePredictions ? 'rgba(0,230,118,0.08)' : 'rgba(255,214,0,0.08)',
                border: `1px solid ${hasCompleteGamePredictions ? 'rgba(0,230,118,0.18)' : 'rgba(255,214,0,0.18)'}`,
                color: hasCompleteGamePredictions ? 'var(--accent-green)' : 'var(--accent-gold)',
              }}
            >
              {hasCompleteGamePredictions
                ? 'Todos los resultados de partidos están completos. Ya puedes enviarlos.'
                : selectedGroupPendingGames > 0
                  ? `Te faltan ${remainingGamesCount} partido${remainingGamesCount === 1 ? '' : 's'} por completar. En el grupo ${selectedGroup} quedan ${selectedGroupPendingGames}.`
                  : `Te faltan ${remainingGamesCount} partido${remainingGamesCount === 1 ? '' : 's'} por completar antes de enviar.`}
            </div>
          )}
          <GroupsView
            groups={displayGroups}
            disabled={!canEditSelectedCarton || selectedCartonGamesSubmitted}
            readOnlyAppearance={selectedCartonGamesSubmitted}
            onScoreChange={updateGameScore}
            selectedGroup={selectedGroup}
          />
        </div>

        {/* Submit games */}
        <div
          className="px-4 py-3 space-y-2"
          style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-color)' }}
        >
          {selectedCartonGamesSubmitted ? (
            <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
              Estado actual: {gamesPanelMeta.label}. Puedes revisar los resultados enviados arriba.
            </p>
          ) : (
            <>
              <Button
                className="w-full h-11 text-base font-semibold"
                disabled={!canSubmitGames}
                onClick={handleSubmitPredictionClick}
              >
                {predictionWrite.isSimulating
                  ? 'Verificando…'
                  : predictionWrite.isPending
                    ? 'Confirmando…'
                    : predictionWrite.isConfirming
                      ? 'Procesando…'
                      : canAttemptCombinedSubmit
                        ? 'Enviar solo partidos'
                        : 'Enviar Predicciones de Partidos'}
              </Button>
              {predictionSubmitBlockedMessage && (
                <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                  {predictionSubmitBlockedMessage}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isImprobableScoresModalOpen}
        onClose={() => setIsImprobableScoresModalOpen(false)}
        title="Confirmar marcadores poco habituales"
        message={`Hay ${improbableScoreSummaries.length} partido${improbableScoreSummaries.length === 1 ? '' : 's'} donde un equipo anota 10 o más goles: ${improbableScoreSummaries.join(', ')}. ¿Seguro que querés enviar estas predicciones?`}
        confirmLabel={pendingGameSubmitMode === 'combined' ? 'Sí, enviar todo' : 'Sí, enviar partidos'}
        variant="warning"
        onConfirm={pendingGameSubmitMode === 'combined' ? submitPredictionAndWinners : submitPrediction}
      />

      {/* ─── Winner Predictions ─── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border-color)' }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)' }}
        >
          <div>
            <p className="font-display text-base font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Ganadores del Torneo
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Predice los 4 finalistas
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {winnersPanelMeta.detail}
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: winnersPanelMeta.bg, color: winnersPanelMeta.color }}>
            {winnersPanelMeta.label}
          </span>
        </div>

        <div className="p-4 space-y-3">
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
              Estado actual: {winnersPanelMeta.label}. Puedes revisar los equipos enviados arriba.
            </p>
          ) : canAttemptCombinedSubmit ? (
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
                      : 'Enviar todo en 1 transacción'}
              </Button>
              <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                {combinedSubmitBlockedMessage ?? 'Este es el camino recomendado: partidos + ganadores juntos.'}
              </p>
            </>
          ) : (
            <>
              <Button
                className="w-full h-11 text-base font-semibold"
                disabled={!canSubmitWinners}
                onClick={submitWinners}
              >
                {winnersWrite.isSimulating ? 'Verificando…' : winnersWrite.isPending ? 'Confirmando…' : winnersWrite.isConfirming ? 'Procesando…' : 'Enviar Predicciones de Ganadores'}
              </Button>
              {winnersSubmitBlockedMessage && (
                <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                  {winnersSubmitBlockedMessage}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ─── Prize Claims ─── */}
      {tokenId !== undefined && <ClaimSection tokenId={tokenId} />}
    </div>
  )
}
