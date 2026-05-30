import { useEffect } from 'react'
import { OpenfortEvents, openfortEvents } from '@openfort/react'
import { toast } from 'sonner'

import { clearStaleOpenfortAuthStorage } from '../lib/openfort-storage'
import { canUseOpenfort } from '../lib/chains'

type OpenfortLikeError = Error & {
  error?: string
  error_description?: string
}

const STALE_SESSION_CODES = new Set([
  'ALREADY_LOGGED_IN',
  'INVALID_TOKEN',
  'NOT_LOGGED_IN',
  'REFRESH_TOKEN_ERROR',
  'SESSION_EXPIRED',
  'USER_NOT_AUTHORIZED',
  'user_not_authorized',
])

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object') return 'Openfort no pudo enviar el codigo OTP.'

  const typedError = error as OpenfortLikeError
  return typedError.error_description || typedError.message || 'Openfort no pudo enviar el codigo OTP.'
}

function getErrorCode(error: unknown) {
  if (!error || typeof error !== 'object') return ''

  const typedError = error as OpenfortLikeError
  return typedError.error || ''
}

export function OpenfortErrorEventsHandler() {
  useEffect(() => {
    if (!canUseOpenfort) return

    const handleOtpFailure = (error: unknown) => {
      const code = getErrorCode(error)

      if (STALE_SESSION_CODES.has(code) && clearStaleOpenfortAuthStorage()) {
        toast.error('Openfort tenia una sesion local vencida. Cerra y abri el modal para pedir el codigo de nuevo.')
        return
      }

      toast.error(getErrorMessage(error))
    }

    openfortEvents.on(OpenfortEvents.ON_OTP_FAILURE as never, handleOtpFailure as never)

    return () => {
      openfortEvents.off(OpenfortEvents.ON_OTP_FAILURE as never, handleOtpFailure as never)
    }
  }, [])

  return null
}
