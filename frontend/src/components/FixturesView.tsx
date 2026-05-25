import { useEffect, useMemo, useState } from 'react'
import { useReadContracts } from 'wagmi'
import { TeamInfoSheet } from './TeamInfoSheet'
import { TeamInfoTrigger } from './TeamInfoTrigger'
import { CONTRACT_ADDRESSES, PREDICTIONS_ABI } from '../lib/contracts'
import {
  getFixtureKickoffDayKey,
  formatFixtureKickoffDate,
  formatFixtureKickoffTime,
  getFixtureLanguage,
} from '../lib/fixture-time'
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
  groupLabel?: string
  showKickoffDate?: boolean
  onOpenTeamInfo: (teamId: number) => void
}

function sortGamesByKickoff(a: Game, b: Game) {
  if (!a.kickoffEt && !b.kickoffEt) return a.id - b.id
  if (!a.kickoffEt) return 1
  if (!b.kickoffEt) return -1
  return a.kickoffEt.localeCompare(b.kickoffEt)
}

function FixtureMatch({ game, officialResult, isSet, groupLabel, showKickoffDate = true, onOpenTeamInfo }: FixtureMatchProps) {
  const fixtureLanguage = getFixtureLanguage()
  const team1Name = teamsById[game.team1] ?? `#${game.team1}`
  const team2Name = teamsById[game.team2] ?? `#${game.team2}`
  const team1Short = teamsSiglaById[game.team1] ?? team1Name
  const team2Short = teamsSiglaById[game.team2] ?? team2Name
  const kickoffDate = formatFixtureKickoffDate(game.kickoffEt, fixtureLanguage)
  const kickoffTime = formatFixtureKickoffTime(game.kickoffEt, fixtureLanguage)

  return (
    <div
      className="flex items-center gap-2 py-3 px-2 rounded-lg transition-colors hover:bg-white/[0.02]"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
        {/* Team 1 */}
        <div
          className="flex min-w-0 flex-1 items-center justify-end text-right text-sm font-mono font-semibold tracking-wide md:justify-start md:text-left"
          style={{ color: 'var(--text-primary)' }}
        >
          <TeamInfoTrigger teamId={game.team1} onOpenTeamInfo={onOpenTeamInfo} className="max-w-full justify-end gap-4">
            <span className={`fi fi-${teamsFlagById[game.team1]}`} style={{ fontSize: '1.4rem' }} />
            <span className="hidden truncate sm:inline">{team1Name}</span>
            <span className="truncate sm:hidden">{team1Short}</span>
          </TeamInfoTrigger>
        </div>

      {/* Score display */}
      <div className="flex items-center justify-center gap-3 w-28 shrink-0 sm:w-36">
        <div className="flex flex-col items-center text-center leading-tight">
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
            <>
            {kickoffDate ? (
              <>
                {showKickoffDate && (
                  <span className="text-[11px] font-medium uppercase tracking-wider opacity-70">
                    {kickoffDate}
                  </span>
                )}
                {kickoffTime && (
                  <span
                    className={showKickoffDate ? 'text-xs font-semibold' : 'text-[11px] font-medium uppercase tracking-wider opacity-70'}
                    style={{ color: showKickoffDate ? 'var(--accent-gold)' : undefined }}
                  >
                    {kickoffTime}
                  </span>
                )}
                {game.venue && (
                  <span className="mt-1 text-[10px] opacity-50 max-w-32 sm:max-w-none">
                    {game.venue}
                  </span>
                )}
              </>
            ) : (
                <span className="text-xs font-medium uppercase tracking-widest opacity-30">
                  vs
                </span>
              )}
            </>
          )}
          {groupLabel && (
            <span
              className="mt-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
              style={{
                color: 'var(--text-secondary)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              Grupo {groupLabel}
            </span>
          )}
        </div>
      </div>

        {/* Team 2 */}
        <div
          className="flex min-w-0 flex-1 items-center text-sm font-mono font-semibold tracking-wide md:justify-end"
          style={{ color: 'var(--text-primary)' }}
        >
          <TeamInfoTrigger teamId={game.team2} onOpenTeamInfo={onOpenTeamInfo} className="max-w-full gap-4">
            <span className="hidden truncate sm:inline">{team2Name}</span>
            <span className="truncate sm:hidden">{team2Short}</span>
            <span className={`fi fi-${teamsFlagById[game.team2]}`} style={{ fontSize: '1.4rem' }} />
          </TeamInfoTrigger>
        </div>
      </div>
  )
}

type FixturesViewProps = {
  groups: GroupData[]
}

type FixtureViewTab = 'group' | 'date' | 'standings'

const FIXTURE_VIEW_STORAGE_KEY = 'fixture-view-tab'

export function FixturesView({ groups }: FixturesViewProps) {
  const [activeTeamInfoId, setActiveTeamInfoId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<FixtureViewTab>(() => {
    if (typeof window === 'undefined') return 'group'

    const stored = window.localStorage.getItem(FIXTURE_VIEW_STORAGE_KEY)
    if (stored === 'group' || stored === 'date' || stored === 'standings') return stored
    return 'group'
  })
  const fixtureLanguage = getFixtureLanguage()
  const allGames = useMemo(() => groups.flatMap((g) => g.games), [groups])

  useEffect(() => {
    window.localStorage.setItem(FIXTURE_VIEW_STORAGE_KEY, activeTab)
  }, [activeTab])

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

  const enrichedMatches = useMemo(
    () =>
      groups.flatMap((group) =>
        [...group.games].sort(sortGamesByKickoff).map((game) => {
          const official = officialResultsMap.get(game.id)
          return {
            game,
            groupId: group.groupId,
            groupLabel: group.groupLabel,
            officialResult: official?.result,
            isSet: official?.set ?? false,
          }
        }),
      ),
    [groups, officialResultsMap],
  )

  const matchesByDate = useMemo(() => {
    const buckets = new Map<string, { label: string; matches: typeof enrichedMatches }>()
    const unscheduled: typeof enrichedMatches = []

    for (const match of enrichedMatches) {
      const key = getFixtureKickoffDayKey(match.game.kickoffEt, fixtureLanguage)
      if (!key) {
        unscheduled.push(match)
        continue
      }

      const existing = buckets.get(key)
      if (existing) {
        existing.matches.push(match)
        continue
      }

      buckets.set(key, {
        label: formatFixtureKickoffDate(match.game.kickoffEt, fixtureLanguage) ?? key,
        matches: [match],
      })
    }

    const datedBuckets = Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, bucket]) => ({
        key,
        label: bucket.label,
        matches: [...bucket.matches].sort((a, b) => sortGamesByKickoff(a.game, b.game)),
      }))

    if (unscheduled.length > 0) {
      datedBuckets.push({
        key: 'tbd',
        label: fixtureLanguage === 'es' ? 'Sin fecha' : 'TBD',
        matches: [...unscheduled].sort((a, b) => sortGamesByKickoff(a.game, b.game)),
      })
    }

    return datedBuckets
  }, [enrichedMatches, fixtureLanguage])

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
            onClick={() => setActiveTab('group')}
            className="px-4 py-1.5 text-sm font-medium rounded-md transition-all"
            style={{
              background: activeTab === 'group' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'group' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'group' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            Por grupo
          </button>
          <button
            onClick={() => setActiveTab('date')}
            className="px-4 py-1.5 text-sm font-medium rounded-md transition-all"
            style={{
              background: activeTab === 'date' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'date' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'date' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            Por fecha
          </button>
            <button
              onClick={() => setActiveTab('standings')}
              className="px-4 py-1.5 text-sm font-medium rounded-md transition-all"
              style={{
                background: activeTab === 'standings' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'standings' ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: activeTab === 'standings' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              Posiciones
            </button>
          </div>
        </div>

      {activeTab === 'date'
        ? matchesByDate.map((bucket) => (
          <div
            key={bucket.key}
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div
              className="px-4 py-2.5 flex items-center justify-between"
              style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-color)' }}
            >
              <span className="font-display text-base font-bold uppercase tracking-wider" style={{ color: 'var(--accent-green)' }}>
                {bucket.label}
              </span>
            </div>

            <div className="p-2">
              {bucket.matches.map((match) => (
                <FixtureMatch
                  key={match.game.id}
                  game={match.game}
                  officialResult={match.officialResult}
                  isSet={match.isSet}
                  groupLabel={match.groupLabel}
                  showKickoffDate={false}
                  onOpenTeamInfo={setActiveTeamInfoId}
                />
              ))}
            </div>
          </div>
        ))
        : groups.map((group) => {
        const teamIds = Array.from(new Set(group.games.flatMap(g => [g.team1, g.team2])))
        const standings = calculateStandings(group.games, officialResultsMap, teamIds)
        const hasOfficialStandings = standings.some((row) => row.played > 0)
        const displayStandings = import.meta.env.DEV && !hasOfficialStandings
          ? withPreviewStandings(standings)
          : standings
        const scheduledGames = [...group.games].sort(sortGamesByKickoff)

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

            {activeTab !== 'standings' ? (
              <div className="p-2">
                {scheduledGames.map((game) => {
                  const official = officialResultsMap.get(game.id)
                  return (
                    <FixtureMatch 
                      key={game.id} 
                      game={game} 
                      officialResult={official?.result}
                      isSet={official?.set ?? false}
                      showKickoffDate
                      onOpenTeamInfo={setActiveTeamInfoId}
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
                          <TeamInfoTrigger teamId={row.teamId} onOpenTeamInfo={setActiveTeamInfoId} className="max-w-full gap-4 font-semibold">
                            <span className={`fi fi-${teamsFlagById[row.teamId]} rounded-sm`} />
                            <span className="hidden truncate sm:inline">{teamsById[row.teamId]}</span>
                            <span className="truncate sm:hidden">{teamsSiglaById[row.teamId] ?? teamsById[row.teamId]}</span>
                          </TeamInfoTrigger>
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

      <TeamInfoSheet teamId={activeTeamInfoId} onClose={() => setActiveTeamInfoId(null)} />
    </div>
  )
}
