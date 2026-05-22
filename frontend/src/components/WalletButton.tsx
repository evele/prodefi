import { useEffect, useMemo } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { LogOut } from 'lucide-react'
import { embeddedWalletId, useSignOut, useUI, useUser } from '@openfort/react'
import { useEthereumEmbeddedWallet } from '@openfort/react/ethereum'
import { useAccount, useDisconnect } from 'wagmi'

import { canUseOpenfort } from '../lib/chains'

function truncateAddress(address?: string) {
  if (!address) return 'Conectar'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function clearStaleOpenfortParams() {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const staleKeys = [
    'openfortAuthProviderUI',
    'openfortAuthProvider',
    'openfortEmailVerificationUI',
    'openfortForgotPasswordUI',
    'access_token',
    'user_id',
    'error',
    'state',
    'email',
  ]

  let changed = false
  for (const key of staleKeys) {
    if (!url.searchParams.has(key)) continue
    url.searchParams.delete(key)
    changed = true
  }

  if (changed) {
    window.history.replaceState({}, document.title, url.toString())
  }
}

function clearStaleEmbeddedWagmiState() {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem('wagmi.store')
    window.localStorage.removeItem('wagmi.recentConnectorId')
  } catch {
    // Ignore storage access failures and still try a runtime disconnect.
  }
}

function OpenfortWalletButton({ mobile = false }: { mobile?: boolean }) {
  const { open, openProfile } = useUI()
  const { user, isConnected, isLoading } = useUser()
  const { activeWallet, status: embeddedStatus } = useEthereumEmbeddedWallet()
  const { address: bridgeAddress, connector, isConnected: isBridgeConnected } = useAccount()
  const { signOut, isLoading: isSigningOut } = useSignOut()
  const { disconnect, disconnectAsync, isPending: isDisconnecting } = useDisconnect()

  const hasOpenfortSession = Boolean(user)
  const hasConnectedWallet = isConnected || isBridgeConnected
  const hasOpenfortAccess = hasOpenfortSession || hasConnectedWallet
  const displayAddress = activeWallet?.address ?? bridgeAddress

  const label = useMemo(() => {
    if (user?.email) return user.email
    return truncateAddress(displayAddress)
  }, [displayAddress, user?.email])

  const primaryLabel = isLoading ? 'Cargando...' : hasOpenfortAccess ? label : 'Entrar'
  const isClosingAccess = isSigningOut || isDisconnecting

  useEffect(() => {
    const shouldClearStaleEmbeddedConnection =
      connector?.id === embeddedWalletId &&
      isBridgeConnected &&
      !hasOpenfortSession &&
      embeddedStatus === 'disconnected' &&
      activeWallet === null

    if (!shouldClearStaleEmbeddedConnection) return

    clearStaleEmbeddedWagmiState()

    void disconnectAsync().catch(() => {
      disconnect()
    })
  }, [
    activeWallet,
    connector?.id,
    disconnect,
    disconnectAsync,
    embeddedStatus,
    hasOpenfortSession,
    isBridgeConnected,
  ])

  const closeAccess = async () => {
    if (hasConnectedWallet) {
      try {
        await disconnectAsync()
      } catch {
        disconnect()
      }
    }

    if (hasOpenfortSession) {
      await signOut()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          if (hasOpenfortSession) {
            openProfile()
            return
          }

          clearStaleOpenfortParams()
          open()
        }}
        className={mobile ? 'rounded-full px-3 py-2 text-sm font-medium' : 'rounded-full px-4 py-2 text-sm font-medium'}
        style={{
          background: 'var(--accent-green)',
          color: 'var(--bg-base)',
        }}
      >
        {primaryLabel}
      </button>
      {hasOpenfortAccess && (
        <button
          type="button"
          onClick={() => { void closeAccess() }}
          disabled={isClosingAccess}
          className={mobile
            ? 'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors'
            : 'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors'}
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
