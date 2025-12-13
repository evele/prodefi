import { keccak256, stringToHex } from 'viem'
import type { Team } from './types'

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

export const teams2026: Team[] = [
  // Grupo A
  { id: 1, name: 'México', group: 'A' },
  { id: 2, name: 'Sudáfrica', group: 'A' },
  { id: 3, name: 'República de Corea', group: 'A' },
  { id: 4, name: 'Playoff UEFA D', group: 'A' },

  // Grupo B
  { id: 5, name: 'Canadá', group: 'B' },
  { id: 6, name: 'Playoff UEFA A', group: 'B' },
  { id: 7, name: 'Qatar', group: 'B' },
  { id: 8, name: 'Suiza', group: 'B' },

  // Grupo C
  { id: 9, name: 'Brasil', group: 'C' },
  { id: 10, name: 'Marruecos', group: 'C' },
  { id: 11, name: 'Haití', group: 'C' },
  { id: 12, name: 'Escocia', group: 'C' },

  // Grupo D
  { id: 13, name: 'Estados Unidos', group: 'D' },
  { id: 14, name: 'Paraguay', group: 'D' },
  { id: 15, name: 'Australia', group: 'D' },
  { id: 16, name: 'Playoff UEFA C', group: 'D' },

  // Grupo E
  { id: 17, name: 'Alemania', group: 'E' },
  { id: 18, name: 'Curazao', group: 'E' },
  { id: 19, name: 'Costa de Marfil', group: 'E' },
  { id: 20, name: 'Ecuador', group: 'E' },

  // Grupo F
  { id: 21, name: 'Países Bajos', group: 'F' },
  { id: 22, name: 'Japón', group: 'F' },
  { id: 23, name: 'Playoff UEFA B', group: 'F' },
  { id: 24, name: 'Túnez', group: 'F' },

  // Grupo G
  { id: 25, name: 'Bélgica', group: 'G' },
  { id: 26, name: 'Egipto', group: 'G' },
  { id: 27, name: 'Irán', group: 'G' },
  { id: 28, name: 'Nueva Zelanda', group: 'G' },

  // Grupo H
  { id: 29, name: 'España', group: 'H' },
  { id: 30, name: 'Cabo Verde', group: 'H' },
  { id: 31, name: 'Arabia Saudita', group: 'H' },
  { id: 32, name: 'Uruguay', group: 'H' },

  // Grupo I
  { id: 33, name: 'Francia', group: 'I' },
  { id: 34, name: 'Senegal', group: 'I' },
  { id: 35, name: 'Playoff Repechaje 1', group: 'I' },
  { id: 36, name: 'Noruega', group: 'I' },

  // Grupo J
  { id: 37, name: 'Argentina', group: 'J' },
  { id: 38, name: 'Argelia', group: 'J' },
  { id: 39, name: 'Austria', group: 'J' },
  { id: 40, name: 'Jordania', group: 'J' },

  // Grupo K
  { id: 41, name: 'Portugal', group: 'K' },
  { id: 42, name: 'Playoff Repechaje 2', group: 'K' },
  { id: 43, name: 'Uzbekistán', group: 'K' },
  { id: 44, name: 'Colombia', group: 'K' },

  // Grupo L
  { id: 45, name: 'Inglaterra', group: 'L' },
  { id: 46, name: 'Croacia', group: 'L' },
  { id: 47, name: 'Ghana', group: 'L' },
  { id: 48, name: 'Panamá', group: 'L' }
];


export const teamsById: Record<number, string> = teams.reduce((acc, team) => {
  acc[team.id] = team.name
  return acc
}, {} as Record<number, string>)

export function indexTeamsById(list: Team[]): Record<number, string> {
  return list.reduce((acc, team) => {
    acc[team.id] = team.name
    return acc
  }, {} as Record<number, string>)
}

export async function computeTeamsHash(list: Team[]): Promise<string> {
  const normalized = list
    .slice()
    .sort((a, b) => a.id - b.id)
    .map((team) => `${team.id}:${team.name.trim().toLowerCase()}`)
    .join('|')

  return keccak256(stringToHex(normalized))
}

export async function computeTeamGroupsHash(list: Team[]): Promise<string> {
  // Deterministic order by team id; hash pairs (teamId, group)
  const normalized = list
    .slice()
    .sort((a, b) => a.id - b.id)
    .map((team) => `${team.id}:${team.group.toUpperCase()}`)
    .join('|')

  return keccak256(stringToHex(normalized))
}
