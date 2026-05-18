import { Input } from './ui/input'
import { getImprobableScoreFlags } from '../lib/improbable-scores'
import {
  formatFixtureKickoffDate,
  formatFixtureKickoffTime,
  getFixtureLanguage,
} from '../lib/fixture-time'
import type { Game } from '../lib/types'
import { teamsSiglaById, teamsById, teamsFlagById } from '../lib/teams'

type MatchProps = {
  game: Game
  disabled: boolean
  readOnlyAppearance?: boolean
  onScoreChange: (gameId: number, team: 0 | 1, score: number | null) => void
  pointsEarned?: bigint
}

export function Match({ game, disabled, readOnlyAppearance = false, onScoreChange, pointsEarned }: MatchProps) {
  const fixtureLanguage = getFixtureLanguage()
  const team1Score = game.result[0]
  const team2Score = game.result[1]
  const team1Name = teamsById[game.team1] ?? `#${game.team1}`
  const team2Name = teamsById[game.team2] ?? `#${game.team2}`
  const team1Label = teamsSiglaById[game.team1] ?? team1Name
  const team2Label = teamsSiglaById[game.team2] ?? team2Name
  const { team1Improbable, team2Improbable, totalImprobable, hasImprobableScore } = getImprobableScoreFlags(team1Score, team2Score)
  const kickoffDate = formatFixtureKickoffDate(game.kickoffEt, fixtureLanguage)
  const kickoffTime = formatFixtureKickoffTime(game.kickoffEt, fixtureLanguage)
  const hasFixtureMeta = Boolean(kickoffDate || game.venue)

  const renderScore = (team: 0 | 1, value: number | null, improbable: boolean) => {
    if (readOnlyAppearance) {
      return (
        <div
          className="flex h-9 w-12 items-center justify-center rounded-md border px-1 text-base font-semibold sm:h-10 sm:w-14 sm:text-lg"
          style={{
            fontFamily: 'var(--font-mono-custom)',
            borderColor: improbable ? 'rgba(255, 214, 0, 0.45)' : 'rgba(255,255,255,0.1)',
            background: improbable ? 'rgba(255, 214, 0, 0.08)' : 'rgba(255,255,255,0.04)',
            color: 'var(--text-primary)',
          }}
        >
          {value ?? '—'}
        </div>
      )
    }

    return (
      <Input
        type="number"
        className="h-9 w-12 px-1 text-center font-mono text-base font-semibold sm:h-10 sm:w-14 sm:text-lg"
        style={{
          fontFamily: 'var(--font-mono-custom)',
          borderColor: improbable ? 'rgba(255, 214, 0, 0.45)' : undefined,
          background: improbable ? 'rgba(255, 214, 0, 0.08)' : undefined,
        }}
        placeholder="0"
        min={0}
        max={255}
        disabled={disabled}
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value
          if (val === '' || val === '-') {
            onScoreChange(game.id, team, null)
          } else {
            const num = Number(val)
            if (!Number.isNaN(num) && num >= 0) onScoreChange(game.id, team, num)
          }
        }}
      />
    )
  }

  return (
    <div className="space-y-2 py-3 sm:py-4">
      <div
        className="flex items-center gap-2 sm:gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        {/* Team 1 */}
        <div
          className="flex min-w-0 flex-1 items-center justify-end gap-1.5 text-right text-[11px] font-mono font-semibold tracking-wide sm:gap-3 sm:text-sm"
          style={{ color: 'var(--text-primary)' }}
          title={team1Name}
        >
          <span className={`fi fi-${teamsFlagById[game.team1]} text-lg sm:text-[1.4rem]`} />
          <span className="truncate">{team1Label}</span>
        </div>

        {/* Score inputs */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 md:gap-3">
          {renderScore(0, team1Score, team1Improbable || totalImprobable)}
          {hasFixtureMeta ? (
            <>
              <span
                className="select-none text-sm font-bold md:hidden sm:text-base"
                style={{ color: 'var(--text-disabled)' }}
              >
                ·
              </span>
              <div className="hidden min-w-[10.5rem] flex-col items-center px-2 text-center leading-tight md:flex lg:min-w-[12rem] lg:px-4">
                {kickoffDate && kickoffTime && (
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {kickoffDate} · {kickoffTime}
                  </span>
                )}
                {game.venue && (
                  <span className="mt-1 text-[10px]" style={{ color: 'var(--text-disabled)' }}>
                    {game.venue}
                  </span>
                )}
              </div>
            </>
          ) : (
            <span
              className="select-none text-sm font-bold sm:text-base"
              style={{ color: 'var(--text-disabled)' }}
            >
              ·
            </span>
          )}
          {renderScore(1, team2Score, team2Improbable || totalImprobable)}
        </div>

        {/* Team 2 */}
        <div
          className="flex min-w-0 flex-1 items-center gap-1.5 text-[11px] font-mono font-semibold tracking-wide sm:gap-3 sm:text-sm"
          style={{ color: 'var(--text-primary)' }}
          title={team2Name}
        >
          <span className="truncate">{team2Label}</span>
          <span className={`fi fi-${teamsFlagById[game.team2]} text-lg sm:text-[1.4rem]`} />
        </div>
      </div>

      {hasImprobableScore && (
        <p className="text-xs text-center" style={{ color: 'var(--accent-gold)' }}>
          Resultado muuy abultado. Pegale una ultima mirada por las dudas.
        </p>
      )}

      {pointsEarned !== undefined && (
        <div className="flex justify-center">
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{
              color: pointsEarned > 0n ? 'var(--accent-green)' : 'var(--text-secondary)',
              background: pointsEarned > 0n ? 'rgba(0,230,118,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${pointsEarned > 0n ? 'rgba(0,230,118,0.18)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {pointsEarned.toString()} pts
          </span>
        </div>
      )}
    </div>
  )
}
