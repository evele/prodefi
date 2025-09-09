import { createFileRoute, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'

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
              {/* Game 1 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Game 1: Team A vs Team B</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Team A Score</label>
                    <Input type="number" placeholder="0" disabled={isExpired} />
                  </div>
                  <div className="text-2xl">-</div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Team B Score</label>
                    <Input type="number" placeholder="0" disabled={isExpired} />
                  </div>
                </div>
              </div>

              {/* Game 2 */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Game 2: Team C vs Team D</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Team C Score</label>
                    <Input type="number" placeholder="0" disabled={isExpired} />
                  </div>
                  <div className="text-2xl">-</div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Team D Score</label>
                    <Input type="number" placeholder="0" disabled={isExpired} />
                  </div>
                </div>
              </div>

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
