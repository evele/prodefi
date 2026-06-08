type ErrorResponse = {
  ok?: false
  error?: string
}

export type ResolveGiftRecipientResponse = {
  ok: true
  eligible: boolean
  reason?: string
}

function getFunctionsBaseUrl() {
  const value = import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL?.trim()
  if (!value) {
    throw new Error('Missing VITE_FIREBASE_FUNCTIONS_BASE_URL in frontend env.')
  }

  return value.replace(/\/+$/, '')
}

function buildFunctionUrl(functionName: string) {
  return `${getFunctionsBaseUrl()}/${functionName}`
}

async function parseResponseJson<T>(response: Response): Promise<T | ErrorResponse> {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text) as T | ErrorResponse
  } catch {
    return { ok: false, error: text }
  }
}

async function requestJson<T>(functionName: string, init: RequestInit): Promise<T> {
  const response = await fetch(buildFunctionUrl(functionName), init)
  const body = await parseResponseJson<T>(response)

  if (!response.ok) {
    const errorMessage = typeof body === 'object' && body && 'error' in body && typeof body.error === 'string'
      ? body.error
      : `request-failed:${response.status}`
    throw new Error(errorMessage)
  }

  return body as T
}

function buildAuthHeaders(accessToken: string, headers: HeadersInit = {}) {
  return {
    ...headers,
    Authorization: `Bearer ${accessToken}`,
  }
}

export async function upsertOpenfortProfile(
  payload: { walletAddress: string },
  accessToken: string,
): Promise<{ ok: true }> {
  return requestJson<{ ok: true }>('upsertOpenfortProfile', {
    method: 'POST',
    headers: buildAuthHeaders(accessToken, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })
}

export async function resolveGiftRecipientByWallet(
  payload: { walletAddress: string },
  accessToken: string,
): Promise<ResolveGiftRecipientResponse> {
  return requestJson<ResolveGiftRecipientResponse>('resolveGiftRecipientByWallet', {
    method: 'POST',
    headers: buildAuthHeaders(accessToken, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })
}
