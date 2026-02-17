import { createFileRoute } from '@tanstack/react-router'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { useEffect, useMemo, useState } from 'react'
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI, TREASURY_ABI, ZERO_ADDRESS } from '../lib/contracts'
import { toast } from 'sonner'
import { computeTeamsHash, teams2026, teamsById } from '../lib/teams'
import { teams2026Config } from '../lib/teams2026.config'
import { buildAllGroupGames } from '../lib/games'

export const Route = createFileRoute('/admin/dev')({
  component: AdminPage,
})

/** Reusable hook for write + wait + toast pattern */
function useContractWrite() {
  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract()
  const { isLoading: isMining, isSuccess, error: txError } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (isSuccess) toast.success('Transaction confirmed')
  }, [isSuccess])
  useEffect(() => {
    if (writeError) {
      console.error('Write error:', writeError)
      toast.error('Transaction rejected')
    }
  }, [writeError])
  useEffect(() => {
    if (txError) {
      console.error('Transaction error:', txError)
      toast.error('Transaction failed')
    }
  }, [txError])

  return { writeContract, isPending, isMining, isSuccess, reset }
}

// --- Set Results Section ---

function SetResultsSection({ isOwner }: { isOwner: boolean }) {
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const { writeContract, isPending, isMining } = useContractWrite()
  const { games } = useMemo(() => buildAllGroupGames(), [])

  // Local state for goal inputs per game
  const [goals, setGoals] = useState<Record<number, [string, string]>>({})

  const getGoals = (gameId: number): [string, string] => goals[gameId] ?? ['', '']

  const setGoal = (gameId: number, team: 0 | 1, value: string) => {
    setGoals((prev) => {
      const current = prev[gameId] ?? ['', '']
      const updated: [string, string] = [...current]
      updated[team] = value
      return { ...prev, [gameId]: updated }
    })
  }

  const submitResult = (gameId: number) => {
    const [g1, g2] = getGoals(gameId)
    const t1 = Number(g1)
    const t2 = Number(g2)
    if (isNaN(t1) || isNaN(t2) || t1 < 0 || t2 < 0 || !Number.isInteger(t1) || !Number.isInteger(t2)) {
      toast.error('Enter valid goal numbers')
      return
    }
    writeContract({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'setResults',
      args: [gameId, t1, t2],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Results</CardTitle>
        <CardDescription>Set actual match results (one game at a time)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {games.map((game) => (
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
              <Button
                size="sm"
                onClick={() => submitResult(game.id)}
                disabled={!isOwner || isPending || isMining}
              >
                Set
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// --- Set Official Winners Section ---

function SetOfficialWinnersSection({ isOwner }: { isOwner: boolean }) {
  const predictions = CONTRACT_ADDRESSES.PREDICTIONS
  const { writeContract, isPending, isMining } = useContractWrite()

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
    writeContract({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'setOfficialWinners',
      args: [ids as [number, number, number, number]],
    })
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
                  {teams2026.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (#{t.id})
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <Button onClick={submit} disabled={!isOwner || isPending || isMining || winnersAlreadySet}>
              {isPending || isMining ? 'Submitting...' : 'Set Winners'}
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
  const { writeContract, isPending, isMining } = useContractWrite()

  const { data: currentPositions } = useReadContract({
    address: predictions,
    abi: PREDICTIONS_ABI,
    functionName: 'getPositions',
    query: { refetchInterval: 10_000 },
  })

  const [csvInput, setCsvInput] = useState('')

  const submit = () => {
    const lines = csvInput.trim().split('\n').filter(Boolean)
    if (lines.length === 0) {
      toast.error('Enter at least one tokenId,points pair')
      return
    }

    const ids: bigint[] = []
    const points: bigint[] = []

    for (const line of lines) {
      const parts = line.split(',').map((s) => s.trim())
      if (parts.length !== 2) {
        toast.error(`Invalid format: "${line}". Expected: tokenId,points`)
        return
      }
      const id = BigInt(parts[0])
      const pt = BigInt(parts[1])
      ids.push(id)
      points.push(pt)
    }

    // Validate descending order
    for (let i = 1; i < points.length; i++) {
      if (points[i] > points[i - 1]) {
        toast.error('Points must be in descending order')
        return
      }
    }

    writeContract({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'setPositions',
      args: [ids, points],
    })
  }

  const positionsArray = currentPositions as bigint[] | undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Positions</CardTitle>
        <CardDescription>Set leaderboard: tokenId,points per line (descending by points)</CardDescription>
      </CardHeader>
      <CardContent>
        <textarea
          className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
          placeholder={"1,150\n3,120\n2,95"}
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
        />
        <Button className="mt-2" onClick={submit} disabled={!isOwner || isPending || isMining}>
          {isPending || isMining ? 'Submitting...' : 'Set Positions'}
        </Button>

        {positionsArray && positionsArray.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Current leaderboard:</div>
            <div className="text-xs text-gray-600 space-y-0.5">
              {positionsArray.map((tokenId, i) => (
                <div key={i}>#{i + 1} — Token {tokenId.toString()}</div>
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
  const treasury = CONTRACT_ADDRESSES.TREASURY
  const { address } = useAccount()
  const { writeContract, isPending, isMining } = useContractWrite()

  const [tournamentId, setTournamentId] = useState('1')
  const [tokenType, setTokenType] = useState<'eth' | 'usdc'>('eth')

  const tokenAddress = tokenType === 'eth' ? ZERO_ADDRESS : CONTRACT_ADDRESSES.USDC

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

  const { data: isClosed } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'isClosedTournament',
    args: [BigInt(tournamentId || '0'), tokenAddress],
    query: { refetchInterval: 10_000 },
  })

  const { data: prizePool } = useReadContract({
    address: treasury,
    abi: TREASURY_ABI,
    functionName: 'getPrizePool',
    args: [BigInt(tournamentId || '0'), tokenAddress],
    query: { refetchInterval: 10_000 },
  })

  const submit = () => {
    const tid = Number(tournamentId)
    if (isNaN(tid) || tid <= 0) {
      toast.error('Enter a valid tournament ID')
      return
    }
    writeContract({
      address: treasury,
      abi: TREASURY_ABI,
      functionName: 'closeTournament',
      args: [BigInt(tid), tokenAddress],
    })
  }

  const poolDisplay = prizePool !== undefined
    ? tokenType === 'eth'
      ? `${(Number(prizePool) / 1e18).toFixed(4)} ETH`
      : `${(Number(prizePool) / 1e6).toFixed(2)} USDC`
    : '—'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Close Tournament</CardTitle>
        <CardDescription>Snapshot prize pool and freeze deposits (requires TOURNAMENT_MANAGER_ROLE)</CardDescription>
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

          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium w-24">Token</span>
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={tokenType}
              onChange={(e) => setTokenType(e.target.value as 'eth' | 'usdc')}
            >
              <option value="eth">ETH</option>
              <option value="usdc">USDC</option>
            </select>
          </div>

          <div className="text-sm space-y-1">
            <div><span className="font-medium">Prize Pool:</span> {poolDisplay}</div>
            <div>
              <span className="font-medium">Closed:</span>{' '}
              <span className={isClosed ? 'text-green-600' : 'text-yellow-600'}>
                {String(Boolean(isClosed))}
              </span>
            </div>
          </div>

          <Button
            onClick={submit}
            disabled={!isOwner || !hasManagerRole || Boolean(isClosed) || isPending || isMining}
          >
            {isPending || isMining ? 'Closing...' : 'Close Tournament'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// --- Main Admin Page ---

function AdminPage() {
  const isDev = import.meta.env.DEV
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

  const { writeContract, isPending, isMining } = useContractWrite()

  const submitTeamsHash = () => {
    if (!teamsHash || !teamsHash.startsWith('0x') || teamsHash.length !== 66) {
      toast.error('Provide a valid bytes32 (0x... 64 hex chars)')
      return
    }
    writeContract({
      address: predictions,
      abi: PREDICTIONS_ABI,
      functionName: 'setTeamsHash',
      args: [teamsHash as `0x${string}`],
    })
  }

  const freeze = () => {
    writeContract({ address: predictions, abi: PREDICTIONS_ABI, functionName: 'freezeTeamsHash' })
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
    writeContract({ address: predictions, abi: PREDICTIONS_ABI, functionName: 'setSubmissionDeadline', args: [BigInt(ts)] })
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
    writeContract({ address: predictions, abi: PREDICTIONS_ABI, functionName: 'setTotalGames', args: [n] })
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
                <Button onClick={submitTeamsHash} disabled={!isOwner || Boolean(isFrozen) || isPending || isMining}>
                  {isPending || isMining ? 'Setting...' : 'Set Hash'}
                </Button>
              </div>
              <div className="text-xs text-gray-600 mt-1">Frozen: {String(isFrozen)}</div>
              <Button className="mt-2" variant="secondary" onClick={freeze} disabled={!isOwner || Boolean(isFrozen) || isPending || isMining}>Freeze</Button>
            </div>

            <div>
              <div className="mb-2 font-medium">Submission Deadline</div>
              <div className="flex gap-2 items-center">
                <Input type="datetime-local" value={deadlineLocal} onChange={(e) => setDeadlineLocal(e.target.value)} />
                <Button onClick={setDeadline} disabled={!isOwner || isPending || isMining}>
                  {isPending || isMining ? 'Saving...' : 'Save Deadline'}
                </Button>
              </div>
            </div>

            <div>
              <div className="mb-2 font-medium">Total Games</div>
              <div className="text-xs text-gray-600 mb-1">On-chain: {onchainTotalGames !== undefined ? String(onchainTotalGames) : '—'} • Started: {String(Boolean(predictionsStarted))}</div>
              <div className="flex gap-2 items-center">
                <Input type="number" min={1} max={255} value={totalGamesLocal} onChange={(e) => setTotalGamesLocal(e.target.value)} />
                <Button onClick={setTotalGames} disabled={!isOwner || Boolean(predictionsStarted) || isPending || isMining}>
                  {isPending || isMining ? 'Saving...' : 'Save'}
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
