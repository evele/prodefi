import { Match } from './Match'
import type { Game } from '../lib/types'

type GroupMatchesProps = {
  groupLabel: string
  games: Game[]
  disabled: boolean
  onScoreChange: (gameId: number, team: 0 | 1, score: number | null) => void
}

export function GroupMatches({ groupLabel, games, disabled, onScoreChange }: GroupMatchesProps) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-display text-base font-bold tracking-wider uppercase"
          style={{ color: 'var(--accent-green)' }}
        >
          Grupo {groupLabel}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-disabled)' }}>
          {games.length} partidos
        </span>
      </div>
      <div>
        {games.map((game) => (
          <Match
            key={game.id}
            game={game}
            disabled={disabled}
            onScoreChange={onScoreChange}
          />
        ))}
      </div>
    </div>
  )
}
