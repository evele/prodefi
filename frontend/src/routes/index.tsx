import { useEffect, useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI } from '../lib/contracts'
import { formatEther } from 'viem'
import { toast } from "sonner"
import { Button } from '../components/ui/button'
import { CartonListItem } from '../components/CartonListItem'
import { TokenStatusBadge } from '../components/TokenStatusBadge'


export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const { isConnected, address: userAddress } = useAccount()

  const { data: cartonPrice, isLoading: priceLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'cartonPrice',
  })

  const { writeContract, data: hash, isPending, error } =  useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const buyCarton = () => {
    if (!cartonPrice) return

    writeContract({
      address: CONTRACT_ADDRESSES.CARTON,
      abi: CARTON_ABI,
      functionName: 'buyCarton',
      args: [],
      value: cartonPrice,
    })
  }

  const {data: cartonsUser, refetch: refetchCartonsUser} = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'getUserTokens',
    args: [userAddress],
    query: {
      enabled: !!userAddress && isConnected,
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    }
  })

  // Read submission deadline and show a small countdown banner
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

  // Watch for CartonPurchased events to update user's cartones in real-time
  /* NOTE: this one is not working on anvil but shoudl be able to testing on testnet and then on mainet
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    eventName: 'CartonPurchased',
    onLogs: (logs) => {
      // console.log('🎫 CartonPurchased event detected:', logs)
      const userPurchased = logs.some(log => log.args.buyer === userAddress)
      // console.log('👤 Is for current user?', userPurchased, 'User:', userAddress)
      if (userPurchased) {
        console.log('🔄 Refetching user cartones...')
        refetchCartonsUser()
      }
    },
    onError: (error) => {
      // console.error('❌ Event listener error:', error)
    }
  }) */

  console.log('🔧 Event listener setup for:', CONTRACT_ADDRESSES.CARTON)

  const getUserCartonsInfo = () => {
    if (!cartonsUser || cartonsUser.length === 0) {
      return { count: 0, text: "No Cartons Owned" }
    }
    return {
      count: cartonsUser.length,
      text: `${cartonsUser.length} Carton${cartonsUser.length > 1 ? 'es' : ''} Owned`
    }
  } 

  const buyButtonText = () => {
    if (!isConnected) return "Connect Wallet to Buy"
    if (isPending) return "Buying..."
    return "Buy Carton"
  }

  useEffect(() => {
    toast.info("Waiting for transaction to be confirmed...", {
      id: hash
    })
  }, [hash])

  useEffect(() => {
    if (isSuccess) {
      toast.success("Carton purchased successfully! 🎫", {
        id: hash
      })
    }
    if (error) {
      toast.error("Transaction failed: " + error.message)
    }
  }, [isSuccess, error, hash])

  return (
    <>
      {/* Main Content */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Buy Carton Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎫 Buy Prediction Card
            </CardTitle>
            <CardDescription>
              Purchase an NFT prediction card to participate in the tournament
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-2xl font-bold text-green-600">
                {priceLoading
                  ? "Loading..."
                  : cartonPrice
                    ? `${formatEther(cartonPrice)} ETH`
                    : "Price not set"
                }
              </div>
              <Button className="w-full" disabled={!isConnected || !cartonPrice} onClick={buyCarton}>
                {buyButtonText()}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Make Predictions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔮 Make Predictions
            </CardTitle>
            <CardDescription>
              Predict game results and tournament winners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Deadline summary */}
              <div className={`p-2 rounded border text-xs ${isExpired ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                {deadline ? (
                  isExpired ? (
                    <span>
                      Submissions closed • {new Date(Number(deadline) * 1000).toLocaleString()}
                    </span>
                  ) : (
                    <span>
                      Deadline: {new Date(Number(deadline) * 1000).toLocaleString()} • {formatCountdown(remaining)}
                    </span>
                  )
                ) : (
                  <span>Deadline: —</span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                • 4 Game Predictions
                • Top 4 Teams Prediction
                • Earn points for accuracy
              </div>
              
              {/* Cartones List */}
              {getUserCartonsInfo().count === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No cartones owned. Buy a carton first!
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    Your Cartones ({getUserCartonsInfo().count}):
                  </div>
                  {cartonsUser?.map((tokenId) => (
                    <CartonListItem
                      key={tokenId.toString()}
                      tokenId={tokenId}
                      deadline={deadline ? Number(deadline) : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prize Pool Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏆 Prize Pool
            </CardTitle>
            <CardDescription>
              Current tournament prize distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>1st Place (50%)</span>
                <span className="font-bold">-- ETH</span>
              </div>
              <div className="flex justify-between">
                <span>2nd Place (30%)</span>
                <span className="font-bold">-- ETH</span>
              </div>
              <div className="flex justify-between">
                <span>3rd Place (15%)</span>
                <span className="font-bold">-- ETH</span>
              </div>
              <div className="flex justify-between">
                <span>4th Place (5%)</span>
                <span className="font-bold">-- ETH</span>
              </div>
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between font-bold">
                  <span>Total Pool</span>
                  <span>0.0 ETH</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Section */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-mono">Anvil (localhost:8545)</span>
              </div>
              <div className="flex justify-between">
                <span>Contracts:</span>
                <span className="text-yellow-600">Not Deployed</span>
              </div>
              <div className="text-xs text-gray-500 mt-4">
                ⚠️ Make sure to run `anvil` and deploy contracts first
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
