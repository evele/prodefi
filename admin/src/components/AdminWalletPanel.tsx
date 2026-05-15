import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { appChainId } from '../lib/chains'
import { useAdminWallet } from '../lib/wallet'

function truncateAddress(address?: string) {
  if (!address) return 'Not connected'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function AdminWalletPanel() {
  const { address, chain, connect, disconnect, error, hasProvider, isConnected, isConnecting } = useAdminWallet()

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
            <span className="font-medium">Expected chain:</span> {appChainId}
          </div>
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
