import type { Address } from 'viem'
import { CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI, USDC_ABI } from './abis'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address

function ensureAddress(value: string | undefined, key: string): Address {
  if (!value || !value.startsWith('0x')) {
    throw new Error(`Missing or invalid ${key} in frontend/.env. Run ./deploy.sh to populate it.`)
  }
  return value as Address
}

export const CONTRACT_ADDRESSES = {
  CARTON: ensureAddress(import.meta.env.VITE_CARTON_ADDRESS, 'VITE_CARTON_ADDRESS'),
  PREDICTIONS: ensureAddress(import.meta.env.VITE_PREDICTIONS_ADDRESS, 'VITE_PREDICTIONS_ADDRESS'),
  TREASURY: ensureAddress(import.meta.env.VITE_TREASURY_ADDRESS, 'VITE_TREASURY_ADDRESS'),
  USDC: ensureAddress(import.meta.env.VITE_USDC_ADDRESS, 'VITE_USDC_ADDRESS'),
} as const

export { CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI, USDC_ABI, ZERO_ADDRESS }
