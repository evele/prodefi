import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http, createConfig } from 'wagmi'
import type { Chain } from 'viem'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo'

const anvilChain: Chain = {
  id: 31337,
  name: 'Anvil',
  network: 'anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
}

export const config = createConfig(
  getDefaultConfig({
    appName: 'ProDefi',
    projectId,
    transports: {
      [anvilChain.id]: http(anvilChain.rpcUrls.default.http[0]!),
    },
    chains: [anvilChain],
    ssr: false,
  }),
)
