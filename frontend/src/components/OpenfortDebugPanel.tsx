import { useMemo } from 'react'
import { useUser } from '@openfort/react'
import { useEthereumEmbeddedWallet } from '@openfort/react/ethereum'
import { useAccount, useWalletClient } from 'wagmi'

import { appChainId, canUseOpenfort, hasOpenfortGasSponsorship, openfortEthereumFeeSponsorshipId } from '../lib/chains'

function formatValue(value: string | number | boolean | undefined | null) {
  if (value === undefined || value === null || value === '') return 'n/a'
  return String(value)
}

export function OpenfortDebugPanel() {
  const { user } = useUser()
  const { activeWallet, status } = useEthereumEmbeddedWallet()
  const { address, chainId, connector, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  const rows = useMemo(
    () => [
      ['Openfort active', canUseOpenfort],
      ['User connected', isConnected],
      ['User id', user?.id],
      ['User email', user?.email],
      ['Embedded status', status],
      ['Account type', activeWallet?.accountType],
      ['Wallet address', activeWallet?.address ?? address],
      ['Connector', connector?.id],
      ['App chain', appChainId],
      ['Wagmi chain', chainId],
      ['Wallet client chain', walletClient?.chain?.id],
      ['Embedded account chain', activeWallet?.accounts?.[0]?.chainId],
      ['Sponsorship enabled', hasOpenfortGasSponsorship],
      ['Sponsorship id', openfortEthereumFeeSponsorshipId],
    ] as const,
    [activeWallet, address, chainId, connector?.id, isConnected, status, user?.email, user?.id, walletClient?.chain?.id]
  )

  if (!import.meta.env.DEV || !canUseOpenfort) return null

  return (
    <aside
      className="fixed bottom-3 right-3 z-[140] max-w-[min(92vw,26rem)] rounded-xl border px-3 py-2 text-xs shadow-2xl backdrop-blur"
      style={{
        background: 'rgba(12, 12, 16, 0.92)',
        borderColor: 'rgba(255,255,255,0.14)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-semibold uppercase tracking-[0.18em] text-[10px] text-[var(--accent-gold)]">
          Openfort Debug
        </p>
        <p className="text-[10px] text-[var(--text-secondary)]">dev only</p>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <span className="text-[var(--text-secondary)]">
              {label}
            </span>
            <span className="break-all font-mono text-[11px]">
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}
