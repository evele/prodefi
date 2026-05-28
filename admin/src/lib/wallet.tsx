import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type Abi,
  type Address,
  type Chain,
  type EIP1193Provider,
} from 'viem'
import type { UseQueryResult } from '@tanstack/react-query'
import { extractErrorMessage } from '../../../frontend/src/lib/transaction-errors'

import { appChain, appChainId, appRpcUrl } from './chains'

const DEFAULT_MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11' as Address

type WalletState = {
  address?: Address
  chainId?: number
  hasProvider: boolean
  isConnected: boolean
  isConnecting: boolean
  isSwitchingChain: boolean
  isWrongNetwork: boolean
  error?: string
  chain?: Chain
  connect: () => Promise<void>
  disconnect: () => void
  switchToAppChain: () => Promise<void>
  provider?: EIP1193Provider
  walletClient?: ReturnType<typeof createWalletClient>
  publicClient: ReturnType<typeof createPublicClient>
}

type QueryOptions = {
  enabled?: boolean
  refetchInterval?: number
}

type ReadContractParameters = {
  address: Address
  abi: Abi
  functionName: string
  args?: readonly unknown[]
  query?: QueryOptions
}

type ReadContractsParameters = {
  contracts: Array<{
    address: Address
    abi: Abi
    functionName: string
    args?: readonly unknown[]
  }>
  query?: QueryOptions
}

type ReadContractsResult = {
  result: unknown
  error?: unknown
  errorMessage?: string
}

const WalletContext = createContext<WalletState | null>(null)

type EthereumProvider = EIP1193Provider & {
  on?: (event: string, listener: (...args: unknown[]) => void) => void
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

function normalizeForKey(value: unknown): unknown {
  if (typeof value === 'bigint') return value.toString()
  if (Array.isArray(value)) return value.map(normalizeForKey)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, normalizeForKey(entry)]))
  }
  return value
}

function toChainId(value: unknown): number | undefined {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return undefined
  const parsed = value.startsWith('0x') ? Number.parseInt(value, 16) : Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function isMissingChainError(error: unknown): boolean {
  const code = typeof error === 'object' && error !== null && 'code' in error ? (error as { code?: unknown }).code : undefined
  if (code === 4902) return true

  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: unknown }).message ?? '')
        : ''

  const normalizedMessage = message.toLowerCase()
  return normalizedMessage.includes('unrecognized chain')
    || normalizedMessage.includes('unknown chain')
    || normalizedMessage.includes('chain not added')
    || normalizedMessage.includes('does not exist')
}

function getAddEthereumChainParams() {
  return {
    chainId: `0x${appChainId.toString(16)}`,
    chainName: appChain.name,
    nativeCurrency: appChain.nativeCurrency,
    rpcUrls: appChain.rpcUrls.default.http.length > 0 ? appChain.rpcUrls.default.http : [appRpcUrl],
  }
}

function getMulticall3Address(): Address | undefined {
  const configured = import.meta.env.VITE_MULTICALL3_ADDRESS?.trim()
  if (configured) return configured as Address
  if (appChainId === 31337) return undefined
  return DEFAULT_MULTICALL3_ADDRESS
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function shouldRetryReadError(error: unknown): boolean {
  const message = extractErrorMessage(error).toLowerCase()

  if (!message) return true
  if (message.includes('invalid game id')) return false
  if (message.includes('execution reverted')) return false
  if (message.includes('contractfunctionexecutionerror')) return false
  if (message.includes('arraylengthmismatch')) return false

  return true
}

async function readContractWithRetry(
  publicClient: ReturnType<typeof createPublicClient>,
  contract: { address: Address; abi: Abi; functionName: string; args?: readonly unknown[] },
  retries = 2,
) {
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await publicClient.readContract(contract as never)
    } catch (error) {
      lastError = error
      if (attempt === retries || !shouldRetryReadError(error)) {
        throw error
      }
      await wait(300 * (attempt + 1))
    }
  }

  throw lastError
}

async function readContractsWithBatch(
  publicClient: ReturnType<typeof createPublicClient>,
  contracts: ReadContractsParameters['contracts'],
): Promise<ReadContractsResult[]> {
  const multicallAddress = getMulticall3Address()

  if (multicallAddress) {
    try {
      const results = await readMulticallWithRetry(publicClient, contracts, multicallAddress)
      return results.map((entry) => {
        if (entry.status === 'success') {
          return { result: entry.result }
        }

        return {
          result: undefined,
          error: entry.error,
          errorMessage: extractErrorMessage(entry.error),
        }
      })
    } catch (error) {
      console.warn('Multicall batch read failed, falling back to individual contract reads:', error)
    }
  }

  return Promise.all(
    contracts.map(async (contract) => {
      try {
        const result = await readContractWithRetry(publicClient, contract)
        return { result }
      } catch (error) {
        console.error(`Read failed for ${contract.functionName}:`, error)
        return { result: undefined, error, errorMessage: extractErrorMessage(error) }
      }
    }),
  )
}

async function readMulticallWithRetry(
  publicClient: ReturnType<typeof createPublicClient>,
  contracts: ReadContractsParameters['contracts'],
  multicallAddress: Address,
  retries = 1,
): Promise<Array<{ status: 'success'; result: unknown } | { status: 'failure'; error: unknown }>> {
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await publicClient.multicall({
        contracts: contracts as never,
        allowFailure: true,
        multicallAddress,
      }) as Array<{ status: 'success'; result: unknown } | { status: 'failure'; error: unknown }>
    } catch (error) {
      lastError = error
      if (attempt === retries || !shouldRetryReadError(error)) {
        throw error
      }
      await wait(300 * (attempt + 1))
    }
  }

  throw lastError
}

export function AdminWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | undefined>(undefined)
  const [chainId, setChainId] = useState<number | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSwitchingChain, setIsSwitchingChain] = useState(false)
  const [isLocallyDisconnected, setIsLocallyDisconnected] = useState(false)

  const provider = typeof window !== 'undefined' ? window.ethereum : undefined
  const hasProvider = Boolean(provider)

  const publicClient = useMemo(
    () => createPublicClient({ chain: appChain, transport: http(appRpcUrl) }),
    [],
  )

  const walletClient = useMemo(() => {
    if (!provider || !address) return undefined
    return createWalletClient({
      account: address,
      chain: appChain,
      transport: custom(provider),
    })
  }, [address, provider])

  const readProviderState = useCallback(async () => {
    if (!provider) return

    const [accounts, currentChainId] = await Promise.all([
      provider.request({ method: 'eth_accounts' }) as Promise<string[]>,
      provider.request({ method: 'eth_chainId' }),
    ])

    setAddress(accounts[0] as Address | undefined)
    setChainId(toChainId(currentChainId))
    setError(undefined)
  }, [provider])

  const syncFromProvider = useCallback(async () => {
    if (!provider || isLocallyDisconnected) return

    try {
      await readProviderState()
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : 'Could not read wallet state.')
    }
  }, [isLocallyDisconnected, provider, readProviderState])

  useEffect(() => {
    void syncFromProvider()
  }, [syncFromProvider])

  useEffect(() => {
    if (!provider?.on) return

    const handleAccountsChanged = (accounts: unknown) => {
      if (!Array.isArray(accounts)) return
      setIsLocallyDisconnected(false)
      setAddress(accounts[0] as Address | undefined)
      if (accounts.length === 0) {
        setChainId(undefined)
      }
    }

    const handleChainChanged = (nextChainId: unknown) => {
      setChainId(toChainId(nextChainId))
    }

    provider.on('accountsChanged', handleAccountsChanged)
    provider.on('chainChanged', handleChainChanged)

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged)
      provider.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [provider])

  const connect = useCallback(async () => {
    if (!provider) {
      setError('No injected wallet found in this browser.')
      return
    }

    setIsConnecting(true)
    setError(undefined)

    try {
      const [accounts, currentChainId] = await Promise.all([
        provider.request({ method: 'eth_requestAccounts' }) as Promise<string[]>,
        provider.request({ method: 'eth_chainId' }),
      ])

      setIsLocallyDisconnected(false)
      setAddress(accounts[0] as Address | undefined)
      setChainId(toChainId(currentChainId))
    } catch (connectError) {
      setError(connectError instanceof Error ? connectError.message : 'Wallet connection failed.')
    } finally {
      setIsConnecting(false)
    }
  }, [provider])

  const disconnect = useCallback(() => {
    setIsLocallyDisconnected(true)
    setAddress(undefined)
    setChainId(undefined)
    setError(undefined)
  }, [])

  const switchToAppChain = useCallback(async () => {
    if (!provider) {
      setError('No injected wallet found in this browser.')
      return
    }

    setIsSwitchingChain(true)
    setError(undefined)

    try {
      const chainIdHex = `0x${appChainId.toString(16)}`

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        })
      } catch (switchError) {
        if (!isMissingChainError(switchError)) {
          throw switchError
        }

        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [getAddEthereumChainParams()],
        })

        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        })
      }

      setIsLocallyDisconnected(false)
      await readProviderState()
    } catch (switchError) {
      setError(switchError instanceof Error ? switchError.message : 'Could not switch the wallet network.')
    } finally {
      setIsSwitchingChain(false)
    }
  }, [provider, readProviderState])

  const value = useMemo<WalletState>(() => ({
    address,
    chainId,
    hasProvider,
    isConnected: Boolean(address),
    isConnecting,
    isSwitchingChain,
    isWrongNetwork: chainId !== undefined && chainId !== appChainId,
    error,
    chain: chainId ? { ...appChain, id: chainId, name: chainId === appChainId ? appChain.name : `Chain ${chainId}` } : undefined,
    connect,
    disconnect,
    switchToAppChain,
    provider,
    walletClient,
    publicClient,
  }), [
    address,
    chainId,
    connect,
    disconnect,
    error,
    hasProvider,
    isConnecting,
    isSwitchingChain,
    provider,
    publicClient,
    switchToAppChain,
    walletClient,
  ])

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

function useWalletState() {
  const value = useContext(WalletContext)
  if (!value) {
    throw new Error('Admin wallet context is missing.')
  }
  return value
}

export function useAdminWallet() {
  return useWalletState()
}

export function useAccount() {
  const { address, chain, chainId, isConnected } = useWalletState()
  return { address, chain, chainId, isConnected }
}

export function usePublicClient() {
  return useWalletState().publicClient
}

export function useReadContract<TData = any>({ query, ...parameters }: ReadContractParameters): UseQueryResult<TData> {
  const publicClient = usePublicClient()

  return useQuery<TData>({
    queryKey: ['readContract', parameters.address, parameters.functionName, normalizeForKey(parameters.args ?? [])],
    enabled: query?.enabled ?? true,
    refetchInterval: query?.refetchInterval,
    queryFn: () => publicClient.readContract(parameters as never) as Promise<TData>,
  })
}

export function useReadContracts<TData = ReadContractsResult[]>({ contracts, query }: ReadContractsParameters): UseQueryResult<TData> {
  const publicClient = usePublicClient()

  return useQuery<TData>({
    queryKey: ['readContracts', contracts.map((contract) => [contract.address, contract.functionName, normalizeForKey(contract.args ?? [])])],
    enabled: query?.enabled ?? true,
    refetchInterval: query?.refetchInterval,
    queryFn: () => readContractsWithBatch(publicClient, contracts) as Promise<TData>,
  })
}
