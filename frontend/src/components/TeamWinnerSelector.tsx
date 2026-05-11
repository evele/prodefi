import { useEffect, useId, useMemo, useState } from 'react'
import type { Team } from "../lib/types"
import { teamsFlagById } from "../lib/teams"
import { Button } from './ui/button'
import { Input } from './ui/input'

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
  const datalistId = useId()
  const availableTeams = useMemo(
    () => teams
      .filter((team) => !selectedTeams.includes(team.id) || team.id === selectedTeams[currentPosition - 1])
      .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })),
    [currentPosition, selectedTeams, teams],
  )
  const icon = POSITION_ICONS[currentPosition - 1]
  const selectedTeamId = selectedTeams[currentPosition - 1]
  const selectedTeam = teams.find((team) => team.id === selectedTeamId)
  const [searchValue, setSearchValue] = useState(selectedTeam?.name ?? '')

  useEffect(() => {
    setSearchValue(selectedTeam?.name ?? '')
  }, [selectedTeam])

  const optionLabelById = useMemo(() => {
    const entries = availableTeams.map((team) => [team.id, team.name] as const)
    return new Map(entries)
  }, [availableTeams])

  const normalizedTeamEntries = useMemo(
    () => availableTeams.map((team) => ({
      team,
      label: optionLabelById.get(team.id) ?? team.name,
      searchText: team.name.toLowerCase(),
    })),
    [availableTeams, optionLabelById],
  )

  const filteredTeamEntries = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    if (!query) return normalizedTeamEntries
    return normalizedTeamEntries.filter((entry) => entry.searchText.includes(query) || entry.label.toLowerCase().includes(query))
  }, [normalizedTeamEntries, searchValue])

  const commitSelection = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) {
      onChange(0)
      setSearchValue('')
      return
    }

    const exactLabelMatch = normalizedTeamEntries.find((entry) => entry.label.toLowerCase() === trimmed.toLowerCase())
    if (exactLabelMatch) {
      onChange(exactLabelMatch.team.id)
      setSearchValue(exactLabelMatch.label)
      return
    }

    if (selectedTeam) {
      setSearchValue(selectedTeam.name)
    } else {
      setSearchValue('')
    }
  }

  const handleInputChange = (value: string) => {
    setSearchValue(value)

    const exactLabelMatch = normalizedTeamEntries.find((entry) => entry.label.toLowerCase() === value.trim().toLowerCase())
    if (exactLabelMatch) {
      onChange(exactLabelMatch.team.id)
    }
  }

  const clearSelection = () => {
    onChange(0)
    setSearchValue('')
  }

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
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Input
            list={datalistId}
            disabled={disabled}
            value={searchValue}
            onChange={(event) => handleInputChange(event.target.value)}
            onBlur={() => commitSelection(searchValue)}
            placeholder="Buscar país…"
            className={readOnlyAppearance ? 'disabled:opacity-100' : ''}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSelection}
            disabled={disabled || (!selectedTeam && searchValue.length === 0)}
            aria-label={`Limpiar ${label}`}
            title={`Limpiar ${label}`}
          >
            ×
          </Button>
        </div>
        <datalist id={datalistId}>
          {filteredTeamEntries.map((entry) => (
            <option key={entry.team.id} value={entry.label} />
          ))}
        </datalist>
        <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          <span>Escribí para filtrar países.</span>
          {selectedTeam && (
            <span className="flex items-center gap-1">
              <span className={`fi fi-${teamsFlagById[selectedTeam.id]}`} />
              {selectedTeam.name}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
