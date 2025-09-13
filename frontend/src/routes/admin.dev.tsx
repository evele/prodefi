import { createFileRoute } from '@tanstack/react-router'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { useEffect, useMemo, useState } from 'react'
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/dev')({
  component: AdminPage,
})

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
    if (onchainTeamsHash && (onchainTeamsHash as string) !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
      setTeamsHashLocal(onchainTeamsHash as string)
    }
  }, [onchainTeamsHash])

  const { writeContract, data: txHash, isPending } = useWriteContract()
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (isSuccess) {
      toast.success('Transaction confirmed')
    }
  }, [isSuccess])

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
    </div>
  )
}
