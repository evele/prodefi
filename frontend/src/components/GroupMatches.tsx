import { Match } from './Match'
import type { Game } from '../lib/types'

type GroupMatchesProps = {
  groupLabel: string
  games: Game[]
  disabled: boolean
  readOnlyAppearance?: boolean
  onScoreChange: (gameId: number, team: 0 | 1, score: number | null) => void
  pointsByGameId?: Record<number, bigint>
}

export function GroupMatches({ groupLabel, games, disabled, readOnlyAppearance = false, onScoreChange, pointsByGameId }: GroupMatchesProps) {
  const scheduledGames = [...games].sort((a, b) => {
    if (!a.kickoffEt && !b.kickoffEt) return a.id - b.id
    if (!a.kickoffEt) return 1
    if (!b.kickoffEt) return -1
    return a.kickoffEt.localeCompare(b.kickoffEt)
  })

  return (
    <div
      className="rounded-xl px-3 py-3 sm:px-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
    >
      <div className="mb-2 flex items-center gap-2 sm:mb-3">
        <span
          className="font-display text-sm font-bold tracking-wider uppercase sm:text-base"
          style={{ color: 'var(--accent-green)' }}
        >
          Grupo {groupLabel}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-disabled)' }}>
          {games.length} partidos
        </span>
      </div>
      <div>
        {scheduledGames.map((game) => (
          <Match
            key={game.id}
            game={game}
            disabled={disabled}
            readOnlyAppearance={readOnlyAppearance}
            onScoreChange={onScoreChange}
            pointsEarned={pointsByGameId?.[game.id]}
          />
        ))}
      </div>
    </div>
  )
}
