import { teams2026Config } from './teams2026.config'
import type { Game, GroupData } from './types'
import groupSchedule from './worldcup2026-group-schedule.json'

type GroupScheduleEntry = {
  team1: number
  team2: number
  kickoffEt: string
  venue: string
}

function matchupKey(team1: number, team2: number) {
  return team1 < team2 ? `${team1}-${team2}` : `${team2}-${team1}`
}

const groupScheduleByMatchup = new Map(
  (groupSchedule as GroupScheduleEntry[]).map((entry) => [matchupKey(entry.team1, entry.team2), entry]),
)

/** Build round-robin games for all groups. Returns flat game list + group metadata. */
export const buildAllGroupGames = (): { games: Game[]; groups: GroupData[] } => {
  const groupMap = new Map<number, { groupLabel: string; teamIds: number[] }>()
  for (const t of teams2026Config) {
    let entry = groupMap.get(t.groupId)
    if (!entry) {
      entry = { groupLabel: t.groupLabel, teamIds: [] }
      groupMap.set(t.groupId, entry)
    }
    entry.teamIds.push(t.id)
  }

  const allGames: Game[] = []
  const groups: GroupData[] = []
  let gameId = 1

  for (const [groupId, { groupLabel, teamIds }] of groupMap) {
    const ids = teamIds.sort((a, b) => a - b)
    const groupGames: Game[] = []

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const schedule = groupScheduleByMatchup.get(matchupKey(ids[i], ids[j]))
        const game: Game = {
          id: gameId++,
          team1: ids[i],
          team2: ids[j],
          result: [null, null],
          set: false,
          kickoffEt: schedule?.kickoffEt,
          venue: schedule?.venue,
        }
        groupGames.push(game)
        allGames.push(game)
      }
    }

    groups.push({ groupId, groupLabel, games: groupGames })
  }

  return { games: allGames, groups }
}
