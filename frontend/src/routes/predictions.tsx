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
import { mapPredictionErrorToMessage, mapWinnersErrorToMessage } from '../lib/transaction-errors'

function normalizeCartonParam(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return /^\d+$/.test(trimmed) ? trimmed : undefined
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
const WINNERS_REVERT_MESSAGE = 'Las predicciones de ganadores fueron rechazadas en cadena.'
// TODO: Revisar este criterio con producto. Hoy se marca como "poco habitual"
// cuando un equipo llega a 10+ goles, pero tal vez deba basarse en goles
// totales del partido (por ejemplo, 6-5).
const IMPROBABLE_SCORE_THRESHOLD = 10

function PredictionsPage() {
  const navigate = useNavigate()
  const { isConnected, address: userAddress } = useAccount()
  const { carton } = useSearch({ from: '/predictions' })
  const normalizedAddress = userAddress as `0x${string}` | undefined
  const tokenId = useMemo(() => (carton ? BigInt(carton) : undefined), [carton])

  const [{ games, groups }, setGameState] = useState(() => buildAllGroupGames())
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [isImprobableScoresModalOpen, setIsImprobableScoresModalOpen] = useState(false)

  useEffect(() => {
    if (groups.length > 0 && selectedGroup === null) {
      setSelectedGroup(groups[0].groupLabel)
    }
  }, [groups, selectedGroup])

  const [winnerPrediction, setWinnerPrediction] = useState<[number, number, number, number]>([0, 0, 0, 0])

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

  const gamesById = useMemo(() => new Map(games.map((g) => [g.id, g])), [games])

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
  const winnersWrite = useSimulatedContractWrite()

  const submitPrediction = () => {
    if (!tokenId) return
    if (predictionSubmitBlockedMessage) {
      toast.error(predictionSubmitBlockedMessage, { id: 'submit-prediction' })
      return
    }
    const predictions = games.map((g) => ({ gameId: g.id, result: g.result }))
    void predictionWrite.simulateAndSend(
      { address: CONTRACT_ADDRESSES.PREDICTIONS, abi: PREDICTIONS_ABI, functionName: 'submitPrediction', args: [tokenId, predictions] },
      {
        toastId: 'submit-prediction',
        pendingMessage: 'Esperando confirmación…',
        successMessage: '¡Predicciones de partidos enviadas!',
        revertedMessage: PREDICTION_REVERT_MESSAGE,
        mapError: mapPredictionErrorToMessage,
        onSuccess: async () => { await Promise.all([refetchCartonUsedState(), refetchSubmittedGames()]) },
        logLabel: 'Submit game predictions',
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
      setIsImprobableScoresModalOpen(true)
      return
    }

    submitPrediction()
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
        onSuccess: async () => { await Promise.all([refetchCartonWinnersState(), refetchSubmittedWinners()]) },
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
  const selectedCartonStatus = getPredictionStatus({
    gamesSubmitted: selectedCartonGamesSubmitted,
    winnersSubmitted: selectedCartonWinnersSubmitted,
    deadline: deadlineValue,
    now,
  })
  const canEditSelectedCarton = Boolean(isConnected && selectedCartonIsOwned && !isExpired)

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

  const canSubmitGames = predictionSubmitBlockedMessage === null
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
              {games.length} partidos de fase de grupos
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedCartonGamesSubmitted && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,230,118,0.1)', color: 'var(--accent-green)' }}>
                ✓ Enviado
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
          <button onClick={() => { const idx = groups.findIndex(g => g.groupLabel === selectedGroup); if (idx > 0) setSelectedGroup(groups[idx - 1].groupLabel) }} disabled={!selectedGroup || groups.findIndex(g => g.groupLabel === selectedGroup) <= 0} className="shrink-0 p-1 rounded hover:bg-bg-card disabled:opacity-30" title="Anterior"><ChevronLeft size={16} /></button>
          <div className="flex gap-1.5 rounded-lg p-1 flex-1" style={{ background: 'var(--bg-card)' }}>
            {groups.map((group) => (<button key={group.groupLabel} onClick={() => setSelectedGroup(group.groupLabel)} className="flex-shrink-0 px-3 py-1 text-sm font-medium rounded-full transition-all" style={{ background: selectedGroup === group.groupLabel ? 'var(--accent-green)' : 'transparent', color: selectedGroup === group.groupLabel ? 'var(--bg-base)' : 'var(--text-secondary)', border: `1px solid ${selectedGroup === group.groupLabel ? 'transparent' : 'rgba(255,255,255,0.08)'}` }}>{group.groupLabel}</button>))}
          </div>
          <button onClick={() => { const idx = groups.findIndex(g => g.groupLabel === selectedGroup); if (idx < groups.length - 1) setSelectedGroup(groups[idx + 1].groupLabel) }} disabled={!selectedGroup || groups.findIndex(g => g.groupLabel === selectedGroup) >= groups.length - 1} className="shrink-0 p-1 rounded hover:bg-bg-card disabled:opacity-30" title="Siguiente"><ChevronRight size={16} /></button>
        </div>

        {/* Group matches */}
        <div className="p-3">
          <GroupsView
            groups={groups}
            disabled={!canEditSelectedCarton || selectedCartonGamesSubmitted}
            onScoreChange={updateGameScore}
            selectedGroup={selectedGroup}
          />
        </div>

        {/* Submit games */}
        <div
          className="px-4 py-3 space-y-2"
          style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-color)' }}
        >
          <Button
            className="w-full h-11 text-base font-semibold"
            disabled={!canSubmitGames}
            onClick={handleSubmitPredictionClick}
          >
            {predictionWrite.isSimulating ? 'Verificando…' : predictionWrite.isPending ? 'Confirmando…' : predictionWrite.isConfirming ? 'Procesando…' : 'Enviar Predicciones de Partidos'}
          </Button>
          {predictionSubmitBlockedMessage && (
            <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
              {predictionSubmitBlockedMessage}
            </p>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isImprobableScoresModalOpen}
        onClose={() => setIsImprobableScoresModalOpen(false)}
        title="Confirmar marcadores poco habituales"
        message={`Hay ${improbableScoreSummaries.length} partido${improbableScoreSummaries.length === 1 ? '' : 's'} donde un equipo anota 10 o más goles: ${improbableScoreSummaries.join(', ')}. ¿Seguro que querés enviar estas predicciones?`}
        confirmLabel="Sí, enviar"
        variant="warning"
        onConfirm={submitPrediction}
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
          </div>
          {selectedCartonWinnersSubmitted && (
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,230,118,0.1)', color: 'var(--accent-green)' }}>
              ✓ Enviado
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          <TeamWinnerSelector label="1er Lugar" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={1} disabled={!canEditSelectedCarton || selectedCartonWinnersSubmitted} onChange={(teamId) => updateWinnerPrediction(1, teamId)} />
          <TeamWinnerSelector label="2do Lugar" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={2} disabled={!canEditSelectedCarton || selectedCartonWinnersSubmitted} onChange={(teamId) => updateWinnerPrediction(2, teamId)} />
          <TeamWinnerSelector label="3er Lugar" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={3} disabled={!canEditSelectedCarton || selectedCartonWinnersSubmitted} onChange={(teamId) => updateWinnerPrediction(3, teamId)} />
          <TeamWinnerSelector label="4to Lugar" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={4} disabled={!canEditSelectedCarton || selectedCartonWinnersSubmitted} onChange={(teamId) => updateWinnerPrediction(4, teamId)} />
        </div>

        <div
          className="px-4 py-3 space-y-2"
          style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-color)' }}
        >
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
        </div>
      </div>

      {/* ─── Prize Claims ─── */}
      {tokenId !== undefined && <ClaimSection tokenId={tokenId} />}

      {/* ─── Submitted predictions display ─── */}
      {tokenId !== undefined && selectedCartonStatus !== 'none' && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border-color)' }}
        >
          <div
            className="px-4 py-3"
            style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)' }}
          >
            <p className="font-display text-base font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Tus Predicciones
            </p>
          </div>
          <div className="p-4 space-y-5" style={{ background: 'var(--bg-card)' }}>
            {/* Submitted game predictions */}
            {submittedGames && (submittedGames as unknown as { gameId: number; result: [number, number] }[]).length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Partidos
                </p>
                <div className="space-y-1">
                  {(submittedGames as unknown as { gameId: number; result: [number, number] }[]).map((pred) => {
                    const game = gamesById.get(pred.gameId)
                    return (
                      <div
                        key={pred.gameId}
                        className="flex items-center text-sm py-1.5 px-3 rounded-lg"
                        style={{ background: 'var(--bg-elevated)' }}
                      >
                        <span className="flex-1 text-right truncate" style={{ color: 'var(--text-primary)' }}>
                          {game ? teamsById[game.team1] : '?'}
                        </span>
                        <span
                          className="mx-4 font-bold text-base"
                          style={{ fontFamily: 'var(--font-mono-custom)', color: 'var(--accent-green)', minWidth: '3rem', textAlign: 'center' }}
                        >
                          {Number(pred.result[0])} · {Number(pred.result[1])}
                        </span>
                        <span className="flex-1 text-left truncate" style={{ color: 'var(--text-primary)' }}>
                          {game ? teamsById[game.team2] : '?'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Submitted winner predictions */}
            {submittedWinners && (submittedWinners as unknown as number[]).some((id) => Number(id) !== 0) && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Ganadores
                </p>
                <div className="space-y-1.5">
                  {(['🥇', '🥈', '🥉', '4°'] as const).map((icon, i) => {
                    const teamId = Number((submittedWinners as unknown as number[])[i])
                    return (
                      <div
                        key={icon}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
                        style={{ background: 'var(--bg-elevated)' }}
                      >
                        <span className="text-base w-6 text-center">{icon}</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                          {teamId > 0 ? teamsById[teamId] ?? `#${teamId}` : '—'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
