import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { appChain, appChainId, appRpcUrl } from '../lib/chains'
import { useAdminWallet } from '../lib/wallet'

function truncateAddress(address?: string) {
  if (!address) return 'Not connected'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function AdminWalletPanel() {
  const {
    address,
    chain,
    connect,
    disconnect,
    switchToAppChain,
    error,
    hasProvider,
    isConnected,
    isConnecting,
    isSwitchingChain,
    isWrongNetwork,
  } = useAdminWallet()

  const networkNotice = !hasProvider
    ? {
        title: 'No wallet detected',
        description: 'Necesitás una wallet inyectada en el navegador para usar este admin.',
        border: '1px solid rgba(255, 214, 0, 0.22)',
        background: 'rgba(255, 214, 0, 0.08)',
        color: 'var(--accent-gold)',
      }
    : isWrongNetwork
      ? {
          title: 'Red incorrecta',
          description: `La wallet está en ${chain ? `${chain.name} (${chain.id})` : 'otra red'}. Cambiala a ${appChain.name} (${appChainId}) para firmar transacciones del admin.`,
          border: '1px solid rgba(255, 214, 0, 0.22)',
          background: 'rgba(255, 214, 0, 0.08)',
          color: 'var(--accent-gold)',
        }
      : isConnected
        ? {
            title: 'Wallet lista',
            description: `La wallet ya está conectada a ${appChain.name} (${appChainId}).`,
            border: '1px solid rgba(0, 230, 118, 0.2)',
            background: 'rgba(0, 230, 118, 0.08)',
            color: 'var(--accent-green)',
          }
        : {
            title: `Conectate a ${appChain.name}`,
            description: 'Antes de usar el admin, conectá una wallet y verificá que esté en la red correcta.',
            border: '1px solid rgba(255, 214, 0, 0.22)',
            background: 'rgba(255, 214, 0, 0.08)',
            color: 'var(--accent-gold)',
          }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Wallet</CardTitle>
        <CardDescription>Conecta una wallet EOA para operar el panel administrativo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 text-sm md:grid-cols-3">
          <div>
            <span className="font-medium">Connected:</span> {truncateAddress(address)}
          </div>
          <div>
            <span className="font-medium">Chain:</span> {chain ? `${chain.name} (${chain.id})` : 'Not connected'}
          </div>
          <div>
            <span className="font-medium">Expected chain:</span> {appChain.name} ({appChainId})
          </div>
        </div>

        <div
          className="rounded-lg p-3 space-y-2"
          style={{
            border: networkNotice.border,
            background: networkNotice.background,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: networkNotice.color }}>
            {networkNotice.title}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {networkNotice.description}
          </p>

          {hasProvider && (!isConnected || isWrongNetwork) && (
            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => void switchToAppChain()} disabled={isSwitchingChain}>
                {isSwitchingChain ? 'Switching network...' : `Switch / add ${appChain.name}`}
              </Button>
            </div>
          )}

          <details className="text-xs" open={isWrongNetwork}>
            <summary className="cursor-pointer hover:text-white/80" style={{ color: 'var(--text-secondary)' }}>
              Configuración sugerida para la wallet
            </summary>
            <div className="mt-2 grid gap-2 font-mono text-[11px]">
              <div>
                <span className="font-semibold">Chain name:</span> {appChain.name}
              </div>
              <div>
                <span className="font-semibold">Chain ID:</span> {appChainId}
              </div>
              <div>
                <span className="font-semibold">Currency:</span> {appChain.nativeCurrency.name} ({appChain.nativeCurrency.symbol})
              </div>
              <div className="break-all">
                <span className="font-semibold">RPC URL:</span> {appRpcUrl}
              </div>
            </div>
          </details>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => void connect()} disabled={!hasProvider || isConnecting}>
            {isConnecting ? 'Connecting wallet...' : 'Connect injected wallet'}
          </Button>

          {isConnected && (
            <Button type="button" variant="secondary" onClick={() => disconnect()}>
              Disconnect
            </Button>
          )}
        </div>

        {!hasProvider && <div className="text-sm text-amber-500">No injected wallet was detected in this browser.</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}
      </CardContent>
    </Card>
  )
}
