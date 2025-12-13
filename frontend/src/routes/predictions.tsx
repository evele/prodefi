import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { TeamWinnerSelector } from '../components/TeamWinnerSelector'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'sonner'
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'
import { teams, computeTeamsHash, computeTeamGroupsHash, teamsById } from '../lib/teams'
import type { Game } from '../lib/types'
import { GameCard } from '../components/GameCard'

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

  const TEAMS = [1,2,3,4]

  const [games, setGames] = useState<Game[]>([
    { id: 1, team1: TEAMS[0], team2: TEAMS[1],result: [0,0], set: false },
    { id: 2, team1: TEAMS[2], team2: TEAMS[3],result: [0,0], set: false }, 
    { id: 3, team1: TEAMS[0], team2: TEAMS[2],result: [0,0], set: false },
    { id: 4, team1: TEAMS[1], team2: TEAMS[3],result: [0,0], set: false }, 
    { id: 5, team1: TEAMS[0], team2: TEAMS[3],result: [0,0], set: false },
    { id: 6, team1: TEAMS[1], team2: TEAMS[2],result: [0,0], set: false }, 
  ])

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

  // TODO: fix rerenders
  const buildFixture = useMemo(() => {
    const gamesAmount = games.length
    const matchdays = Math.floor(gamesAmount / 2)
    console.log("BF", matchdays)
    const fixture = new Map<number, Game[]>()
    games.map((game) => {
      fixture.set(Math.floor(game.id / matchdays)+1, [...fixture.get(Math.floor(game.id / matchdays)+1) || [], game])
    })
    return fixture
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
        // enabled: !!userAddress && isConnected, NOTE: proably this is handled by the father
        refetchInterval: 10000,
        refetchOnWindowFocus: true,
        }
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
    setGames((prevGames) => {
      const updatedGames = [...prevGames]
      const gameIndex = updatedGames.findIndex((game) => game.id === gameId)
      if (gameIndex !== -1) {
        updatedGames[gameIndex].result[team] = score
      }
      return updatedGames
    })
  }

  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const submitPrediction = async() => {
    if (!tokenId) return
    console.log("Games to submit:", games)
    console.log("Token ID:", tokenId)
    console.log("Games length:", games.length)

    try {
      writeContract({
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'submitPrediction',
        args: [tokenId, games],
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

  // Toast notifications based on transaction status
  useEffect(() => {
    if (isSuccess) {
      toast.success('Predictions submitted successfully!', { id: 'submit-prediction' })
    }
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      console.error('Wagmi error:', error)
      console.log('Wagmi error details:', JSON.stringify(error, null, 2))
      toast.error(`Transaction failed: ${error.message || 'Unknown error'}`, { id: 'submit-prediction' })
    }
  }, [error])


  // Read submission deadline and keep a live countdown
  const { data: deadline } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'submissionDeadline',
    query: { refetchInterval: 10000, refetchOnWindowFocus: true },
  })

  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = useMemo(() => (deadline ? Number(deadline) - now : undefined), [deadline, now])
  const isExpired = remaining !== undefined && remaining <= 0

  // Verify off-chain teams metadata hash vs on-chain anchor
  const { data: onchainTeamsHash } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'teamsHash',
  })
  const { data: onchainTeamGroupsHash } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'teamGroupsHash',
  })

  const [teamsHashStatus, setTeamsHashStatus] = useState<'unknown' | 'match' | 'mismatch' | 'unset'>('unknown')
  const [groupsHashStatus, setGroupsHashStatus] = useState<'unknown' | 'match' | 'mismatch' | 'unset'>('unknown')
  useEffect(() => {
    const run = async () => {
      try {
        if (!onchainTeamsHash) { setTeamsHashStatus('unset'); return }
        if (!teams.length) { setTeamsHashStatus('unknown'); return }
        const local = await computeTeamsHash(teams)
        setTeamsHashStatus(local.toLowerCase() === (onchainTeamsHash as string).toLowerCase() ? 'match' : 'mismatch')
      } catch {
        setTeamsHashStatus('unknown')
      }
    }
    run()
  }, [onchainTeamsHash])

  useEffect(() => {
    const run = async () => {
      try {
        if (!onchainTeamGroupsHash) { setGroupsHashStatus('unset'); return }
        if (!teams.length) { setGroupsHashStatus('unknown'); return }
        const local = await computeTeamGroupsHash(teams)
        setGroupsHashStatus(local.toLowerCase() === (onchainTeamGroupsHash as string).toLowerCase() ? 'match' : 'mismatch')
      } catch {
        setGroupsHashStatus('unknown')
      }
    }
    run()
  }, [onchainTeamGroupsHash])

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
            {teamsHashStatus === 'match' && 'Teams metadata verified'}
            {teamsHashStatus === 'mismatch' && 'Teams metadata mismatch — check your list'}
            {teamsHashStatus === 'unset' && 'On-chain teams hash not set'}
          </div>
        )}
        {/* Team groups hash verification banner */}
        {groupsHashStatus !== 'unknown' && (
          <div className={`mt-2 p-2 rounded text-xs border ${
            groupsHashStatus === 'match'
              ? 'bg-green-50 border-green-200 text-green-700'
              : groupsHashStatus === 'mismatch'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}>
            {groupsHashStatus === 'match' && 'Team groups verified'}
            {groupsHashStatus === 'mismatch' && 'Team groups mismatch — check your list'}
            {groupsHashStatus === 'unset' && 'On-chain team groups hash not set'}
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

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Game Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚽ Game Predictions
            </CardTitle>
            <CardDescription>
              Predict the scores for 4 key tournament games
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...buildFixture.values()].map((matchday) => (
                matchday.map((game, index) => (
                  <GameCard key={index} game={game} isUsed={!!cartonGroupsState} isExpired={isExpired} onScoreChange={updateGameScore} />
                )))
              )}

              {/* Más juegos... */}
              <Button 
                className="w-full" 
                disabled={isExpired || isPending || isConfirming}
                onClick={submitPrediction}
              >
                {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Submit Game Predictions'}
              </Button>
            </div>
          </CardContent>
        </Card>

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
              <TeamWinnerSelector label="1st Place" teams={teams} selectedTeams={winnerPrediction} currentPosition={1} isExpired={isExpired} onChange={(teamId) => updateWinnerPrediction(1, teamId)}/>
              <TeamWinnerSelector label="2nd Place" teams={teams} selectedTeams={winnerPrediction} currentPosition={2} isExpired={isExpired} onChange={(teamId) => updateWinnerPrediction(2, teamId)}/>
              <TeamWinnerSelector label="3rd Place" teams={teams} selectedTeams={winnerPrediction} currentPosition={3} isExpired={isExpired} onChange={(teamId) => updateWinnerPrediction(3, teamId)}/>
              <TeamWinnerSelector label="4th Place" teams={teams} selectedTeams={winnerPrediction} currentPosition={4} isExpired={isExpired} onChange={(teamId) => updateWinnerPrediction(4, teamId)}/>
              <Button className="w-full" disabled={isExpired}>
                Submit Winner Predictions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <div className="text-center py-8 text-gray-500">
              No predictions submitted yet. Buy a prediction card to get started!
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
