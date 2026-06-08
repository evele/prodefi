import { useEffect, useMemo, useRef } from 'react'
import { useUser } from '@openfort/react'
import { useEthereumEmbeddedWallet } from '@openfort/react/ethereum'
import { useAccount } from 'wagmi'
import { getAddress } from 'viem'

import { canUseOpenfort } from '../lib/chains'
import { upsertOpenfortProfile } from '../lib/user-profiles'

function normalizeWalletAddress(value?: string) {
  if (!value) return null

  try {
    return getAddress(value)
  } catch {
    return null
  }
}

export function OpenfortProfileSync() {
  const { user, getAccessToken } = useUser()
  const { activeWallet } = useEthereumEmbeddedWallet()
  const { address } = useAccount()
  const lastSyncedKeyRef = useRef<string | null>(null)

  const walletAddress = useMemo(
    () => normalizeWalletAddress(activeWallet?.address ?? address),
    [activeWallet?.address, address],
  )

  const syncKey = useMemo(() => {
    if (!user?.id || !walletAddress) return null
    return `${user.id}:${walletAddress}:${user.email ?? ''}`
  }, [user?.email, user?.id, walletAddress])

  useEffect(() => {
    if (!canUseOpenfort || !syncKey || !walletAddress || !user?.id) return
    if (lastSyncedKeyRef.current === syncKey) return

    let cancelled = false

    void (async () => {
      try {
        const accessToken = await getAccessToken()
        if (!accessToken) return

        await upsertOpenfortProfile({ walletAddress }, accessToken)

        if (!cancelled) {
          lastSyncedKeyRef.current = syncKey
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('[OpenfortProfileSync] Failed to sync user profile', error)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [getAccessToken, syncKey, user?.id, walletAddress])

  return null
}
