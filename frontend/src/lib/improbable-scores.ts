import type { Game } from './types'

export const IMPROBABLE_TEAM_SCORE_THRESHOLD = 8
export const IMPROBABLE_TOTAL_SCORE_THRESHOLD = 11

export function getImprobableScoreFlags(team1Score: number | null, team2Score: number | null) {
  const team1Improbable = team1Score !== null && team1Score >= IMPROBABLE_TEAM_SCORE_THRESHOLD
  const team2Improbable = team2Score !== null && team2Score >= IMPROBABLE_TEAM_SCORE_THRESHOLD
  const totalImprobable = team1Score !== null && team2Score !== null && team1Score + team2Score >= IMPROBABLE_TOTAL_SCORE_THRESHOLD

  return {
    team1Improbable,
    team2Improbable,
    totalImprobable,
    hasImprobableScore: team1Improbable || team2Improbable || totalImprobable,
  }
}

export function isImprobableGame(game: Game) {
  return getImprobableScoreFlags(game.result[0], game.result[1]).hasImprobableScore
}
