export type PredictionStatus = 'none' | 'partial' | 'complete' | 'expired'

export type Team = {
  id: number
  name: string
  group?: string
  emoji?: string
}

export type Game = {
  id: number
  team1: number
  team2: number
  result: [number | null, number | null]
  set: boolean
  kickoffEt?: string
  venue?: string
}

export type GroupData = {
  groupId: number
  groupLabel: string
  games: Game[]
}
