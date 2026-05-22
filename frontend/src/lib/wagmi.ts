import { getDefaultConfig as getRainbowKitDefaultConfig } from '@rainbow-me/rainbowkit'
import { embeddedWalletConnector, getDefaultConfig as getOpenfortDefaultConfig } from '@openfort/react/wagmi'
import { createConfig, http } from 'wagmi'

import { appChain, appRpcUrl, canUseOpenfort, enableOpenfortWalletAuth, walletConnectProjectId } from './chains'

const chains = [appChain] as const
const transports = {
  [appChain.id]: http(appRpcUrl),
}

export const config = canUseOpenfort
  ? createConfig(
      getOpenfortDefaultConfig({
        appName: 'ProDefi',
        chains,
        connectors: enableOpenfortWalletAuth ? undefined : [embeddedWalletConnector()],
        transports,
        walletConnectProjectId: enableOpenfortWalletAuth ? walletConnectProjectId : undefined,
        // TODO(openfort-eoa-refresh): OTP / embedded session restore is acceptable,
        // but external wallet auth through the Openfort modal still rehydrates
        // inconsistently after F5. The real fix belongs here in the connection
        // restore/persistence layer, not in UI-level button workarounds.
        // Embedded-only mode stays opt-in to avoid restoring stale wagmi connector state.
        // When external wallet auth is enabled, allow wagmi persistence so EOA sessions
        // survive a hard refresh instead of appearing disconnected after F5.
        ...(enableOpenfortWalletAuth ? {} : { storage: null }),
        ssr: false,
      })
    )
  : getRainbowKitDefaultConfig({
      appName: 'ProDefi',
      projectId: walletConnectProjectId,
      transports,
      chains,
      ssr: false,
    })
