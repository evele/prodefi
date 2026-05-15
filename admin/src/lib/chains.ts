import type { Chain } from 'viem'

function readNumberEnv(key: string, fallback: number): number {
  const value = import.meta.env[key]
  if (!value) return fallback

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const defaultRpcUrl = 'http://127.0.0.1:8545'

export const appChainId = readNumberEnv('VITE_CHAIN_ID', 31337)
export const appRpcUrl = import.meta.env.VITE_RPC_URL || defaultRpcUrl

export const appChain: Chain = {
  id: appChainId,
  name: import.meta.env.VITE_CHAIN_NAME || (appChainId === 31337 ? 'Anvil' : `Chain ${appChainId}`),
  nativeCurrency: {
    name: import.meta.env.VITE_CHAIN_CURRENCY_NAME || 'Ether',
    symbol: import.meta.env.VITE_CHAIN_CURRENCY_SYMBOL || 'ETH',
    decimals: readNumberEnv('VITE_CHAIN_CURRENCY_DECIMALS', 18),
  },
  rpcUrls: {
    default: { http: [appRpcUrl] },
    public: { http: [appRpcUrl] },
  },
}
