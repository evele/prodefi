export type TeamGroupConfig = {
  id: number
  name: string
  sigla: string
  groupId: number
  groupLabel: string
}

export const PRIMARY_GROUP_ID = 1

export const teams2026Config: TeamGroupConfig[] = [
  // Group A
  { id: 1, name: 'México', sigla: 'MEX', groupId: 1, groupLabel: 'A' },
  { id: 2, name: 'Sudáfrica', sigla: 'RSA', groupId: 1, groupLabel: 'A' },
  { id: 3, name: 'República de Corea', sigla: 'KOR', groupId: 1, groupLabel: 'A' },
  { id: 4, name: 'Playoff UEFA D', sigla: 'UE-D', groupId: 1, groupLabel: 'A' },

  // Group B
  { id: 5, name: 'Canadá', sigla: 'CAN', groupId: 2, groupLabel: 'B' },
  { id: 6, name: 'Playoff UEFA A', sigla: 'UE-A', groupId: 2, groupLabel: 'B' },
  { id: 7, name: 'Qatar', sigla: 'QAT', groupId: 2, groupLabel: 'B' },
  { id: 8, name: 'Suiza', sigla: 'SUI', groupId: 2, groupLabel: 'B' },

  // Group C
  { id: 9, name: 'Brasil', sigla: 'BRA', groupId: 3, groupLabel: 'C' },
  { id: 10, name: 'Marruecos', sigla: 'MAR', groupId: 3, groupLabel: 'C' },
  { id: 11, name: 'Haití', sigla: 'HAI', groupId: 3, groupLabel: 'C' },
  { id: 12, name: 'Escocia', sigla: 'SCO', groupId: 3, groupLabel: 'C' },

  // Group D
  { id: 13, name: 'Estados Unidos', sigla: 'USA', groupId: 4, groupLabel: 'D' },
  { id: 14, name: 'Paraguay', sigla: 'PAR', groupId: 4, groupLabel: 'D' },
  { id: 15, name: 'Australia', sigla: 'AUS', groupId: 4, groupLabel: 'D' },
  { id: 16, name: 'Playoff UEFA C', sigla: 'UE-C', groupId: 4, groupLabel: 'D' },

  // Group E
  { id: 17, name: 'Alemania', sigla: 'GER', groupId: 5, groupLabel: 'E' },
  { id: 18, name: 'Curazao', sigla: 'CUW', groupId: 5, groupLabel: 'E' },
  { id: 19, name: 'Costa de Marfil', sigla: 'CIV', groupId: 5, groupLabel: 'E' },
  { id: 20, name: 'Ecuador', sigla: 'ECU', groupId: 5, groupLabel: 'E' },

  // Group F
  { id: 21, name: 'Países Bajos', sigla: 'NED', groupId: 6, groupLabel: 'F' },
  { id: 22, name: 'Japón', sigla: 'JPN', groupId: 6, groupLabel: 'F' },
  { id: 23, name: 'Playoff UEFA B', sigla: 'UE-B', groupId: 6, groupLabel: 'F' },
  { id: 24, name: 'Túnez', sigla: 'TUN', groupId: 6, groupLabel: 'F' },

  // Group G
  { id: 25, name: 'Bélgica', sigla: 'BEL', groupId: 7, groupLabel: 'G' },
  { id: 26, name: 'Egipto', sigla: 'EGY', groupId: 7, groupLabel: 'G' },
  { id: 27, name: 'Irán', sigla: 'IRN', groupId: 7, groupLabel: 'G' },
  { id: 28, name: 'Nueva Zelanda', sigla: 'NZL', groupId: 7, groupLabel: 'G' },

  // Group H
  { id: 29, name: 'España', sigla: 'ESP', groupId: 8, groupLabel: 'H' },
  { id: 30, name: 'Cabo Verde', sigla: 'CPV', groupId: 8, groupLabel: 'H' },
  { id: 31, name: 'Arabia Saudita', sigla: 'KSA', groupId: 8, groupLabel: 'H' },
  { id: 32, name: 'Uruguay', sigla: 'URU', groupId: 8, groupLabel: 'H' },

  // Group I
  { id: 33, name: 'Francia', sigla: 'FRA', groupId: 9, groupLabel: 'I' },
  { id: 34, name: 'Senegal', sigla: 'SEN', groupId: 9, groupLabel: 'I' },
  { id: 35, name: 'Playoff Repechaje 1', sigla: 'REP1', groupId: 9, groupLabel: 'I' },
  { id: 36, name: 'Noruega', sigla: 'NOR', groupId: 9, groupLabel: 'I' },

  // Group J
  { id: 37, name: 'Argentina', sigla: 'ARG', groupId: 10, groupLabel: 'J' },
  { id: 38, name: 'Argelia', sigla: 'ALG', groupId: 10, groupLabel: 'J' },
  { id: 39, name: 'Austria', sigla: 'AUT', groupId: 10, groupLabel: 'J' },
  { id: 40, name: 'Jordania', sigla: 'JOR', groupId: 10, groupLabel: 'J' },

  // Group K
  { id: 41, name: 'Portugal', sigla: 'POR', groupId: 11, groupLabel: 'K' },
  { id: 42, name: 'Playoff Repechaje 2', sigla: 'REP2', groupId: 11, groupLabel: 'K' },
  { id: 43, name: 'Uzbekistán', sigla: 'UZB', groupId: 11, groupLabel: 'K' },
  { id: 44, name: 'Colombia', sigla: 'COL', groupId: 11, groupLabel: 'K' },

  // Group L
  { id: 45, name: 'Inglaterra', sigla: 'ENG', groupId: 12, groupLabel: 'L' },
  { id: 46, name: 'Croacia', sigla: 'CRO', groupId: 12, groupLabel: 'L' },
  { id: 47, name: 'Ghana', sigla: 'GHA', groupId: 12, groupLabel: 'L' },
  { id: 48, name: 'Panamá', sigla: 'PAN', groupId: 12, groupLabel: 'L' },
]
