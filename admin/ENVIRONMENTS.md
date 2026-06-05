# Admin Environments

The admin app now mirrors the frontend environment split:

- `pnpm dev` uses the default Vite mode for local Anvil work
- `pnpm dev:openfort` uses Vite `openfort` mode for Base Sepolia / testnet work

## Files

- default mode: `.env`
- openfort mode: `.env` + `.env.openfort.local`

Do not keep network-specific values in `admin/.env.local`.

Vite always loads `.env.local` in every mode, so a Base Sepolia `admin/.env.local`
would override local Anvil settings even when running plain `pnpm dev`.

## Recommended setup

### Local / Anvil

- keep Anvil addresses in `admin/.env`
- start with `pnpm dev`

### Base Sepolia

- keep Base Sepolia addresses and chain config in `admin/.env.openfort.local`
- start with `pnpm dev:openfort`

`deploy.sh` updates `admin/.env`.

`deploy-base-sepolia.sh` updates `admin/.env.openfort.local`.
