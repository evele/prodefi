import { GroupMatches } from './GroupMatches'
import type { GroupData } from '../lib/types'

export type { GroupData }

type GroupsViewProps = {
  groups: GroupData[]
  disabled: boolean
  readOnlyAppearance?: boolean
  onScoreChange: (gameId: number, team: 0 | 1, score: number | null) => void
  selectedGroup?: string | null
  pointsByGameId?: Record<number, bigint>
  onOpenTeamInfo: (teamId: number) => void
}

export function GroupsView({ groups, disabled, readOnlyAppearance = false, onScoreChange, selectedGroup, pointsByGameId, onOpenTeamInfo }: GroupsViewProps) {
  const visible = selectedGroup ? groups.filter((g) => g.groupLabel === selectedGroup) : groups

  return (
    <div className="space-y-1">
      {visible.map((group) => (
        <GroupMatches
          key={group.groupId}
          groupLabel={group.groupLabel}
          games={group.games}
          disabled={disabled}
          readOnlyAppearance={readOnlyAppearance}
          onScoreChange={onScoreChange}
          pointsByGameId={pointsByGameId}
          onOpenTeamInfo={onOpenTeamInfo}
        />
      ))}
    </div>
  )
}
