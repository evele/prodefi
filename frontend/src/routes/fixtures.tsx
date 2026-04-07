import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { buildAllGroupGames } from '../lib/games'
import { FixturesView } from '../components/FixturesView'

export const Route = createFileRoute('/fixtures')({
  component: FixturesPage,
})

function FixturesPage() {
  const { groups } = useMemo(() => buildAllGroupGames(), [])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ─── Page header ─── */}
      <div>
        <h1 className="font-display text-3xl font-black uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
          Fixtures
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Resultados oficiales del torneo
        </p>
      </div>

      {/* ─── Group tabs ─── */}
      <div
        className="px-3 py-2 overflow-x-auto scrollbar-hide rounded-xl"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)' }}
      >
        <div className="flex gap-1.5 p-1">
          <button
            onClick={() => setSelectedGroup(null)}
            className="flex-shrink-0 px-4 py-1.5 text-sm font-medium rounded-full transition-all"
            style={{
              background: selectedGroup === null ? 'var(--accent-green)' : 'transparent',
              color: selectedGroup === null ? 'var(--bg-base)' : 'var(--text-secondary)',
              border: `1px solid ${selectedGroup === null ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            Todos
          </button>
          {groups.map((group) => (
            <button
              key={group.groupLabel}
              onClick={() => setSelectedGroup(group.groupLabel)}
              className="flex-shrink-0 px-4 py-1.5 text-sm font-medium rounded-full transition-all"
              style={{
                background: selectedGroup === group.groupLabel ? 'var(--accent-green)' : 'transparent',
                color: selectedGroup === group.groupLabel ? 'var(--bg-base)' : 'var(--text-secondary)',
                border: `1px solid ${selectedGroup === group.groupLabel ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              Grupo {group.groupLabel}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Fixtures ─── */}
      <FixturesView groups={groups} selectedGroupLabel={selectedGroup} />
    </div>
  )
}
