import { useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import { formatEther, formatUnits } from 'viem'
import { CONTRACT_ADDRESSES, USDC_ABI } from '../lib/contracts'
import { appChain } from '../lib/chains'
import { appPublicClient } from '../lib/publicClient'

export function useUserBalance() {
  const { address, isConnected } = useAccount()
  const userAddress = address as `0x${string}` | undefined
  const [ethBalance, setEthBalance] = useState<bigint | undefined>()
  const [usdcRawBalance, setUsdcRawBalance] = useState<bigint | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown>()
  const hasLoadedBalancesRef = useRef(false)

  useEffect(() => {
    if (!import.meta.env.DEV) return

    if (!isConnected || !userAddress) {
      setEthBalance(undefined)
      setUsdcRawBalance(undefined)
      setIsLoading(false)
      setError(undefined)
      hasLoadedBalancesRef.current = false
      return
    }

    let cancelled = false

    const fetchBalances = async () => {
      if (!hasLoadedBalancesRef.current) {
        setIsLoading(true)
      }

      try {
        const [nextEthBalance, nextUsdcBalance] = await Promise.all([
          appPublicClient.getBalance({ address: userAddress }),
          appPublicClient.readContract({
            address: CONTRACT_ADDRESSES.USDC,
            abi: USDC_ABI,
            functionName: 'balanceOf',
            args: [userAddress],
          }),
        ])

        if (cancelled) return
        setEthBalance(nextEthBalance)
        setUsdcRawBalance(nextUsdcBalance)
        setError(undefined)
        hasLoadedBalancesRef.current = true
      } catch (caught) {
        if (cancelled) return
        setError(caught)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void fetchBalances()
    const intervalId = window.setInterval(() => {
      void fetchBalances()
    }, 5000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [isConnected, userAddress])

  return {
    isConnected,
    eth: {
      value: ethBalance,
      amount: ethBalance !== undefined ? Number(formatEther(ethBalance)).toFixed(4) : undefined,
      symbol: appChain.nativeCurrency.symbol,
      isLoading: isLoading || (isConnected && ethBalance === undefined && !error),
      error,
    },
    usdc: {
      value: usdcRawBalance,
      amount: usdcRawBalance !== undefined ? Number(formatUnits(usdcRawBalance, 6)).toFixed(2) : undefined,
      symbol: 'USDC',
      isLoading: isLoading || (isConnected && usdcRawBalance === undefined && !error),
      error,
    },
  }
}
