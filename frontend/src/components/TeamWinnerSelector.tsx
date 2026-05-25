import { useEffect, useMemo, useRef, useState } from 'react'
import type { Team } from "../lib/types"
import { teamsFlagById, teamsSiglaById } from "../lib/teams"
import { Button } from './ui/button'
import { Input } from './ui/input'

const POSITION_ICONS = ['🥇', '🥈', '🥉', '4°'] as const

function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

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
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const suggestionItemRefs = useRef<Array<HTMLButtonElement | null>>([])

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
      normalizedLabel: normalizeSearchText(optionLabelById.get(team.id) ?? team.name),
      searchText: [team.name, optionLabelById.get(team.id) ?? team.name, teamsSiglaById[team.id] ?? '']
        .map((value) => normalizeSearchText(value))
        .join(' '),
    })),
    [availableTeams, optionLabelById],
  )

  const normalizedQuery = useMemo(() => normalizeSearchText(searchValue.trim()), [searchValue])

  const filteredTeamEntries = useMemo(() => {
    const query = normalizedQuery
    if (!query) return normalizedTeamEntries
    return normalizedTeamEntries.filter((entry) => entry.searchText.includes(query) || entry.normalizedLabel.includes(query))
  }, [normalizedQuery, normalizedTeamEntries])

  const visibleSuggestions = filteredTeamEntries

  useEffect(() => {
    setHighlightedIndex((currentIndex) => {
      if (visibleSuggestions.length === 0) return -1
      return currentIndex >= 0 && currentIndex < visibleSuggestions.length ? currentIndex : -1
    })
  }, [visibleSuggestions])

  useEffect(() => {
    suggestionItemRefs.current = suggestionItemRefs.current.slice(0, visibleSuggestions.length)
  }, [visibleSuggestions])

  useEffect(() => {
    if (!isSuggestionsOpen || highlightedIndex < 0) return
    suggestionItemRefs.current[highlightedIndex]?.scrollIntoView({ block: 'nearest' })
  }, [highlightedIndex, isSuggestionsOpen])

  const selectEntry = (entry: (typeof normalizedTeamEntries)[number]) => {
    onChange(entry.team.id)
    setSearchValue(entry.label)
    setIsSuggestionsOpen(false)
    setHighlightedIndex(-1)
  }

  const commitSelection = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) {
      onChange(0)
      setSearchValue('')
      setIsSuggestionsOpen(false)
      setHighlightedIndex(-1)
      return
    }

    const normalizedValue = normalizeSearchText(trimmed)
    const matchedEntry = normalizedTeamEntries.find((entry) => entry.normalizedLabel === normalizedValue)
    if (matchedEntry) {
      selectEntry(matchedEntry)
      return
    }

    if (filteredTeamEntries.length === 1 && normalizedValue.length > 0) {
      selectEntry(filteredTeamEntries[0])
      return
    }

    if (selectedTeam) {
      setSearchValue(selectedTeam.name)
    } else {
      setSearchValue('')
    }

    setIsSuggestionsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleInputChange = (value: string) => {
    setSearchValue(value)
    setIsSuggestionsOpen(true)
    setHighlightedIndex(-1)

    const matchedEntry = normalizedTeamEntries.find((entry) => entry.normalizedLabel === normalizeSearchText(value.trim()))
    if (matchedEntry) {
      onChange(matchedEntry.team.id)
    }
  }

  const clearSelection = () => {
    onChange(0)
    setSearchValue('')
    setIsSuggestionsOpen(true)
    setHighlightedIndex(-1)
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
            className="flex items-center gap-4 rounded-full px-2.5 py-1 sm:ml-auto"
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
            disabled={disabled}
            value={searchValue}
            onChange={(event) => handleInputChange(event.target.value)}
            onFocus={() => {
              setIsSuggestionsOpen(true)
              setHighlightedIndex(-1)
            }}
            onBlur={() => {
              commitSelection(searchValue)
              setIsSuggestionsOpen(false)
              setHighlightedIndex(-1)
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setIsSuggestionsOpen(true)
                setHighlightedIndex((currentIndex) => {
                  if (visibleSuggestions.length === 0) return -1
                  return currentIndex < visibleSuggestions.length - 1 ? currentIndex + 1 : 0
                })
                return
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault()
                setIsSuggestionsOpen(true)
                setHighlightedIndex((currentIndex) => {
                  if (visibleSuggestions.length === 0) return -1
                  return currentIndex > 0 ? currentIndex - 1 : visibleSuggestions.length - 1
                })
                return
              }

              if (event.key === 'Enter') {
                event.preventDefault()

                if (isSuggestionsOpen && highlightedIndex >= 0 && visibleSuggestions[highlightedIndex]) {
                  selectEntry(visibleSuggestions[highlightedIndex])
                  return
                }

                commitSelection(searchValue)
                return
              }

              if (event.key === 'Escape') {
                setIsSuggestionsOpen(false)
                setHighlightedIndex(-1)
              }
            }}
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
        {!disabled && isSuggestionsOpen && visibleSuggestions.length > 0 && (
          <div
            className="max-h-52 overflow-y-auto rounded-xl border"
            style={{ background: 'var(--bg-elevated)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            {visibleSuggestions.map((entry, index) => (
              <button
                key={entry.team.id}
                type="button"
                ref={(element) => {
                  suggestionItemRefs.current[index] = element
                }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-white/[0.04]"
                style={{
                  color: 'var(--text-primary)',
                  background: highlightedIndex === index ? 'rgba(255,255,255,0.05)' : undefined,
                }}
                onMouseDown={(event) => {
                  event.preventDefault()
                  selectEntry(entry)
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="flex min-w-0 items-center gap-4">
                  <span className={`fi fi-${teamsFlagById[entry.team.id]}`} />
                  <span className="truncate">{entry.label}</span>
                </span>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
                  {teamsSiglaById[entry.team.id] ?? entry.team.name}
                </span>
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          <span>Escribí para filtrar países.</span>
          {selectedTeam && (
            <span className="flex items-center gap-4">
              <span className={`fi fi-${teamsFlagById[selectedTeam.id]}`} />
              {selectedTeam.name}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
