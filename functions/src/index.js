const crypto = require('node:crypto')

const admin = require('firebase-admin')
const logger = require('firebase-functions/logger')
const { onRequest } = require('firebase-functions/v2/https')
const { setGlobalOptions } = require('firebase-functions/v2')

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
