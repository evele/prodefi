const POINTS_FIRST = 25
const POINTS_SECOND = 18
const POINTS_THIRD_FOURTH = 10

export function computeWinnerPointsPerPosition(
  predicted: readonly [number, number, number, number],
  official: readonly [number, number, number, number],
): [number, number, number, number] {
  return [
    predicted[0] === official[0] ? POINTS_FIRST : 0,
    predicted[1] === official[1] ? POINTS_SECOND : 0,
    (predicted[2] === official[2] || predicted[2] === official[3]) ? POINTS_THIRD_FOURTH : 0,
    (predicted[3] === official[2] || predicted[3] === official[3]) ? POINTS_THIRD_FOURTH : 0,
  ]
}

const MATCH_BASE_POINTS = 7
const MATCH_OUTCOME_BONUS = 3
const outcome = (a: number, b: number) => (a > b ? 0 : a === b ? 1 : 2)

export function computeGamePoints(
  pred: readonly [number, number],
  official: readonly [number, number],
): number {
  const diff = Math.abs(pred[0] - official[0]) + Math.abs(pred[1] - official[1])
  let points = diff >= MATCH_BASE_POINTS ? 0 : MATCH_BASE_POINTS - diff
  if (outcome(pred[0], pred[1]) === outcome(official[0], official[1])) points += MATCH_OUTCOME_BONUS
  return points
}
