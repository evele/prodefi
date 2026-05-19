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
        // Openfort's embedded connector can be restored from storage without methods
        // that wagmi later expects (for example, getChainId). Keep Openfort sessions
        // in Openfort itself and avoid persisting wagmi connector state.
        storage: null,
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
