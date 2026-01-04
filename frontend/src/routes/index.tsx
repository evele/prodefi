import { useEffect, useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI, USDC_ABI, ZERO_ADDRESS } from '../lib/contracts'
import { formatEther, formatUnits } from 'viem'
import { toast } from "sonner"
import { Button } from '../components/ui/button'
import { CartonListItem } from '../components/CartonListItem'
import { TokenStatusBadge } from '../components/TokenStatusBadge'
import { useUserBalance } from '../hooks/useBalance'


export const Route = createFileRoute('/')({
  component: HomePage,
})

const POSITION_META = [
  { label: '1st Place (50%)', position: 1 },
  { label: '2nd Place (30%)', position: 2 },
  { label: '3rd Place (15%)', position: 3 },
  { label: '4th Place (5%)', position: 4 },
] as const

function HomePage() {
  const navigate = useNavigate()
  const { isConnected, address: userAddress } = useAccount()
  const normalizedAddress = userAddress as `0x${string}` | undefined
  const [currency, setCurrency] = useState<'ETH' | 'USDC'>('ETH')
  const [lastPurchaseCurrency, setLastPurchaseCurrency] = useState<'ETH' | 'USDC'>('ETH')
  const { eth: ethBalance, usdc: usdcBalance } = useUserBalance()

  const { data: cartonPrice, isLoading: priceLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'cartonPrice',
  })

  const { data: activeTournamentId } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'activeTournamentId',
  })
  const tournamentId = activeTournamentId ?? 0n

  const {
    writeContract: writePurchase,
    data: purchaseHash,
    isPending: isPurchasePending,
    error: purchaseError,
  } = useWriteContract()

  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApprovePending,
    error: approveError,
  } = useWriteContract()

  const { isLoading: isPurchaseConfirming, isSuccess: isPurchaseSuccess } = useWaitForTransactionReceipt({
    hash: purchaseHash,
  })

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  const { data: usdcPrice, isLoading: usdcPriceLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'tokenPrices',
    args: [CONTRACT_ADDRESSES.USDC],
  })

  const { data: usdcAllowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.USDC,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: normalizedAddress ? [normalizedAddress, CONTRACT_ADDRESSES.CARTON] : undefined,
    query: {
      enabled: Boolean(normalizedAddress) && isConnected,
      refetchInterval: 15000,
    },
  })

  const usdcPriceValue = usdcPrice ?? 0n
  const usdcAllowanceValue = usdcAllowance ?? 0n
  const needsApproval = currency === 'USDC' && usdcPriceValue > 0n && usdcAllowanceValue < usdcPriceValue
  const isBuying = isPurchasePending || isPurchaseConfirming
  const isApproving = isApprovePending || isApproveConfirming

  const priceDisplay =
    currency === 'ETH'
      ? priceLoading
        ? 'Loading...'
        : cartonPrice
          ? `${formatEther(cartonPrice)} ETH`
          : 'Price not set'
      : usdcPriceLoading
        ? 'Loading...'
        : usdcPriceValue > 0n
          ? `${formatUnits(usdcPriceValue, 6)} USDC`
          : 'Price not set'

  const buyButtonText = () => {
    if (!isConnected) return 'Connect Wallet to Buy'
    if (currency === 'ETH') {
      return isBuying ? 'Buying...' : 'Buy with ETH'
    }
    return isBuying ? 'Buying...' : 'Buy with USDC'
  }

  const canBuy =
    currency === 'ETH'
      ? Boolean(cartonPrice)
      : usdcPriceValue > 0n && !needsApproval

  const balanceDisplay = () => {
    if (!isConnected) return null
    if (currency === 'ETH') {
      return ethBalance.isLoading ? 'Loading balance...' : `${ethBalance.amount} ${ethBalance.symbol}`
    }
    return usdcBalance.isLoading ? 'Loading balance...' : `${usdcBalance.amount} ${usdcBalance.symbol}`
  }

  const { data: ethPrizePool } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getPrizePool',
    args: tournamentId > 0n ? [tournamentId, ZERO_ADDRESS] : undefined,
    query: { enabled: tournamentId > 0n },
  })

  const { data: usdcPrizePool } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getPrizePool',
    args: tournamentId > 0n ? [tournamentId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n },
  })

  const prizeContracts = useMemo(() => {
    if (tournamentId === 0n) return []
    return POSITION_META.flatMap((meta) => [
      {
        address: CONTRACT_ADDRESSES.TREASURY,
        abi: TREASURY_ABI,
        functionName: 'getUserPrizeAmount',
        args: [tournamentId, ZERO_ADDRESS, BigInt(meta.position)],
      } as const,
      {
        address: CONTRACT_ADDRESSES.TREASURY,
        abi: TREASURY_ABI,
        functionName: 'getUserPrizeAmount',
        args: [tournamentId, CONTRACT_ADDRESSES.USDC, BigInt(meta.position)],
      } as const,
    ])
  }, [tournamentId])

  const { data: prizeAmounts } = useReadContracts({
    contracts: prizeContracts,
    query: { enabled: prizeContracts.length > 0 },
  })

  const ethPositionAmounts = POSITION_META.map((_, index) => {
    const entry = prizeAmounts?.[index * 2]
    return (entry?.result as bigint | undefined) ?? 0n
  })

  const usdcPositionAmounts = POSITION_META.map((_, index) => {
    const entry = prizeAmounts?.[index * 2 + 1]
    return (entry?.result as bigint | undefined) ?? 0n
  })

  const formatAssetValue = (amount: bigint, asset: 'ETH' | 'USDC') => {
    if (amount === 0n) return `-- ${asset}`
    return asset === 'ETH'
      ? `${Number(formatEther(amount)).toFixed(3)} ${asset}`
      : `${Number(formatUnits(amount, 6)).toFixed(2)} ${asset}`
  }

  const prizeSections = [
    { asset: 'ETH' as const, total: ethPrizePool ?? 0n, values: ethPositionAmounts },
    { asset: 'USDC' as const, total: usdcPrizePool ?? 0n, values: usdcPositionAmounts },
  ]

  const buyCartonWithEth = () => {
    if (!cartonPrice) return
    writePurchase({
      address: CONTRACT_ADDRESSES.CARTON,
      abi: CARTON_ABI,
      functionName: 'buyCarton',
      args: [],
      value: cartonPrice,
    })
  }

  const buyCartonWithUsdc = () => {
    if (!usdcPriceValue) return
    writePurchase({
      address: CONTRACT_ADDRESSES.CARTON,
      abi: CARTON_ABI,
      functionName: 'buyCartonWithToken',
      args: [CONTRACT_ADDRESSES.USDC],
    })
  }

  const approveUsdc = () => {
    if (!usdcPriceValue) return
    writeApprove({
      address: CONTRACT_ADDRESSES.USDC,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.CARTON, usdcPriceValue],
    })
  }

  const handleBuyClick = () => {
    if (currency === 'ETH') {
      setLastPurchaseCurrency('ETH')
      buyCartonWithEth()
    } else {
      setLastPurchaseCurrency('USDC')
      buyCartonWithUsdc()
    }
  }

  const {data: cartonsUser, refetch: refetchCartonsUser} = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'getUserTokens',
    args: normalizedAddress ? [normalizedAddress] : undefined,
    query: {
      enabled: Boolean(normalizedAddress) && isConnected,
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

  useEffect(() => {
    if (purchaseHash) {
      toast.info('Waiting for purchase confirmation...', { id: purchaseHash })
    }
  }, [purchaseHash])

  useEffect(() => {
    if (isPurchaseSuccess && purchaseHash) {
      toast.success(
        lastPurchaseCurrency === 'ETH'
          ? 'Carton purchased with ETH! 🎫'
          : 'Carton purchased with USDC! 🎫',
        { id: purchaseHash },
      )
      refetchCartonsUser()
      refetchAllowance()
    }
  }, [isPurchaseSuccess, purchaseHash, lastPurchaseCurrency, refetchCartonsUser, refetchAllowance])

  useEffect(() => {
    if (purchaseError) {
      toast.error(`Transaction failed: ${purchaseError.message}`)
    }
  }, [purchaseError])

  useEffect(() => {
    if (approveHash) {
      toast.info('Waiting for approval confirmation...', { id: approveHash })
    }
  }, [approveHash])

  useEffect(() => {
    if (isApproveSuccess && approveHash) {
      toast.success('USDC approval confirmed. You can now buy with USDC.', { id: approveHash })
      refetchAllowance()
    }
  }, [isApproveSuccess, approveHash, refetchAllowance])

  useEffect(() => {
    if (approveError) {
      toast.error(`Approval failed: ${approveError.message}`)
    }
  }, [approveError])

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
              <div className="flex gap-2">
                <Button
                  variant={currency === 'ETH' ? 'default' : 'outline'}
                  onClick={() => setCurrency('ETH')}
                  className="flex-1"
                >
                  Pay in ETH
                </Button>
                <Button
                  variant={currency === 'USDC' ? 'default' : 'outline'}
                  onClick={() => setCurrency('USDC')}
                  className="flex-1"
                >
                  Pay in USDC
                </Button>
              </div>
              <div className="text-2xl font-bold text-green-600">{priceDisplay}</div>
              {isConnected && (
                <div className="text-xs text-gray-600">Balance: {balanceDisplay()}</div>
              )}
              <div className="text-xs text-gray-500">
                Dev pricing only: ETH and USDC are fixed and not pegged to USD.
              </div>
              {currency === 'USDC' && needsApproval && (
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!isConnected || isApproving || usdcPriceValue === 0n}
                  onClick={approveUsdc}
                >
                  {isApproving ? 'Approving...' : 'Approve USDC'}
                </Button>
              )}
              <Button
                className="w-full"
                disabled={!isConnected || !canBuy || isBuying}
                onClick={handleBuyClick}
              >
                {buyButtonText()}
              </Button>
              {currency === 'USDC' && needsApproval && (
                <p className="text-xs text-gray-500">
                  Approval required only once per token. After approving you can buy instantly.
                </p>
              )}
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
            {tournamentId === 0n ? (
              <p className="text-sm text-gray-500">
                Configure an active tournament in the Carton contract to see live prize pools.
              </p>
            ) : (
              <div className="space-y-6">
                {prizeSections.map((section) => (
                  <div key={section.asset} className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{section.asset} Pool</span>
                      <span className="font-semibold text-gray-800">
                        {formatAssetValue(section.total, section.asset)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {POSITION_META.map((meta, idx) => (
                        <div className="flex justify-between" key={`${section.asset}-${meta.position}`}>
                          <span>{meta.label}</span>
                          <span className="font-bold">{formatAssetValue(section.values[idx], section.asset)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400">
                      Live amounts update with each purchase and lock in once the tournament is closed.
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <span className="text-green-700 font-mono">Configured</span>
              </div>
              <div className="text-xs text-gray-500 mt-4 space-y-1">
                <div className="font-semibold">Addresses (from frontend/.env):</div>
                <div className="font-mono break-all">Carton: {CONTRACT_ADDRESSES.CARTON}</div>
                <div className="font-mono break-all">Predictions: {CONTRACT_ADDRESSES.PREDICTIONS}</div>
                <div className="font-mono break-all">Treasury: {CONTRACT_ADDRESSES.TREASURY}</div>
                <div className="font-mono break-all">USDC: {CONTRACT_ADDRESSES.USDC}</div>
                <div>Run `anvil` on 127.0.0.1:8545 to interact with these deployments.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
