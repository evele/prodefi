import type { Address, Chain } from 'viem'

function readNumberEnv(key: string, fallback: number): number {
  const value = import.meta.env[key]
  if (!value) return fallback

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const defaultRpcUrl = 'http://127.0.0.1:8545'
export const appMulticall3Address = '0xcA11bde05977b3631167028862bE2a173976CA11' as Address

export const appChainId = readNumberEnv('VITE_CHAIN_ID', 31337)
export const appRpcUrl = import.meta.env.VITE_RPC_URL || defaultRpcUrl
export const isLocalAppChain = appChainId === 31337
export const isDevOrTestChain = appChainId === 31337 || appChainId === 84532

function readRpcHost(rpcUrl: string): string {
  try {
    return new URL(rpcUrl).host
  } catch {
    return rpcUrl
  }
}

export const appRpcHost = readRpcHost(appRpcUrl)

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
  ...(isLocalAppChain
    ? {}
    : {
        contracts: {
          multicall3: {
            address: appMulticall3Address,
          },
        },
      }),
}

export const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo'
export const enableOpenfortWalletAuth = import.meta.env.VITE_OPENFORT_ENABLE_WALLET_AUTH !== 'false'

export const openfortPublishableKey = import.meta.env.VITE_OPENFORT_PUBLISHABLE_KEY
export const openfortShieldPublishableKey = import.meta.env.VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY
export const openfortEthereumFeeSponsorshipId = import.meta.env.VITE_OPENFORT_ETHEREUM_FEE_SPONSORSHIP_ID?.trim() || undefined

const OPENFORT_SUPPORTED_CHAIN_IDS = new Set([
  1,
  10,
  56,
  97,
  137,
  8453,
  84532,
  42161,
  421614,
  43113,
  43114,
  11155111,
  11155420,
  1946,
  7777777,
  999999999,
  10143,
  13337,
])

export const isOpenfortConfigured = Boolean(openfortPublishableKey && openfortShieldPublishableKey)
export const isOpenfortSupportedChain = OPENFORT_SUPPORTED_CHAIN_IDS.has(appChainId)
export const canUseOpenfort = isOpenfortConfigured && isOpenfortSupportedChain
export const hasOpenfortGasSponsorship = canUseOpenfort && Boolean(openfortEthereumFeeSponsorshipId)

if (import.meta.env.DEV && isOpenfortConfigured && !isOpenfortSupportedChain) {
  console.warn(
    `[Openfort] Chain ${appChainId} is not listed as supported for embedded wallets/sponsorship. Falling back to RainbowKit.`
  )
}
