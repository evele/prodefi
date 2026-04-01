import { Input } from './ui/input'
import type { Game } from '../lib/types'
import { teamsById } from '../lib/teams'

type MatchProps = {
  game: Game
  disabled: boolean
  onScoreChange: (gameId: number, team: 0 | 1, score: number) => void
}

export function Match({ game, disabled, onScoreChange }: MatchProps) {
  return (
    <div
      className="flex items-center gap-2 py-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Team 1 */}
      <div
        className="flex-1 text-right text-sm truncate"
        style={{ color: 'var(--text-primary)', fontWeight: 500 }}
        title={teamsById[game.team1] ?? `#${game.team1}`}
      >
        {teamsById[game.team1] ?? `#${game.team1}`}
      </div>

      {/* Score inputs */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Input
          type="number"
          className="w-11 h-9 text-center px-1 font-mono text-base font-semibold"
          style={{ fontFamily: 'var(--font-mono-custom)' }}
          placeholder="0"
          min={0}
          max={255}
          disabled={disabled}
          value={game.result[0]}
          onChange={(e) => onScoreChange(game.id, 0, Number(e.target.value))}
        />
        <span
          className="text-base font-bold select-none"
          style={{ color: 'var(--text-disabled)' }}
        >
          ·
        </span>
        <Input
          type="number"
          className="w-11 h-9 text-center px-1 font-mono text-base font-semibold"
          style={{ fontFamily: 'var(--font-mono-custom)' }}
          placeholder="0"
          min={0}
          max={255}
          disabled={disabled}
          value={game.result[1]}
          onChange={(e) => onScoreChange(game.id, 1, Number(e.target.value))}
        />
      </div>

      {/* Team 2 */}
      <div
        className="flex-1 text-left text-sm truncate"
        style={{ color: 'var(--text-primary)', fontWeight: 500 }}
        title={teamsById[game.team2] ?? `#${game.team2}`}
      >
        {teamsById[game.team2] ?? `#${game.team2}`}
      </div>
    </div>
  )
}
