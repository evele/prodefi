# Payment Dual-Rail Flow

## Goal

Support two payment rails for ProDefi without losing either audience:

1. `ARS / fiat` for Argentina and mainstream users
2. `USDC onchain` for crypto-native users

The user should always end up with a carton in their wallet, regardless of the payment rail.

## Core Idea

Use a single wallet destination and a single order model, but allow two checkout paths:

1. `Pay with pesos`
2. `Pay with USDC`

The wallet address is fixed before payment starts.

## Current Repo Fit

The current codebase already supports most of the building blocks:

- `Carton.mintForTournament(...)` allows admin/server-side minting
- `Carton.buyCartonWithToken(...)` already supports direct USDC purchases
- `Treasury.depositFromSalesERC20(...)` allows separate treasury funding
- Firebase Functions already exist and can host serverless order/payment logic

Relevant files:

- `src/Carton.sol`
- `src/Treasury.sol`
- `frontend/src/routes/index.tsx`
- `functions/src/index.js`

## Product Flow

### Shared Entry

1. User connects a wallet
2. App detects active tournament and price
3. User clicks `Comprar carton`
4. App shows a checkout modal with:
   - destination wallet
   - tournament
   - ARS price
   - USDC price
   - `Pagar con pesos`
   - `Pagar con USDC`

The destination wallet must be confirmed and frozen into the order before payment.

## ARS Rail

### UX Flow

1. Frontend calls `createOrder({ paymentRail: "fiat_ars", walletAddress, tournamentId })`
2. Backend creates a Firestore order with status `pending_payment`
3. Backend creates a Mercado Pago payment/preference using:
   - `external_reference = orderId`
   - `metadata.walletAddress`
   - `metadata.tournamentId`
   - `metadata.openfortUserId` when available
4. User pays in ARS
5. Mercado Pago webhook hits Firebase
6. Backend validates the event and resolves the order
7. If payment is approved, backend mints the carton to the frozen wallet
8. Backend stores `tokenId` and `mintTxHash`
9. Order moves to `fulfilled`
10. Frontend redirects the user to predictions

### Why This Works

- No need for the user to get USDC
- No need for the user to bridge
- No need for the user to understand gas
- Wallet still receives the onchain asset directly

## Crypto Rail

### UX Flow

1. Frontend calls `createOrder({ paymentRail: "crypto_usdc", walletAddress, tournamentId })`
2. Backend creates a Firestore order with status `awaiting_onchain_payment`
3. Frontend runs the existing onchain flow:
   - approve USDC
   - call `buyCartonWithToken(...)`
4. After the transaction confirms, frontend calls `confirmCryptoOrder({ orderId, txHash })`
5. Backend verifies the transaction onchain
6. Backend confirms:
   - tx exists
   - event was emitted
   - buyer matches wallet
   - tournament matches
7. Order moves to `fulfilled` with `tokenId` and `txHash`

### Why Keep This Rail

- Crypto-native users expect direct wallet payment
- Treasury funding already happens automatically in this rail
- It preserves the current onchain purchase path
- It avoids forcing crypto users through a fiat PSP

## Single Order Model

Use one `orders` collection in Firestore for both payment rails.

Example shape:

```ts
{
  orderId: "ord_xxx",
  status:
    "pending_payment" |
    "awaiting_payment_confirmation" |
    "paid" |
    "minting" |
    "awaiting_onchain_payment" |
    "fulfilled" |
    "failed" |
    "refunded",
  paymentRail: "fiat_ars" | "crypto_usdc",
  provider: "mercadopago" | "onchain",
  tournamentId: 1,
  walletAddress: "0x...",
  openfortUserId: "...",
  arsAmount: 12000,
  usdcAmount: "10.00",
  externalReference: "ord_xxx",
  paymentId: "...",
  txHash: "0x...",
  tokenId: "123",
  mintTxHash: "0x...",
  createdAt: ..., 
  updatedAt: ...
}
```

## Source of Truth

Do not rely only on payment metadata.

The backend source of truth should be:

1. `orderId`
2. `orderId -> walletAddress`

Payment metadata is useful for audit and debugging, but Firestore should remain canonical.

## Firebase Functions

Minimum serverless functions:

1. `createOrder`
2. `getOrderStatus`
3. `mercadoPagoWebhook`
4. `confirmCryptoOrder`

Possible later additions:

1. `reconcileTournamentFunding`
2. `cancelExpiredOrder`

## Treasury Strategy

Treasury handling differs by rail.

### ARS Rail

Do not try to fund treasury on every fiat purchase.

Recommended approach:

1. Sell cartons in ARS
2. Reconcile collected fiat offchain
3. Buy/move USDC separately
4. Fund the tournament treasury in batches

### Crypto Rail

Keep current behavior:

1. User pays in USDC onchain
2. Purchase goes through current contract flow
3. Treasury receives funds automatically

## Advantages

### User Experience

- Argentina users get a familiar ARS payment flow
- Crypto users keep a native onchain experience
- Openfort still works as wallet identity and destination

### Operations

- One unified order model
- Better support visibility
- Better analytics
- Better reconciliation

### Product

- No need to choose between fiat users and crypto users
- Supports growth in multiple markets
- Keeps checkout flexible

## Risks To Handle

1. Duplicate webhooks must not mint twice
2. Duplicate order confirmations must be idempotent
3. Wallet destination must be frozen when order is created
4. ARS payments must only mint after final approved state
5. Failed or reverted onchain payments must not fulfill the order

## Suggested Status Transitions

### Fiat

1. `pending_payment`
2. `awaiting_payment_confirmation`
3. `paid`
4. `minting`
5. `fulfilled`

### Crypto

1. `awaiting_onchain_payment`
2. `verifying_onchain_payment`
3. `fulfilled`

## UI States

### ARS

- `Esperando pago`
- `Pago acreditado`
- `Emitiendo carton`
- `Carton listo`

### Crypto

- `Esperando aprobacion USDC`
- `Esperando compra onchain`
- `Verificando transaccion`
- `Carton listo`

## Recommended Implementation Order

### Phase 1

1. Add Firestore `orders`
2. Implement `createOrder`
3. Implement `mercadoPagoWebhook`
4. Implement backend mint using `mintForTournament(...)`
5. Keep current onchain crypto purchase flow unchanged

### Phase 2

1. Add `confirmCryptoOrder`
2. Add unified order status UI
3. Add treasury reconciliation tooling
4. Add gas sponsorship improvements for Openfort users

## Recommended Product Decision

Recommended final model:

1. `ARS rail` uses backend order + webhook + backend mint
2. `Crypto rail` keeps direct USDC onchain purchase
3. Both rails feed into a unified order system in Firestore

This gives ProDefi the best local UX for Argentina without losing crypto-native users.
