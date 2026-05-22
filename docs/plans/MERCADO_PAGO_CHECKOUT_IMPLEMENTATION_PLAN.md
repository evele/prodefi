# Mercado Pago Checkout Implementation Plan

## Objective

Implement the user-facing carton purchase flow with two payment rails inside a single purchase modal:

1. `ARS offchain` via Mercado Pago
2. `USDC onchain` via the existing contract flow

The ARS rail must create an order in Firebase, redirect the user to Mercado Pago, receive payment confirmation back in Firebase, and mint the carton automatically to the already-connected wallet after an approved payment.

## Locked Product Decisions

- The main CTA on the home page remains a single `Comprar cartón` entrypoint.
- Clicking that CTA opens a modal with two payment paths instead of rendering multiple main buttons on the page.
- Paying in ARS still requires a connected wallet.
- The destination wallet is frozen when the order is created and is the wallet that receives the minted carton.
- The existing `USDC` onchain rail stays available inside the modal.
- The ARS rail must mint automatically after payment approval.
- This implementation should not depend on Mercado Pago SDKs for now.

## Why No SDK Is Required Right Now

The current product goal is:

1. user clicks buy
2. frontend calls Firebase
3. Firebase creates a Mercado Pago preference
4. frontend redirects to Mercado Pago
5. Mercado Pago notifies Firebase
6. Firebase validates payment state
7. Firebase mints the carton

That flow can be implemented with direct HTTP calls to Mercado Pago.

Useful consequences:

- no frontend SDK is required just to redirect the user to checkout
- no backend SDK is required just to create preferences or query payments
- the source of truth remains Firebase + Firestore, not the browser redirect

## Current State

Already implemented:

- `functions/src/index.js` exposes `createOrder`
- `createOrder` creates a Mercado Pago preference
- the returned payload already includes `initPoint` and `sandboxInitPoint`
- Firestore `orders` documents are already being created for the ARS rail spike
- backend mint handlers already exist for:
  - `mintCartonTestnet`
  - `mintCartonMainnet`

Not implemented yet:

- frontend ARS purchase flow
- purchase modal with both rails
- Mercado Pago webhook endpoint
- `notification_url` in the created preference
- payment verification and order resolution after notification
- automatic mint trigger from approved ARS payments
- checkout result/status screen in the frontend

## Target User Experience

### Home CTA

Keep a single main CTA:

- `Comprar cartón`

### Purchase Modal

Opening the CTA shows a modal with two paths.

#### 1. ARS Rail

Show:

- label: `Pagar en pesos`
- copy explaining that payment happens with Mercado Pago
- a short note that the carton will be minted to the connected wallet
- the ARS amount

Primary action:

- `Continuar con Mercado Pago`

#### 2. USDC Rail

Show:

- label: `Pagar con USDC`
- current onchain price
- existing allowance and approval flow
- gas reminder when applicable

Actions:

- `Aprobar USDC`
- `Comprar con USDC`

### Wallet Requirement

The modal should not present ARS as a guest checkout.

If the wallet is not connected:

- disable both paths as appropriate
- explain that the connected wallet is required because the minted carton will be delivered there

This is not optional behavior; it is a product rule.

## Backend Plan

## Required Configuration

### Frontend

Required Vite envs:

- `VITE_FIREBASE_FUNCTIONS_BASE_URL`
- `VITE_MERCADO_PAGO_USE_SANDBOX`

### Firebase Functions

Required Mercado Pago config:

- secret: `MERCADO_PAGO_ACCESS_TOKEN`
- secret: `MERCADO_PAGO_WEBHOOK_SECRET`
- param: `MERCADO_PAGO_SUCCESS_URL`
- param: `MERCADO_PAGO_PENDING_URL`
- param: `MERCADO_PAGO_FAILURE_URL`
- param: `MERCADO_PAGO_NOTIFICATION_URL`
- param: `MERCADO_PAGO_MINT_ENVIRONMENT`

Required mint config depends on the selected environment:

- testnet path:
  - secret: `TEST_MINTER_WALLET_PRIVATE_KEY`
  - secret: `TEST_MINTER_RPC_URL`
  - secret: `TEST_MINTER_ENDPOINT_TOKEN`
  - param: `TEST_CARTON_ADDRESS`
  - param: `TEST_CHAIN_ID`
- mainnet path:
  - secret: `PROD_MINTER_WALLET_PRIVATE_KEY`
  - secret: `PROD_MINTER_RPC_URL`
  - secret: `PROD_MINTER_ENDPOINT_TOKEN`
  - param: `PROD_CARTON_ADDRESS`
  - param: `PROD_CHAIN_ID`

### 1. Keep `createOrder` as the Order Entry Point

Frontend calls Firebase `createOrder` with:

- `walletAddress`
- `tournamentId`
- `quantity: 1`
- `paymentRail: "fiat_ars"`
- `openfortUserId` when available

At order creation time, Firebase must persist:

- `orderId`
- `walletAddress`
- `tournamentId`
- `quantity`
- `paymentRail`
- `provider`
- `externalReference`
- `unitPriceArs`
- `totalAmountArs`
- initial order status

### 2. Add `notification_url` to the Preference

`createOrder` should add a Mercado Pago `notification_url` that points to the Firebase webhook endpoint.

This is required so Mercado Pago can notify the backend about payment creation and payment status changes.

Important:

- `back_urls` are for UX only
- `notification_url` is for backend state reconciliation
- the backend must not trust the browser redirect alone to mark an order as paid

### 3. Add `mercadoPagoWebhook`

Create a new public HTTPS Firebase function:

- `mercadoPagoWebhook`

Responsibilities:

1. receive Mercado Pago webhook requests
2. validate request authenticity using the webhook secret and `x-signature`
3. extract `data.id` for the payment notification
4. fetch the real payment details from Mercado Pago using the backend access token
5. locate the Firestore order using `external_reference`
6. update the order with normalized payment data
7. if payment is finally `approved`, move the order toward minting

### 4. Payment Verification Model

Do not resolve orders from raw webhook payload alone.

Canonical verification flow:

1. webhook arrives
2. backend validates signature
3. backend reads `paymentId`
4. backend fetches payment details from Mercado Pago API
5. backend reads `external_reference`
6. backend resolves the canonical Firestore order
7. backend applies status transitions from verified payment data

This keeps Firestore as the source of truth.

### 5. Automatic Mint After Approved ARS Payment

When a verified ARS payment reaches final approved state:

1. mark the order as `paid`
2. transition the order to `minting`
3. trigger the server-side mint flow
4. write mint transaction data back into the order
5. mark the order as `fulfilled` only after the mint is confirmed

Reuse the existing Firebase mint infrastructure.

Preferred first environment:

- `mintCartonTestnet` for Base Sepolia

Later production path:

- `mintCartonMainnet`

## Frontend Plan

### 1. Replace the Current Single-Rail Buy Block

The current home buy section is USDC-only. Replace that UX with:

- one `Comprar cartón` button
- one modal with both payment options

The USDC purchase logic can be reused inside the new modal.

### 2. Add ARS Order Creation Call

For the ARS path:

1. call Firebase `createOrder`
2. receive order payload with `orderId`, `initPoint`, `sandboxInitPoint`
3. redirect the user to the correct Mercado Pago URL

Environment behavior:

- use `sandboxInitPoint` during test mode
- use `initPoint` in production mode

### 3. Add Checkout Result Route

Create a frontend route such as:

- `/checkout/result`

Mercado Pago `back_urls` should return the user there with `orderId` attached.

The route should:

1. read `orderId`
2. query Firebase `getOrderStatus`
3. show the current order state
4. poll briefly while the order is still unresolved

Suggested user-facing states:

- `Esperando pago`
- `Pago acreditado`
- `Emitiendo cartón`
- `Cartón listo`
- `Pago rechazado`

## Order State Model

Recommended ARS order states:

1. `pending_payment`
2. `awaiting_payment_confirmation`
3. `paid`
4. `minting`
5. `fulfilled`
6. `failed`

Suggested Firestore fields to keep on the order:

- `orderId`
- `status`
- `paymentRail`
- `provider`
- `walletAddress`
- `tournamentId`
- `quantity`
- `unitPriceArs`
- `totalAmountArs`
- `externalReference`
- `preferenceId`
- `initPoint`
- `sandboxInitPoint`
- `paymentId`
- `paymentStatus`
- `paymentStatusDetail`
- `merchantOrderId`
- `liveMode`
- `lastWebhookAt`
- `mintRequestId`
- `mintTxHash`
- `fulfilledAt`
- `lastError`

## Idempotency and Safety Rules

These are mandatory for the ARS rail.

1. Duplicate webhooks must not mint twice.
2. Duplicate payment confirmations must not fulfill twice.
3. The frozen wallet address from order creation must be the only mint destination.
4. The order must not be fulfilled from browser redirect parameters alone.
5. Only a final verified `approved` payment can trigger minting.
6. `pending` or `rejected` payments must never mint.

Implementation direction:

- use Firestore order status transitions as the coordination layer
- persist `paymentId` and `mintRequestId`
- short-circuit safely if the order is already `minting` or `fulfilled`

## Testing Notes

### Checkout UI Testing

For Mercado Pago test purchases:

- use test credentials
- use a buyer test account
- open the checkout in an incognito window
- prefer `sandboxInitPoint`

### Webhook Testing Caveat

Mercado Pago documentation notes that payments created with test credentials do not send real payment notifications automatically.

Therefore:

- the webhook endpoint should be tested using Mercado Pago's webhook simulation tools from the developer panel
- the redirect flow and frontend state handling can still be tested with test purchases

### Mint Testing

Once the order reaches verified approved state in the test environment:

- Firebase should call `mintCartonTestnet`
- the destination wallet should receive the carton on Base Sepolia
- the resulting mint transaction hash should be stored in Firestore

## Recommended Implementation Order

1. create a reusable purchase modal component with two rails
2. move the existing USDC flow into the modal
3. wire the ARS button to Firebase `createOrder`
4. add `notification_url` support in Mercado Pago preference creation
5. implement `mercadoPagoWebhook`
6. implement verified payment lookup and Firestore order updates
7. trigger automatic minting for approved ARS payments
8. add `/checkout/result` and polling UI
9. run end-to-end testing in sandbox + webhook simulation

## Final Product Shape

The intended final purchase experience is:

1. user clicks `Comprar cartón`
2. modal opens with `Pagar en pesos` and `Pagar con USDC`
3. ARS users go through Mercado Pago and receive the carton in the connected wallet after backend confirmation and minting
4. crypto-native users keep the direct onchain `USDC` path
5. both rails converge into one unified Firestore order model
