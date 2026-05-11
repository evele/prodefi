import { useEffect, useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI, USDC_ABI } from '../lib/contracts'
import { formatUnits } from 'viem'
import { Button } from '../components/ui/button'
import { CartonListItem } from '../components/CartonListItem'
import { useUserBalance } from '../hooks/useBalance'
import { useSimulatedContractWrite } from '../hooks/useSimulatedContractWrite'
import { getPredictionStatus, getPredictionStatusPriority, hasWinnersPrediction } from '../lib/prediction-status'
import { mapApproveUsdcError, mapBuyCartonError } from '../lib/transaction-errors'
import { PRIZE_BANDS } from '../lib/prize-payout'
import { Ticket } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const { isConnected, address: userAddress } = useAccount()
  const normalizedAddress = userAddress as `0x${string}` | undefined
  const { eth: nativeBalance, usdc: usdcBalance } = useUserBalance()
  const purchaseWrite = useSimulatedContractWrite()
  const approveWrite = useSimulatedContractWrite()

  const { data: activeTournamentId } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'activeTournamentId',
  })
  const tournamentId = activeTournamentId ?? 0n

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
  const needsApproval = usdcPriceValue > 0n && usdcAllowanceValue < usdcPriceValue
  const isBuying = purchaseWrite.isBusy
  const isApproving = approveWrite.isBusy

  const priceDisplay =
    usdcPriceLoading
      ? '…'
      : usdcPriceValue > 0n
        ? `${formatUnits(usdcPriceValue, 6)} USDC`
        : '—'

  const buyButtonText = () => {
    if (!isConnected) return 'Conecta tu wallet para comprar'
    return isBuying ? 'Comprando…' : 'Comprar con USDC'
  }

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

  const balanceDisplay = () => {
    if (!isConnected) return null
    return usdcBalance.isLoading ? '…' : `${usdcBalance.amount} ${usdcBalance.symbol}`
  }

  const gasReadinessNotice = (() => {
    if (!isConnected || nativeBalance.isLoading) return null
    if (nativeBalance.value > 0n) return null

    return {
      title: `Te falta ${nativeBalance.symbol} para gas`,
      description:
        `El cartón se paga con USDC, pero igual necesitas ${nativeBalance.symbol} para aprobar y comprar en la red.`,
    }
  })()

  const { data: usdcPrizePool } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getPrizePool',
    args: tournamentId > 0n ? [tournamentId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n },
  })

  const { data: usdcReservePool } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getReservePool',
    args: tournamentId > 0n ? [tournamentId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n },
  })

  const prizeContracts = useMemo(() => {
    if (tournamentId === 0n) return []
    return PRIZE_BANDS.map((band) => ({
      address: CONTRACT_ADDRESSES.TREASURY,
      abi: TREASURY_ABI,
      functionName: 'getUserPrizeAmount',
      args: [tournamentId, CONTRACT_ADDRESSES.USDC, BigInt(band.start)],
    }) as const)
  }, [tournamentId])

  const { data: prizeAmounts } = useReadContracts({
    contracts: prizeContracts,
    query: { enabled: prizeContracts.length > 0 },
  })

  const usdcBandAmounts = PRIZE_BANDS.map((_, index) => {
    const entry = prizeAmounts?.[index]
    return (entry?.result as bigint | undefined) ?? 0n
  })

  const formatAssetValue = (amount: bigint) => {
    if (amount === 0n) return `—`
    return `${Number(formatUnits(amount, 6)).toFixed(2)} USDC`
  }

  const buyCartonWithUsdc = () => {
    if (!usdcPriceValue) return
    void purchaseWrite.simulateAndSend(
      { address: CONTRACT_ADDRESSES.CARTON, abi: CARTON_ABI, functionName: 'buyCartonWithToken', args: [CONTRACT_ADDRESSES.USDC] },
      {
        toastId: 'buy-carton-usdc',
        pendingMessage: 'Esperando confirmación de compra…',
        successMessage: '¡Cartón comprado con USDC!',
        revertedMessage: 'La compra con USDC fue rechazada en cadena.',
        mapError: mapBuyCartonError,
        onSuccess: async () => {
          const [cartonsResult] = await Promise.all([refetchCartonsUser(), refetchAllowance()])
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
        onSuccess: async () => { await refetchAllowance() },
        logLabel: 'Approve USDC',
      },
    )
  }

  const handleBuyClick = () => {
    buyCartonWithUsdc()
  }

  const { data: cartonsUser, refetch: refetchCartonsUser } = useReadContract({
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
    return `${pad(h)}h ${pad(m)}m ${pad(ss)}s`
  }

  const usdcPoolDisplay = usdcPrizePool !== undefined
    ? `${Number(formatUnits(usdcPrizePool, 6)).toFixed(2)} USDC`
    : '—'

  const usdcReserveDisplay = usdcReservePool !== undefined
    ? `${Number(formatUnits(usdcReservePool, 6)).toFixed(2)} USDC`
    : '—'

  const grossSalesDisplay = usdcPrizePool !== undefined && usdcReservePool !== undefined
    ? `${Number(formatUnits(usdcPrizePool + usdcReservePool, 6)).toFixed(2)} USDC`
    : '—'

  const cartonStatusContracts = useMemo(() => {
    if (!cartonsUser?.length) return []

    return cartonsUser.flatMap((tokenId) => [
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
  }, [cartonsUser])

  const { data: cartonStatusResults } = useReadContracts({
    contracts: cartonStatusContracts,
    query: {
      enabled: cartonStatusContracts.length > 0,
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    },
  })

  const cartonEntries = useMemo(() => {
    if (!cartonsUser?.length) return []

    const deadlineValue = deadline ? Number(deadline) : undefined

    return cartonsUser.map((tokenId, index) => {
      const gamesSubmitted = Boolean(cartonStatusResults?.[index * 2]?.result)
      const winnersSubmitted = hasWinnersPrediction(cartonStatusResults?.[index * 2 + 1]?.result)
      const status = getPredictionStatus({ gamesSubmitted, winnersSubmitted, deadline: deadlineValue })

      return { tokenId, status, gamesSubmitted, winnersSubmitted }
    })
  }, [cartonsUser, cartonStatusResults, deadline])

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
        cta: 'Empezar prediccion',
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
    <div className="max-w-lg mx-auto space-y-6">

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
            Pool premiable
          </p>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span
              className="font-display text-5xl font-black leading-none"
              style={{ color: 'var(--accent-gold)', textShadow: 'var(--glow-gold)' }}
            >
              {usdcPoolDisplay}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Ventas brutas: {grossSalesDisplay} · Reserva onchain: {usdcReserveDisplay}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Se premia sobre el 95% de las ventas. El resto queda en reserva y remanentes.
          </p>
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
            USDC only
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span
            className="text-3xl font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono-custom)' }}
          >
            {priceDisplay}
          </span>
          {isConnected && balanceDisplay() && (
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Saldo: {balanceDisplay()}
            </span>
          )}
        </div>

        {/* Approve USDC */}
        {needsApproval && (
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
        )}

        {/* Buy button */}
        <Button
          className="w-full h-11 text-base font-semibold"
          disabled={!canBuy}
          onClick={handleBuyClick}
          style={canBuy ? { boxShadow: 'var(--glow-green)' } : undefined}
        >
          {buyButtonText()}
        </Button>
        {buyBlockedMessage && (
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {buyBlockedMessage}
          </p>
        )}
      </div>

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
            {cartonsUser && cartonsUser.length > 0 && (
              <span
                className="text-xs font-mono px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(0,230,118,0.12)', color: 'var(--accent-green)' }}
              >
                {cartonsUser.length}
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
          {!cartonsUser || cartonsUser.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Ticket className="w-8 h-8 opacity-30" style={{ color: 'var(--text-disabled)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-disabled)' }}>
                Sin cartones todavía
              </p>
              <p className="text-xs" style={{ color: 'var(--text-disabled)' }}>
                Comprá el primero para empezar a predecir
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {orderedCartonEntries.map(({ tokenId, status }) => (
                <CartonListItem
                  key={tokenId.toString()}
                  tokenId={tokenId}
                  status={status}
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
                <span className="uppercase tracking-wider">Bandas de premios</span>
                <span style={{ fontFamily: 'var(--font-mono-custom)', color: 'var(--text-primary)' }}>
                  {usdcPoolDisplay}
                </span>
              </div>
              {PRIZE_BANDS.map((band, idx) => (
                <div
                  key={`usdc-${band.start}`}
                  className="px-4 py-2.5 flex items-center justify-between text-sm"
                  style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}
                >
                  <span className="flex items-center gap-2">
                    <span>{band.icon}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{band.label}</span>
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
