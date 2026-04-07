import { keccak256, stringToHex } from 'viem'
import type { Team } from './types'
import { teams2026Config, type TeamGroupConfig } from './teams2026.config'

export const teams: Team[] = [
  { id: 1, name: 'Argentina', group: 'A' },
  { id: 2, name: 'Brazil', group: 'A' },
  { id: 3, name: 'France', group: 'B' },
  { id: 4, name: 'Germany', group: 'B' },
  { id: 5, name: 'Spain', group: 'C' },
  { id: 6, name: 'England', group: 'C' },
  { id: 7, name: 'Portugal', group: 'D' },
  { id: 8, name: 'Netherlands', group: 'D' },
  { id: 9, name: 'Croatia', group: 'E' },
  { id: 10, name: 'Belgium', group: 'E' },
  { id: 11, name: 'Uruguay', group: 'F' },
  { id: 12, name: 'Colombia', group: 'F' },
]

export const teams2026: Team[] = teams2026Config.map((team) => ({
  id: team.id,
  name: team.name,
  group: team.groupLabel,
}))


export const teamsById: Record<number, string> = teams2026.reduce((acc, team) => {
  acc[team.id] = team.name
  return acc
}, {} as Record<number, string>)

export const teamsSiglaById: Record<number, string> = teams2026Config.reduce((acc, team) => {
  acc[team.id] = team.sigla
  return acc
}, {} as Record<number, string>)

export const teamsFlagById: Record<number, string> = teams2026Config.reduce((acc, team) => {
  acc[team.id] = team.flag
  return acc
}, {} as Record<number, string>)

export function indexTeamsById(list: Team[]): Record<number, string> {
  return list.reduce((acc, team) => {
    acc[team.id] = team.name
    return acc
  }, {} as Record<number, string>)
}

export async function computeTeamsHash(list: TeamGroupConfig[]): Promise<string> {
  const normalized = list
    .slice()
    .sort((a, b) => a.id - b.id)
    .map((team) => `${team.id}:${team.name.trim().toLowerCase()}:${team.groupId}`)
    .join('|')

  return keccak256(stringToHex(normalized))
}
