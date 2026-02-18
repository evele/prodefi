import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { TeamWinnerSelector } from '../components/TeamWinnerSelector'
import { GroupsView } from '../components/GroupsView'
import { ClaimSection } from '../components/ClaimSection'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'sonner'
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'
import { computeTeamsHash, teams2026, teamsById } from '../lib/teams'
import { teams2026Config } from '../lib/teams2026.config'
import { buildAllGroupGames } from '../lib/games'
import type { Game } from '../lib/types'

export const Route = createFileRoute('/predictions')({
  component: PredictionsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    carton: search.carton as string | undefined,
  }),
})

function PredictionsPage() {

  const { carton } = useSearch({ from: '/predictions' })
  // Normalize tokenId once as bigint for on-chain reads
  const tokenId = useMemo(() => (carton ? BigInt(carton) : undefined), [carton])

  const [{ games, groups }, setGameState] = useState(() => buildAllGroupGames())

  const [winnerPrediction, setWinnerPrediction] = useState<[number, number, number, number]>([0,0,0,0])

  const updateWinnerPrediction = (position: 1|2|3|4, teamId: number) => {
    setWinnerPrediction((prev) => {
      const updated = [...prev]
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
    
 

  const {data: cartonGroupsState, refetch: refetchCartonUsedState} = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'used',
    args: [tokenId],
    query: {
    // enabled: !!userAddress && isConnected, NOTE: proably this is handled by the father
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    }
  })

  const {data: cartonWinnersState, refetch: refetchCartonWinnersState} = useReadContract({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'winnersPredictions',
        args: [tokenId],
        query: {
        refetchInterval: 10000,
        refetchOnWindowFocus: true,
        }
    })

  // Read submitted predictions from contract
  const { data: submittedGames, refetch: refetchSubmittedGames } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'getPrediction',
    args: [tokenId],
    query: {
      enabled: !!tokenId && !!cartonGroupsState,
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    },
  })

  const { data: submittedWinners, refetch: refetchSubmittedWinners } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'getWinnersPrediction',
    args: [tokenId],
    query: {
      enabled: !!tokenId && !!cartonWinnersState,
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

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { writeContract: writeContractWinners, data: hashWinners, isPending: isPendingWinners, error: errorWinners} = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const { isLoading: isConfirmingWinners, isSuccess: isSuccessWinners} = useWaitForTransactionReceipt({
    hashWinners,
  })

  const submitPrediction = async() => {
    if (!tokenId) return

    // Map local Game state to lightweight Prediction struct for the contract
    const predictions = games.map(g => ({ gameId: g.id, result: g.result }))
    console.log("Predictions to submit:", predictions)
    console.log("Token ID:", tokenId)

    try {
      writeContract({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'submitPrediction',
        args: [tokenId, predictions],
      })
      toast.loading('Transaction pending...', { id: 'submit-prediction' })
    } catch (error) {
      console.error('Error submiting prediction:', error)

      // Log completo del error
      console.log('Full error object:', JSON.stringify(error, null, 2))

      if (error && typeof error === 'object' && 'message' in error) {
        toast.error(`Failed: ${error.message}`)
      } else {
        toast.error('Failed to submit prediction')
      }
    }
  }

  const submitWinners = async() => {
    if (!tokenId) return
    try {
      writeContractWinners({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'predictWinners',
        args: [tokenId, winnerPrediction],
      })
      toast.loading('Transaction pending...', { id: 'submit-winners' })
    } catch (error) {
      console.error('Error submiting winners prediction:', error)

      // Log completo del error
      console.log('Full error object:', JSON.stringify(error, null, 2))

      if (error && typeof error === 'object' && 'message' in error) {
        toast.error(`Failed: ${error.message}`)
      } else {
        toast.error('Failed to submit winners prediction')
      }
    }
  }



  // Toast notifications based on transaction status
  useEffect(() => {
    if (isSuccess) {
      toast.success('Predictions submitted successfully!', { id: 'submit-prediction' })
      refetchCartonUsedState()
      refetchSubmittedGames()
    }
    if (isSuccessWinners) {
      toast.success('Predictions submitted successfully!', { id: 'submit-winners' })
      refetchCartonWinnersState()
      refetchSubmittedWinners()
    }
  }, [isSuccess, isSuccessWinners, refetchCartonUsedState, refetchSubmittedGames, refetchCartonWinnersState, refetchSubmittedWinners])

  useEffect(() => {
    if (error) {
      console.error('Wagmi error:', error)
      console.log('Wagmi error details:', JSON.stringify(error, null, 2))
      toast.error(`Transaction failed: ${error.message || 'Unknown error'}`, { id: 'submit-prediction' })
    }
  }, [error])

  useEffect(() => {
    if (errorWinners) {
      console.error('Wagmi winners error:', errorWinners)
      toast.error(`Transaction failed: ${errorWinners.message || 'Unknown error'}`, { id: 'submit-winners' })
    }
  }, [errorWinners])


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

  const remaining = useMemo(() => (deadline ? Number(deadline) - now : undefined), [deadline, now])
  const isExpired = remaining !== undefined && remaining <= 0

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
  const isTeamsHashValid = teamsHashStatus === 'match'
  const canSubmitGames = !isExpired && !isPending && !isConfirming && isTeamsHashValid && !totalGamesMismatch

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
            isExpired
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}
          role="status"
          aria-live="polite"
        >
          {deadline ? (
            isExpired ? (
              <span>
                Submission closed • {new Date(Number(deadline) * 1000).toLocaleString()}
              </span>
            ) : (
              <span>
                Predictions close on {new Date(Number(deadline) * 1000).toLocaleString()} • {formatCountdown(remaining)}
              </span>
            )
          ) : (
            <span>Deadline: —</span>
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
          disabled={!!cartonGroupsState || isExpired}
          onScoreChange={updateGameScore}
        />

        <Button
          className="w-full"
          disabled={!canSubmitGames}
          onClick={submitPrediction}
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Submit Game Predictions'}
        </Button>
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
              <TeamWinnerSelector label="1st Place" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={1} isExpired={isExpired} onChange={(teamId) => updateWinnerPrediction(1, teamId)}/>
              <TeamWinnerSelector label="2nd Place" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={2} isExpired={isExpired} onChange={(teamId) => updateWinnerPrediction(2, teamId)}/>
              <TeamWinnerSelector label="3rd Place" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={3} isExpired={isExpired} onChange={(teamId) => updateWinnerPrediction(3, teamId)}/>
              <TeamWinnerSelector label="4th Place" teams={teams2026} selectedTeams={winnerPrediction} currentPosition={4} isExpired={isExpired} onChange={(teamId) => updateWinnerPrediction(4, teamId)}/>
              <Button
                className="w-full"
                disabled={isExpired || !hasValidWinners || isPendingWinners || isConfirmingWinners || !isTeamsHashValid}
                onClick={submitWinners}
              >
                {isPendingWinners ? 'Confirming...' : isConfirmingWinners ? 'Processing...' : 'Submit Winner Predictions'}
              </Button>
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
