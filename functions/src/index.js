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

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function waitlistDocId(email) {
  return crypto.createHash('sha256').update(email).digest('hex')
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

  const email = normalizeEmail(req.body?.email)
  if (!isValidEmail(email)) {
    res.status(400).json({ ok: false, error: 'invalid-email' })
    return
  }

  const docRef = db.collection('waitlist').doc(waitlistDocId(email))
  const userAgent = typeof req.get('user-agent') === 'string' ? req.get('user-agent') : null
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
