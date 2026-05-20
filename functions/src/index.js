const crypto = require('node:crypto')

const admin = require('firebase-admin')
const logger = require('firebase-functions/logger')
const { defineSecret, defineString } = require('firebase-functions/params')
const { onRequest } = require('firebase-functions/v2/https')
const { setGlobalOptions } = require('firebase-functions/v2')
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

const CANONICAL_TESTNET_CARTON_ADDRESS = getAddress('0xC4be278Cf2FF8B231e89753e2027d6f51F29C998')

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
  expectedCartonAddress: null,
  requestCollection: 'cartonMintRequests_mainnet',
  privateKeySecret: PROD_MINTER_WALLET_PRIVATE_KEY,
  rpcUrlSecret: PROD_MINTER_RPC_URL,
  endpointTokenSecret: PROD_MINTER_ENDPOINT_TOKEN,
  cartonAddressParam: PROD_CARTON_ADDRESS,
  chainIdParam: PROD_CHAIN_ID,
}

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

function getMinterRuntime(config) {
  const privateKey = getRequiredString(config.privateKeySecret.value(), `${config.environment} private key`)
  const rpcUrl = getRequiredString(config.rpcUrlSecret.value(), `${config.environment} rpc url`)
  const endpointToken = getRequiredString(config.endpointTokenSecret.value(), `${config.environment} endpoint token`)
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
        logger.error(`mint config failed: ${config.environment}`, { error })
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
        const existingResponse = buildExistingMintResponse(reservation.data)
        res.status(existingResponse.httpStatus).json(existingResponse.body)
        return
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

        res.status(200).json({
          ok: true,
          status: 'confirmed',
          environment: config.environment,
          requestId: payload.requestId,
          txHash,
        })
      } catch (error) {
        const errorDetails = error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : {
              message: String(error),
            }

        logger.error(`carton mint failed: ${config.environment}`, {
          error: errorDetails,
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
          res.status(202).json({
            ok: false,
            status: 'submitted',
            environment: config.environment,
            requestId: payload.requestId,
            txHash,
            error: 'mint-submitted-check-firestore',
          })
          return
        }

        res.status(500).json({ ok: false, error: 'mint-failed' })
      }
    }
  )
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

exports.mintCartonTestnet = createMintHandler(TESTNET_MINT_CONFIG)
exports.mintCartonMainnet = createMintHandler(MAINNET_MINT_CONFIG)
