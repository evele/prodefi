# Minter Role Implementation Plan

## Objective

Define a dedicated wallet that can mint `Carton` NFTs without reusing the owner/admin wallet. This plan prepares the signer that will later be used by Firebase for the Mercado Pago flow, while also remaining useful for manual testnet operations.

## Contract Surface

`Carton` already exposes the required minting entrypoints:

- `mint(address account, uint256 amount, bytes memory data)`
- `mintForTournament(address account, uint256 tournamentId, uint256 amount, bytes memory data)`
- `mintBatch(address to, uint256[] memory amounts, bytes memory data)`
- `mintBatchForTournament(address to, uint256 tournamentId, uint256[] memory amounts, bytes memory data)`

All of them require `MINTER_ROLE`.

Relevant source references:

- `src/Carton.sol:42`
- `src/Carton.sol:66-69`
- `src/Carton.sol:84-123`

## Target Wallet Architecture

Use two different privileged wallets:

1. `owner/admin wallet`
   Responsible for role management and sensitive admin actions.

2. `minter wallet`
   Responsible only for calling `Carton.mintForTournament(...)` or related mint functions.

Rules:

- The minter wallet must not hold `DEFAULT_ADMIN_ROLE`.
- The owner/admin wallet should be able to grant and revoke `MINTER_ROLE`.
- For production, prefer a dedicated minter wallet instead of reusing `deployer`.

## Environment Strategy

Recommended per environment:

### Testnet

- Use a dedicated EOA for minting.
- It can be managed manually at first.
- This wallet is only for Base Sepolia operations.

### Production

- Use a dedicated server-side minter wallet.
- Store the private key in a secrets manager.
- Keep owner/admin authority in a stronger wallet model such as hardware wallet or Safe.

## Canonical Mint Path

Use `mintForTournament(...)` as the standard server-side entrypoint.

Why:

- it is explicit about `tournamentId`
- it avoids relying on `activeTournamentId`
- it is a better fit for Firebase-triggered minting later

Canonical payload:

- `account = user wallet address`
- `tournamentId = target tournament`
- `amount = 1`
- `data = 0x`

## Role Assignment Procedure

### Step 1: Identify the current admin wallet

The caller must hold `DEFAULT_ADMIN_ROLE` on `Carton`.

### Step 2: Read the role value

Recommended command pattern:

```bash
cast call <carton_address> "MINTER_ROLE()(bytes32)" --rpc-url <rpc_url>
```

### Step 3: Grant the role to the minter wallet

```bash
cast send <carton_address> \
  "grantRole(bytes32,address)" \
  <minter_role_bytes32> \
  <minter_wallet_address> \
  --account <admin_account> \
  --rpc-url <rpc_url>
```

### Step 4: Verify the role

```bash
cast call <carton_address> \
  "hasRole(bytes32,address)(bool)" \
  <minter_role_bytes32> \
  <minter_wallet_address> \
  --rpc-url <rpc_url>
```

Expected result: `true`.

## Manual Test Procedure

Before integrating Firebase, validate the mint flow manually.

### Goal

Mint one carton directly to an Openfort user wallet.

### Test inputs

- `recipient wallet`: one real Openfort user address
- `tournamentId`: active tournament id on the current deployment
- `amount`: `1`
- `data`: `0x`

### Example flow

1. Call:

```bash
cast send <carton_address> \
  "mintForTournament(address,uint256,uint256,bytes)" \
  <recipient_wallet> \
  <tournament_id> \
  1 \
  0x \
  --account <minter_account> \
  --rpc-url <rpc_url>
```

2. Verify recipient token inventory:

```bash
cast call <carton_address> \
  "getUserTokens(address)(uint256[])" \
  <recipient_wallet> \
  --rpc-url <rpc_url>
```

3. Verify the minted token tournament:

```bash
cast call <carton_address> \
  "tokenTournamentId(uint256)(uint256)" \
  <token_id> \
  --rpc-url <rpc_url>
```

### Success criteria

- recipient sees a new token id
- `tokenTournamentId(tokenId)` matches the intended tournament
- token can later be used in predictions flow normally

## Operational Security Rules

1. The minter wallet should only mint.
2. Do not give `DEFAULT_ADMIN_ROLE` to the minter wallet.
3. If the minter wallet is compromised, revoke `MINTER_ROLE` immediately.
4. Rotate to a fresh minter wallet instead of reusing a suspicious one.
5. Keep owner/admin and minter responsibilities separated at all times.

## Rotation / Revocation Procedure

If rotation is needed:

1. grant `MINTER_ROLE` to the new wallet
2. verify `hasRole(...) == true`
3. revoke `MINTER_ROLE` from the old wallet
4. verify `hasRole(...) == false`
5. update any server-side secret/config that depends on the minter wallet

Example revoke pattern:

```bash
cast send <carton_address> \
  "revokeRole(bytes32,address)" \
  <minter_role_bytes32> \
  <old_minter_wallet_address> \
  --account <admin_account> \
  --rpc-url <rpc_url>
```

## Future Firebase Handoff

This plan intentionally stops before Mercado Pago implementation, but it prepares the exact wallet model Firebase will need later.

Expected future server-side flow:

1. Firebase verifies approved payment.
2. Firebase loads the dedicated minter secret.
3. Firebase calls `mintForTournament(userWallet, tournamentId, 1, 0x)`.
4. Firebase records the mint tx hash and marks the purchase as fulfilled.

The future Firebase signer should be the same dedicated minter wallet defined by this plan, not the owner/admin wallet.

## Open Questions

1. Should there be one minter wallet per environment or one shared wallet across multiple non-production environments?
2. Will the admin UI eventually expose `grantRole` / `revokeRole` for `Carton`, or will role management remain a `cast`-only operation?
3. Will future fiat purchases ever need `mintBatchForTournament(...)`, or is one-carton-per-payment enough?
4. When production arrives, should owner authority live in a hardware wallet directly or in a Safe controlled by hardware wallet signers?
