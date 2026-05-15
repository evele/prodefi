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

import { appChain, appChainId, appRpcUrl } from './chains'

type WalletState = {
  address?: Address
  chainId?: number
  hasProvider: boolean
  isConnected: boolean
  isConnecting: boolean
  error?: string
  chain?: Chain
  connect: () => Promise<void>
  disconnect: () => void
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

export function AdminWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | undefined>(undefined)
  const [chainId, setChainId] = useState<number | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isConnecting, setIsConnecting] = useState(false)
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

  const syncFromProvider = useCallback(async () => {
    if (!provider || isLocallyDisconnected) return

    try {
      const [accounts, currentChainId] = await Promise.all([
        provider.request({ method: 'eth_accounts' }) as Promise<string[]>,
        provider.request({ method: 'eth_chainId' }),
      ])

      setAddress(accounts[0] as Address | undefined)
      setChainId(toChainId(currentChainId))
      setError(undefined)
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : 'Could not read wallet state.')
    }
  }, [isLocallyDisconnected, provider])

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

  const value = useMemo<WalletState>(() => ({
    address,
    chainId,
    hasProvider,
    isConnected: Boolean(address),
    isConnecting,
    error,
    chain: chainId ? { ...appChain, id: chainId, name: chainId === appChainId ? appChain.name : `Chain ${chainId}` } : undefined,
    connect,
    disconnect,
    provider,
    walletClient,
    publicClient,
  }), [address, chainId, connect, disconnect, error, hasProvider, isConnecting, provider, publicClient, walletClient])

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
    queryFn: async () => Promise.all(
      contracts.map(async (contract) => {
        try {
          const result = await publicClient.readContract(contract as never)
          return { result }
        } catch (error) {
          console.error(`Read failed for ${contract.functionName}:`, error)
          return { result: undefined, error }
        }
      }),
    ) as Promise<TData>,
  })
}
