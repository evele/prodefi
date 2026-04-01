import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import type { Team } from "../lib/types"

const POSITION_ICONS = ['🥇', '🥈', '🥉', '4°'] as const

export function TeamWinnerSelector({
  label,
  teams,
  selectedTeams,
  currentPosition,
  disabled,
  onChange,
}: {
  label: string
  teams: Team[]
  selectedTeams: [number, number, number, number]
  currentPosition: 1 | 2 | 3 | 4
  disabled: boolean
  onChange: (teamId: number) => void
}) {
  const availableTeams = teams.filter(
    (team) => !selectedTeams.includes(team.id) || team.id === selectedTeams[currentPosition - 1]
  )
  const icon = POSITION_ICONS[currentPosition - 1]

  return (
    <div className="flex items-center gap-3">
      <span className="text-xl w-8 text-center shrink-0" title={label}>
        {icon}
      </span>
      <Select
        disabled={disabled}
        onValueChange={(value) => onChange(Number(value))}
        value={selectedTeams[currentPosition - 1] !== 0 ? selectedTeams[currentPosition - 1].toString() : undefined}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={`Seleccionar equipo…`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">— Sin seleccionar —</SelectItem>
          {availableTeams.map((team) => (
            <SelectItem key={team.id} value={team.id.toString()}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
