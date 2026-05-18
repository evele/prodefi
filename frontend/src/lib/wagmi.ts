import { getDefaultConfig as getRainbowKitDefaultConfig } from '@rainbow-me/rainbowkit'
import { getDefaultConfig as getOpenfortDefaultConfig } from '@openfort/react/wagmi'
import { createConfig, http } from 'wagmi'

import { appChain, appRpcUrl, canUseOpenfort, walletConnectProjectId } from './chains'

const chains = [appChain] as const
const transports = {
  [appChain.id]: http(appRpcUrl),
}

export const config = canUseOpenfort
  ? createConfig(
      getOpenfortDefaultConfig({
        appName: 'ProDefi',
        walletConnectProjectId,
        chains,
        transports,
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
