import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'

export function useUserBalance() {
  const { address, isConnected } = useAccount()
  
  const { data: balance, isLoading, error } = useBalance({
    address,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 5000, // Refresh every 5 seconds
    }
  })

  const formattedBalance = balance 
    ? parseFloat(formatEther(balance.value)).toFixed(4)
    : '0.0000'

  return {
    balance: formattedBalance,
    symbol: balance?.symbol || 'ETH',
    isLoading,
    error,
    isConnected
  }
}