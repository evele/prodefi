import type { Game } from './types'

export type StandingRow = {
  teamId: number
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  pts: number
}

export function calculateStandings(games: Game[], officialResultsMap: Map<number, { result: [number, number]; set: boolean }>, teamIds: number[]): StandingRow[] {
  const standings: Record<number, StandingRow> = {}

  for (const id of teamIds) {
    standings[id] = {
      teamId: id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
    }
  }

  for (const game of games) {
    const official = officialResultsMap.get(game.id)
    if (!official || !official.set) continue

    const [score1, score2] = official.result
    const t1 = standings[game.team1]
    const t2 = standings[game.team2]

    if (!t1 || !t2) continue

    t1.played++
    t2.played++
    t1.gf += score1
    t1.ga += score2
    t2.gf += score2
    t2.ga += score1
    t1.gd = t1.gf - t1.ga
    t2.gd = t2.gf - t2.ga

    if (score1 > score2) {
      t1.won++
      t1.pts += 3
      t2.lost++
    } else if (score1 < score2) {
      t2.won++
      t2.pts += 3
      t1.lost++
    } else {
      t1.drawn++
      t1.pts += 1
      t2.drawn++
      t2.pts += 1
    }
  }

  return Object.values(standings).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    if (b.gd !== a.gd) return b.gd - a.gd
    return b.gf - a.gf
  })
}
