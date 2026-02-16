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
    <div className="flex items-center gap-3 py-2">
      <span className="text-xs text-muted-foreground w-6 text-center">{game.id}</span>
      <div className="flex-1 text-right text-sm font-medium truncate">
        {teamsById[game.team1] ?? `#${game.team1}`}
      </div>
      <Input
        type="number"
        className="w-14 text-center"
        placeholder="0"
        min={0}
        max={255}
        disabled={disabled}
        value={game.result[0]}
        onChange={(e) => onScoreChange(game.id, 0, Number(e.target.value))}
      />
      <span className="text-muted-foreground">-</span>
      <Input
        type="number"
        className="w-14 text-center"
        placeholder="0"
        min={0}
        max={255}
        disabled={disabled}
        value={game.result[1]}
        onChange={(e) => onScoreChange(game.id, 1, Number(e.target.value))}
      />
      <div className="flex-1 text-left text-sm font-medium truncate">
        {teamsById[game.team2] ?? `#${game.team2}`}
      </div>
    </div>
  )
}
