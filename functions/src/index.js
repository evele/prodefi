const crypto = require('node:crypto')

const Openfort = require('@openfort/openfort-node').default
const admin = require('firebase-admin')
const logger = require('firebase-functions/logger')
const { defineSecret, defineString } = require('firebase-functions/params')
const { onRequest } = require('firebase-functions/v2/https')
const { setGlobalOptions } = require('firebase-functions/v2')
const { MercadoPagoConfig, Payment, Preference } = require('mercadopago')
const { createPublicClient, createWalletClient, getAddress, http, isAddress } = require('viem')
const { privateKeyToAccount } = require('viem/accounts')
const { base, baseSepolia } = require('viem/chains')

admin.initializeApp()

setGlobalOptions({
  region: 'southamerica-east1',
  maxInstances: 10,
})

const db = admin.firestore()
const { FieldValue } = admin.firestore

const HONEYPOT_FIELD = 'company'
const MIN_FORM_FILL_MS = 1200
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_ATTEMPTS = 10

const TEST_MINTER_WALLET_PRIVATE_KEY = defineSecret('TEST_MINTER_WALLET_PRIVATE_KEY')
const TEST_MINTER_RPC_URL = defineSecret('TEST_MINTER_RPC_URL')
const TEST_MINTER_ENDPOINT_TOKEN = defineSecret('TEST_MINTER_ENDPOINT_TOKEN')
const TEST_CARTON_ADDRESS = defineString('TEST_CARTON_ADDRESS')
const TEST_CHAIN_ID = defineString('TEST_CHAIN_ID')
const OPENFORT_API_KEY = defineSecret('OPENFORT_API_KEY')
const OPENFORT_PUBLISHABLE_KEY = defineString('OPENFORT_PUBLISHABLE_KEY')

const MERCADO_PAGO_ACCESS_TOKEN = defineSecret('MERCADO_PAGO_ACCESS_TOKEN')
const MERCADO_PAGO_SANDBOX_ACCESS_TOKEN = defineSecret('MERCADO_PAGO_SANDBOX_ACCESS_TOKEN')
const MERCADO_PAGO_SUCCESS_URL_TEST = defineString('MERCADO_PAGO_SUCCESS_URL_TEST')
const MERCADO_PAGO_PENDING_URL_TEST = defineString('MERCADO_PAGO_PENDING_URL_TEST')
const MERCADO_PAGO_FAILURE_URL_TEST = defineString('MERCADO_PAGO_FAILURE_URL_TEST')
const MERCADO_PAGO_SUCCESS_URL_PRODUCTION = defineString('MERCADO_PAGO_SUCCESS_URL_PRODUCTION')
const MERCADO_PAGO_PENDING_URL_PRODUCTION = defineString('MERCADO_PAGO_PENDING_URL_PRODUCTION')
const MERCADO_PAGO_FAILURE_URL_PRODUCTION = defineString('MERCADO_PAGO_FAILURE_URL_PRODUCTION')
const MERCADO_PAGO_NOTIFICATION_URL_TEST = defineString('MERCADO_PAGO_NOTIFICATION_URL_TEST')
const MERCADO_PAGO_NOTIFICATION_URL_PRODUCTION = defineString('MERCADO_PAGO_NOTIFICATION_URL_PRODUCTION')
const MERCADO_PAGO_WEBHOOK_SECRET = defineSecret('MERCADO_PAGO_WEBHOOK_SECRET')

const PROD_MINTER_WALLET_PRIVATE_KEY = defineSecret('PROD_MINTER_WALLET_PRIVATE_KEY')
const PROD_MINTER_RPC_URL = defineSecret('PROD_MINTER_RPC_URL')
const PROD_MINTER_ENDPOINT_TOKEN = defineSecret('PROD_MINTER_ENDPOINT_TOKEN')
const PROD_CARTON_ADDRESS = defineString('PROD_CARTON_ADDRESS')
const PROD_CHAIN_ID = defineString('PROD_CHAIN_ID')

const CARTON_MINTER_ABI = [
  {
    type: 'function',
    name: 'mintForTournament',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'tournamentId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
]

const CANONICAL_TESTNET_CARTON_ADDRESS = getAddress('0xDe4AA6BAdD64dDDd494AE6efB86F95aA2DEc420A')

const TESTNET_MINT_CONFIG = {
  environment: 'testnet',
  label: 'Base Sepolia',
  expectedChainId: baseSepolia.id,
  expectedCartonAddress: CANONICAL_TESTNET_CARTON_ADDRESS,
  requestCollection: 'cartonMintRequests_testnet',
  privateKeySecret: TEST_MINTER_WALLET_PRIVATE_KEY,
  rpcUrlSecret: TEST_MINTER_RPC_URL,
  endpointTokenSecret: TEST_MINTER_ENDPOINT_TOKEN,
  cartonAddressParam: TEST_CARTON_ADDRESS,
  chainIdParam: TEST_CHAIN_ID,
}

const MAINNET_MINT_CONFIG = {
  environment: 'mainnet',
  label: 'Base Mainnet',
  expectedChainId: base.id,
  expectedCartonAddress: null, // TODO: add here the right one to validate
  requestCollection: 'cartonMintRequests_mainnet',
  privateKeySecret: PROD_MINTER_WALLET_PRIVATE_KEY,
  rpcUrlSecret: PROD_MINTER_RPC_URL,
  endpointTokenSecret: PROD_MINTER_ENDPOINT_TOKEN,
  cartonAddressParam: PROD_CARTON_ADDRESS,
  chainIdParam: PROD_CHAIN_ID,
}

const ORDERS_COLLECTION = 'orders'
const USER_PROFILES_COLLECTION = 'userProfiles'
const MERCADO_PAGO_ITEM_TITLE = 'Cartón Prodefi'
const MERCADO_PAGO_CURRENCY_ID = 'ARS'
const MERCADO_PAGO_UNIT_PRICE_ARS = 2000
const SUPPORTED_PAYMENT_RAIL = 'fiat_ars'
const SUPPORTED_PAYMENT_PROVIDER = 'mercadopago'
const MERCADO_PAGO_PENDING_STATUSES = new Set(['pending', 'in_process', 'in_mediation'])
const MERCADO_PAGO_FAILURE_STATUSES = new Set(['cancelled', 'rejected', 'refunded', 'charged_back'])
const MERCADO_PAGO_EXCLUDED_PAYMENT_TYPES = [
  'credit_card',
  'prepaid_card',
  'ticket',
  'atm',
  'bank_transfer',
]

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function waitlistDocId(email) {
  return crypto.createHash('sha256').update(email).digest('hex')
}

function getClientIp(req) {
  const forwardedFor = req.get('x-forwarded-for')
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim()
  }

  return typeof req.ip === 'string' ? req.ip.trim() : ''
}

function parseStartedAt(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function getRequiredString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} is not configured`)
  }

  return value.trim()
}

function parsePositiveInteger(value) {
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null
}

function parseRequestId(value) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return trimmed.length > 0 && trimmed.length <= 200 ? trimmed : ''
}

function getBearerToken(req) {
  const authorization = req.get('authorization')
  if (typeof authorization !== 'string') return ''

  const match = authorization.match(/^Bearer\s+(.+)$/i)
  return match ? match[1].trim() : ''
}

function buildMintDocId(environment, requestId) {
  return crypto.createHash('sha256').update(`${environment}:${requestId}`).digest('hex')
}

function buildOrderId() {
  return `ord_${crypto.randomUUID().replace(/-/g, '')}`
}

function resolveChain(chainId, rpcUrl, label) {
  if (chainId === base.id) return base
  if (chainId === baseSepolia.id) return baseSepolia

  return {
    id: chainId,
    name: label,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: [rpcUrl] },
      public: { http: [rpcUrl] },
    },
  }
}

function getMinterRuntime(config, options = {}) {
  const requireEndpointToken = options.requireEndpointToken !== false
  const privateKey = getRequiredString(config.privateKeySecret.value(), `${config.environment} private key`)
  const rpcUrl = getRequiredString(config.rpcUrlSecret.value(), `${config.environment} rpc url`)
  const endpointToken = requireEndpointToken
    ? getRequiredString(config.endpointTokenSecret.value(), `${config.environment} endpoint token`)
    : null
  const cartonAddress = getAddress(getRequiredString(config.cartonAddressParam.value(), `${config.environment} carton address`))
  const chainId = parsePositiveInteger(config.chainIdParam.value())

  if (!chainId) {
    throw new Error(`${config.environment} chain id is not configured`)
  }

  if (chainId !== config.expectedChainId) {
    throw new Error(
      `${config.environment} chain id must be ${config.expectedChainId}, received ${chainId}`
    )
  }

  if (config.expectedCartonAddress && cartonAddress !== config.expectedCartonAddress) {
    throw new Error(
      `${config.environment} carton address must be ${config.expectedCartonAddress}, received ${cartonAddress}`
    )
  }

  const chain = resolveChain(chainId, rpcUrl, config.label)
  const account = privateKeyToAccount(privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`)
  const transport = http(rpcUrl)

  return {
    account,
    chain,
    cartonAddress,
    endpointToken,
    publicClient: createPublicClient({ chain, transport }),
    walletClient: createWalletClient({ account, chain, transport }),
  }
}

function parseMintPayload(body) {
  const requestId = parseRequestId(body?.requestId)
  const tournamentId = parsePositiveInteger(body?.tournamentId)
  const recipientRaw = typeof body?.recipient === 'string' ? body.recipient.trim() : ''

  if (!requestId) {
    return { error: 'invalid-request-id' }
  }

  if (!recipientRaw || !isAddress(recipientRaw)) {
    return { error: 'invalid-recipient' }
  }

  if (!tournamentId) {
    return { error: 'invalid-tournament-id' }
  }

  return {
    requestId,
    recipient: getAddress(recipientRaw),
    tournamentId,
  }
}

function parseOptionalString(value) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function normalizeWalletAddress(value) {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed || !isAddress(trimmed)) return null
  return getAddress(trimmed)
}

function getWalletLookupKey(address) {
  return address.toLowerCase()
}

function parseWalletAddressPayload(body) {
  const walletAddress = normalizeWalletAddress(body?.walletAddress)
  if (!walletAddress) {
    return { error: 'invalid-wallet-address' }
  }

  return { walletAddress }
}

function getOpenfortRuntime() {
  const apiKey = getRequiredString(OPENFORT_API_KEY.value(), 'openfort api key')
  const publishableKey = getRequiredString(OPENFORT_PUBLISHABLE_KEY.value(), 'openfort publishable key')

  return {
    openfort: new Openfort(apiKey, { publishableKey }),
  }
}

async function verifyOpenfortSession(req, runtime) {
  const accessToken = getBearerToken(req)
  if (!accessToken) {
    return { error: 'missing-access-token' }
  }

  try {
    const session = await runtime.openfort.iam.getSession({ accessToken })
    if (!session) {
      return { error: 'invalid-session' }
    }

    return { session }
  } catch (error) {
    logger.warn('openfort session verification failed', { error: serializeError(error) })
    return { error: 'invalid-session' }
  }
}

async function walletBelongsToSessionUser(runtime, sessionUserId, walletAddress) {
  const normalizedWalletLookupKey = getWalletLookupKey(walletAddress)

  try {
    const accounts = await runtime.openfort.accounts.list({
      user: sessionUserId,
      chainType: 'EVM',
      custody: 'User',
      address: walletAddress,
    })

    if (Array.isArray(accounts?.data)) {
      const hasExactUserAccount = accounts.data.some((account) =>
        typeof account?.address === 'string' && getWalletLookupKey(account.address) === normalizedWalletLookupKey
      )

      if (hasExactUserAccount) return true
    }
  } catch (error) {
    logger.warn('openfort account lookup fallback triggered', {
      error: serializeError(error),
      openfortUserId: sessionUserId,
      walletAddress,
    })
  }

  const user = await runtime.openfort.iam.users.get(sessionUserId)
  if (!Array.isArray(user?.linkedAccounts)) return false

  return user.linkedAccounts.some((linkedAccount) =>
    typeof linkedAccount?.accountId === 'string'
    && linkedAccount.accountId.trim().toLowerCase() === normalizedWalletLookupKey
  )
}

async function upsertOpenfortProfile(req, res) {
  res.set('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method-not-allowed' })
    return
  }

  let runtime
  try {
    runtime = getOpenfortRuntime()
  } catch (error) {
    logger.error('openfort runtime config failed', { error: serializeError(error) })
    res.status(500).json({ ok: false, error: 'openfort-config-invalid' })
    return
  }

  const verifiedSession = await verifyOpenfortSession(req, runtime)
  if (verifiedSession.error) {
    res.status(401).json({ ok: false, error: verifiedSession.error })
    return
  }

  const parsed = parseWalletAddressPayload(req.body)
  if (parsed.error) {
    res.status(400).json({ ok: false, error: parsed.error })
    return
  }

  const { walletAddress } = parsed
  const { session } = verifiedSession

  try {
    const belongsToUser = await walletBelongsToSessionUser(runtime, session.user.id, walletAddress)
    if (!belongsToUser) {
      res.status(403).json({ ok: false, error: 'wallet-not-linked-to-user' })
      return
    }

    const walletAddressLower = getWalletLookupKey(walletAddress)
    const email = normalizeEmail(session.user.email)
    const profileRef = db.collection(USER_PROFILES_COLLECTION).doc(walletAddressLower)

    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(profileRef)
      const profilePatch = {
        walletAddress,
        walletAddressLower,
        openfortUserId: session.user.id,
        email: email || null,
        emailNormalized: email || null,
        isActive: true,
        updatedAt: FieldValue.serverTimestamp(),
        lastSeenAt: FieldValue.serverTimestamp(),
      }

      if (!snapshot.exists) {
        transaction.create(profileRef, {
          ...profilePatch,
          createdAt: FieldValue.serverTimestamp(),
        })
        return
      }

      transaction.set(profileRef, profilePatch, { merge: true })
    })

    res.status(200).json({ ok: true })
  } catch (error) {
    logger.error('openfort profile upsert failed', {
      error: serializeError(error),
      walletAddress,
      openfortUserId: session.user.id,
    })
    res.status(500).json({ ok: false, error: 'profile-upsert-failed' })
  }
}

async function resolveGiftRecipientByWallet(req, res) {
  res.set('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method-not-allowed' })
    return
  }

  let runtime
  try {
    runtime = getOpenfortRuntime()
  } catch (error) {
    logger.error('openfort runtime config failed', { error: serializeError(error) })
    res.status(500).json({ ok: false, error: 'openfort-config-invalid' })
    return
  }

  const verifiedSession = await verifyOpenfortSession(req, runtime)
  if (verifiedSession.error) {
    res.status(401).json({ ok: false, error: verifiedSession.error })
    return
  }

  const parsed = parseWalletAddressPayload(req.body)
  if (parsed.error) {
    res.status(400).json({ ok: false, error: parsed.error })
    return
  }

  try {
    const walletAddressLower = getWalletLookupKey(parsed.walletAddress)
    const snapshot = await db.collection(USER_PROFILES_COLLECTION).doc(walletAddressLower).get()

    if (!snapshot.exists) {
      res.status(200).json({ ok: true, eligible: false, reason: 'not-active-user' })
      return
    }

    const data = snapshot.data() || {}
    if (data.isActive !== true) {
      res.status(200).json({ ok: true, eligible: false, reason: 'not-active-user' })
      return
    }

    res.status(200).json({ ok: true, eligible: true })
  } catch (error) {
    logger.error('gift recipient resolution failed', {
      error: serializeError(error),
      walletAddress: parsed.walletAddress,
    })
    res.status(500).json({ ok: false, error: 'gift-recipient-lookup-failed' })
  }
}

function parseCreateOrderPayload(body) {
  const walletAddressRaw = parseOptionalString(body?.walletAddress)
  const tournamentId = parsePositiveInteger(body?.tournamentId)
  const quantity = body?.quantity === undefined ? 1 : parsePositiveInteger(body?.quantity)
  const paymentRail = parseOptionalString(body?.paymentRail) || SUPPORTED_PAYMENT_RAIL
  const openfortUserId = parseOptionalString(body?.openfortUserId)

  if (!walletAddressRaw || !isAddress(walletAddressRaw)) {
    return { error: 'invalid-wallet-address' }
  }

  if (!tournamentId) {
    return { error: 'invalid-tournament-id' }
  }

  if (!quantity) {
    return { error: 'invalid-quantity' }
  }

  if (paymentRail !== SUPPORTED_PAYMENT_RAIL) {
    return { error: 'unsupported-payment-rail' }
  }

  if (quantity !== 1) {
    return { error: 'quantity-not-supported-yet' }
  }

  return {
    walletAddress: getAddress(walletAddressRaw),
    tournamentId,
    quantity,
    paymentRail,
    openfortUserId: openfortUserId || null,
  }
}


function buildCheckoutStatusUrl(baseUrl, orderId) {
  const url = new URL(baseUrl)
  url.searchParams.set('orderId', orderId)
  return url.toString()
}

function shouldUseMercadoPagoAutoReturn(successUrl) {
  try {
    return new URL(successUrl).protocol === 'https:'
  } catch {
    return false
  }
}

function buildOrderResponse(order) {
  return {
    ok: true,
    orderId: order.orderId,
    status: order.status,
    paymentRail: order.paymentRail,
    provider: order.provider,
    walletAddress: order.walletAddress,
    tournamentId: order.tournamentId,
    quantity: order.quantity,
    unitPriceArs: order.unitPriceArs,
    totalAmountArs: order.totalAmountArs,
    initPoint: order.initPoint || null,
    sandboxInitPoint: order.sandboxInitPoint || null,
    paymentId: order.paymentId || null,
    paymentStatus: order.paymentStatus || null,
    paymentStatusDetail: order.paymentStatusDetail || null,
    merchantOrderId: order.merchantOrderId || null,
    liveMode: typeof order.liveMode === 'boolean' ? order.liveMode : null,
    mintTxHash: order.mintTxHash || null,
    lastError: order.lastError || null,
  }
}

async function createMercadoPagoPreference(runtime, order) {
  const client = new MercadoPagoConfig({ accessToken: runtime.accessToken })
  const preference = new Preference(client)
  const successUrl = buildCheckoutStatusUrl(runtime.successUrl, order.orderId)
  const pendingUrl = buildCheckoutStatusUrl(runtime.pendingUrl, order.orderId)
  const failureUrl = buildCheckoutStatusUrl(runtime.failureUrl, order.orderId)
  const preferencePayload = {
    items: [
      {
        id: order.orderId,
        title: MERCADO_PAGO_ITEM_TITLE,
        quantity: order.quantity,
        currency_id: MERCADO_PAGO_CURRENCY_ID,
        unit_price: order.unitPriceArs,
      },
    ],
    external_reference: order.externalReference,
    back_urls: {
      success: successUrl,
      pending: pendingUrl,
      failure: failureUrl,
    },
    payment_methods: {
      excluded_payment_types: MERCADO_PAGO_EXCLUDED_PAYMENT_TYPES.map((id) => ({ id })),
    },
    notification_url: runtime.notificationUrl,
    metadata: {
      orderId: order.orderId,
      walletAddress: order.walletAddress,
      tournamentId: String(order.tournamentId),
      quantity: String(order.quantity),
      ...(order.openfortUserId ? { openfortUserId: order.openfortUserId } : {}),
    },
  }

  if (shouldUseMercadoPagoAutoReturn(successUrl)) {
    preferencePayload.auto_return = 'approved'
  }

  try {
    return await preference.create({
      body: preferencePayload,
      requestOptions: {
        idempotencyKey: order.orderId,
      },
    })
  } catch (error) {
    throw new Error(
      `mercado-pago-preference-failed:${error instanceof Error ? error.message : String(error)}`
    )
  }
}

function serializeError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  return {
    message: String(error),
  }
}

function normalizeMercadoPagoId(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(Math.trunc(value))
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? trimmed : ''
  }

  return ''
}

function parseMercadoPagoSignature(headerValue) {
  const rawValue = typeof headerValue === 'string' ? headerValue.trim() : ''
  if (!rawValue) {
    return { ts: '', v1: '' }
  }

  return rawValue.split(',').reduce(
    (signature, part) => {
      const [keyRaw, valueRaw] = part.split('=', 2)
      const key = keyRaw?.trim().toLowerCase()
      const value = valueRaw?.trim() || ''

      if (key === 'ts') signature.ts = value
      if (key === 'v1') signature.v1 = value.toLowerCase()

      return signature
    },
    { ts: '', v1: '' }
  )
}

function buildMercadoPagoSignatureManifest(paymentId, requestId, timestamp) {
  const parts = []

  if (paymentId) parts.push(`id:${paymentId}`)
  if (requestId) parts.push(`request-id:${requestId}`)
  if (timestamp) parts.push(`ts:${timestamp}`)

  return `${parts.join(';')};`
}

function timingSafeEqualHex(left, right) {
  if (!left || !right) return false

  try {
    const leftBuffer = Buffer.from(left, 'hex')
    const rightBuffer = Buffer.from(right, 'hex')

    if (!leftBuffer.length || leftBuffer.length !== rightBuffer.length) {
      return false
    }

    return crypto.timingSafeEqual(leftBuffer, rightBuffer)
  } catch {
    return false
  }
}

function getMercadoPagoNotificationPaymentId(req) {
  return normalizeMercadoPagoId(req.query?.['data.id']) || normalizeMercadoPagoId(req.body?.data?.id)
}

function verifyMercadoPagoWebhookSignature(req, secret) {
  const { ts, v1 } = parseMercadoPagoSignature(req.get('x-signature'))
  const requestId = parseOptionalString(req.get('x-request-id'))
  const manifest = buildMercadoPagoSignatureManifest(normalizeMercadoPagoId(req.query?.['data.id']), requestId, ts)
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  return timingSafeEqualHex(expectedSignature, v1)
}

async function fetchMercadoPagoPayment(runtime, paymentId) {
  const client = new MercadoPagoConfig({ accessToken: runtime.accessToken })
  const payment = new Payment(client)

  try {
    return await payment.get({ id: paymentId })
  } catch (error) {
    throw new Error(
      `mercado-pago-payment-fetch-failed:${error instanceof Error ? error.message : String(error)}`
    )
  }
}

function getOrderStatusFromMercadoPagoPayment(paymentStatus) {
  if (paymentStatus === 'approved') return 'paid'
  if (MERCADO_PAGO_PENDING_STATUSES.has(paymentStatus)) return 'awaiting_payment_confirmation'
  if (MERCADO_PAGO_FAILURE_STATUSES.has(paymentStatus)) return 'failed'
  return 'awaiting_payment_confirmation'
}

function buildMercadoPagoPaymentPatch(payment) {
  return {
    paymentId: normalizeMercadoPagoId(payment?.id) || null,
    paymentStatus: parseOptionalString(payment?.status) || null,
    paymentStatusDetail: parseOptionalString(payment?.status_detail) || null,
    merchantOrderId: normalizeMercadoPagoId(payment?.order?.id) || null,
    liveMode: typeof payment?.live_mode === 'boolean' ? payment.live_mode : null,
    lastWebhookAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }
}

async function applyMercadoPagoPaymentUpdate(orderRef, paymentPatch) {
  const targetStatus = getOrderStatusFromMercadoPagoPayment(paymentPatch.paymentStatus || '')

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(orderRef)
    if (!snapshot.exists) return

    const currentStatus = parseOptionalString(snapshot.data()?.status)
    const shouldPreserveTerminalState = currentStatus === 'fulfilled' || currentStatus === 'minting'

    transaction.set(
      orderRef,
      {
        ...paymentPatch,
        ...(shouldPreserveTerminalState ? {} : { status: targetStatus }),
      },
      { merge: true }
    )
  })
}

async function reserveOrderForApprovedPayment(orderRef, paymentPatch, orderId) {
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(orderRef)
    if (!snapshot.exists) {
      return { type: 'missing' }
    }

    const existing = snapshot.data() || {}
    const currentStatus = parseOptionalString(existing.status)
    const mintRequestId = parseOptionalString(existing.mintRequestId) || orderId
    const mergedOrder = {
      ...existing,
      ...paymentPatch,
      orderId,
      mintRequestId,
    }

    if (currentStatus === 'fulfilled') {
      transaction.set(orderRef, paymentPatch, { merge: true })
      return { type: 'already-fulfilled', order: mergedOrder }
    }

    if (currentStatus === 'minting') {
      transaction.set(orderRef, paymentPatch, { merge: true })
      return { type: 'already-minting', order: mergedOrder }
    }

    transaction.set(
      orderRef,
      {
        ...paymentPatch,
        status: 'minting',
        mintRequestId,
        lastError: null,
      },
      { merge: true }
    )

    return {
      type: 'reserved',
      order: {
        ...mergedOrder,
        status: 'minting',
      },
    }
  })
}

async function finalizeOrderAsFulfilled(orderRef, paymentPatch, mintRequestId, txHash) {
  await orderRef.set(
    {
      ...paymentPatch,
      status: 'fulfilled',
      mintRequestId,
      mintTxHash: txHash || null,
      fulfilledAt: FieldValue.serverTimestamp(),
      lastError: null,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  )
}

async function keepOrderMinting(orderRef, paymentPatch, mintRequestId, txHash, lastError = null) {
  await orderRef.set(
    {
      ...paymentPatch,
      status: 'minting',
      mintRequestId,
      mintTxHash: txHash || null,
      lastError,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  )
}

async function failOrderAfterApprovedPayment(orderRef, paymentPatch, mintRequestId, errorMessage) {
  await orderRef.set(
    {
      ...paymentPatch,
      status: 'failed',
      mintRequestId,
      lastError: errorMessage,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  )
}

function createOrderHandler(config) {
  return async (req, res) => {
  res.set('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method-not-allowed' })
    return
  }

  let runtime
  try {
    runtime = {
      accessToken: getRequiredString(config.getAccessToken(), 'mercado pago access token'),
      successUrl: getRequiredString(config.getSuccessUrl(), 'mercado pago success url'),
      pendingUrl: getRequiredString(config.getPendingUrl(), 'mercado pago pending url'),
      failureUrl: getRequiredString(config.getFailureUrl(), 'mercado pago failure url'),
      notificationUrl: getRequiredString(config.getNotificationUrl(), 'mercado pago notification url'),
    }
  } catch (error) {
    logger.error('mercado pago config failed', { error: serializeError(error) })
    res.status(500).json({ ok: false, error: 'mercado-pago-config-invalid' })
    return
  }

  const payload = parseCreateOrderPayload(req.body)
  if (payload.error) {
    res.status(400).json({ ok: false, error: payload.error })
    return
  }

  const orderId = buildOrderId()
  const orderRef = db.collection(ORDERS_COLLECTION).doc(orderId)
  const order = {
    orderId,
    status: 'pending_payment',
    environment: config.environment,
    paymentRail: payload.paymentRail,
    provider: SUPPORTED_PAYMENT_PROVIDER,
    tournamentId: payload.tournamentId,
    walletAddress: payload.walletAddress,
    quantity: payload.quantity,
    unitPriceArs: MERCADO_PAGO_UNIT_PRICE_ARS,
    totalAmountArs: MERCADO_PAGO_UNIT_PRICE_ARS * payload.quantity,
    title: MERCADO_PAGO_ITEM_TITLE,
    currencyId: MERCADO_PAGO_CURRENCY_ID,
    externalReference: orderId,
    openfortUserId: payload.openfortUserId,
  }

  try {
    await orderRef.set({
      ...order,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    const preference = await createMercadoPagoPreference(runtime, order)

    await orderRef.set(
      {
        preferenceId: preference.id || null,
        initPoint: preference.init_point || null,
        sandboxInitPoint: preference.sandbox_init_point || null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    )

    res.status(201).json(
      buildOrderResponse({
        ...order,
        initPoint: preference.init_point || null,
        sandboxInitPoint: preference.sandbox_init_point || null,
      })
    )
  } catch (error) {
    const errorDetails = serializeError(error)
    logger.error('create order failed', {
      error: errorDetails,
      tournamentId: payload.tournamentId,
      walletAddress: payload.walletAddress,
      quantity: payload.quantity,
      orderId,
    })

    await orderRef.set(
      {
        ...order,
        status: 'failed',
        lastError: errorDetails.message,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    )

    res.status(500).json({ ok: false, error: 'create-order-failed' })
  }
  }
}

async function getOrderStatus(req, res) {
  res.set('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'method-not-allowed' })
    return
  }

  const orderId = parseOptionalString(req.query?.orderId)
  if (!orderId) {
    res.status(400).json({ ok: false, error: 'missing-order-id' })
    return
  }

  const snapshot = await db.collection(ORDERS_COLLECTION).doc(orderId).get()
  if (!snapshot.exists) {
    res.status(404).json({ ok: false, error: 'order-not-found' })
    return
  }

  const data = snapshot.data() || {}
  res.status(200).json(buildOrderResponse(data))
}

function buildExistingMintResponse(existing) {
  const txHash = typeof existing.txHash === 'string' ? existing.txHash : null

  if (existing.status === 'confirmed') {
    return {
      httpStatus: 200,
      body: {
        ok: true,
        status: 'already-confirmed',
        txHash,
      },
    }
  }

  return {
    httpStatus: 202,
    body: {
      ok: true,
      status: existing.status || 'pending',
      txHash,
    },
  }
}

async function submitMintRequest(config, runtime, payload) {
  const requestRef = db.collection(config.requestCollection).doc(buildMintDocId(config.environment, payload.requestId))
  const reservation = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(requestRef)

    if (snapshot.exists) {
      const existing = snapshot.data() || {}
      if (['pending', 'submitted', 'confirmed'].includes(existing.status)) {
        return { type: 'existing', data: existing }
      }

      transaction.update(requestRef, {
        requestId: payload.requestId,
        recipient: payload.recipient,
        tournamentId: payload.tournamentId,
        environment: config.environment,
        chainId: runtime.chain.id,
        cartonAddress: runtime.cartonAddress,
        minterAddress: runtime.account.address,
        status: 'pending',
        txHash: null,
        lastError: null,
        updatedAt: FieldValue.serverTimestamp(),
      })

      return { type: 'reserved' }
    }

    transaction.create(requestRef, {
      requestId: payload.requestId,
      recipient: payload.recipient,
      tournamentId: payload.tournamentId,
      environment: config.environment,
      chainId: runtime.chain.id,
      cartonAddress: runtime.cartonAddress,
      minterAddress: runtime.account.address,
      status: 'pending',
      txHash: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return { type: 'reserved' }
  })

  if (reservation.type === 'existing') {
    return buildExistingMintResponse(reservation.data).body
  }

  let txHash = null

  try {
    const liveChainId = await runtime.publicClient.getChainId()
    if (liveChainId !== config.expectedChainId) {
      throw new Error(`unexpected chain id ${liveChainId}; expected ${config.expectedChainId}`)
    }

    txHash = await runtime.walletClient.writeContract({
      address: runtime.cartonAddress,
      abi: CARTON_MINTER_ABI,
      functionName: 'mintForTournament',
      args: [payload.recipient, BigInt(payload.tournamentId), 1n, '0x'],
    })

    await requestRef.update({
      status: 'submitted',
      txHash,
      updatedAt: FieldValue.serverTimestamp(),
    })

    const receipt = await runtime.publicClient.waitForTransactionReceipt({ hash: txHash })
    if (receipt.status !== 'success') {
      throw new Error(`mint transaction ended with status ${receipt.status}`)
    }

    await requestRef.update({
      status: 'confirmed',
      txHash,
      blockNumber: receipt.blockNumber.toString(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return {
      ok: true,
      status: 'confirmed',
      environment: config.environment,
      requestId: payload.requestId,
      txHash,
    }
  } catch (error) {
    logger.error(`carton mint failed: ${config.environment}`, {
      error: serializeError(error),
      requestId: payload.requestId,
      recipient: payload.recipient,
      tournamentId: payload.tournamentId,
      txHash,
    })

    await requestRef.set(
      {
        status: txHash ? 'submitted' : 'failed',
        txHash,
        lastError: error instanceof Error ? error.message : 'unknown-error',
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    )

    if (txHash) {
      return {
        ok: false,
        status: 'submitted',
        environment: config.environment,
        requestId: payload.requestId,
        txHash,
        error: 'mint-submitted-check-firestore',
      }
    }

    throw error
  }
}

function createMintHandler(config) {
  return onRequest(
    {
      cors: true,
      invoker: 'public',
      secrets: [config.privateKeySecret, config.rpcUrlSecret, config.endpointTokenSecret],
    },
    async (req, res) => {
      res.set('Cache-Control', 'no-store')

      if (req.method === 'OPTIONS') {
        res.status(204).send('')
        return
      }

      if (req.method !== 'POST') {
        res.status(405).json({ ok: false, error: 'method-not-allowed' })
        return
      }

      let runtime
      try {
        runtime = getMinterRuntime(config)
      } catch (error) {
        logger.error(`mint config failed: ${config.environment}`, { error: serializeError(error) })
        res.status(500).json({ ok: false, error: 'minter-config-invalid' })
        return
      }

      const providedToken = getBearerToken(req)
      if (!providedToken || providedToken !== runtime.endpointToken) {
        res.status(401).json({ ok: false, error: 'unauthorized' })
        return
      }

      const payload = parseMintPayload(req.body)
      if (payload.error) {
        res.status(400).json({ ok: false, error: payload.error })
        return
      }

      try {
        const result = await submitMintRequest(config, runtime, payload)
        const httpStatus = result.status === 'confirmed' || result.status === 'already-confirmed' ? 200 : 202
        res.status(httpStatus).json(result)
      } catch (error) {
        logger.error(`mint handler failed: ${config.environment}`, {
          error: serializeError(error),
          requestId: payload.requestId,
        })
        res.status(500).json({ ok: false, error: 'mint-failed' })
      }
    }
  )
}

function createWebhookHandler(config) {
  return async (req, res) => {
  res.set('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method-not-allowed' })
    return
  }

  let runtime
  try {
    runtime = {
      accessToken: getRequiredString(config.getAccessToken(), 'mercado pago access token'),
      webhookSecret: getRequiredString(config.getWebhookSecret(), 'mercado pago webhook secret'),
      mintConfig: config.mintConfig,
    }
  } catch (error) {
    logger.error('mercado pago webhook config failed', { error: serializeError(error) })
    res.status(500).json({ ok: false, error: 'mercado-pago-webhook-config-invalid' })
    return
  }

  const notificationType = parseOptionalString(req.query?.type) || parseOptionalString(req.body?.type)
  if (notificationType && notificationType !== 'payment') {
    res.status(200).json({ ok: true, ignored: true, reason: 'unsupported-notification-type' })
    return
  }

  const paymentId = getMercadoPagoNotificationPaymentId(req)
  if (!paymentId) {
    res.status(200).json({ ok: true, ignored: true, reason: 'missing-payment-id' })
    return
  }

  if (!verifyMercadoPagoWebhookSignature(req, runtime.webhookSecret)) {
    if (config.requireSignature) {
      logger.warn('mercado pago webhook signature mismatch', { paymentId })
      res.status(401).json({ ok: false, error: 'invalid-signature' })
      return
    }
    // En sandbox, MP firma con el secreto de la credencial de test (distinto al
    // configurado), asi que no rechazamos: la autorizacion real es el fetch del
    // pago contra la API de MP + el match contra la orden en la DB.
    logger.warn('mercado pago webhook signature mismatch (test, validating via API)', { paymentId })
  }

  let orderRef = null
  let paymentPatch = null
  let mintRequestId = ''

  try {
    const payment = await fetchMercadoPagoPayment(runtime, paymentId)
    paymentPatch = buildMercadoPagoPaymentPatch(payment)

    const externalReference = parseOptionalString(payment?.external_reference)
    if (!externalReference) {
      logger.warn('mercado pago payment missing external reference', { paymentId, paymentStatus: paymentPatch.paymentStatus })
      res.status(200).json({ ok: true, ignored: true, reason: 'missing-external-reference' })
      return
    }

    orderRef = db.collection(ORDERS_COLLECTION).doc(externalReference)
    const orderSnapshot = await orderRef.get()
    if (!orderSnapshot.exists) {
      logger.warn('mercado pago order not found', { paymentId, externalReference })
      res.status(200).json({ ok: true, ignored: true, reason: 'order-not-found' })
      return
    }

    if (paymentPatch.paymentStatus !== 'approved') {
      await applyMercadoPagoPaymentUpdate(orderRef, paymentPatch)
      res.status(200).json({ ok: true, status: paymentPatch.paymentStatus || 'updated' })
      return
    }

    const mintReservation = await reserveOrderForApprovedPayment(orderRef, paymentPatch, externalReference)
    if (mintReservation.type === 'missing') {
      res.status(200).json({ ok: true, ignored: true, reason: 'order-not-found' })
      return
    }

    if (mintReservation.type === 'already-fulfilled') {
      res.status(200).json({ ok: true, status: 'fulfilled' })
      return
    }

    if (mintReservation.type === 'already-minting') {
      res.status(200).json({ ok: true, status: 'minting' })
      return
    }

    const order = mintReservation.order
    mintRequestId = order.mintRequestId
    const mintRuntime = getMinterRuntime(runtime.mintConfig, { requireEndpointToken: false })
    const mintResult = await submitMintRequest(runtime.mintConfig, mintRuntime, {
      requestId: order.mintRequestId,
      recipient: getAddress(order.walletAddress),
      tournamentId: Number(order.tournamentId),
    })

    if (mintResult.status === 'confirmed' || mintResult.status === 'already-confirmed') {
      await finalizeOrderAsFulfilled(orderRef, paymentPatch, order.mintRequestId, mintResult.txHash || null)
      res.status(200).json({ ok: true, status: 'fulfilled', txHash: mintResult.txHash || null })
      return
    }

    await keepOrderMinting(
      orderRef,
      paymentPatch,
      order.mintRequestId,
      mintResult.txHash || null,
      typeof mintResult.error === 'string' ? mintResult.error : null
    )
    res.status(202).json({ ok: true, status: 'minting', txHash: mintResult.txHash || null })
  } catch (error) {
    logger.error('mercado pago webhook failed', {
      error: serializeError(error),
      paymentId,
      mintRequestId,
    })

    if (orderRef && paymentPatch && mintRequestId) {
      await failOrderAfterApprovedPayment(
        orderRef,
        paymentPatch,
        mintRequestId,
        error instanceof Error ? error.message : 'mercado-pago-webhook-failed'
      )
    }

    res.status(500).json({ ok: false, error: 'mercado-pago-webhook-failed' })
  }
  }
}

async function enforceRateLimit(rateLimitKey, userAgent, now) {
  const rateLimitRef = db.collection('waitlistRateLimits').doc(rateLimitKey)

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(rateLimitRef)

    let count = 1
    let windowStartedAt = now

    if (snapshot.exists) {
      const data = snapshot.data() || {}
      const existingCount = typeof data.count === 'number' ? data.count : 0
      const existingWindowStartedAt = typeof data.windowStartedAt === 'number' ? data.windowStartedAt : 0

      if (now - existingWindowStartedAt < RATE_LIMIT_WINDOW_MS) {
        if (existingCount >= RATE_LIMIT_MAX_ATTEMPTS) {
          throw new Error('rate-limit-exceeded')
        }

        count = existingCount + 1
        windowStartedAt = existingWindowStartedAt
      }
    }

    transaction.set(
      rateLimitRef,
      {
        count,
        windowStartedAt,
        userAgent,
        updatedAt: FieldValue.serverTimestamp(),
        expireAt: new Date(windowStartedAt + RATE_LIMIT_WINDOW_MS * 2),
      },
      { merge: true }
    )
  })
}

exports.waitlist = onRequest({ cors: true, invoker: 'public' }, async (req, res) => {
  res.set('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method-not-allowed' })
    return
  }

  const userAgent = typeof req.get('user-agent') === 'string' ? req.get('user-agent') : null
  const clientIp = getClientIp(req)
  const rateLimitKey = waitlistDocId(clientIp || userAgent || 'unknown')
  const now = Date.now()

  try {
    await enforceRateLimit(rateLimitKey, userAgent, now)
  } catch (error) {
    if (error instanceof Error && error.message === 'rate-limit-exceeded') {
      res.status(429).json({ ok: false, error: 'rate-limit-exceeded' })
      return
    }

    logger.error('waitlist rate limit failed', { error })
    res.status(500).json({ ok: false, error: 'internal' })
    return
  }

  const honeypotValue = typeof req.body?.[HONEYPOT_FIELD] === 'string' ? req.body[HONEYPOT_FIELD].trim() : ''
  const startedAt = parseStartedAt(req.body?.startedAt)
  const submittedTooFast = !startedAt || startedAt > now || now - startedAt < MIN_FORM_FILL_MS

  if (honeypotValue || submittedTooFast) {
    res.status(202).json({ ok: true, status: 'accepted' })
    return
  }

  const email = normalizeEmail(req.body?.email)
  if (!isValidEmail(email)) {
    res.status(400).json({ ok: false, error: 'invalid-email' })
    return
  }

  const docRef = db.collection('waitlist').doc(waitlistDocId(email))
  let created = false

  try {
    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(docRef)

      if (snapshot.exists) {
        transaction.update(docRef, {
          updatedAt: FieldValue.serverTimestamp(),
          userAgent,
          submissions: FieldValue.increment(1),
        })
        return
      }

      created = true
      transaction.set(docRef, {
        email,
        source: 'landing',
        status: 'pending',
        submissions: 1,
        userAgent,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })
    })

    res.status(created ? 201 : 200).json({
      ok: true,
      status: created ? 'created' : 'already-exists',
    })
  } catch (error) {
    logger.error('waitlist signup failed', { error })
    res.status(500).json({ ok: false, error: 'internal' })
  }
})

exports.createOrderTest = onRequest(
  {
    cors: true,
    invoker: 'public',
    secrets: [MERCADO_PAGO_SANDBOX_ACCESS_TOKEN],
  },
  createOrderHandler({
    environment: 'testnet',
    getAccessToken: () => MERCADO_PAGO_SANDBOX_ACCESS_TOKEN.value(),
    getSuccessUrl: () => MERCADO_PAGO_SUCCESS_URL_TEST.value(),
    getPendingUrl: () => MERCADO_PAGO_PENDING_URL_TEST.value(),
    getFailureUrl: () => MERCADO_PAGO_FAILURE_URL_TEST.value(),
    getNotificationUrl: () => MERCADO_PAGO_NOTIFICATION_URL_TEST.value(),
  })
)

exports.createOrderProduction = onRequest(
  {
    cors: true,
    invoker: 'public',
    secrets: [MERCADO_PAGO_ACCESS_TOKEN],
  },
  createOrderHandler({
    environment: 'mainnet',
    getAccessToken: () => MERCADO_PAGO_ACCESS_TOKEN.value(),
    getSuccessUrl: () => MERCADO_PAGO_SUCCESS_URL_PRODUCTION.value(),
    getPendingUrl: () => MERCADO_PAGO_PENDING_URL_PRODUCTION.value(),
    getFailureUrl: () => MERCADO_PAGO_FAILURE_URL_PRODUCTION.value(),
    getNotificationUrl: () => MERCADO_PAGO_NOTIFICATION_URL_PRODUCTION.value(),
  })
)

exports.upsertOpenfortProfile = onRequest(
  {
    cors: true,
    invoker: 'public',
    secrets: [OPENFORT_API_KEY],
  },
  upsertOpenfortProfile
)

exports.resolveGiftRecipientByWallet = onRequest(
  {
    cors: true,
    invoker: 'public',
    secrets: [OPENFORT_API_KEY],
  },
  resolveGiftRecipientByWallet
)

exports.getOrderStatus = onRequest({ cors: true, invoker: 'public' }, getOrderStatus)

exports.mercadoPagoWebhookTest = onRequest(
  {
    invoker: 'public',
    secrets: [
      MERCADO_PAGO_SANDBOX_ACCESS_TOKEN,
      MERCADO_PAGO_WEBHOOK_SECRET,
      TEST_MINTER_WALLET_PRIVATE_KEY,
      TEST_MINTER_RPC_URL,
      TEST_MINTER_ENDPOINT_TOKEN,
    ],
  },
  createWebhookHandler({
    mintConfig: TESTNET_MINT_CONFIG,
    requireSignature: false,
    getAccessToken: () => MERCADO_PAGO_SANDBOX_ACCESS_TOKEN.value(),
    getWebhookSecret: () => MERCADO_PAGO_WEBHOOK_SECRET.value(),
  })
)

exports.mercadoPagoWebhookProduction = onRequest(
  {
    invoker: 'public',
    secrets: [
      MERCADO_PAGO_ACCESS_TOKEN,
      MERCADO_PAGO_WEBHOOK_SECRET,
      PROD_MINTER_WALLET_PRIVATE_KEY,
      PROD_MINTER_RPC_URL,
      PROD_MINTER_ENDPOINT_TOKEN,
    ],
  },
  createWebhookHandler({
    mintConfig: MAINNET_MINT_CONFIG,
    requireSignature: true,
    getAccessToken: () => MERCADO_PAGO_ACCESS_TOKEN.value(),
    getWebhookSecret: () => MERCADO_PAGO_WEBHOOK_SECRET.value(),
  })
)

exports.mintCartonTestnet = createMintHandler(TESTNET_MINT_CONFIG)
exports.mintCartonMainnet = createMintHandler(MAINNET_MINT_CONFIG)

const CARTON_METADATA_ABI = [
  {
    type: 'function',
    name: 'variantByTokenId',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint16' }],
  },
]

const CARTON_METADATA_IMAGE_BASE =
  'https://storage.googleapis.com/prodefi-f2237.appspot.com/carton-metadata/images'

async function cartonMetadataHandler(req, res) {
  res.set('Cache-Control', 'public, max-age=300')

  const rawId = req.path.replace(/^\//, '') || parseOptionalString(req.query?.id)
  if (!rawId) {
    res.status(400).json({ error: 'missing-token-id' })
    return
  }

  let tokenId
  try {
    tokenId = BigInt(rawId.startsWith('0x') || rawId.startsWith('0X') ? rawId : `0x${rawId}`)
    if (tokenId < 0n) throw new Error('negative')
  } catch {
    res.status(400).json({ error: 'invalid-token-id' })
    return
  }

  let variant = 0
  try {
    const client = createPublicClient({
      chain: base,
      transport: http('https://mainnet.base.org'),
    })
    const result = await client.readContract({
      address: MAINNET_MINT_CONFIG.cartonAddressParam.value(),
      abi: CARTON_METADATA_ABI,
      functionName: 'variantByTokenId',
      args: [tokenId],
    })
    variant = Number(result)
  } catch (error) {
    logger.warn('carton metadata variant lookup failed', { tokenId: tokenId.toString(), error: serializeError(error) })
  }

  res.status(200).json({
    name: `Cartón Prodefi #${tokenId.toString()}`,
    description: 'Cartón del Prodefi Mundial 2026.',
    image: `${CARTON_METADATA_IMAGE_BASE}/variant-${variant}.png`,
    attributes: [
      { trait_type: 'Variant', value: String(variant) },
    ],
  })
}

exports.cartonMetadata = onRequest(
  { cors: true, invoker: 'public' },
  cartonMetadataHandler
)
