import type { ReactNode } from 'react'

import { getTeamMeta } from '../lib/teams'

type TeamInfoTriggerProps = {
  teamId: number
  onOpenTeamInfo: (teamId: number) => void
  children: ReactNode
  className?: string
}

export function TeamInfoTrigger({ teamId, onOpenTeamInfo, children, className = '' }: TeamInfoTriggerProps) {
  const teamMeta = getTeamMeta(teamId)
  const accessibleName = teamMeta ? `${teamMeta.name} (${teamMeta.sigla})` : `Equipo ${teamId}`

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-haspopup="dialog"
      aria-label={`Ver info de ${accessibleName}`}
      className={`inline-flex min-w-0 cursor-pointer items-center rounded-md px-1 py-1 text-inherit outline-none transition-all hover:bg-white/[0.03] hover:opacity-85 focus-visible:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-white/15 ${className}`.trim()}
      onClick={() => onOpenTeamInfo(teamId)}
    >
      {children}
    </button>
  )
}
