import { useEffect, useId } from 'react'
import { X } from 'lucide-react'

import { getTeamMeta } from '../lib/teams'

type TeamInfoSheetProps = {
  teamId: number | null
  onClose: () => void
}

export function TeamInfoSheet({ teamId, onClose }: TeamInfoSheetProps) {
  const titleId = useId()
  const teamMeta = teamId !== null ? getTeamMeta(teamId) : null

  useEffect(() => {
    if (!teamMeta) return

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, teamMeta])

  if (!teamMeta) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="Cerrar ficha del equipo"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:px-4">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative rounded-t-[1.75rem] border border-white/10 px-5 pb-6 pt-5 shadow-2xl sm:rounded-[1.75rem]"
          style={{ background: 'var(--bg-card)' }}
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-primary)]"
            onClick={onClose}
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-start gap-5 pr-10">
            <div className="text-[3.6rem] leading-none sm:text-[4.2rem]" aria-hidden="true">
              <span className={`fi fi-${teamMeta.flag}`} />
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--accent-green)' }}>
                Equipo
              </p>
              <h2 id={titleId} className="text-2xl font-bold leading-tight sm:text-[2rem]" style={{ color: 'var(--text-primary)' }}>
                {teamMeta.name}
              </h2>
            </div>

            <dl className="grid w-full grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <dt className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--text-disabled)' }}>
                  Sigla
                </dt>
                <dd className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {teamMeta.sigla}
                </dd>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <dt className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: 'var(--text-disabled)' }}>
                  Grupo
                </dt>
                <dd className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {teamMeta.group}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  )
}
