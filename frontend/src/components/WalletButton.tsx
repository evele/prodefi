import { useMemo } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { LogOut } from 'lucide-react'
import { useSignOut, useUI, useUser } from '@openfort/react'
import { useEthereumEmbeddedWallet } from '@openfort/react/ethereum'

import { canUseOpenfort } from '../lib/chains'

function truncateAddress(address?: string) {
  if (!address) return 'Conectar'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function OpenfortWalletButton({ mobile = false }: { mobile?: boolean }) {
  const { openProfile, openProviders } = useUI()
  const { user, isConnected, isLoading } = useUser()
  const { activeWallet } = useEthereumEmbeddedWallet()
  const { signOut, isLoading: isSigningOut } = useSignOut()

  const label = useMemo(() => {
    if (user?.email) return user.email
    return truncateAddress(activeWallet?.address)
  }, [activeWallet?.address, user?.email])

  const primaryLabel = isLoading ? 'Cargando...' : isConnected ? label : 'Entrar'

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={isConnected ? openProfile : openProviders}
        className={mobile ? 'rounded-full px-3 py-2 text-sm font-medium' : 'rounded-full px-4 py-2 text-sm font-medium'}
        style={{
          background: 'var(--accent-green)',
          color: 'var(--bg-base)',
        }}
      >
        {primaryLabel}
      </button>
      {isConnected && !mobile && (
        <button
          type="button"
          onClick={() => void signOut()}
          disabled={isSigningOut}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      )}
    </div>
  )
}

export function WalletButton({ mobile = false }: { mobile?: boolean }) {
  if (!canUseOpenfort) {
    return mobile ? (
      <ConnectButton showBalance={false} accountStatus="avatar" chainStatus="none" />
    ) : (
      <ConnectButton showBalance={false} />
    )
  }

  return <OpenfortWalletButton mobile={mobile} />
}
