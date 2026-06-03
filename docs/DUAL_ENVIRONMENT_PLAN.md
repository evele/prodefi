# Plan: test y producción en el mismo proyecto Firebase

## Problema

Un solo proyecto Firebase (`prodefi-f2237`) con dos hostings (`frontend-test` y `frontend-prod`) comparten las mismas Cloud Functions. Actualmente:

1. **`MERCADO_PAGO_ACCESS_TOKEN`** es un único secret — no puede ser sandbox y producción al mismo tiempo.
2. **`MERCADO_PAGO_MINT_ENVIRONMENT`** es un único param — el webhook lo usa globalmente, ignora el `environment` almacenado en cada orden.
3. **`MERCADO_PAGO_WEBHOOK_SECRET`** es un único secret — same issue si hay dos apps de MP.
4. **Dos guías** (`PASOS_PRODUCCION.md` y `PRODUCTION_DEPLOYMENT_GUIDE.md`) que deberían ser una sola.

## Arquitectura target

```
Firebase project: prodefi-f2237
├── Hosting: frontend-test (test-prodefi-front)
│   └── Build: pnpm build:hosting:test (--mode openfort)
│       └── VITE_MERCADO_PAGO_USE_SANDBOX=true
│       └── Envía environment: 'testnet' a createOrder
├── Hosting: frontend-prod (app-prodefi)
│   └── Build: pnpm build:hosting:prod
│       └── VITE_MERCADO_PAGO_USE_SANDBOX=false
│       └── Envía environment: 'mainnet' a createOrder
└── Functions (compartidas)
    ├── createOrder → usa MP token según environment del request
    ├── mercadoPagoWebhook → lee order.environment para elegir mint config
    └── getOrderStatus → sin cambios
```

## Cambios necesarios

### 1. Secrets y params

| Secret | Valor |
|--------|-------|
| `MERCADO_PAGO_ACCESS_TOKEN` | Access token **productivo** (`APP_USR-...`) |
| `MERCADO_PAGO_SANDBOX_ACCESS_TOKEN` | Access token **sandbox** (`TEST-...`) |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Secreto de webhook (único por app de MP) |
| `TEST_MINTER_WALLET_PRIVATE_KEY` | (ya existe) |
| `PROD_MINTER_WALLET_PRIVATE_KEY` | (ya existe) |
| `TEST_MINTER_RPC_URL` | (ya existe) |
| `PROD_MINTER_RPC_URL` | (ya existe) |
| `TEST_MINTER_ENDPOINT_TOKEN` | (ya existe) |
| `PROD_MINTER_ENDPOINT_TOKEN` | (ya existe) |

| Param | Valor |
|-------|-------|
| `TEST_CARTON_ADDRESS` | (ya existe) |
| `TEST_CHAIN_ID` | (ya existe) |
| `PROD_CARTON_ADDRESS` | (ya existe) |
| `PROD_CHAIN_ID` | (ya existe) |
| `MERCADO_PAGO_MINT_ENVIRONMENT` | **Eliminar** — ya no se usa globalmente |
| `MERCADO_PAGO_SUCCESS_URL` | (ya existe, se usa para ambos) |
| `MERCADO_PAGO_PENDING_URL` | (ya existe) |
| `MERCADO_PAGO_FAILURE_URL` | (ya existe) |
| `MERCADO_PAGO_NOTIFICATION_URL` | (ya existe, única para ambos) |

### 2. Frontend: enviar environment en createOrder

En `frontend/src/lib/orders.ts`, la función `createCheckoutOrder` ya envía `walletAddress`, `tournamentId`, etc. Agregar `environment` al body:

```ts
const env = import.meta.env.VITE_MERCADO_PAGO_USE_SANDBOX === 'true' ? 'testnet' : 'mainnet'

body: JSON.stringify({
  walletAddress,
  tournamentId,
  openfortUserId,
  environment: env,
})
```

### 3. Backend: parseCreateOrderPayload

Agregar campo `environment` opcional al parseo (con default `testnet` para atrás compat):

```js
function parseCreateOrderPayload(body) {
  // ... existing fields ...
  const environment = parseOptionalString(body?.environment) || 'testnet'

  if (environment !== 'testnet' && environment !== 'mainnet') {
    return { error: 'invalid-environment' }
  }

  return {
    // ...existing...
    environment,
  }
}
```

### 4. Backend: createOrder usa el token según environment

```js
const accessToken = payload.environment === 'mainnet'
  ? MERCADO_PAGO_ACCESS_TOKEN.value()
  : MERCADO_PAGO_SANDBOX_ACCESS_TOKEN.value()

const runtime = {
  accessToken: getRequiredString(accessToken, 'mercado pago access token'),
  successUrl: ...,
  pendingUrl: ...,
  failureUrl: ...,
  notificationUrl: ...,
}
```

Ya no se necesita `getMercadoPagoPreferenceRuntime()`. El `mintEnvironment` se setea desde `payload.environment`:

```js
const order = {
  // ...
  environment: payload.environment,  // antes: mintEnvironment del global
  // ...
}
```

### 5. Backend: mercadoPagoWebhook rutea por order.environment

El webhook actualmente:

```
runtime = getMercadoPagoWebhookRuntime()  // usa MERCADO_PAGO_MINT_ENVIRONMENT global
mintRuntime = getMinterRuntime(runtime.mintConfig, ...)
```

Cambiar a:

```js
// Después de obtener la orden (orderSnapshot):
const orderData = orderSnapshot.data()
const mintConfig = orderData.environment === 'mainnet'
  ? MAINNET_MINT_CONFIG
  : TESTNET_MINT_CONFIG

const mpAccessToken = orderData.environment === 'mainnet'
  ? MERCADO_PAGO_ACCESS_TOKEN.value()
  : MERCADO_PAGO_SANDBOX_ACCESS_TOKEN.value()

// Usar mpAccessToken para fetchear el payment (si se necesita re-verificar)
// Usar mintConfig para el mint
```

#### Estrategia para fetchear el payment de MP

El webhook recibe `data.id` (paymentId). Para obtener los detalles del pago necesita el access token correcto:

**Opción A (recomendada)**: Intentar con production token primero, verificar `payment.live_mode`. Si es `false`, re-fetchear con sandbox token.

```js
async function fetchPaymentWithFallback(paymentId) {
  try {
    const prodClient = new MercadoPagoConfig({
      accessToken: getRequiredString(MERCADO_PAGO_ACCESS_TOKEN.value(), 'mp prod token')
    })
    const payment = await new Payment(prodClient).get({ id: paymentId })
    if (payment.live_mode) return { payment, environment: 'mainnet' }
  } catch { /* fall through */ }

  const sandboxClient = new MercadoPagoConfig({
    accessToken: getRequiredString(MERCADO_PAGO_SANDBOX_ACCESS_TOKEN.value(), 'mp sandbox token')
  })
  const payment = await new Payment(sandboxClient).get({ id: paymentId })
  return { payment, environment: 'testnet' }
}
```

### 6. Backend: export de createOrder con nuevo secret

```js
exports.createOrder = onRequest(
  {
    cors: true,
    invoker: 'public',
    secrets: [MERCADO_PAGO_ACCESS_TOKEN, MERCADO_PAGO_SANDBOX_ACCESS_TOKEN],
  },
  createOrder
)
```

### 7. Backend: webhook export con ambos tokens

```js
exports.mercadoPagoWebhook = onRequest(
  {
    invoker: 'public',
    secrets: [
      MERCADO_PAGO_ACCESS_TOKEN,
      MERCADO_PAGO_SANDBOX_ACCESS_TOKEN,
      MERCADO_PAGO_WEBHOOK_SECRET,
      TEST_MINTER_WALLET_PRIVATE_KEY,
      TEST_MINTER_RPC_URL,
      PROD_MINTER_WALLET_PRIVATE_KEY,
      PROD_MINTER_RPC_URL,
    ],
  },
  mercadoPagoWebhook
)
```

## Orden de implementación

1. Agregar secret `MERCADO_PAGO_SANDBOX_ACCESS_TOKEN` en Firebase
2. Modificar `parseCreateOrderPayload` para aceptar `environment`
3. Modificar `createOrder` para usar el token según environment
4. Modificar frontend para enviar `environment`
5. Modificar `mercadoPagoWebhook` para rutear por `order.environment`
6. Eliminar dependencia de `MERCADO_PAGO_MINT_ENVIRONMENT` global
7. Probar: build test + build prod + deploy a ambos hostings
8. Consolidar `PASOS_PRODUCCION.md` y `PRODUCTION_DEPLOYMENT_GUIDE.md`

## Notas

- `getOrderStatus` no necesita cambios (solo lee Firestore).
- El webhook de MP tiene una única URL configurada en la app. Sigue siendo la misma.
- `MERCADO_PAGO_WEBHOOK_SECRET` es único por app de MP. Si en el futuro se necesitan dos apps separadas (sandbox y prod), se puede duplicar el webhook export con otra URL.
- `MERCADO_PAGO_MINT_ENVIRONMENT` se vuelve redundante y se puede eliminar de los params una vez migrado.
