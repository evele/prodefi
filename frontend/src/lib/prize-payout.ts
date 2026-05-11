export const PRIZEABLE_BPS = 9_500
export const RESERVE_BPS = 500
export const BPS_DENOMINATOR = 10_000
export const USDC_CENT = 10_000n

export const FIXED_PRIZE_DISTRIBUTION = [
  22, 14, 9, 7, 4, 4, 4, 4,
  2, 2, 2, 2, 2, 2, 2, 2,
  1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1,
] as const

export const FIXED_PRIZE_DISTRIBUTION_INPUT = FIXED_PRIZE_DISTRIBUTION.join(',')

export const PRIZE_BANDS = [
  { label: '1', start: 1, end: 1, icon: '🥇' },
  { label: '2', start: 2, end: 2, icon: '🥈' },
  { label: '3', start: 3, end: 3, icon: '🥉' },
  { label: '4', start: 4, end: 4, icon: '4°' },
  { label: '5-8', start: 5, end: 8, icon: '5-8' },
  { label: '9-16', start: 9, end: 16, icon: '9-16' },
  { label: '17-32', start: 17, end: 32, icon: '17-32' },
] as const

export type LeaderboardPointEntry = {
  tokenId: bigint
  points: bigint
}

export type RankedLeaderboardEntry = LeaderboardPointEntry & {
  rank: number
}

export type FinalPrizeEntry = RankedLeaderboardEntry & {
  amount: bigint
}

export function computePrizeablePool(grossAmount: bigint) {
  return (grossAmount * BigInt(PRIZEABLE_BPS)) / BigInt(BPS_DENOMINATOR)
}

export function computeReserveAmount(grossAmount: bigint) {
  return grossAmount - computePrizeablePool(grossAmount)
}

export function parsePrizeDistributionInput(input: string) {
  return input
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => !Number.isNaN(value))
}

export function parseLeaderboardCsv(input: string): { entries: LeaderboardPointEntry[]; error: string | null } {
  const lines = input.trim().split('\n').filter(Boolean)
  if (lines.length === 0) {
    return { entries: [], error: 'Enter at least one tokenId,points pair.' }
  }

  const entries: LeaderboardPointEntry[] = []
  for (const line of lines) {
    const parts = line.split(',').map((value) => value.trim())
    if (parts.length !== 2) {
      return { entries: [], error: `Invalid format: "${line}". Expected tokenId,points.` }
    }

    try {
      const tokenId = BigInt(parts[0])
      const points = BigInt(parts[1])
      if (tokenId <= 0n || points < 0n) {
        return { entries: [], error: `Invalid values: "${line}".` }
      }
      entries.push({ tokenId, points })
    } catch {
      return { entries: [], error: `Invalid values: "${line}".` }
    }
  }

  for (let i = 1; i < entries.length; i++) {
    if (entries[i].points > entries[i - 1].points) {
      return { entries: [], error: 'Points must be sorted from highest to lowest.' }
    }
  }

  return { entries, error: null }
}

export function computeSharedRanks(entries: LeaderboardPointEntry[]): RankedLeaderboardEntry[] {
  const ranked: RankedLeaderboardEntry[] = []

  let previousPoints: bigint | null = null
  let currentRank = 0
  for (let i = 0; i < entries.length; i++) {
    if (i === 0 || entries[i].points < (previousPoints ?? entries[i].points)) {
      currentRank = i + 1
      previousPoints = entries[i].points
    }

    ranked.push({
      ...entries[i],
      rank: currentRank,
    })
  }

  return ranked
}

export function computeFinalPrizeAmounts(
  rankedEntries: RankedLeaderboardEntry[],
  prizePool: bigint,
  distribution: readonly number[] = FIXED_PRIZE_DISTRIBUTION,
  quantizationUnit: bigint = USDC_CENT,
) {
  const payouts: FinalPrizeEntry[] = []
  let totalAssigned = 0n

  for (let i = 0; i < rankedEntries.length;) {
    const blockRank = rankedEntries[i].rank
    const block: RankedLeaderboardEntry[] = []

    while (i < rankedEntries.length && rankedEntries[i].rank === blockRank) {
      block.push(rankedEntries[i])
      i += 1
    }

    const lastOccupiedPosition = Math.min(blockRank + block.length - 1, distribution.length)
    let blockPercent = 0
    for (let position = blockRank; position <= lastOccupiedPosition; position += 1) {
      blockPercent += distribution[position - 1] ?? 0
    }

    const blockAmount = (prizePool * BigInt(blockPercent)) / 100n
    const rawShare = block.length > 0 ? blockAmount / BigInt(block.length) : 0n
    const quantizedShare = quantizationUnit > 1n ? rawShare - (rawShare % quantizationUnit) : rawShare
    totalAssigned += quantizedShare * BigInt(block.length)

    for (const entry of block) {
      payouts.push({
        ...entry,
        amount: quantizedShare,
      })
    }
  }

  return {
    payouts,
    totalAssigned,
    reserveAddition: prizePool - totalAssigned,
  }
}

export function getBandAmount(prizePool: bigint, bandStart: number, distribution: readonly number[] = FIXED_PRIZE_DISTRIBUTION) {
  const percentage = distribution[bandStart - 1] ?? 0
  return (prizePool * BigInt(percentage)) / 100n
}
