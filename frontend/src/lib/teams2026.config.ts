export type TeamGroupConfig = {
  id: number
  name: string
  groupId: number
  groupLabel: string
}

export const PRIMARY_GROUP_ID = 1

export const teams2026Config: TeamGroupConfig[] = [
  // Group A
  { id: 1, name: 'México', groupId: 1, groupLabel: 'A' },
  { id: 2, name: 'Sudáfrica', groupId: 1, groupLabel: 'A' },
  { id: 3, name: 'República de Corea', groupId: 1, groupLabel: 'A' },
  { id: 4, name: 'Playoff UEFA D', groupId: 1, groupLabel: 'A' },

  // Group B
  { id: 5, name: 'Canadá', groupId: 2, groupLabel: 'B' },
  { id: 6, name: 'Playoff UEFA A', groupId: 2, groupLabel: 'B' },
  { id: 7, name: 'Qatar', groupId: 2, groupLabel: 'B' },
  { id: 8, name: 'Suiza', groupId: 2, groupLabel: 'B' },

  // Group C
  { id: 9, name: 'Brasil', groupId: 3, groupLabel: 'C' },
  { id: 10, name: 'Marruecos', groupId: 3, groupLabel: 'C' },
  { id: 11, name: 'Haití', groupId: 3, groupLabel: 'C' },
  { id: 12, name: 'Escocia', groupId: 3, groupLabel: 'C' },

  // Group D
  { id: 13, name: 'Estados Unidos', groupId: 4, groupLabel: 'D' },
  { id: 14, name: 'Paraguay', groupId: 4, groupLabel: 'D' },
  { id: 15, name: 'Australia', groupId: 4, groupLabel: 'D' },
  { id: 16, name: 'Playoff UEFA C', groupId: 4, groupLabel: 'D' },

  // Group E
  { id: 17, name: 'Alemania', groupId: 5, groupLabel: 'E' },
  { id: 18, name: 'Curazao', groupId: 5, groupLabel: 'E' },
  { id: 19, name: 'Costa de Marfil', groupId: 5, groupLabel: 'E' },
  { id: 20, name: 'Ecuador', groupId: 5, groupLabel: 'E' },

  // Group F
  { id: 21, name: 'Países Bajos', groupId: 6, groupLabel: 'F' },
  { id: 22, name: 'Japón', groupId: 6, groupLabel: 'F' },
  { id: 23, name: 'Playoff UEFA B', groupId: 6, groupLabel: 'F' },
  { id: 24, name: 'Túnez', groupId: 6, groupLabel: 'F' },

  // Group G
  { id: 25, name: 'Bélgica', groupId: 7, groupLabel: 'G' },
  { id: 26, name: 'Egipto', groupId: 7, groupLabel: 'G' },
  { id: 27, name: 'Irán', groupId: 7, groupLabel: 'G' },
  { id: 28, name: 'Nueva Zelanda', groupId: 7, groupLabel: 'G' },

  // Group H
  { id: 29, name: 'España', groupId: 8, groupLabel: 'H' },
  { id: 30, name: 'Cabo Verde', groupId: 8, groupLabel: 'H' },
  { id: 31, name: 'Arabia Saudita', groupId: 8, groupLabel: 'H' },
  { id: 32, name: 'Uruguay', groupId: 8, groupLabel: 'H' },

  // Group I
  { id: 33, name: 'Francia', groupId: 9, groupLabel: 'I' },
  { id: 34, name: 'Senegal', groupId: 9, groupLabel: 'I' },
  { id: 35, name: 'Playoff Repechaje 1', groupId: 9, groupLabel: 'I' },
  { id: 36, name: 'Noruega', groupId: 9, groupLabel: 'I' },

  // Group J
  { id: 37, name: 'Argentina', groupId: 10, groupLabel: 'J' },
  { id: 38, name: 'Argelia', groupId: 10, groupLabel: 'J' },
  { id: 39, name: 'Austria', groupId: 10, groupLabel: 'J' },
  { id: 40, name: 'Jordania', groupId: 10, groupLabel: 'J' },

  // Group K
  { id: 41, name: 'Portugal', groupId: 11, groupLabel: 'K' },
  { id: 42, name: 'Playoff Repechaje 2', groupId: 11, groupLabel: 'K' },
  { id: 43, name: 'Uzbekistán', groupId: 11, groupLabel: 'K' },
  { id: 44, name: 'Colombia', groupId: 11, groupLabel: 'K' },

  // Group L
  { id: 45, name: 'Inglaterra', groupId: 12, groupLabel: 'L' },
  { id: 46, name: 'Croacia', groupId: 12, groupLabel: 'L' },
  { id: 47, name: 'Ghana', groupId: 12, groupLabel: 'L' },
  { id: 48, name: 'Panamá', groupId: 12, groupLabel: 'L' },
]
