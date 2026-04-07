import { useMemo, useState } from 'react'
import { useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'
import { teamsSiglaById, teamsById, teamsFlagById } from '../lib/teams'
import type { Game, GroupData } from '../lib/types'
import { calculateStandings } from '../lib/standings'

type FixtureMatchProps = {
  game: Game
  officialResult?: [number, number]
  isSet: boolean
}

function FixtureMatch({ game, officialResult, isSet }: FixtureMatchProps) {
  return (
    <div
      className="flex items-center gap-2 py-3 px-2 rounded-lg transition-colors hover:bg-white/[0.02]"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Team 1 */}
      <div
        className="flex-1 flex items-center justify-end gap-2 text-sm font-mono font-semibold tracking-wide"
        style={{ color: 'var(--text-primary)' }}
        title={teamsById[game.team1] ?? `#${game.team1}`}
      >
        <span className={`fi fi-${teamsFlagById[game.team1]}`} style={{ fontSize: '1.4rem' }} />
        <span className="hidden sm:inline">{teamsById[game.team1]}</span>
        <span className="sm:hidden">{teamsSiglaById[game.team1] ?? teamsById[game.team1]}</span>
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
          <span className="text-xs font-medium uppercase tracking-widest opacity-30">
            vs
          </span>
        )}
      </div>

      {/* Team 2 */}
      <div
        className="flex-1 flex items-center gap-2 text-sm font-mono font-semibold tracking-wide"
        style={{ color: 'var(--text-primary)' }}
        title={teamsById[game.team2] ?? `#${game.team2}`}
      >
        <span className="hidden sm:inline">{teamsById[game.team2]}</span>
        <span className="sm:hidden">{teamsSiglaById[game.team2] ?? teamsById[game.team2]}</span>
        <span className={`fi fi-${teamsFlagById[game.team2]}`} style={{ fontSize: '1.4rem' }} />
      </div>
    </div>
  )
}

type FixturesViewProps = {
  groups: GroupData[]
  selectedGroupLabel: string | null
}

export function FixturesView({ groups, selectedGroupLabel }: FixturesViewProps) {
  const [viewMode, setViewMode] = useState<'matches' | 'standings'>('matches')
  const allGames = useMemo(() => groups.flatMap((g) => g.games), [groups])
  
  const { data: officialGamesData, isLoading } = useReadContracts({
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

  const officialResultsMap = useMemo(() => {
    const map = new Map<number, { result: [number, number]; set: boolean }>()
    if (!officialGamesData) return map
    
    officialGamesData.forEach((res, idx) => {
      if (res.status === 'success' && res.result && Array.isArray(res.result)) {
        // res.result is [id, [score1, score2], set]
        const data = res.result as unknown as [number, [number, number], boolean]
        map.set(allGames[idx].id, { result: [data[1][0], data[1][1]], set: data[2] })
      }
    })
    return map
  }, [officialGamesData, allGames])

  const visibleGroups = selectedGroupLabel 
    ? groups.filter(g => g.groupLabel === selectedGroupLabel)
    : groups

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

      {visibleGroups.map((group) => {
        const teamIds = Array.from(new Set(group.games.flatMap(g => [g.team1, g.team2])))
        const standings = calculateStandings(group.games, officialResultsMap, teamIds)

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
                      <th className="px-4 py-3 font-medium">Pos</th>
                      <th className="px-2 py-3 font-medium">Equipo</th>
                      <th className="px-2 py-3 font-medium text-center">P</th>
                      <th className="px-2 py-3 font-medium text-center">GF</th>
                      <th className="px-2 py-3 font-medium text-center">GC</th>
                      <th className="px-2 py-3 font-medium text-center">DG</th>
                      <th className="px-4 py-3 font-medium text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {standings.map((row, idx) => (
                      <tr key={row.teamId} className="transition-colors hover:bg-white/[0.01]">
                        <td className="px-4 py-3.5 font-mono text-xs opacity-50">{idx + 1}</td>
                        <td className="px-2 py-3.5">
                          <div className="flex items-center gap-2 font-semibold">
                            <span className={`fi fi-${teamsFlagById[row.teamId]} rounded-sm`} />
                            <span>{teamsById[row.teamId]}</span>
                          </div>
                        </td>
                        <td className="px-2 py-3.5 text-center font-mono">{row.played}</td>
                        <td className="px-2 py-3.5 text-center font-mono opacity-60">{row.gf}</td>
                        <td className="px-2 py-3.5 text-center font-mono opacity-60">{row.ga}</td>
                        <td className="px-2 py-3.5 text-center font-mono" style={{ color: row.gd > 0 ? 'var(--accent-green)' : row.gd < 0 ? 'var(--accent-red)' : 'inherit' }}>
                          {row.gd > 0 ? `+${row.gd}` : row.gd}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold font-mono text-base" style={{ color: idx < 2 ? 'var(--accent-gold)' : 'inherit' }}>
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
