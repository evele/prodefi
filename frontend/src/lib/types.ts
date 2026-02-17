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
  result: [number, number]
  set: boolean
}

export type GroupData = {
  groupId: number
  groupLabel: string
  games: Game[]
}
