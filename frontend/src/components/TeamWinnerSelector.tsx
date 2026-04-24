import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import type { Team } from "../lib/types"
import { teamsFlagById } from "../lib/teams"

const POSITION_ICONS = ['🥇', '🥈', '🥉', '4°'] as const

export function TeamWinnerSelector({
  label,
  teams,
  selectedTeams,
  currentPosition,
  disabled,
  readOnlyAppearance = false,
  onChange,
}: {
  label: string
  teams: Team[]
  selectedTeams: [number, number, number, number]
  currentPosition: 1 | 2 | 3 | 4
  disabled: boolean
  readOnlyAppearance?: boolean
  onChange: (teamId: number) => void
}) {
  const availableTeams = teams.filter(
    (team) => !selectedTeams.includes(team.id) || team.id === selectedTeams[currentPosition - 1]
  )
  const icon = POSITION_ICONS[currentPosition - 1]
  const selectedTeamId = selectedTeams[currentPosition - 1]
  const selectedTeam = teams.find((team) => team.id === selectedTeamId)

  if (readOnlyAppearance) {
    return (
      <div
        className="flex flex-col items-start gap-3 rounded-xl px-3 py-3 sm:flex-row sm:items-center"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex w-full items-start gap-3 sm:w-auto sm:flex-1 sm:items-center">
          <span className="w-8 shrink-0 text-center text-xl" title={label}>
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
              {label}
            </p>
            <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {selectedTeam?.name ?? 'Sin seleccionar'}
            </p>
          </div>
        </div>
        {selectedTeam ? (
          <div
            className="flex items-center gap-2 rounded-full px-2.5 py-1 sm:ml-auto"
            style={{ background: 'rgba(0,230,118,0.08)', color: 'var(--accent-green)' }}
          >
            <span className={`fi fi-${teamsFlagById[selectedTeam.id]}`} />
            <span className="text-xs font-medium uppercase tracking-wide">Confirmado</span>
          </div>
        ) : (
          <span className="text-xs" style={{ color: 'var(--text-disabled)' }}>
            Sin equipo
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex items-center gap-2 sm:w-8 sm:shrink-0 sm:justify-center">
        <span className="text-xl" title={label}>
          {icon}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] sm:hidden" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </span>
      </div>
      <Select
        disabled={disabled}
        onValueChange={(value) => onChange(Number(value))}
        value={selectedTeams[currentPosition - 1] !== 0 ? selectedTeams[currentPosition - 1].toString() : undefined}
      >
        <SelectTrigger className={`flex-1 ${readOnlyAppearance ? 'disabled:opacity-100' : ''}`}>
          <SelectValue placeholder={`Seleccionar equipo…`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">— Sin seleccionar —</SelectItem>
          {availableTeams.map((team) => (
            <SelectItem key={team.id} value={team.id.toString()}>
              <span className={`fi fi-${teamsFlagById[team.id]} mr-2`} />
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
