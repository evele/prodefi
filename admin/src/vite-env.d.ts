/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAIN_ID?: string
  readonly VITE_CHAIN_NAME?: string
  readonly VITE_RPC_URL?: string
  readonly VITE_CHAIN_CURRENCY_NAME?: string
  readonly VITE_CHAIN_CURRENCY_SYMBOL?: string
  readonly VITE_CHAIN_CURRENCY_DECIMALS?: string
  readonly VITE_CARTON_ADDRESS: string
  readonly VITE_PREDICTIONS_ADDRESS: string
  readonly VITE_TREASURY_ADDRESS: string
  readonly VITE_USDC_ADDRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
