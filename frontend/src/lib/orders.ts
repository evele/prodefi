export type CheckoutOrder = {
  ok: true
  orderId: string
  status: string
  paymentRail: string
  provider: string
  walletAddress: string
  tournamentId: number
  quantity: number
  unitPriceArs: number
  totalAmountArs: number
  initPoint: string | null
  sandboxInitPoint: string | null
  paymentId?: string | null
  paymentStatus?: string | null
  paymentStatusDetail?: string | null
  merchantOrderId?: string | null
  liveMode?: boolean | null
  mintTxHash?: string | null
  lastError?: string | null
}

type CreateOrderPayload = {
  walletAddress: string
  tournamentId: number
  quantity?: number
  paymentRail?: 'fiat_ars'
  openfortUserId?: string
}

type ErrorResponse = {
  ok?: false
  error?: string
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

async function requestUrlJson<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const body = await parseResponseJson<T>(response)

  if (!response.ok) {
    const errorMessage = typeof body === 'object' && body && 'error' in body && typeof body.error === 'string'
      ? body.error
      : `request-failed:${response.status}`
    throw new Error(errorMessage)
  }

  return body as T
}

export async function createCheckoutOrder(payload: CreateOrderPayload): Promise<CheckoutOrder> {
  return requestJson<CheckoutOrder>('createOrder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function getCheckoutOrderStatus(orderId: string): Promise<CheckoutOrder> {
  return requestUrlJson<CheckoutOrder>(getCheckoutOrderStatusUrl(orderId), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
}

export function getCheckoutOrderStatusUrl(orderId: string) {
  const url = new URL(buildFunctionUrl('getOrderStatus'), window.location.origin)
  url.searchParams.set('orderId', orderId)
  return url.toString()
}

export function getMercadoPagoCheckoutUrl(order: CheckoutOrder) {
  const shouldUseSandbox = import.meta.env.VITE_MERCADO_PAGO_USE_SANDBOX === 'true'

  if (shouldUseSandbox && order.sandboxInitPoint) {
    return order.sandboxInitPoint
  }

  return order.initPoint || order.sandboxInitPoint
}
