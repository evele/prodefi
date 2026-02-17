import { GroupMatches } from './GroupMatches'
import type { GroupData } from '../lib/types'

export type { GroupData }

type GroupsViewProps = {
  groups: GroupData[]
  disabled: boolean
  onScoreChange: (gameId: number, team: 0 | 1, score: number) => void
}

export function GroupsView({ groups, disabled, onScoreChange }: GroupsViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
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
