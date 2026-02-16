import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Match } from './Match'
import type { Game } from '../lib/types'

type GroupMatchesProps = {
  groupLabel: string
  games: Game[]
  disabled: boolean
  onScoreChange: (gameId: number, team: 0 | 1, score: number) => void
}

export function GroupMatches({ groupLabel, games, disabled, onScoreChange }: GroupMatchesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Group {groupLabel}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {games.map((game) => (
          <Match
            key={game.id}
            game={game}
            disabled={disabled}
            onScoreChange={onScoreChange}
          />
        ))}
      </CardContent>
    </Card>
  )
}
