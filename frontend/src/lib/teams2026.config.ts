export type TeamGroupConfig = {
  id: number
  name: string
  sigla: string
  flag: string
  groupId: number
  groupLabel: string
}

export const PRIMARY_GROUP_ID = 1

export const teams2026Config: TeamGroupConfig[] = [
  // Group A
  { id: 1, name: 'México', sigla: 'MEX', flag: 'mx', groupId: 1, groupLabel: 'A' },
  { id: 2, name: 'Sudáfrica', sigla: 'RSA', flag: 'za', groupId: 1, groupLabel: 'A' },
  { id: 3, name: 'República de Corea', sigla: 'KOR', flag: 'kr', groupId: 1, groupLabel: 'A' },
  { id: 4, name: 'República Checa', sigla: 'CZE', flag: 'cz', groupId: 1, groupLabel: 'A' },

  // Group B
  { id: 5, name: 'Canadá', sigla: 'CAN', flag: 'ca', groupId: 2, groupLabel: 'B' },
  { id: 6, name: 'Bosnia y Herzegovina', sigla: 'BIH', flag: 'ba', groupId: 2, groupLabel: 'B' },
  { id: 7, name: 'Qatar', sigla: 'QAT', flag: 'qa', groupId: 2, groupLabel: 'B' },
  { id: 8, name: 'Suiza', sigla: 'SUI', flag: 'ch', groupId: 2, groupLabel: 'B' },

  // Group C
  { id: 9, name: 'Brasil', sigla: 'BRA', flag: 'br', groupId: 3, groupLabel: 'C' },
  { id: 10, name: 'Marruecos', sigla: 'MAR', flag: 'ma', groupId: 3, groupLabel: 'C' },
  { id: 11, name: 'Haití', sigla: 'HAI', flag: 'ht', groupId: 3, groupLabel: 'C' },
  { id: 12, name: 'Escocia', sigla: 'SCO', flag: 'gb-sct', groupId: 3, groupLabel: 'C' },

  // Group D
  { id: 13, name: 'Estados Unidos', sigla: 'USA', flag: 'us', groupId: 4, groupLabel: 'D' },
  { id: 14, name: 'Paraguay', sigla: 'PAR', flag: 'py', groupId: 4, groupLabel: 'D' },
  { id: 15, name: 'Australia', sigla: 'AUS', flag: 'au', groupId: 4, groupLabel: 'D' },
  { id: 16, name: 'Turquía', sigla: 'TUR', flag: 'tr', groupId: 4, groupLabel: 'D' },

  // Group E
  { id: 17, name: 'Alemania', sigla: 'GER', flag: 'de', groupId: 5, groupLabel: 'E' },
  { id: 18, name: 'Curazao', sigla: 'CUW', flag: 'cw', groupId: 5, groupLabel: 'E' },
  { id: 19, name: 'Costa de Marfil', sigla: 'CIV', flag: 'ci', groupId: 5, groupLabel: 'E' },
  { id: 20, name: 'Ecuador', sigla: 'ECU', flag: 'ec', groupId: 5, groupLabel: 'E' },

  // Group F
  { id: 21, name: 'Países Bajos', sigla: 'NED', flag: 'nl', groupId: 6, groupLabel: 'F' },
  { id: 22, name: 'Japón', sigla: 'JPN', flag: 'jp', groupId: 6, groupLabel: 'F' },
  { id: 23, name: 'Suecia', sigla: 'SWE', flag: 'se', groupId: 6, groupLabel: 'F' },
  { id: 24, name: 'Túnez', sigla: 'TUN', flag: 'tn', groupId: 6, groupLabel: 'F' },

  // Group G
  { id: 25, name: 'Bélgica', sigla: 'BEL', flag: 'be', groupId: 7, groupLabel: 'G' },
  { id: 26, name: 'Egipto', sigla: 'EGY', flag: 'eg', groupId: 7, groupLabel: 'G' },
  { id: 27, name: 'Irán', sigla: 'IRN', flag: 'ir', groupId: 7, groupLabel: 'G' },
  { id: 28, name: 'Nueva Zelanda', sigla: 'NZL', flag: 'nz', groupId: 7, groupLabel: 'G' },

  // Group H
  { id: 29, name: 'España', sigla: 'ESP', flag: 'es', groupId: 8, groupLabel: 'H' },
  { id: 30, name: 'Cabo Verde', sigla: 'CPV', flag: 'cv', groupId: 8, groupLabel: 'H' },
  { id: 31, name: 'Arabia Saudita', sigla: 'KSA', flag: 'sa', groupId: 8, groupLabel: 'H' },
  { id: 32, name: 'Uruguay', sigla: 'URU', flag: 'uy', groupId: 8, groupLabel: 'H' },

  // Group I
  { id: 33, name: 'Francia', sigla: 'FRA', flag: 'fr', groupId: 9, groupLabel: 'I' },
  { id: 34, name: 'Senegal', sigla: 'SEN', flag: 'sn', groupId: 9, groupLabel: 'I' },
  { id: 35, name: 'Irak', sigla: 'IRQ', flag: 'iq', groupId: 9, groupLabel: 'I' },
  { id: 36, name: 'Noruega', sigla: 'NOR', flag: 'no', groupId: 9, groupLabel: 'I' },

  // Group J
  { id: 37, name: 'Argentina', sigla: 'ARG', flag: 'ar', groupId: 10, groupLabel: 'J' },
  { id: 38, name: 'Argelia', sigla: 'ALG', flag: 'dz', groupId: 10, groupLabel: 'J' },
  { id: 39, name: 'Austria', sigla: 'AUT', flag: 'at', groupId: 10, groupLabel: 'J' },
  { id: 40, name: 'Jordania', sigla: 'JOR', flag: 'jo', groupId: 10, groupLabel: 'J' },

  // Group K
  { id: 41, name: 'Portugal', sigla: 'POR', flag: 'pt', groupId: 11, groupLabel: 'K' },
  { id: 42, name: 'R.D. Congo', sigla: 'COD', flag: 'cd', groupId: 11, groupLabel: 'K' },
  { id: 43, name: 'Uzbekistán', sigla: 'UZB', flag: 'uz', groupId: 11, groupLabel: 'K' },
  { id: 44, name: 'Colombia', sigla: 'COL', flag: 'co', groupId: 11, groupLabel: 'K' },

  // Group L
  { id: 45, name: 'Inglaterra', sigla: 'ENG', flag: 'gb-eng', groupId: 12, groupLabel: 'L' },
  { id: 46, name: 'Croacia', sigla: 'CRO', flag: 'hr', groupId: 12, groupLabel: 'L' },
  { id: 47, name: 'Ghana', sigla: 'GHA', flag: 'gh', groupId: 12, groupLabel: 'L' },
  { id: 48, name: 'Panamá', sigla: 'PAN', flag: 'pa', groupId: 12, groupLabel: 'L' },
]
