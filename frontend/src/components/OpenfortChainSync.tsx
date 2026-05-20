import { useEffect, useRef } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { embeddedWalletId } from '@openfort/react'

import { appChainId, canUseOpenfort } from '../lib/chains'

export function OpenfortChainSync() {
  const { chainId, connector, isConnected } = useAccount()
  const { switchChainAsync, isPending } = useSwitchChain()
  const lastAttemptedChainIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!canUseOpenfort || !isConnected) return
    if (connector?.id !== embeddedWalletId) return
    if (chainId === undefined || chainId === appChainId) {
      lastAttemptedChainIdRef.current = null
      return
    }
    if (!switchChainAsync || isPending) return
    if (lastAttemptedChainIdRef.current === chainId) return

    lastAttemptedChainIdRef.current = chainId

    switchChainAsync({ chainId: appChainId }).catch((error) => {
      console.error('[Openfort] Failed to switch embedded wallet chain:', error)
    })
  }, [chainId, connector?.id, isConnected, isPending, switchChainAsync])

  return null
}
