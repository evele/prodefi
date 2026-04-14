import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { buildAllGroupGames } from '../lib/games'
import { FixturesView } from '../components/FixturesView'

export const Route = createFileRoute('/fixtures')({
  component: FixturesPage,
})

function FixturesPage() {
  const { groups } = useMemo(() => buildAllGroupGames(), [])

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

      {/* ─── Fixtures ─── */}
      <FixturesView groups={groups} />
    </div>
  )
}
