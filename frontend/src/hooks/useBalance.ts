import { useAccount, useBalance, useReadContract } from 'wagmi'
import { formatEther, formatUnits } from 'viem'
import { CONTRACT_ADDRESSES, USDC_ABI } from '../lib/contracts'

export function useUserBalance() {
  const { address, isConnected } = useAccount()
  const userAddress = address as `0x${string}` | undefined

  const {
    data: ethBalance,
    isLoading: isEthLoading,
    error: ethError,
  } = useBalance({
    address,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 5000,
    },
  })

  const { data: usdcRawBalance, isLoading: isUsdcLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.USDC,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 5000,
    },
  })

  return {
    isConnected,
    eth: {
      amount: ethBalance ? Number(formatEther(ethBalance.value)).toFixed(4) : '0.0000',
      symbol: ethBalance?.symbol ?? 'ETH',
      isLoading: isEthLoading,
      error: ethError,
    },
    usdc: {
      amount: usdcRawBalance ? Number(formatUnits(usdcRawBalance, 6)).toFixed(2) : '0.00',
      symbol: 'USDC',
      isLoading: isUsdcLoading,
    },
  }
}
