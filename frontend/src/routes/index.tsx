import { useCallback, useEffect, useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useUser } from '@openfort/react'
import { useAccount } from 'wagmi'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI, USDC_ABI } from '../lib/contracts'
import { formatUnits } from 'viem'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { CartonListItem } from '../components/CartonListItem'
import { PurchaseCartonModal } from '../components/PurchaseCartonModal'
import { useUserBalance } from '../hooks/useBalance'
import { useAppReadContract, useAppReadContracts } from '../hooks/useAppRead'
import { useSimulatedContractWrite } from '../hooks/useSimulatedContractWrite'
import { useStableValue } from '../hooks/useStableValue'
import { appChainId, canUseOpenfort, hasOpenfortGasSponsorship } from '../lib/chains'
import { createCheckoutOrder, getMercadoPagoCheckoutUrl } from '../lib/orders'
import { appPublicClient } from '../lib/publicClient'
import { getPredictionStatus, getPredictionStatusPriority, hasWinnersPrediction } from '../lib/prediction-status'
import { mapApproveUsdcError, mapBuyCartonError } from '../lib/transaction-errors'
import { PRIZE_BANDS, getBandAmount } from '../lib/prize-payout'
import { Ticket } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const ARS_CARTON_PRICE_LABEL = '$2.000'

function HomePage() {
  if (canUseOpenfort) return <OpenfortHomePage />

  return <HomePageContent />
}

function OpenfortHomePage() {
  const { user } = useUser()

  return <HomePageContent openfortUserId={user?.id} />
}

function HomePageContent({ openfortUserId }: { openfortUserId?: string }) {
  const navigate = useNavigate()
  const { isConnected, address: userAddress } = useAccount()
  const normalizedAddress = userAddress as `0x${string}` | undefined
  const { eth: nativeBalance } = useUserBalance()
  const purchaseWrite = useSimulatedContractWrite()
  const approveWrite = useSimulatedContractWrite()
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [isCreatingArsOrder, setIsCreatingArsOrder] = useState(false)
  const [activeTournamentId, setActiveTournamentId] = useState<bigint>()
  const [usdcPrice, setUsdcPrice] = useState<bigint>()
  const [usdcAllowance, setUsdcAllowance] = useState<bigint>()
  const [usdcPrizePool, setUsdcPrizePool] = useState<bigint>()
  const [cartonsUser, setCartonsUser] = useState<bigint[]>([])
  const [cartonTournamentIds, setCartonTournamentIds] = useState<bigint[]>([])
  const [usdcPriceLoading, setUsdcPriceLoading] = useState(true)

  const refetchPurchaseReads = useCallback(async () => {
    setUsdcPriceLoading(true)

    const nextTournamentId = await appPublicClient.readContract({
      address: CONTRACT_ADDRESSES.CARTON,
      abi: CARTON_ABI,
      functionName: 'activeTournamentId',
    })

    const [nextPrice, nextAllowance] = await Promise.all([
      nextTournamentId > 0n
        ? appPublicClient.readContract({
            address: CONTRACT_ADDRESSES.CARTON,
            abi: CARTON_ABI,
            functionName: 'tokenPricesByTournament',
            args: [nextTournamentId, CONTRACT_ADDRESSES.USDC],
          })
        : Promise.resolve(0n),
      normalizedAddress && isConnected
        ? appPublicClient.readContract({
            address: CONTRACT_ADDRESSES.USDC,
            abi: USDC_ABI,
            functionName: 'allowance',
            args: [normalizedAddress, CONTRACT_ADDRESSES.CARTON],
          })
        : Promise.resolve(0n),
    ])

    const nextPrizePool = nextTournamentId > 0n
      ? await appPublicClient.readContract({
          address: CONTRACT_ADDRESSES.TREASURY,
          abi: TREASURY_ABI,
          functionName: 'getPrizePool',
          args: [nextTournamentId, CONTRACT_ADDRESSES.USDC],
        })
      : 0n

    setActiveTournamentId(nextTournamentId)
    setUsdcPrice(nextPrice)
    setUsdcAllowance(nextAllowance)
    setUsdcPrizePool(nextPrizePool)
    setUsdcPriceLoading(false)
  }, [isConnected, normalizedAddress])

  const refetchCartonsUser = useCallback(async () => {
    if (!normalizedAddress || !isConnected) {
      setCartonsUser([])
      setCartonTournamentIds([])
      return { data: [] as bigint[] }
    }

    const nextCartons = await appPublicClient.readContract({
      address: CONTRACT_ADDRESSES.CARTON,
      abi: CARTON_ABI,
      functionName: 'getUserTokens',
      args: [normalizedAddress],
    })

    const nextTournamentIds = await Promise.all(
      nextCartons.map((tokenId) =>
        appPublicClient.readContract({
          address: CONTRACT_ADDRESSES.CARTON,
          abi: CARTON_ABI,
          functionName: 'tokenTournamentId',
          args: [tokenId],
        })
      ),
    )

    setCartonsUser(Array.from(nextCartons))
    setCartonTournamentIds(nextTournamentIds)
    return { data: Array.from(nextCartons) }
  }, [isConnected, normalizedAddress])

  useEffect(() => {
    let cancelled = false

    const fetchPurchaseReads = async () => {
      try {
        await refetchPurchaseReads()
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('[HomePage] Failed to read purchase state', {
            cartonAddress: CONTRACT_ADDRESSES.CARTON,
            usdcAddress: CONTRACT_ADDRESSES.USDC,
            chainId: appChainId,
            error,
          })
        }

        if (!cancelled) setUsdcPriceLoading(false)
      }
    }

    void fetchPurchaseReads()

    return () => {
      cancelled = true
    }
  }, [refetchPurchaseReads])

  useEffect(() => {
    void refetchCartonsUser()
  }, [refetchCartonsUser])

  const tournamentId = activeTournamentId ?? 0n

  const usdcPriceValue = usdcPrice ?? 0n
  const usdcAllowanceValue = usdcAllowance ?? 0n
  const needsApproval = usdcPriceValue > 0n && usdcAllowanceValue < usdcPriceValue
  const isBuying = purchaseWrite.isBusy
  const isApproving = approveWrite.isBusy

  const priceDisplay =
    usdcPriceLoading
      ? '…'
      : usdcPriceValue > 0n
        ? `${formatUnits(usdcPriceValue, 6)} USDC`
        : '—'

  const approvalBlockedMessage = (() => {
    if (!needsApproval) return null
    if (!isConnected) return 'Conecta tu wallet para aprobar USDC.'
    if (usdcPriceLoading) return 'Cargando precio USDC…'
    if (usdcPriceValue === 0n) return 'El precio USDC no está configurado aún.'
    if (approveWrite.isSimulating) return 'Verificando la transacción de aprobación…'
    if (approveWrite.isPending) return 'Confirma la aprobación en tu wallet.'
    if (approveWrite.isConfirming) return 'Confirmando aprobación en cadena…'
    return null
  })()

  const buyBlockedMessage = (() => {
    if (!isConnected) return 'Conecta tu wallet para comprar un cartón.'
    if (usdcPriceLoading) return 'Cargando precio USDC…'
    if (usdcPriceValue === 0n) return 'El precio USDC no está configurado aún.'
    if (needsApproval) return 'Aprueba USDC antes de comprar.'
    if (purchaseWrite.isSimulating) return 'Verificando la compra…'
    if (purchaseWrite.isPending) return 'Confirma la compra en tu wallet.'
    if (purchaseWrite.isConfirming) return 'Confirmando compra en cadena…'
    return null
  })()

  const canBuy = buyBlockedMessage === null

  const arsBlockedMessage = (() => {
    if (!isConnected) return 'Debes conectarte primero.'
    if (tournamentId === 0n) return 'No hay un torneo activo configurado para emitir cartones.'
    if (isCreatingArsOrder) return 'redirigiendo a Mercado Pago.'
    return null
  })()

  const gasReadinessNotice = (() => {
    if (!isConnected || nativeBalance.isLoading || nativeBalance.value === undefined) return null
    if (hasOpenfortGasSponsorship) return null
    if (nativeBalance.value > 0n) return null

    return {
      title: `Te falta ${nativeBalance.symbol} para gas`,
      description:
        `El cartón se paga con USDC, pero igual necesitas ${nativeBalance.symbol} para aprobar y comprar en la red.`,
    }
  })()

  const { data: usdcDistributionSet } = useAppReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'prizeDistributionSet',
    args: tournamentId > 0n ? [tournamentId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10000, refetchOnWindowFocus: false },
  })

  const { data: tournamentFinalized } = useAppReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'tournamentFinalized',
    args: tournamentId > 0n ? [tournamentId] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10000, refetchOnWindowFocus: false },
  })

  const { data: finalPrizeAmountsReady } = useAppReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'finalPrizeAmountsReady',
    args: tournamentId > 0n ? [tournamentId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10000, refetchOnWindowFocus: false },
  })

  const { data: nextTokenId } = useAppReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'nextTokenId',
    query: { refetchInterval: 10000, refetchOnWindowFocus: false },
  })

  const candidateTokenIds = useMemo(() => {
    const upperBound = Number(nextTokenId ?? 1n)
    return Array.from({ length: Math.max(upperBound - 1, 0) }, (_, i) => BigInt(i + 1))
  }, [nextTokenId])

  const { data: positionsVersion } = useAppReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'positionsVersion',
    query: {
      enabled: Boolean(finalPrizeAmountsReady),
      refetchInterval: 10000,
      refetchOnWindowFocus: false,
    },
  })

  const finalPrizePositionContracts = useMemo(
    () =>
      finalPrizeAmountsReady
        ? candidateTokenIds.map((tokenId) => ({
            address: CONTRACT_ADDRESSES.PREDICTIONS,
            abi: PREDICTIONS_ABI,
            functionName: 'tokenPositions' as const,
            args: [tokenId] as const,
          }))
        : [],
    [candidateTokenIds, finalPrizeAmountsReady],
  )

  const { data: finalPrizePositionData } = useAppReadContracts({
    contracts: finalPrizePositionContracts,
    query: {
      enabled: finalPrizePositionContracts.length > 0,
      refetchInterval: 10000,
      refetchOnWindowFocus: false,
    },
  })

  const finalPrizePositionVersionContracts = useMemo(
    () =>
      finalPrizeAmountsReady
        ? candidateTokenIds.map((tokenId) => ({
            address: CONTRACT_ADDRESSES.PREDICTIONS,
            abi: PREDICTIONS_ABI,
            functionName: 'tokenPositionsVersion' as const,
            args: [tokenId] as const,
          }))
        : [],
    [candidateTokenIds, finalPrizeAmountsReady],
  )

  const { data: finalPrizePositionVersionData } = useAppReadContracts({
    contracts: finalPrizePositionVersionContracts,
    query: {
      enabled: finalPrizePositionVersionContracts.length > 0,
      refetchInterval: 10000,
      refetchOnWindowFocus: false,
    },
  })

  const finalPrizePositionsReady = useMemo(() => {
    if (!finalPrizeAmountsReady) return false
    if (candidateTokenIds.length === 0) return true
    if (positionsVersion === undefined) return false
    if (
      finalPrizePositionData?.length !== candidateTokenIds.length
      || finalPrizePositionVersionData?.length !== candidateTokenIds.length
    ) {
      return false
    }

    return candidateTokenIds.every(
      (_, i) =>
        typeof finalPrizePositionData?.[i]?.result === 'bigint'
        && typeof finalPrizePositionVersionData?.[i]?.result === 'bigint',
    )
  }, [candidateTokenIds, finalPrizeAmountsReady, finalPrizePositionData, finalPrizePositionVersionData, positionsVersion])

  const liveFinalPrizeEntries = useMemo(() => {
    if (!finalPrizePositionsReady) return undefined

    return candidateTokenIds
      .map((tokenId, i) => ({
        tokenId,
        rank: finalPrizePositionData?.[i]?.result as bigint,
        version: finalPrizePositionVersionData?.[i]?.result as bigint,
      }))
      .filter((entry) => entry.rank > 0n && entry.version === (positionsVersion ?? 0n))
      .sort((a, b) => {
        if (a.rank !== b.rank) return a.rank < b.rank ? -1 : 1
        if (a.tokenId === b.tokenId) return 0
        return a.tokenId < b.tokenId ? -1 : 1
      })
  }, [candidateTokenIds, finalPrizePositionData, finalPrizePositionVersionData, finalPrizePositionsReady, positionsVersion])

  const stableFinalPrizeEntries = useStableValue(liveFinalPrizeEntries, liveFinalPrizeEntries !== undefined)
  const finalPrizeEntries = useMemo(() => stableFinalPrizeEntries ?? [], [stableFinalPrizeEntries])

  const finalPrizeContracts = useMemo(
    () =>
      finalPrizeAmountsReady
        ? finalPrizeEntries.map(({ tokenId }) => ({
            address: CONTRACT_ADDRESSES.TREASURY,
            abi: TREASURY_ABI,
            functionName: 'getClaimablePrizeAmount' as const,
            args: [tournamentId, tokenId, CONTRACT_ADDRESSES.USDC] as const,
          }))
        : [],
    [finalPrizeAmountsReady, finalPrizeEntries, tournamentId],
  )

  const { data: finalPrizeData } = useAppReadContracts({
    contracts: finalPrizeContracts,
    query: {
      enabled: finalPrizeContracts.length > 0,
      refetchInterval: 10000,
      refetchOnWindowFocus: false,
    },
  })

  const prizeContracts = useMemo(() => {
    if (tournamentId === 0n || !usdcDistributionSet) return []
    return PRIZE_BANDS.map((band) => ({
      address: CONTRACT_ADDRESSES.TREASURY,
      abi: TREASURY_ABI,
      functionName: 'getUserPrizeAmount',
      args: [tournamentId, CONTRACT_ADDRESSES.USDC, BigInt(band.start)],
    }) as const)
  }, [tournamentId, usdcDistributionSet])

  const { data: prizeAmounts } = useAppReadContracts({
    contracts: prizeContracts,
    query: { enabled: prizeContracts.length > 0 },
  })

  const estimatedUsdcBandAmounts = useMemo(
    () => PRIZE_BANDS.map((band) => (usdcPrizePool !== undefined ? getBandAmount(usdcPrizePool, band.start) : 0n)),
    [usdcPrizePool],
  )

  const hasOnchainBandAmounts = Boolean(usdcDistributionSet)
    && PRIZE_BANDS.every((_, index) => typeof prizeAmounts?.[index]?.result === 'bigint')

  const finalPrizeDataReady = useMemo(() => {
    if (!finalPrizeAmountsReady) return false
    if (!finalPrizePositionsReady) return false
    if (finalPrizeContracts.length === 0) return true
    if (finalPrizeData?.length !== finalPrizeContracts.length) return false

    return finalPrizeContracts.every((_, index) => typeof finalPrizeData?.[index]?.result === 'bigint')
  }, [finalPrizeAmountsReady, finalPrizeContracts, finalPrizeData, finalPrizePositionsReady])

  const liveFinalPrizeRows = useMemo(() => {
    if (!finalPrizeDataReady) return undefined

    const payouts = finalPrizeEntries
      .map((entry, index) => ({
        rank: Number(entry.rank),
        amount: finalPrizeData?.[index]?.result as bigint,
      }))
      .filter((entry) => entry.amount > 0n)

    const rows: Array<{ label: string; amount: bigint; shared: boolean }> = []

    for (let i = 0; i < payouts.length;) {
      const current = payouts[i]
      let count = 0
      while (i + count < payouts.length && payouts[i + count].rank === current.rank) {
        count += 1
      }

      rows.push({
        label: count > 1 ? `${current.rank}° compartido` : `${current.rank}°`,
        amount: current.amount,
        shared: count > 1,
      })

      i += count
    }

    return rows
  }, [finalPrizeData, finalPrizeDataReady, finalPrizeEntries])

  const finalPrizeRows = useStableValue(liveFinalPrizeRows, liveFinalPrizeRows !== undefined) ?? []

  const hasLoadedFinalPrizeAmounts = Boolean(finalPrizeAmountsReady) && (finalPrizeDataReady || finalPrizeRows.length > 0)

  const usdcBandAmounts = hasOnchainBandAmounts
    ? PRIZE_BANDS.map((_, index) => prizeAmounts?.[index]?.result as bigint)
    : estimatedUsdcBandAmounts

  const prizeTableTitle = finalPrizeAmountsReady || hasOnchainBandAmounts ? 'Premios' : 'Premios estimados'

  const formatAssetValue = (amount: bigint) => {
    if (amount === 0n) return `—`
    return `${Number(formatUnits(amount, 6)).toFixed(2)} USDC`
  }

  const buyCartonWithUsdc = () => {
    if (!usdcPriceValue) return
    void purchaseWrite.simulateAndSend(
      {
        address: CONTRACT_ADDRESSES.CARTON,
        abi: CARTON_ABI,
        functionName: 'buyCartonWithToken',
        args: [tournamentId, CONTRACT_ADDRESSES.USDC],
      },
      {
        toastId: 'buy-carton-usdc',
        pendingMessage: 'Esperando confirmación de compra…',
        successMessage: '¡Cartón comprado con USDC!',
        revertedMessage: 'La compra con USDC fue rechazada en cadena.',
        mapError: mapBuyCartonError,
        onSuccess: async () => {
          setIsPurchaseModalOpen(false)
          const [cartonsResult] = await Promise.all([refetchCartonsUser(), refetchPurchaseReads()])
          const latestTokenId = cartonsResult.data?.reduce<bigint | undefined>((latest, current) => {
            if (latest === undefined || current > latest) return current
            return latest
          }, undefined)

          if (latestTokenId !== undefined) {
            navigateToCarton(latestTokenId)
          }
        },
        logLabel: 'Buy carton with USDC',
      },
    )
  }

  const approveUsdc = () => {
    if (!usdcPriceValue) return
    void approveWrite.simulateAndSend(
      { address: CONTRACT_ADDRESSES.USDC, abi: USDC_ABI, functionName: 'approve', args: [CONTRACT_ADDRESSES.CARTON, usdcPriceValue] },
      {
        toastId: 'approve-usdc',
        pendingMessage: 'Esperando confirmación de aprobación…',
        successMessage: 'USDC aprobado. Ya puedes comprar.',
        revertedMessage: 'La aprobación USDC fue rechazada en cadena.',
        mapError: mapApproveUsdcError,
        onSuccess: async () => { await refetchPurchaseReads() },
        logLabel: 'Approve USDC',
      },
    )
  }

  const handleBuyClick = () => {
    setIsPurchaseModalOpen(true)
  }

  const handleArsCheckout = async () => {
    if (!normalizedAddress) {
      toast.error('Conéctate antes de pagar en pesos.')
      return
    }

    if (tournamentId === 0n) {
      toast.error('No hay un torneo activo disponible para emitir cartones.')
      return
    }

    setIsCreatingArsOrder(true)

    try {
      const order = await createCheckoutOrder({
        walletAddress: normalizedAddress,
        tournamentId: Number(tournamentId),
        quantity: 1,
        paymentRail: 'fiat_ars',
        ...(openfortUserId ? { openfortUserId } : {}),
      })

      const checkoutUrl = getMercadoPagoCheckoutUrl(order)
      if (!checkoutUrl) {
        throw new Error('missing-checkout-url')
      }

      window.location.assign(checkoutUrl)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'create-order-failed'
      toast.error(`No pudimos iniciar el checkout en pesos: ${message}`)
      setIsCreatingArsOrder(false)
    }
  }

  const activeTournamentCartons = useMemo(() => {
    if (!cartonsUser.length || tournamentId === 0n) return []

    return cartonsUser.filter(
      (_, index) => (cartonTournamentIds[index] ?? 0n) === tournamentId,
    )
  }, [cartonTournamentIds, cartonsUser, tournamentId])

  const buyButtonText = () => {
    if (!isConnected) return 'Conecta tu wallet para comprar'
    if (activeTournamentCartons.length > 0) return 'Comprar cartón extra'
    return 'Comprar cartón'
  }

  const { data: deadline } = useAppReadContract<bigint>({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'submissionDeadline',
    query: { refetchInterval: 10000, refetchOnWindowFocus: false },
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
    return `${pad(h)}h ${pad(m)}m ${pad(ss)}s`
  }

  const usdcPoolDisplay = usdcPrizePool !== undefined
    ? `${Number(formatUnits(usdcPrizePool, 6)).toFixed(2)} USDC`
    : '—'

  const cartonStatusContracts = useMemo(() => {
    if (!activeTournamentCartons.length) return []

    return activeTournamentCartons.flatMap((tokenId) => [
      {
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'used',
        args: [tokenId],
      } as const,
      {
        address: CONTRACT_ADDRESSES.PREDICTIONS,
        abi: PREDICTIONS_ABI,
        functionName: 'winnersPredictions',
        args: [tokenId],
      } as const,
    ])
  }, [activeTournamentCartons])

  const { data: cartonStatusResults } = useAppReadContracts({
    contracts: cartonStatusContracts,
    query: {
      enabled: cartonStatusContracts.length > 0,
      refetchInterval: 10000,
      refetchOnWindowFocus: false,
    },
  })

  const claimablePrizeContracts = useMemo(
    () =>
      tournamentFinalized
        ? activeTournamentCartons.map((tokenId) => ({
            address: CONTRACT_ADDRESSES.TREASURY,
            abi: TREASURY_ABI,
            functionName: 'getClaimablePrizeAmount' as const,
            args: [tournamentId, tokenId, CONTRACT_ADDRESSES.USDC] as const,
          }))
        : [],
    [activeTournamentCartons, tournamentFinalized, tournamentId],
  )

  const { data: claimablePrizeResults } = useAppReadContracts({
    contracts: claimablePrizeContracts,
    query: {
      enabled: claimablePrizeContracts.length > 0,
      refetchInterval: 10000,
      refetchOnWindowFocus: false,
    },
  })

  const claimedPrizeContracts = useMemo(
    () =>
      tournamentFinalized
        ? activeTournamentCartons.map((tokenId) => ({
            address: CONTRACT_ADDRESSES.TREASURY,
            abi: TREASURY_ABI,
            functionName: 'hasUserClaimed' as const,
            args: [tournamentId, tokenId, CONTRACT_ADDRESSES.USDC] as const,
          }))
        : [],
    [activeTournamentCartons, tournamentFinalized, tournamentId],
  )

  const { data: claimedPrizeResults } = useAppReadContracts({
    contracts: claimedPrizeContracts,
    query: {
      enabled: claimedPrizeContracts.length > 0,
      refetchInterval: 10000,
      refetchOnWindowFocus: false,
    },
  })

  const cartonEntries = useMemo(() => {
    if (!activeTournamentCartons.length) return []

    const deadlineValue = deadline ? Number(deadline) : undefined

    return activeTournamentCartons.map((tokenId, index) => {
      const gamesSubmitted = Boolean(cartonStatusResults?.[index * 2]?.result)
      const winnersSubmitted = hasWinnersPrediction(cartonStatusResults?.[index * 2 + 1]?.result)
      const status = getPredictionStatus({ gamesSubmitted, winnersSubmitted, deadline: deadlineValue })
      const claimablePrize = tournamentFinalized
        ? ((claimablePrizeResults?.[index]?.result as bigint | undefined) ?? 0n)
        : 0n
      const hasClaimedPrize = tournamentFinalized
        ? Boolean(claimedPrizeResults?.[index]?.result)
        : false

      const prizeStatus: 'none' | 'claimable' | 'claimed' = hasClaimedPrize
        ? 'claimed'
        : claimablePrize > 0n
          ? 'claimable'
          : 'none'

      return { tokenId, status, gamesSubmitted, winnersSubmitted, prizeStatus }
    })
  }, [activeTournamentCartons, cartonStatusResults, claimablePrizeResults, claimedPrizeResults, deadline, tournamentFinalized])

  const orderedCartonEntries = useMemo(() => {
    return [...cartonEntries].sort((a, b) => {
      const priorityDiff = getPredictionStatusPriority(a.status) - getPredictionStatusPriority(b.status)
      if (priorityDiff !== 0) return priorityDiff
      if (a.tokenId === b.tokenId) return 0
      return a.tokenId > b.tokenId ? -1 : 1
    })
  }, [cartonEntries])

  const nextActionableCarton = useMemo(
    () => orderedCartonEntries.find((entry) => entry.status === 'partial' || entry.status === 'none'),
    [orderedCartonEntries],
  )

  const allCartonsComplete = cartonEntries.length > 0 && cartonEntries.every((entry) => entry.status === 'complete')

  const nextActionableCopy = (() => {
    if (!nextActionableCarton) return null
    if (!nextActionableCarton.gamesSubmitted) {
      return {
        title: `Carton #${nextActionableCarton.tokenId.toString()} esperando tus partidos`,
        description: 'Ya tienes un carton listo para arrancar. Empieza por cargar los resultados de grupos.',
        cta: 'Comenzar prediccion',
      }
    }

    if (!nextActionableCarton.winnersSubmitted) {
      return {
        title: `Carton #${nextActionableCarton.tokenId.toString()} casi listo`,
        description: 'Ya enviaste los partidos. Solo falta definir el top 4 del torneo.',
        cta: 'Continuar prediccion',
      }
    }

    return null
  })()

  const navigateToCarton = (targetTokenId: bigint) => {
    navigate({ to: '/predictions', search: { carton: targetTokenId.toString() } })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* ─── Deadline banner ─── */}
      {deadline !== undefined && deadline > 0n && (
        <div
          className="rounded-lg px-4 py-2.5 flex items-center gap-2 text-sm"
          style={{
            background: isExpired ? 'rgba(255,77,109,0.1)' : 'rgba(255,214,0,0.08)',
            border: `1px solid ${isExpired ? 'rgba(255,77,109,0.25)' : 'rgba(255,214,0,0.2)'}`,
            color: isExpired ? 'var(--accent-red)' : 'var(--accent-gold)',
          }}
        >
          <span>{isExpired ? '🔒' : '⏱'}</span>
          <span>
            {isExpired
              ? `Predicciones cerradas · ${new Date(Number(deadline) * 1000).toLocaleDateString()}`
              : `Cierra en ${formatCountdown(remaining)}`}
          </span>
        </div>
      )}

      {/* ─── Prize Pool Hero ─── */}
      {tournamentId > 0n && (
        <section className="space-y-1">
          <p
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: 'var(--text-secondary)' }}
          >
            Pozo premiable
          </p>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span
              className="font-display text-5xl font-black leading-none"
              style={{ color: 'var(--accent-gold)', textShadow: 'var(--glow-gold)' }}
            >
              {usdcPoolDisplay}
            </span>
          </div>
        </section>
      )}

      {gasReadinessNotice && (
        <div
          className="rounded-xl p-4 space-y-1"
          style={{
            background: 'rgba(255, 77, 109, 0.08)',
            border: '1px solid rgba(255, 77, 109, 0.22)',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--accent-red)' }}>
            {gasReadinessNotice.title}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {gasReadinessNotice.description}
          </p>
        </div>
      )}

      {/* ─── Buy Carton ─── */}
      <div
        className="rounded-xl p-5 space-y-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="font-display text-xl font-bold uppercase tracking-wide"
            style={{ color: 'var(--text-primary)' }}
          >
            Comprar Cartón
          </h2>
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            ARS + USDC
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <span
            className="text-3xl font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono-custom)' }}
          >
            {priceDisplay}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            o {ARS_CARTON_PRICE_LABEL} por Mercado Pago
          </span>
        </div>

        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Elige entre pagar en pesos con Mercado Pago o con crypto con USDC .
        </p>

        <Button
          className="w-full h-12 text-base font-semibold"
          disabled={!isConnected || tournamentId === 0n}
          onClick={handleBuyClick}
          style={isConnected && tournamentId > 0n ? { boxShadow: 'var(--glow-green)' } : undefined}
        >
          {buyButtonText()}
        </Button>
        {(!isConnected || tournamentId === 0n) && (
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {!isConnected
              ? 'Conéctate para elegir cómo pagar y fijar la dirección que recibirá el cartón.'
              : 'No hay un torneo activo configurado para vender cartones ahora mismo.'}
          </p>
        )}
      </div>

      <PurchaseCartonModal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          if (isCreatingArsOrder) return
          setIsPurchaseModalOpen(false)
        }}
        arsPriceLabel={ARS_CARTON_PRICE_LABEL}
        usdcPriceLabel={priceDisplay}
        walletAddressLabel={normalizedAddress ?? 'Wallet no conectada'}
        arsActionLabel="Comprar con Mercado Pago"
        onArsCheckout={() => { void handleArsCheckout() }}
        isCreatingArsOrder={isCreatingArsOrder}
        arsBlockedMessage={arsBlockedMessage}
        gasNotice={gasReadinessNotice}
        approvalAction={
          needsApproval ? (
            <>
              <Button
                variant="outline"
                className="w-full"
                disabled={approvalBlockedMessage !== null}
                onClick={approveUsdc}
              >
                {isApproving ? 'Aprobando…' : 'Aprobar USDC'}
              </Button>
              {approvalBlockedMessage && (
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {approvalBlockedMessage}
                </p>
              )}
            </>
          ) : null
        }
        usdcAction={
          <>
            <Button
              className="h-11 w-full text-base font-semibold"
              disabled={!canBuy}
              onClick={buyCartonWithUsdc}
              style={canBuy ? { boxShadow: 'var(--glow-green)' } : undefined}
            >
              {isBuying ? 'Comprando…' : 'Comprar con USDC'}
            </Button>
            {buyBlockedMessage && (
              <p className="text-xs mb-[-28px]" style={{ color: 'var(--text-secondary)' }}>
                {buyBlockedMessage}
              </p>
            )}
          </>
        }
      />

      {/* ─── Mis Cartones ─── */}
      {isConnected && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: 'var(--text-secondary)' }}
            >
              Mis Cartones
            </p>
            {activeTournamentCartons.length > 0 && (
              <span
                className="text-xs font-mono px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(0,230,118,0.12)', color: 'var(--accent-green)' }}
              >
                {activeTournamentCartons.length}
              </span>
            )}
          </div>
          {nextActionableCarton && nextActionableCopy && (
            <div
              className="rounded-xl p-4 space-y-3"
              style={{ background: 'rgba(0, 230, 118, 0.08)', border: '1px solid rgba(0, 230, 118, 0.2)' }}
            >
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--accent-green)' }}>
                  Tu siguiente paso
                </p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {nextActionableCopy.title}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {nextActionableCopy.description}
                </p>
              </div>
              <Button className="w-full sm:w-auto" onClick={() => navigateToCarton(nextActionableCarton.tokenId)}>
                {nextActionableCopy.cta}
              </Button>
            </div>
          )}
          {!nextActionableCarton && allCartonsComplete && (
            <div
              className="rounded-xl p-4 space-y-1"
              style={{ background: 'rgba(0, 230, 118, 0.05)', border: '1px solid rgba(0, 230, 118, 0.14)' }}
            >
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Tienes todos tus cartones al dia.
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Si compras otro, te llevamos directo a completar sus predicciones.
              </p>
            </div>
          )}
          {activeTournamentCartons.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Ticket className="w-8 h-8 opacity-30" style={{ color: 'var(--text-disabled)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-disabled)' }}>
                {cartonsUser && cartonsUser.length > 0 ? 'Sin cartones en el torneo activo' : 'Sin cartones todavía'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-disabled)' }}>
                {cartonsUser && cartonsUser.length > 0
                  ? 'Tus otros cartones pertenecen a otro torneo. Compra uno del torneo activo para predecir aquí.'
                  : 'Comprá el primero para comenzar a predecir'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {orderedCartonEntries.map(({ tokenId, status, prizeStatus }) => (
                <CartonListItem
                  key={tokenId.toString()}
                  tokenId={tokenId}
                  status={status}
                  prizeStatus={prizeStatus}
                  highlighted={nextActionableCarton?.tokenId === tokenId}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Prize distribution ─── */}
      {tournamentId > 0n && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border-color)' }}
        >
          {usdcPrizePool !== undefined && usdcPrizePool > 0n && (
            <div>
              <div
                className="px-4 py-2.5 flex justify-between text-xs font-medium"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
              >
                 <span className="uppercase tracking-wider">{prizeTableTitle}</span>
                 <span style={{ fontFamily: 'var(--font-mono-custom)', color: 'var(--text-primary)' }}>
                   {usdcPoolDisplay}
                 </span>
               </div>
              {finalPrizeAmountsReady ? (
                hasLoadedFinalPrizeAmounts ? (
                  finalPrizeRows.map((row, idx) => (
                    <div
                      key={`final-prize-${row.label}`}
                      className="px-4 py-2.5 flex items-center justify-between text-sm"
                      style={{
                        background: 'var(--bg-card)',
                        borderBottom: idx < finalPrizeRows.length - 1 ? '1px solid var(--border-color)' : 'none',
                      }}
                    >
                      <span style={{ color: 'var(--text-primary)' }}>{row.label}</span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono-custom)',
                          fontWeight: 600,
                          color: row.label === '1°' ? 'var(--accent-gold)' : 'var(--text-primary)',
                        }}
                      >
                        {formatAssetValue(row.amount)}{row.shared ? ' c/u' : ''}
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    className="px-4 py-3 text-xs"
                    style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
                  >
                    Cargando premios finales...
                  </div>
                )
              ) : (
                PRIZE_BANDS.map((band, idx) => (
                  <div
                    key={`usdc-${band.start}`}
                    className="px-4 py-2.5 flex items-center justify-between text-sm"
                    style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}
                  >
                    {/** Only medal rows need the numeric label next to the icon. */}
                    <span className="flex items-center gap-2">
                      <span>{band.icon}</span>
                      {band.start <= 3 && <span style={{ color: 'var(--text-secondary)' }}>{band.label}</span>}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono-custom)',
                        fontWeight: 600,
                        color: band.start === 1 ? 'var(--accent-gold)' : 'var(--text-primary)',
                      }}
                    >
                      {formatAssetValue(usdcBandAmounts[idx])}
                    </span>
                  </div>
                ))
              )}
              {!finalPrizeAmountsReady && !hasOnchainBandAmounts && (
                <div
                  className="px-4 py-3 text-xs"
                  style={{
                    background: 'rgba(96,165,250,0.08)',
                    borderTop: '1px solid var(--border-color)',
                    color: 'rgb(125, 211, 252)',
                  }}
                >
                  Cada fila muestra el premio por puesto. Mientras no se cierre el pozo, usamos valores aproximados.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
