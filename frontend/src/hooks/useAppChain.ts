import { useCallback } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

import { appChain } from '../lib/chains'

export function useAppChainGuard() {
  const { chainId, isConnected } = useAccount()
  const { switchChainAsync, isPending } = useSwitchChain()

  const isOnAppChain = chainId === appChain.id
  const isWrongNetwork = isConnected && !isOnAppChain

  const switchToAppChain = useCallback(async () => {
    if (!switchChainAsync) {
      throw new Error('Wallet does not support automatic network switching')
    }

    return switchChainAsync({ chainId: appChain.id })
  }, [switchChainAsync])

  return {
    appChainId: appChain.id,
    appChainName: appChain.name,
    chainId,
    isConnected,
    isOnAppChain,
    isWrongNetwork,
    isSwitching: isPending,
    switchToAppChain,
  }
}
