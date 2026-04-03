import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI, USDC_ABI, ZERO_ADDRESS } from '../lib/contracts'
import { formatEther, formatUnits } from 'viem'
import { Button } from '../components/ui/button'
import { CartonListItem } from '../components/CartonListItem'
import { useUserBalance } from '../hooks/useBalance'
import { useSimulatedContractWrite } from '../hooks/useSimulatedContractWrite'
import { mapApproveUsdcError, mapBuyCartonError } from '../lib/transaction-errors'
import { Ticket } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const POSITION_META = [
  { label: '1° Lugar', icon: '🥇', position: 1 },
  { label: '2° Lugar', icon: '🥈', position: 2 },
  { label: '3° Lugar', icon: '🥉', position: 3 },
  { label: '4° Lugar', icon: '4°',  position: 4 },
] as const

function HomePage() {
  const { isConnected, address: userAddress } = useAccount()
  const normalizedAddress = userAddress as `0x${string}` | undefined
  const [currency, setCurrency] = useState<'ETH' | 'USDC'>('ETH')
  const { eth: ethBalance, usdc: usdcBalance } = useUserBalance()
  const purchaseWrite = useSimulatedContractWrite()
  const approveWrite = useSimulatedContractWrite()

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
  const isBuying = purchaseWrite.isBusy
  const isApproving = approveWrite.isBusy

  const priceDisplay =
    currency === 'ETH'
      ? priceLoading
        ? '…'
        : cartonPrice
          ? `${formatEther(cartonPrice)} ETH`
          : '—'
      : usdcPriceLoading
        ? '…'
        : usdcPriceValue > 0n
          ? `${formatUnits(usdcPriceValue, 6)} USDC`
          : '—'

  const buyButtonText = () => {
    if (!isConnected) return 'Conecta tu wallet para comprar'
    if (currency === 'ETH') return isBuying ? 'Comprando…' : 'Comprar con ETH'
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
    if (currency === 'ETH') {
      if (priceLoading) return 'Cargando precio ETH…'
      if (!cartonPrice) return 'El precio ETH no está configurado aún.'
    } else {
      if (usdcPriceLoading) return 'Cargando precio USDC…'
      if (usdcPriceValue === 0n) return 'El precio USDC no está configurado aún.'
      if (needsApproval) return 'Aprueba USDC antes de comprar.'
    }
    if (purchaseWrite.isSimulating) return 'Verificando la compra…'
    if (purchaseWrite.isPending) return 'Confirma la compra en tu wallet.'
    if (purchaseWrite.isConfirming) return 'Confirmando compra en cadena…'
    return null
  })()

  const canBuy = buyBlockedMessage === null

  const balanceDisplay = () => {
    if (!isConnected) return null
    if (currency === 'ETH')
      return ethBalance.isLoading ? '…' : `${ethBalance.amount} ${ethBalance.symbol}`
    return usdcBalance.isLoading ? '…' : `${usdcBalance.amount} ${usdcBalance.symbol}`
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
    if (amount === 0n) return `—`
    return asset === 'ETH'
      ? `${Number(formatEther(amount)).toFixed(3)} ETH`
      : `${Number(formatUnits(amount, 6)).toFixed(2)} USDC`
  }

  const buyCartonWithEth = () => {
    if (!cartonPrice) return
    void purchaseWrite.simulateAndSend(
      { address: CONTRACT_ADDRESSES.CARTON, abi: CARTON_ABI, functionName: 'buyCarton', args: [], value: cartonPrice },
      {
        toastId: 'buy-carton-eth',
        pendingMessage: 'Esperando confirmación de compra…',
        successMessage: '¡Cartón comprado con ETH!',
        revertedMessage: 'La compra con ETH fue rechazada en cadena.',
        mapError: (error) => mapBuyCartonError(error, 'ETH'),
        onSuccess: async () => { await Promise.all([refetchCartonsUser(), refetchAllowance()]) },
        logLabel: 'Buy carton with ETH',
      },
    )
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
        mapError: (error) => mapBuyCartonError(error, 'USDC'),
        onSuccess: async () => { await Promise.all([refetchCartonsUser(), refetchAllowance()]) },
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
    if (currency === 'ETH') buyCartonWithEth()
    else buyCartonWithUsdc()
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

  const ethPoolDisplay = ethPrizePool !== undefined
    ? `${Number(formatEther(ethPrizePool)).toFixed(3)} ETH`
    : '—'
  const usdcPoolDisplay = usdcPrizePool !== undefined
    ? `${Number(formatUnits(usdcPrizePool, 6)).toFixed(2)} USDC`
    : '—'

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
            Prize Pool
          </p>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span
              className="font-display text-5xl font-black leading-none"
              style={{ color: 'var(--accent-gold)', textShadow: 'var(--glow-gold)' }}
            >
              {ethPoolDisplay}
            </span>
            <span
              className="text-xl font-semibold"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono-custom)' }}
            >
              + {usdcPoolDisplay}
            </span>
          </div>
        </section>
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
          {/* Currency toggle */}
          <div
            className="flex rounded-lg overflow-hidden text-sm"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
          >
            {(['ETH', 'USDC'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className="px-3 py-1.5 font-medium transition-colors"
                style={{
                  background: currency === c ? 'var(--accent-green)' : 'transparent',
                  color: currency === c ? 'var(--bg-base)' : 'var(--text-secondary)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
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
        {currency === 'USDC' && needsApproval && (
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
            <div className="flex flex-wrap gap-2">
              {cartonsUser.map((tokenId) => (
                <CartonListItem
                  key={tokenId.toString()}
                  tokenId={tokenId}
                  deadline={deadline ? Number(deadline) : undefined}
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
          {/* ETH section */}
          {ethPrizePool !== undefined && ethPrizePool > 0n && (
            <div>
              <div
                className="px-4 py-2.5 flex justify-between text-xs font-medium"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
              >
                <span className="uppercase tracking-wider">Pool ETH</span>
                <span style={{ fontFamily: 'var(--font-mono-custom)', color: 'var(--text-primary)' }}>
                  {ethPoolDisplay}
                </span>
              </div>
              {POSITION_META.map((meta, idx) => (
                <div
                  key={`eth-${meta.position}`}
                  className="px-4 py-2.5 flex items-center justify-between text-sm"
                  style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}
                >
                  <span className="flex items-center gap-2">
                    <span>{meta.icon}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{meta.label}</span>
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono-custom)',
                      fontWeight: 600,
                      color: meta.position === 1 ? 'var(--accent-gold)' : 'var(--text-primary)',
                    }}
                  >
                    {formatAssetValue(ethPositionAmounts[idx], 'ETH')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* USDC section */}
          {usdcPrizePool !== undefined && usdcPrizePool > 0n && (
            <div>
              <div
                className="px-4 py-2.5 flex justify-between text-xs font-medium"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
              >
                <span className="uppercase tracking-wider">Pool USDC</span>
                <span style={{ fontFamily: 'var(--font-mono-custom)', color: 'var(--text-primary)' }}>
                  {usdcPoolDisplay}
                </span>
              </div>
              {POSITION_META.map((meta, idx) => (
                <div
                  key={`usdc-${meta.position}`}
                  className="px-4 py-2.5 flex items-center justify-between text-sm"
                  style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}
                >
                  <span className="flex items-center gap-2">
                    <span>{meta.icon}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{meta.label}</span>
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono-custom)',
                      fontWeight: 600,
                      color: meta.position === 1 ? 'var(--accent-gold)' : 'var(--text-primary)',
                    }}
                  >
                    {formatAssetValue(usdcPositionAmounts[idx], 'USDC')}
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
