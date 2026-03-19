import { useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { formatEther, formatUnits } from 'viem'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { CONTRACT_ADDRESSES, CARTON_ABI, PREDICTIONS_ABI, TREASURY_ABI, ZERO_ADDRESS } from '../lib/contracts'
import { useSimulatedContractWrite } from '../hooks/useSimulatedContractWrite'
import { mapClaimError } from '../lib/transaction-errors'

export function ClaimSection({ tokenId }: { tokenId: bigint }) {
  const ethClaimWrite = useSimulatedContractWrite()
  const usdcClaimWrite = useSimulatedContractWrite()

  // Tournament context
  const { data: activeTournamentId } = useReadContract({
    address: CONTRACT_ADDRESSES.CARTON,
    abi: CARTON_ABI,
    functionName: 'activeTournamentId',
    query: { refetchInterval: 10_000 },
  })
  const tournamentId = activeTournamentId ?? 0n

  // Tournament closed status per asset
  const { data: ethClosed } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'isClosedTournament',
    args: tournamentId > 0n ? [tournamentId, ZERO_ADDRESS] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10_000 },
  })

  const { data: usdcClosed } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'isClosedTournament',
    args: tournamentId > 0n ? [tournamentId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n, refetchInterval: 10_000 },
  })

  const anyClosed = Boolean(ethClosed) || Boolean(usdcClosed)

  const { data: positionsVersion } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'positionsVersion',
    query: { enabled: anyClosed, refetchInterval: 10_000 },
  })

  // 1-indexed rank from tokenPositions mapping (0 means unranked)
  const { data: rawRank } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'tokenPositions',
    args: anyClosed ? [tokenId] : undefined,
    query: { enabled: anyClosed, refetchInterval: 10_000 },
  })

  const { data: rankVersion } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTIONS,
    abi: PREDICTIONS_ABI,
    functionName: 'tokenPositionsVersion',
    args: anyClosed ? [tokenId] : undefined,
    query: { enabled: anyClosed, refetchInterval: 10_000 },
  })

  const rank = useMemo(() => {
    if (rawRank === undefined || rawRank === 0n) return null
    if (positionsVersion === undefined || rankVersion !== positionsVersion) return null
    return Number(rawRank)
  }, [positionsVersion, rankVersion, rawRank])

  // Prize amounts per asset (only useful when ranked + closed)
  const { data: ethPrize } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getUserPrizeAmount',
    args: rank !== null && tournamentId > 0n ? [tournamentId, ZERO_ADDRESS, BigInt(rank)] : undefined,
    query: { enabled: rank !== null && Boolean(ethClosed), refetchInterval: 10_000 },
  })

  const { data: usdcPrize } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'getUserPrizeAmount',
    args: rank !== null && tournamentId > 0n ? [tournamentId, CONTRACT_ADDRESSES.USDC, BigInt(rank)] : undefined,
    query: { enabled: rank !== null && Boolean(usdcClosed), refetchInterval: 10_000 },
  })

  // Claimed status
  const { data: ethClaimed, refetch: refetchEthClaimed } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'hasUserClaimed',
    args: tournamentId > 0n ? [tournamentId, tokenId, ZERO_ADDRESS] : undefined,
    query: { enabled: tournamentId > 0n && Boolean(ethClosed), refetchInterval: 10_000 },
  })

  const { data: usdcClaimed, refetch: refetchUsdcClaimed } = useReadContract({
    address: CONTRACT_ADDRESSES.TREASURY,
    abi: TREASURY_ABI,
    functionName: 'hasUserClaimed',
    args: tournamentId > 0n ? [tournamentId, tokenId, CONTRACT_ADDRESSES.USDC] : undefined,
    query: { enabled: tournamentId > 0n && Boolean(usdcClosed), refetchInterval: 10_000 },
  })

  const handleClaimEth = () => {
    void ethClaimWrite.simulateAndSend(
      {
        address: CONTRACT_ADDRESSES.TREASURY,
        abi: TREASURY_ABI,
        functionName: 'claimPrize',
        args: [tournamentId, tokenId, ZERO_ADDRESS],
      },
      {
        toastId: `claim-eth-${tokenId.toString()}`,
        pendingMessage: 'Waiting for ETH claim confirmation...',
        successMessage: 'ETH prize claimed!',
        revertedMessage: 'The ETH claim was rejected on-chain.',
        mapError: (error) => mapClaimError(error, 'ETH'),
        onSuccess: async () => {
          await refetchEthClaimed()
        },
        logLabel: 'Claim ETH prize',
      },
    )
  }

  const handleClaimUsdc = () => {
    void usdcClaimWrite.simulateAndSend(
      {
        address: CONTRACT_ADDRESSES.TREASURY,
        abi: TREASURY_ABI,
        functionName: 'claimPrize',
        args: [tournamentId, tokenId, CONTRACT_ADDRESSES.USDC],
      },
      {
        toastId: `claim-usdc-${tokenId.toString()}`,
        pendingMessage: 'Waiting for USDC claim confirmation...',
        successMessage: 'USDC prize claimed!',
        revertedMessage: 'The USDC claim was rejected on-chain.',
        mapError: (error) => mapClaimError(error, 'USDC'),
        onSuccess: async () => {
          await refetchUsdcClaimed()
        },
        logLabel: 'Claim USDC prize',
      },
    )
  }

  // Don't render anything until at least one asset pool is closed
  if (!anyClosed) return null

  const ethPrizeValue = ethPrize ?? 0n
  const usdcPrizeValue = usdcPrize ?? 0n

  const assets = [
    {
      label: 'ETH',
      closed: Boolean(ethClosed),
      prize: ethPrizeValue,
      claimed: Boolean(ethClaimed),
      isPending: ethClaimWrite.isBusy,
      hasPrize: ethPrizeValue > 0n,
      onClaim: handleClaimEth,
      format: (v: bigint) => `${Number(formatEther(v)).toFixed(4)} ETH`,
    },
    {
      label: 'USDC',
      closed: Boolean(usdcClosed),
      prize: usdcPrizeValue,
      claimed: Boolean(usdcClaimed),
      isPending: usdcClaimWrite.isBusy,
      hasPrize: usdcPrizeValue > 0n,
      onClaim: handleClaimUsdc,
      format: (v: bigint) => `${Number(formatUnits(v, 6)).toFixed(2)} USDC`,
    },
  ]

  return (
    <Card className="border-yellow-200 dark:border-yellow-800 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
          Prize Claims — Carton #{tokenId.toString()}
        </CardTitle>
        <CardDescription>
          {rank !== null
            ? `Ranked #${rank} in the tournament`
            : 'This carton is not ranked in the current tournament'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rank === null ? (
          <p className="text-sm text-gray-500">
            No prize available — this token has no position in the leaderboard.
          </p>
        ) : (
          <div className="space-y-3">
            {assets.map((asset) => {
              if (!asset.closed) return null
              return (
                <div
                  key={asset.label}
                  className="flex items-center justify-between p-3 rounded-lg border bg-white/60 dark:bg-white/5"
                >
                  <div>
                    <div className="text-sm font-medium">{asset.label} Prize</div>
                    <div className="text-lg font-bold">
                      {asset.hasPrize ? asset.format(asset.prize) : `-- ${asset.label}`}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    disabled={!asset.hasPrize || asset.claimed || asset.isPending}
                    onClick={asset.onClaim}
                    variant={asset.claimed ? 'outline' : 'default'}
                  >
                    {asset.claimed
                      ? 'Claimed'
                      : asset.isPending
                        ? 'Claiming...'
                        : !asset.hasPrize
                          ? 'No Prize'
                          : `Claim ${asset.label}`}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
