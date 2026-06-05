import { useQuery } from '@tanstack/react-query'
import type { RefetchOptions } from '@tanstack/react-query'
import { useReadContract as useWagmiReadContract, useReadContracts as useWagmiReadContracts } from 'wagmi'
import type { Abi, Address } from 'viem'
import { isLocalAppChain } from '../lib/chains'
import { appPublicClient } from '../lib/publicClient'

type ContractCallResult = {
  result: unknown
  status: 'success' | 'failure'
  error?: unknown
}

type UseAppReadContractReturn<TData> = Omit<
  ReturnType<typeof useWagmiReadContract>,
  'data' | 'error' | 'refetch'
> & {
  data: TData | undefined
  error: Error | null
  refetch: (options?: RefetchOptions) => Promise<unknown>
}

type UseAppReadContractsReturn = Omit<
  ReturnType<typeof useWagmiReadContracts>,
  'data' | 'error' | 'refetch'
> & {
  data: ContractCallResult[] | undefined
  error: Error | null
  refetch: (options?: RefetchOptions) => Promise<unknown>
}

type QueryOptions = {
  enabled?: boolean
  refetchInterval?: number
  refetchOnWindowFocus?: boolean
}

type ReadContractParameters = {
  address: Address
  abi: Abi
  functionName: string
  args?: readonly unknown[]
  chainId?: number
  query?: QueryOptions
}

type ReadContractsParameters = {
  contracts: Array<{
    address: Address
    abi: Abi
    functionName: string
    args?: readonly unknown[]
    chainId?: number
  }>
  query?: QueryOptions
}

function normalizeForKey(value: unknown): unknown {
  if (typeof value === 'bigint') return value.toString()
  if (Array.isArray(value)) return value.map(normalizeForKey)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, normalizeForKey(entry)]),
    )
  }
  return value
}

export function useAppReadContract<TData = unknown>(parameters: ReadContractParameters): UseAppReadContractReturn<TData> {
  const enabled = parameters.query?.enabled ?? true

  const wagmiResult = useWagmiReadContract({
    ...parameters,
    query: {
      ...parameters.query,
      enabled: !isLocalAppChain && enabled,
    },
  })

  const rpcResult = useQuery({
    queryKey: ['app-read-contract', parameters.address, parameters.functionName, normalizeForKey(parameters.args ?? [])],
    enabled: isLocalAppChain && enabled,
    refetchInterval: parameters.query?.refetchInterval,
    refetchOnWindowFocus: parameters.query?.refetchOnWindowFocus,
    queryFn: () =>
      appPublicClient.readContract({
        address: parameters.address,
        abi: parameters.abi,
        functionName: parameters.functionName,
        args: parameters.args,
      } as never),
  })

  return (isLocalAppChain
    ? {
        ...wagmiResult,
        data: rpcResult.data,
        error: rpcResult.error,
        isLoading: rpcResult.isLoading,
        isFetching: rpcResult.isFetching,
        refetch: rpcResult.refetch,
      }
    : wagmiResult) as UseAppReadContractReturn<TData>
}

export function useAppReadContracts(parameters: ReadContractsParameters): UseAppReadContractsReturn {
  const enabled = parameters.query?.enabled ?? true

  const wagmiResult = useWagmiReadContracts({
    ...parameters,
    query: {
      ...parameters.query,
      enabled: !isLocalAppChain && enabled,
    },
  })

  const rpcResult = useQuery({
    queryKey: [
      'app-read-contracts',
      parameters.contracts.map((contract) => ({
        address: contract.address,
        functionName: contract.functionName,
        args: normalizeForKey(contract.args ?? []),
      })),
    ],
    enabled: isLocalAppChain && enabled,
    refetchInterval: parameters.query?.refetchInterval,
    refetchOnWindowFocus: parameters.query?.refetchOnWindowFocus,
    queryFn: async () =>
      Promise.all(
        parameters.contracts.map(async (contract) => {
          try {
            const result = await appPublicClient.readContract({
              address: contract.address,
              abi: contract.abi,
              functionName: contract.functionName,
              args: contract.args,
            } as never)

            return { result, status: 'success' as const }
          } catch (error) {
            return { result: undefined, error, status: 'failure' as const }
          }
        }),
      ),
  })

  return (isLocalAppChain
    ? {
        ...wagmiResult,
        data: rpcResult.data,
        error: rpcResult.error,
        isLoading: rpcResult.isLoading,
        isFetching: rpcResult.isFetching,
        refetch: rpcResult.refetch,
      }
    : wagmiResult) as UseAppReadContractsReturn
}
