import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'
import { teams, computeTeamsHash } from '../lib/teams'
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

  const buildFixture = () => {
    const gamesAmount = games.length
    const matchdays = Math.floor(gamesAmount / 2)
    console.log(matchdays)
    const fixture = new Map<number, Game[]>()
    games.map((game) => {
      fixture.set(Math.floor(game.id / matchdays)+1, [...fixture.get(Math.floor(game.id / matchdays)+1) || [], game])
    })
    return fixture
  }
    
 

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

  const [teamsHashStatus, setTeamsHashStatus] = useState<'unknown' | 'match' | 'mismatch' | 'unset'>('unknown')
  useEffect(() => {
    const run = async () => {
      try {
        if (!onchainTeamsHash) { setTeamsHashStatus('unset'); return }
        if (!teams.length) { setTeamsHashStatus('unknown'); return }
        const local = await computeTeamsHash(teams)
        console.log("TH",local, onchainTeamsHash)
        setTeamsHashStatus(local.toLowerCase() === (onchainTeamsHash as string).toLowerCase() ? 'match' : 'mismatch')
      } catch {
        setTeamsHashStatus('unknown')
      }
    }
    run()
  }, [onchainTeamsHash])

  const formatCountdown = (secs?: number) => {
    if (secs === undefined) return '—'
    const s = Math.max(0, secs)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const ss = s % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(h)}:${pad(m)}:${pad(ss)}`
  }

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
              {[...buildFixture().values()].map((matchday) => (
                matchday.map((game, index) => (
                  <GameCard key={index} game={game} isUsed={cartonGroupsState} isExpired={isExpired} />
                )))
              )}

              {/* Más juegos... */}
              <Button className="w-full" disabled={isExpired}>
                Submit Game Predictions
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
              <div>
                <label className="text-sm font-medium">1st Place</label>
                <Input placeholder="Select team..." disabled={isExpired} />
              </div>
              <div>
                <label className="text-sm font-medium">2nd Place</label>
                <Input placeholder="Select team..." disabled={isExpired} />
              </div>
              <div>
                <label className="text-sm font-medium">3rd Place</label>
                <Input placeholder="Select team..." disabled={isExpired} />
              </div>
              <div>
                <label className="text-sm font-medium">4th Place</label>
                <Input placeholder="Select team..." disabled={isExpired} />
              </div>
              
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
