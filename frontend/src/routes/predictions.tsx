import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { TeamWinnerSelector } from '../components/TeamWinnerSelector'
import { GroupsView } from '../components/GroupsView'
import { ClaimSection } from '../components/ClaimSection'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useAccount, useReadContract } from 'wagmi'
import { toast } from 'sonner'
import { CARTON_ABI, CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'
import { computeTeamsHash, teams2026, teamsById } from '../lib/teams'
import { teams2026Config } from '../lib/teams2026.config'
import { buildAllGroupGames } from '../lib/games'
import type { Game } from '../lib/types'
import { useSimulatedContractWrite } from '../hooks/useSimulatedContractWrite'
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

const DEADLINE_NOT_SET_MESSAGE = 'Submission deadline is not configured yet. Ask the admin to set it in /admin/dev.'
const PREDICTION_REVERT_MESSAGE = 'Game predictions were rejected on-chain. Review the form and try again.'
const WINNERS_REVERT_MESSAGE = 'Winner predictions were rejected on-chain. Review the form and try again.'

function PredictionsPage() {
  const navigate = useNavigate()
  const { isConnected, address: userAddress } = useAccount()
  const { carton } = useSearch({ from: '/predictions' })
  const normalizedAddress = userAddress as `0x${string}` | undefined
  // Normalize tokenId once as bigint for on-chain reads
  const tokenId = useMemo(() => (carton ? BigInt(carton) : undefined), [carton])

  const [{ games, groups }, setGameState] = useState(() => buildAllGroupGames())

  const [winnerPrediction, setWinnerPrediction] = useState<[number, number, number, number]>([0,0,0,0])

  const updateWinnerPrediction = (position: 1|2|3|4, teamId: number) => {
    setWinnerPrediction((prev) => {
      const updated = [...prev] as [number, number, number, number]
      updated[position-1] = teamId
      return updated
    })
  }

  const hasValidWinners = useMemo(()=>{
    const nonZero = winnerPrediction.filter((teamId) => teamId !== 0)
    return new Set(nonZero).size === winnerPrediction.length && nonZero.length === 4
  }, [winnerPrediction])

  // Lookup for current game state (used by submitted predictions display)
  const gamesById = useMemo(() => {
    return new Map(games.map(g => [g.id, g]))
  }, [games])

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
    () => tokenId !== undefined && (ownedCartons?.some((ownedTokenId) => ownedTokenId === tokenId) ?? false),
    [ownedCartons, tokenId],
  )
  const hasOwnedCartons = (ownedCartons?.length ?? 0) > 0

  const {data: cartonGroupsState, refetch: refetchCartonUsedState} = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'used',
    args: [tokenId ?? 0n],
    query: {
    enabled: tokenId !== undefined,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    }
  })

  const {data: cartonWinnersState, refetch: refetchCartonWinnersState} = useReadContract({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'winnersPredictions',
        args: [tokenId ?? 0n],
        query: {
        enabled: tokenId !== undefined,
        refetchInterval: 10000,
        refetchOnWindowFocus: true,
        }
    })

  // Read submitted predictions from contract
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
      enabled: tokenId !== undefined && !!cartonWinnersState,
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    },
  })

    const cartonStatus = () => {
        if (cartonGroupsState && cartonWinnersState) {
            return 'complete'
        }
        if (cartonGroupsState) {
            return 'partial'
        }
        if (cartonWinnersState) {
            return 'partial'
        }
        return 'none'
    }
  
  const updateGameScore = (gameId: number, team: 0 | 1, score: number) => {
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

    // Map local Game state to lightweight Prediction struct for the contract
    const predictions = games.map(g => ({ gameId: g.id, result: g.result }))
    void predictionWrite.simulateAndSend(
      {
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'submitPrediction',
        args: [tokenId, predictions],
      },
      {
        toastId: 'submit-prediction',
        pendingMessage: 'Waiting for game prediction confirmation...',
        successMessage: 'Predictions submitted successfully!',
        revertedMessage: PREDICTION_REVERT_MESSAGE,
        mapError: mapPredictionErrorToMessage,
        onSuccess: async () => {
          await Promise.all([refetchCartonUsedState(), refetchSubmittedGames()])
        },
        logLabel: 'Submit game predictions',
      },
    )
  }

  const submitWinners = () => {
    if (!tokenId) return
    if (winnersSubmitBlockedMessage) {
      toast.error(winnersSubmitBlockedMessage, { id: 'submit-winners' })
      return
    }
    void winnersWrite.simulateAndSend(
      {
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'predictWinners',
        args: [tokenId, winnerPrediction],
      },
      {
        toastId: 'submit-winners',
        pendingMessage: 'Waiting for winner prediction confirmation...',
        successMessage: 'Predictions submitted successfully!',
        revertedMessage: WINNERS_REVERT_MESSAGE,
        mapError: mapWinnersErrorToMessage,
        onSuccess: async () => {
          await Promise.all([refetchCartonWinnersState(), refetchSubmittedWinners()])
        },
        logLabel: 'Submit winner predictions',
      },
    )
  }

  // Read submission deadline and keep a live countdown
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
  const canEditSelectedCarton = Boolean(isConnected && selectedCartonIsOwned && !isExpired)

  useEffect(() => {
    if (tokenId !== undefined || !ownedCartons || ownedCartons.length !== 1) return

    navigate({
      to: '/predictions',
      search: { carton: ownedCartons[0].toString() },
      replace: true,
    })
  }, [navigate, ownedCartons, tokenId])

  // Verify off-chain teams config hash vs on-chain anchor
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
      } catch {
        setTeamsHashStatus('unknown')
      }
    }
    run()
  }, [onchainTeamsHash])

  const totalGamesMismatch = totalGames !== undefined && Number(totalGames) !== games.length
  const predictionSubmitBlockedMessage = (() => {
    if (!isConnected) return 'Connect your wallet to submit game predictions.'
    if (!hasOwnedCartons) return 'Buy a carton before submitting game predictions.'
    if (!tokenId) return 'Select a carton to submit game predictions.'
    if (!selectedCartonIsOwned) return 'The selected carton is not owned by the connected wallet.'
    if (!hasDeadlineConfigured) return DEADLINE_NOT_SET_MESSAGE
    if (isExpired) return 'Predictions are already closed for this tournament.'
    if (teamsHashStatus === 'unset') return 'Teams are not configured on-chain yet.'
    if (teamsHashStatus === 'mismatch') return 'Teams configuration is out of sync. Ask the admin to update the teams hash.'
    if (totalGamesMismatch) return 'Game configuration is out of sync. Ask the admin to review total games.'
    if (cartonGroupsState) return 'Game predictions were already submitted for this carton.'
    if (predictionWrite.isSimulating) return 'Checking game predictions against the contract.'
    if (predictionWrite.isPending) return 'Confirm the game prediction transaction in your wallet.'
    if (predictionWrite.isConfirming) return 'Game prediction transaction is being confirmed on-chain.'
    return null
  })()

  const winnersSubmitBlockedMessage = (() => {
    if (!isConnected) return 'Connect your wallet to submit winner predictions.'
    if (!hasOwnedCartons) return 'Buy a carton before submitting winner predictions.'
    if (!tokenId) return 'Select a carton to submit winner predictions.'
    if (!selectedCartonIsOwned) return 'The selected carton is not owned by the connected wallet.'
    if (!hasDeadlineConfigured) return DEADLINE_NOT_SET_MESSAGE
    if (isExpired) return 'Predictions are already closed for this tournament.'
    if (teamsHashStatus === 'unset') return 'Teams are not configured on-chain yet.'
    if (teamsHashStatus === 'mismatch') return 'Teams configuration is out of sync. Ask the admin to update the teams hash.'
    if (!hasValidWinners) return 'Choose 4 different teams before submitting winners.'
    if (cartonWinnersState) return 'Winner predictions were already submitted for this carton.'
    if (winnersWrite.isSimulating) return 'Checking winner predictions against the contract.'
    if (winnersWrite.isPending) return 'Confirm the winner prediction transaction in your wallet.'
    if (winnersWrite.isConfirming) return 'Winner prediction transaction is being confirmed on-chain.'
    return null
  })()

  const canSubmitGames = predictionSubmitBlockedMessage === null
  const canSubmitWinners = winnersSubmitBlockedMessage === null

  const handleCartonChange = (value: string) => {
    navigate({
      to: '/predictions',
      search: { carton: value },
    })
  }

  const formatCountdown = (secs?: number) => {
    if (secs === undefined) return '—'
    const s = Math.max(0, secs)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const ss = s % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(h)}:${pad(m)}:${pad(ss)}`
  }

  /*
  console.log('RENDER TRIGGERED', {
    cartonGroupsState,
    cartonWinnersState,
    deadline,
    now,
    games: games.length
  }) */


  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Make Predictions
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Predict game results and tournament winners to earn points
        </p>
        {/* Teams hash verification banner */}
        {teamsHashStatus !== 'unknown' && (
          <div className={`mt-3 p-2 rounded text-xs border ${
            teamsHashStatus === 'match'
              ? 'bg-green-50 border-green-200 text-green-700'
              : teamsHashStatus === 'mismatch'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}>
            {teamsHashStatus === 'match' && 'Teams config verified (id + name + group)'}
            {teamsHashStatus === 'mismatch' && 'Teams config mismatch — check your list'}
            {teamsHashStatus === 'unset' && 'On-chain teams hash not set'}
          </div>
        )}
        {totalGamesMismatch && (
          <div className="mt-2 p-2 rounded text-xs border bg-red-50 border-red-200 text-red-700">
            Total games mismatch — on-chain expects {String(totalGames)}, UI has {games.length}.
          </div>
        )}
        {/* Deadline banner */}
        <div
          className={`mt-4 p-3 rounded-lg border text-sm ${
            !hasDeadlineConfigured
              ? 'bg-orange-50 border-orange-200 text-orange-700'
              : isExpired
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}
          role="status"
          aria-live="polite"
        >
          {hasDeadlineConfigured && deadlineValue !== undefined ? (
            isExpired ? (
              <span>
                Submission closed • {new Date(deadlineValue * 1000).toLocaleString()}
              </span>
            ) : (
              <span>
                Predictions close on {new Date(deadlineValue * 1000).toLocaleString()} • {formatCountdown(remaining)}
              </span>
            )
          ) : (
            <span>Submission deadline is not configured yet.</span>
          )}
        </div>
        {tokenId !== undefined && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                #{tokenId.toString()}
              </div>
              <span className="text-sm font-medium text-blue-800">
                Selected Carton #{tokenId.toString()}
              </span>
            </div>
          </div>
        )}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Carton</CardTitle>
          <CardDescription>
            Choose which owned carton you want to use for predictions and claims.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!isConnected ? (
            <p className="text-sm text-gray-500">Connect your wallet to load your cartones.</p>
          ) : !hasOwnedCartons ? (
            <p className="text-sm text-gray-500">This wallet does not own any cartones yet.</p>
          ) : (
            <>
              <Select value={tokenId?.toString()} onValueChange={handleCartonChange}>
                <SelectTrigger className="w-full sm:max-w-xs">
                  <SelectValue placeholder="Select a carton" />
                </SelectTrigger>
                <SelectContent>
                  {ownedCartons?.map((ownedTokenId) => (
                    <SelectItem key={ownedTokenId.toString()} value={ownedTokenId.toString()}>
                      Carton #{ownedTokenId.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {tokenId !== undefined && !selectedCartonIsOwned && (
                <p className="text-sm text-red-600">
                  The selected carton does not belong to the connected wallet.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Game Predictions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Game Predictions</h3>
            <p className="text-sm text-muted-foreground">
              Predict the scores for {games.length} group-stage games
            </p>
          </div>
          <div className="flex gap-2">
            {import.meta.env.DEV && (
              <Button variant="outline" size="sm" onClick={fillRandomScores} disabled={!!cartonGroupsState || isExpired}>
                Fill Random
              </Button>
            )}
          </div>
        </div>

        <GroupsView
          groups={groups}
          disabled={!canEditSelectedCarton || !!cartonGroupsState}
          onScoreChange={updateGameScore}
        />

        <Button
          className="w-full"
          disabled={!canSubmitGames}
          onClick={submitPrediction}
        >
          {predictionWrite.isSimulating
            ? 'Checking...'
            : predictionWrite.isPending
              ? 'Confirming...'
              : predictionWrite.isConfirming
                ? 'Processing...'
                : 'Submit Game Predictions'}
        </Button>
        {predictionSubmitBlockedMessage && (
          <p className="text-sm text-muted-foreground">{predictionSubmitBlockedMessage}</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2 mt-8">
        {/* Winner Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏆 Winner Predictions
            </CardTitle>
            <CardDescription>
              Predict the top 4 teams in the tournament
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TeamWinnerSelector label="1st Place" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={1} disabled={!canEditSelectedCarton || !!cartonWinnersState} onChange={(teamId) => updateWinnerPrediction(1, teamId)}/>
              <TeamWinnerSelector label="2nd Place" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={2} disabled={!canEditSelectedCarton || !!cartonWinnersState} onChange={(teamId) => updateWinnerPrediction(2, teamId)}/>
              <TeamWinnerSelector label="3rd Place" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={3} disabled={!canEditSelectedCarton || !!cartonWinnersState} onChange={(teamId) => updateWinnerPrediction(3, teamId)}/>
              <TeamWinnerSelector label="4th Place" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={4} disabled={!canEditSelectedCarton || !!cartonWinnersState} onChange={(teamId) => updateWinnerPrediction(4, teamId)}/>
              <Button
                className="w-full"
                disabled={!canSubmitWinners}
                onClick={submitWinners}
              >
                {winnersWrite.isSimulating
                  ? 'Checking...'
                  : winnersWrite.isPending
                    ? 'Confirming...'
                    : winnersWrite.isConfirming
                      ? 'Processing...'
                      : 'Submit Winner Predictions'}
              </Button>
              {winnersSubmitBlockedMessage && (
                <p className="text-sm text-muted-foreground">{winnersSubmitBlockedMessage}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prize Claims */}
      {tokenId !== undefined && (
        <div className="mt-8">
          <ClaimSection tokenId={tokenId} />
        </div>
      )}

      {/* Your Predictions */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Your Current Predictions</CardTitle>
            <CardDescription>
              View and track your submitted predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!tokenId ? (
              <div className="text-center py-8 text-gray-500">
                Select a carton to view predictions.
              </div>
            ) : cartonStatus() === 'none' ? (
              <div className="text-center py-8 text-gray-500">
                No predictions submitted yet for Carton #{tokenId.toString()}.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Submitted Game Predictions */}
                {submittedGames && (submittedGames as unknown as { gameId: number; result: [number, number] }[]).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Game Predictions</h4>
                    <div className="grid gap-2">
                      {(submittedGames as unknown as { gameId: number; result: [number, number] }[]).map((pred) => {
                        const game = gamesById.get(pred.gameId)
                        return (
                          <div key={pred.gameId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                            <span className="flex-1 text-right">{game ? teamsById[game.team1] : `Team ?`}</span>
                            <span className="mx-3 font-mono font-bold">{Number(pred.result[0])} - {Number(pred.result[1])}</span>
                            <span className="flex-1 text-left">{game ? teamsById[game.team2] : `Team ?`}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Submitted Winner Predictions */}
                {submittedWinners && (submittedWinners as unknown as number[]).some((id) => Number(id) !== 0) && (
                  <div>
                    <h4 className="font-semibold mb-3">Winner Predictions</h4>
                    <div className="grid gap-2">
                      {(['1st', '2nd', '3rd', '4th'] as const).map((label, i) => {
                        const teamId = Number((submittedWinners as unknown as number[])[i])
                        return (
                          <div key={label} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                            <span className="font-medium w-8">{label}</span>
                            <span>{teamId > 0 ? teamsById[teamId] ?? `Team #${teamId}` : '—'}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
