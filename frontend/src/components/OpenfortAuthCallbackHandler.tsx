import { useEffect } from 'react'
import { useAuthCallback } from '@openfort/react'
import { toast } from 'sonner'

import { canUseOpenfort } from '../lib/chains'

function hasOpenfortCallbackParams() {
  if (typeof window === 'undefined') return false

  const params = new URL(window.location.href).searchParams
  return params.has('openfortAuthProvider')
}

export function OpenfortAuthCallbackHandler() {
  const authCallback = useAuthCallback({ enabled: canUseOpenfort })

  useEffect(() => {
    if (!authCallback.isError || !authCallback.error) return
    toast.error(authCallback.error.message || 'Openfort authentication callback failed.')
  }, [authCallback.error, authCallback.isError])

  if (!hasOpenfortCallbackParams()) return null

  if (authCallback.isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 text-center">
        <div className="max-w-sm rounded-2xl border border-white/10 bg-[var(--bg-card)] px-6 py-5 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-secondary)]">Openfort</p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">Procesando acceso...</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Estamos cerrando el login y preparando tu wallet. No cierres esta ventana.
          </p>
        </div>
      </div>
    )
  }

  return null
}
