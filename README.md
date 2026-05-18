# ProDefi

Prediction tournament platform built with Solidity, Foundry, and React.

## Overview

ProDefi sells tournament prediction cards as ERC-1155 tokens. Users buy a carton, submit match and winner predictions, admins load official results, and `Treasury` manages prize distribution and claims.

Current product constraints:

- Carton purchases are product-facing `USDC` only.
- `Predictions` is tournament-scoped.
- `Treasury` supports multi-asset internals, but the product flow is currently USDC-first.
- Admin-only result loading and leaderboard publication live in the dev admin app.

## Main Components

- `src/Carton.sol` - ERC-1155 carton contract, mint/purchase flows, treasury integration.
- `src/Predictions.sol` - game predictions, winner predictions, scoring, final positions.
- `src/Treasury.sol` - tournament sales closure, prize pools, finalization, and claims.
- `frontend/` - user-facing React app.
- `admin/` - dev admin React app for lifecycle and scoring operations.
- `landing/site/` - production landing site source.

## Common Commands

### Contracts

```bash
forge build
forge test
forge test -vvv
forge fmt
anvil
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
```

### Admin

```bash
cd admin
pnpm dev
pnpm build
```

## Project Layout

- `src/` - Solidity contracts.
- `test/` - Foundry tests.
- `script/` - deploy and helper scripts.
- `frontend/` - user app.
- `admin/` - dev admin app.
- `docs/plans/` - active focused plans that should not live in root.
- `docs/research/` - research/reference notes.
- `docs/archive/` - historical docs kept only for reference.

## Canonical Root Docs

- `AGENTS.md` - repo workflow, conventions, and contributor instructions.
- `DEVELOPMENT_PLAN.md` - active roadmap, pending work, and implementation notes.
- `SMOKE_TEST_CHECKLIST.md` - QA template for environment-specific validation runs.
- `TOURNAMENT_OPERATIONS_CHECKLIST.md` - manual tournament operations checklist.

## Important Notes

- Admin page is dev-only at `/admin/dev` and should not be exposed in production builds.
- Team lookups in the frontend should use `teamsById` or a memoized ID index, not repeated linear `find()` calls.
- Review `knowledge/openfort.md` before changing Openfort integration.
