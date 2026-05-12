import { useMemo, useState } from 'react'
import { useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'
import { teamsSiglaById, teamsById, teamsFlagById } from '../lib/teams'
import type { Game, GroupData } from '../lib/types'
import { calculateStandings, type StandingRow } from '../lib/standings'

const PREVIEW_STANDINGS: Array<Pick<StandingRow, 'played' | 'won' | 'drawn' | 'lost' | 'gf' | 'ga' | 'gd' | 'pts'>> = [
  { played: 3, won: 3, drawn: 0, lost: 0, gf: 12, ga: 1, gd: 11, pts: 9 },
  { played: 3, won: 2, drawn: 0, lost: 1, gf: 10, ga: 4, gd: 6, pts: 6 },
  { played: 3, won: 1, drawn: 0, lost: 2, gf: 4, ga: 9, gd: -5, pts: 3 },
  { played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 13, gd: -12, pts: 0 },
]

function withPreviewStandings(rows: StandingRow[]): StandingRow[] {
  return rows.map((row, index) => ({
    ...row,
    ...PREVIEW_STANDINGS[index % PREVIEW_STANDINGS.length],
  }))
}

function normalizeOfficialGameMeta(value: unknown): { id: number; set: boolean } | null {
  if (Array.isArray(value)) {
    const gameId = Number(value[0])
    const isSet = Boolean(value[1])
    return Number.isFinite(gameId) ? { id: gameId, set: isSet } : null
  }

  if (typeof value === 'object' && value !== null && 'id' in value && 'set' in value) {
    const gameId = Number((value as { id?: unknown }).id)
    const isSet = Boolean((value as { set?: unknown }).set)
    return Number.isFinite(gameId) ? { id: gameId, set: isSet } : null
  }

  return null
}

function normalizeGameResult(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length < 2) return null

  const team1Goals = Number(value[0])
  const team2Goals = Number(value[1])

  return Number.isFinite(team1Goals) && Number.isFinite(team2Goals)
    ? [team1Goals, team2Goals]
    : null
}

type FixtureMatchProps = {
  game: Game
  officialResult?: [number, number]
  isSet: boolean
}

function FixtureMatch({ game, officialResult, isSet }: FixtureMatchProps) {
  const team1Name = teamsById[game.team1] ?? `#${game.team1}`
  const team2Name = teamsById[game.team2] ?? `#${game.team2}`
  const team1Short = teamsSiglaById[game.team1] ?? team1Name
  const team2Short = teamsSiglaById[game.team2] ?? team2Name

  return (
    <div
      className="flex items-center gap-2 py-3 px-2 rounded-lg transition-colors hover:bg-white/[0.02]"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
        {/* Team 1 */}
        <div
          className="flex min-w-0 flex-1 items-center justify-end gap-3 text-right text-sm font-mono font-semibold tracking-wide md:justify-start md:text-left"
          style={{ color: 'var(--text-primary)' }}
          title={team1Name}
        >
          <span className={`fi fi-${teamsFlagById[game.team1]}`} style={{ fontSize: '1.4rem' }} />
          <span className="hidden truncate sm:inline">{team1Name}</span>
          <span className="truncate sm:hidden">{team1Short}</span>
        </div>

      {/* Score display */}
      <div className="flex items-center justify-center gap-3 w-20 shrink-0">
        {isSet ? (
          <div className="flex items-center gap-2">
            <span
              className="text-lg font-bold font-mono"
              style={{ color: 'var(--accent-green)' }}
            >
              {officialResult?.[0]}
            </span>
            <span className="text-xs opacity-30">—</span>
            <span
              className="text-lg font-bold font-mono"
              style={{ color: 'var(--accent-green)' }}
            >
              {officialResult?.[1]}
            </span>
          </div>
        ) : (
          // TODO: Show kickoff time here once we have match schedule data.
          <span className="text-xs font-medium uppercase tracking-widest opacity-30">
            vs
          </span>
        )}
      </div>

        {/* Team 2 */}
        <div
          className="flex min-w-0 flex-1 items-center gap-3 text-sm font-mono font-semibold tracking-wide md:justify-end"
          style={{ color: 'var(--text-primary)' }}
          title={team2Name}
        >
          <span className="hidden truncate sm:inline">{team2Name}</span>
          <span className="truncate sm:hidden">{team2Short}</span>
          <span className={`fi fi-${teamsFlagById[game.team2]}`} style={{ fontSize: '1.4rem' }} />
        </div>
      </div>
  )
}

type FixturesViewProps = {
  groups: GroupData[]
}

export function FixturesView({ groups }: FixturesViewProps) {
  const [viewMode, setViewMode] = useState<'matches' | 'standings'>('matches')
  const allGames = useMemo(() => groups.flatMap((g) => g.games), [groups])

  type ContractReadResult = { status: 'success' | 'failure'; result?: unknown }
  
  const { data: rawOfficialGamesMetaData, isLoading: isLoadingGameMeta } = useReadContracts({
    contracts: allGames.map((g) => ({
      address: CONTRACT_ADDRESSES.PREDICTIONS,
      abi: PREDICTIONS_ABI,
      functionName: 'games',
      args: [g.id],
    })),
    query: {
      refetchInterval: 30000,
    }
  })
  const { data: rawOfficialGameResultsData, isLoading: isLoadingGameResults } = useReadContracts({
    contracts: allGames.map((g) => ({
      address: CONTRACT_ADDRESSES.PREDICTIONS,
      abi: PREDICTIONS_ABI,
      functionName: 'getGameResults',
      args: [g.id],
    })),
    query: {
      refetchInterval: 30000,
    }
  })

  const officialGamesMetaData = rawOfficialGamesMetaData as ContractReadResult[] | undefined
  const officialGameResultsData = rawOfficialGameResultsData as ContractReadResult[] | undefined

  const officialResultsMap = useMemo(() => {
    const map = new Map<number, { result: [number, number]; set: boolean }>()
    if (!officialGamesMetaData) return map
    
    officialGamesMetaData.forEach((res, idx) => {
      if (res.status !== 'success') return

      const meta = normalizeOfficialGameMeta(res.result)
      const result = normalizeGameResult(officialGameResultsData?.[idx]?.status === 'success' ? officialGameResultsData[idx].result : undefined)

      if (!meta || !result) return

      map.set(allGames[idx].id, { result, set: meta.set })
    })
    return map
  }, [officialGameResultsData, officialGamesMetaData, allGames])

  const isLoading = isLoadingGameMeta || isLoadingGameResults

  if (isLoading) {
    return (
      <div className="py-10 text-center animate-pulse">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Cargando resultados oficiales...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-center">
        <div 
          className="flex p-1 rounded-lg" 
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}
        >
          <button
            onClick={() => setViewMode('matches')}
            className="px-4 py-1.5 text-sm font-medium rounded-md transition-all"
            style={{
              background: viewMode === 'matches' ? 'var(--bg-card)' : 'transparent',
              color: viewMode === 'matches' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: viewMode === 'matches' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            Partidos
          </button>
          <button
            onClick={() => setViewMode('standings')}
            className="px-4 py-1.5 text-sm font-medium rounded-md transition-all"
            style={{
              background: viewMode === 'standings' ? 'var(--bg-card)' : 'transparent',
              color: viewMode === 'standings' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: viewMode === 'standings' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            Posiciones
          </button>
        </div>
      </div>

      {groups.map((group) => {
        const teamIds = Array.from(new Set(group.games.flatMap(g => [g.team1, g.team2])))
        const standings = calculateStandings(group.games, officialResultsMap, teamIds)
        const hasOfficialStandings = standings.some((row) => row.played > 0)
        const displayStandings = import.meta.env.DEV && !hasOfficialStandings
          ? withPreviewStandings(standings)
          : standings

        return (
          <div 
            key={group.groupId}
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div 
              className="px-4 py-2.5 flex items-center justify-between"
              style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)' }}
            >
              <span className="font-display text-base font-bold uppercase tracking-wider" style={{ color: 'var(--accent-green)' }}>
                Grupo {group.groupLabel}
              </span>
            </div>

            {viewMode === 'matches' ? (
              <div className="p-2">
                {group.games.map((game) => {
                  const official = officialResultsMap.get(game.id)
                  return (
                    <FixtureMatch 
                      key={game.id} 
                      game={game} 
                      officialResult={official?.result}
                      isSet={official?.set ?? false}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr 
                      className="text-xs font-bold uppercase tracking-wider" 
                      style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}
                    >
                      <th className="w-8 px-2 py-3 font-medium sm:w-10">Pos</th>
                      <th className="px-1 py-3 pr-2 font-medium sm:px-2 sm:pr-3">Equipo</th>
                      <th className="px-2 py-3 text-center font-medium sm:px-3">P</th>
                      <th className="px-2 py-3 text-center font-medium sm:px-3">GF</th>
                      <th className="px-2 py-3 text-center font-medium sm:px-3">GC</th>
                      <th className="px-2 py-3 text-center font-medium sm:px-3">DG</th>
                      <th className="px-3 py-3 text-center font-medium sm:px-4">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {displayStandings.map((row, idx) => (
                      <tr key={row.teamId} className="transition-colors hover:bg-white/[0.01]">
                        <td className="px-2 py-3.5 font-mono text-xs opacity-50 sm:px-3">{idx + 1}</td>
                        <td className="px-1 py-3.5 pr-2 sm:px-2 sm:pr-3">
                          <div className="flex items-center gap-1.5 font-semibold sm:gap-2">
                            <span className={`fi fi-${teamsFlagById[row.teamId]} rounded-sm`} />
                            <span className="hidden truncate sm:inline">{teamsById[row.teamId]}</span>
                            <span className="truncate sm:hidden">{teamsSiglaById[row.teamId] ?? teamsById[row.teamId]}</span>
                          </div>
                        </td>
                        <td className="px-2 py-3.5 text-center font-mono sm:px-3">{row.played}</td>
                        <td className="px-2 py-3.5 text-center font-mono opacity-60 sm:px-3">{row.gf}</td>
                        <td className="px-2 py-3.5 text-center font-mono opacity-60 sm:px-3">{row.ga}</td>
                        <td className="px-2 py-3.5 text-center font-mono sm:px-3" style={{ color: row.gd > 0 ? 'var(--accent-green)' : row.gd < 0 ? 'var(--accent-red)' : 'inherit' }}>
                          {row.gd > 0 ? `+${row.gd}` : row.gd}
                        </td>
                        <td className="px-3 py-3.5 text-center font-mono text-base font-bold sm:px-4" style={{ color: idx < 2 ? 'var(--accent-gold)' : 'inherit' }}>
                          {row.pts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
