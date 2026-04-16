import type { PredictionStatus } from './types'

export function hasWinnersPrediction(value: unknown): boolean {
  if (typeof value === 'boolean') return value

  if (Array.isArray(value)) {
    if (typeof value[1] === 'boolean') return value[1]

    const teams = value[0]
    if (Array.isArray(teams)) {
      return teams.some((teamId) => Number(teamId) !== 0)
    }

    return Boolean(value[1])
  }

  if (typeof value === 'object' && value !== null && 'set' in value) {
    return Boolean((value as { set?: unknown }).set)
  }

   if (typeof value === 'object' && value !== null && '1' in value) {
    return Boolean((value as { 1?: unknown })[1])
  }

  return false
}

export function getPredictionStatus({
  gamesSubmitted,
  winnersSubmitted,
  deadline,
  now = Math.floor(Date.now() / 1000),
}: {
  gamesSubmitted: boolean
  winnersSubmitted: boolean
  deadline?: number
  now?: number
}): PredictionStatus {
  if (gamesSubmitted && winnersSubmitted) return 'complete'

  const expired = typeof deadline === 'number' && now >= deadline
  if (expired) return 'expired'

  if (gamesSubmitted || winnersSubmitted) return 'partial'
  return 'none'
}

export function getPredictionStatusPriority(status: PredictionStatus): number {
  switch (status) {
    case 'partial':
      return 0
    case 'none':
      return 1
    case 'complete':
      return 2
    case 'expired':
      return 3
    default:
      return 4
  }
}
