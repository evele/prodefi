import { GroupMatches } from './GroupMatches'
import type { GroupData } from '../lib/types'

export type { GroupData }

type GroupsViewProps = {
  groups: GroupData[]
  disabled: boolean
  onScoreChange: (gameId: number, team: 0 | 1, score: number) => void
  selectedGroup?: string | null
}

export function GroupsView({ groups, disabled, onScoreChange, selectedGroup }: GroupsViewProps) {
  const visible = selectedGroup ? groups.filter((g) => g.groupLabel === selectedGroup) : groups

  return (
    <div className="space-y-1">
      {visible.map((group) => (
        <GroupMatches
          key={group.groupId}
          groupLabel={group.groupLabel}
          games={group.games}
          disabled={disabled}
          onScoreChange={onScoreChange}
        />
      ))}
    </div>
  )
}
