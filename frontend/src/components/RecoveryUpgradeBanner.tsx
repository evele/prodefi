import { useState } from 'react'
import { Fingerprint, ShieldAlert, X } from 'lucide-react'
import { RecoveryMethod } from '@openfort/react'
import { useEthereumEmbeddedWallet } from '@openfort/react/ethereum'
import { toast } from 'sonner'

import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { canUseOpenfort } from '../lib/chains'

function getRecoveryErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return 'No se pudo configurar la passkey.'

  const message = error.message.toLowerCase()

  if (message.includes('cancel')) return 'La creación de la passkey fue cancelada.'
  if (message.includes('password')) return 'La password actual no es correcta.'
  if (message.includes('passkey')) return 'No se pudo registrar la passkey en este dispositivo.'

  return error.message || 'No se pudo configurar la passkey.'
}

export function RecoveryUpgradeBanner() {
  const embeddedWallet = useEthereumEmbeddedWallet()
  const [password, setPassword] = useState('')
  const [isDismissed, setIsDismissed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const activeRecoveryMethod = embeddedWallet.activeWallet?.recoveryMethod
  const shouldShow =
    canUseOpenfort &&
    !isDismissed &&
    embeddedWallet.isConnected &&
    activeRecoveryMethod === RecoveryMethod.PASSWORD

  if (!shouldShow) return null

  const upgradeToPasskey = async () => {
    if (!password.trim()) {
      toast.error('Ingresá tu password actual para proteger la wallet con passkey.')
      return
    }

    setIsUpdating(true)

    try {
      await embeddedWallet.setRecovery({
        previousRecovery: {
          recoveryMethod: RecoveryMethod.PASSWORD,
          password: password.trim(),
        },
        newRecovery: {
          recoveryMethod: RecoveryMethod.PASSKEY,
        },
      })

      toast.success('Passkey configurada. Tu wallet ya no depende solo de password.')
      setPassword('')
      setIsDismissed(true)
    } catch (error) {
      toast.error(getRecoveryErrorMessage(error))
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--accent-gold)]" style={{ borderColor: 'var(--accent-gold)' }}>
            <ShieldAlert size={14} />
            <span className="truncate">Seguridad de wallet</span>
          </div>
          <CardTitle className="text-left text-sm leading-snug text-[var(--text-primary)] normal-case tracking-normal sm:text-base">
            Tu wallet sigue dependiendo de password. Configurá una passkey para no quedar atado a recordarla.
          </CardTitle>
        </div>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="rounded-full p-1 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          aria-label="Ocultar recordatorio"
        >
          <X size={16} />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[var(--text-secondary)]">
          Vas a necesitar tu password actual una sola vez para migrar la recuperación a passkey en este dispositivo.
        </p>

        {isExpanded ? (
          <div className="space-y-3">
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password actual de recuperación"
              autoComplete="current-password"
              disabled={isUpdating}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => void upgradeToPasskey()} disabled={isUpdating} className="w-full sm:flex-1">
                <Fingerprint size={16} />
                {isUpdating ? 'Configurando...' : 'Proteger con passkey'}
              </Button>
              <Button variant="outline" onClick={() => setIsExpanded(false)} disabled={isUpdating} className="w-full sm:flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => setIsExpanded(true)} className="w-full sm:flex-1">
              <Fingerprint size={16} />
              Configurar passkey
            </Button>
            <Button variant="outline" onClick={() => setIsDismissed(true)} className="w-full sm:flex-1">
              Más tarde
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
