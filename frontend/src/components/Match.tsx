import { Input } from './ui/input'
import type { Game } from '../lib/types'
import { teamsSiglaById, teamsById, teamsFlagById } from '../lib/teams'

type MatchProps = {
  game: Game
  disabled: boolean
  readOnlyAppearance?: boolean
  onScoreChange: (gameId: number, team: 0 | 1, score: number | null) => void
}

export function Match({ game, disabled, readOnlyAppearance = false, onScoreChange }: MatchProps) {
  const team1Score = game.result[0]
  const team2Score = game.result[1]
  const team1Name = teamsById[game.team1] ?? `#${game.team1}`
  const team2Name = teamsById[game.team2] ?? `#${game.team2}`
  const team1Label = teamsSiglaById[game.team1] ?? team1Name
  const team2Label = teamsSiglaById[game.team2] ?? team2Name
  // TODO: Revisar este criterio con producto. Hoy el warning aparece cuando
  // un equipo llega a 10+ goles; tal vez deba evaluarse por goles totales.
  const team1Improbable = team1Score !== null && team1Score >= 10
  const team2Improbable = team2Score !== null && team2Score >= 10
  const hasImprobableScore = team1Improbable || team2Improbable

  return (
    <div className="space-y-1 py-2">
      <div
        className="flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        {/* Team 1 */}
        <div
          className="flex min-w-0 flex-1 items-center justify-end gap-3 text-right text-sm font-mono font-semibold tracking-wide"
          style={{ color: 'var(--text-primary)' }}
          title={team1Name}
        >
          <span className={`fi fi-${teamsFlagById[game.team1]}`} style={{ fontSize: '1.4rem' }} />
          <span className="truncate">{team1Label}</span>
        </div>

        {/* Score inputs */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Input
            type="number"
            className={`w-14 h-10 text-center px-1 font-mono text-lg font-semibold ${readOnlyAppearance ? 'disabled:opacity-100 disabled:text-[var(--text-primary)]' : ''}`}
            style={{ 
              fontFamily: 'var(--font-mono-custom)',
              borderColor: team1Improbable ? 'rgba(255, 214, 0, 0.45)' : undefined,
              background: team1Improbable ? 'rgba(255, 214, 0, 0.08)' : undefined,
            }}
            placeholder="0"
            min={0}
            max={255}
            disabled={disabled}
            value={team1Score ?? ''}
            onChange={(e) => {
              const val = e.target.value
              if (val === '' || val === '-') {
                onScoreChange(game.id, 0, null)
              } else {
                const num = Number(val)
                if (!Number.isNaN(num) && num >= 0) onScoreChange(game.id, 0, num)
              }
            }}
          />
          <span
            className="text-base font-bold select-none"
            style={{ color: 'var(--text-disabled)' }}
          >
            ·
          </span>
          <Input
            type="number"
            className={`w-14 h-10 text-center px-1 font-mono text-lg font-semibold ${readOnlyAppearance ? 'disabled:opacity-100 disabled:text-[var(--text-primary)]' : ''}`}
            style={{ 
              fontFamily: 'var(--font-mono-custom)',
              borderColor: team2Improbable ? 'rgba(255, 214, 0, 0.45)' : undefined,
              background: team2Improbable ? 'rgba(255, 214, 0, 0.08)' : undefined,
            }}
            placeholder="0"
            min={0}
            max={255}
            disabled={disabled}
            value={team2Score ?? ''}
            onChange={(e) => {
              const val = e.target.value
              if (val === '' || val === '-') {
                onScoreChange(game.id, 1, null)
              } else {
                const num = Number(val)
                if (!Number.isNaN(num) && num >= 0) onScoreChange(game.id, 1, num)
              }
            }}
          />
        </div>

        {/* Team 2 */}
        <div
          className="flex min-w-0 flex-1 items-center gap-3 text-sm font-mono font-semibold tracking-wide"
          style={{ color: 'var(--text-primary)' }}
          title={team2Name}
        >
          <span className="truncate">{team2Label}</span>
          <span className={`fi fi-${teamsFlagById[game.team2]}`} style={{ fontSize: '1.4rem' }} />
        </div>
      </div>

      {hasImprobableScore && (
        <p className="text-xs text-center" style={{ color: 'var(--accent-gold)' }}>
          Marcador poco habitual. Un equipo llego a 10 o mas goles; revisa si era intencional.
        </p>
      )}
    </div>
  )
}
