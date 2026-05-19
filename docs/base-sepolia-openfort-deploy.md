# Base Sepolia Openfort Deploy

## Goal

Deploy the current contracts to `Base Sepolia` so the frontend can run in Openfort mode against a supported testnet.

## Important Context

- `./deploy.sh` is for local `Anvil` only.
- For Openfort validation on testnet, use `./deploy-base-sepolia.sh`.
- The current deploy script still deploys a local `MockUSDC` contract, not canonical USDC.
- That is fine for testing login, wallet connection, approvals, purchases, and general flow.

## Prerequisites

1. A wallet with `Base Sepolia ETH`
2. A working RPC URL for Base Sepolia
3. A deploy signer, either:
   - `PRIVATE_KEY`, or
   - a Foundry keystore account name in `FOUNDRY_ACCOUNT`
4. Openfort publishable keys
5. WalletConnect project ID if needed

## Required Environment Variables

Export these before running the deploy:

```bash
export BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

Then choose one signer mode.

### Option A: Foundry Keystore

If you do not have a keystore yet:

```bash
cast wallet import deployer --interactive
```

Then run with:

```bash
export FOUNDRY_ACCOUNT=deployer
```

If your keystore password is stored in a file, you can also set:

```bash
export ETH_PASSWORD=/absolute/path/to/password.txt
```

### Option B: Raw Private Key

```bash
export PRIVATE_KEY=0x...
```

Optional:

```bash
export TEAMS_HASH=0x...
```

## Deploy

Run:

```bash
./deploy-base-sepolia.sh
```

This script will:

1. Deploy `Carton`, `Predictions`, `Treasury`, and `MockUSDC`
2. Configure treasury integration and tournament `1`
3. Export fresh ABI artifacts to the frontend
4. Create or update `frontend/.env.openfort.local`
5. Create or update `admin/.env.local`

## Frontend Environment

After deploy, fill these keys in `frontend/.env.openfort.local`:

```bash
VITE_OPENFORT_PUBLISHABLE_KEY=pk_...
VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY=shield_pk_...
VITE_WALLETCONNECT_PROJECT_ID=...
```

The deploy script preserves existing values for those keys if the file already exists.

## Admin Environment

`admin/` does not use Openfort. It uses an injected EOA wallet, but it still needs the same Base Sepolia chain config and deployed contract addresses.

The deploy script now writes:

```bash
admin/.env.local
```

That file is enough to run the admin panel against the same Base Sepolia deployment.

## Run The Frontend

Start the frontend in Openfort mode:

```bash
cd frontend
npm run dev:openfort
```

This uses `frontend/.env.openfort.local` plus the versioned Openfort environment files already in the repo.

Start the admin panel separately with:

```bash
cd admin
pnpm dev
```

The admin app will read `admin/.env.local` and connect to Base Sepolia through an injected wallet.

## Fund Test Wallets

For a full purchase test, the user wallet needs:

1. `Base Sepolia ETH` for gas
2. `MockUSDC` for the carton purchase

### ETH

Use any Base Sepolia faucet for the wallet you want to test. With keystore mode, the deployer wallet is the address behind `FOUNDRY_ACCOUNT`.

### MockUSDC

Because the repo deploys `MockUSDC`, you can mint test funds directly to the wallet:

```bash
cast send <mock_usdc_address> "mint(address,uint256)" <wallet> 10000000 --account "$FOUNDRY_ACCOUNT" --rpc-url "$BASE_SEPOLIA_RPC_URL"
```

`10000000` means `10 USDC` because the mock token uses `6` decimals.

If you deploy with `PRIVATE_KEY` instead of `FOUNDRY_ACCOUNT`, replace the signer flags accordingly.

## Smoke Test

Recommended validation sequence:

1. Start `frontend` with `npm run dev:openfort`
2. Connect with Openfort
3. Confirm the embedded wallet is created on Base Sepolia
4. Send test ETH to the wallet
5. Mint `MockUSDC` to the wallet
6. Approve USDC
7. Buy a carton
8. Confirm the carton's token ID appears in the app
9. Open the admin app and confirm it reads the same deployment on Base Sepolia

## Notes

- This is good for Openfort UX validation, not final production payments.
- For production, you likely want real USDC and a separate production deploy path.
- If you later want gas sponsorship, that is configured in Openfort separately from this contract deploy.
