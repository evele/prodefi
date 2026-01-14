# Repository Guidelines

## Project Structure & Module Organization
- `src/` — Solidity contracts (e.g., `Carton.sol`, `Predictions.sol`, `Treasury.sol`).
- `test/` — Foundry tests (`*.t.sol`) with shared helpers in `BaseTest.sol`.
- `script/` — Forge scripts (e.g., `Deploy.s.sol`, `Counter.s.sol`).
- `frontend/` — React + TypeScript (Vite) app; UI and wallet integration lives here.
- Generated: `out/`, `broadcast/`, `cache/` (do not edit). Secrets in `.env` files (root and `frontend/`).

## Build, Test, and Development Commands
- Contracts
  - `forge build` — compile contracts.
  - `forge test -vvv` — run tests (verbose). CI runs build, fmt check, and tests.
  - `forge fmt` — format Solidity code.
  - `anvil` — local EVM node for development.
  - Deploy (local/example): `forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast`
  - Alt: `./deploy.sh` if provided for scripted deploys.
- Frontend (inside `frontend/`)
  - `npm run dev` — start Vite dev server.
  - `npm run build` — type-check and build.
  - `npm run lint` — ESLint checks.

## Coding Style & Naming Conventions
- Solidity: run `forge fmt`; 4-space indents; contracts and files in `PascalCase.sol`; tests in `test/Foo.t.sol`.
- Frontend: TypeScript with ESLint; React components in `PascalCase.tsx`; hooks/functions in `camelCase.ts`.
- Keep modules small and focused; avoid circular deps; prefer explicit imports.

## Testing Guidelines
- Use Foundry (`forge-std/Test.sol`). Name tests `*.t.sol` and group by contract.
- Aim for meaningful revert/assert messages and edge coverage (roles, access, zero values).
- Helpful flags: `-vvv` for logs, `--match-path`/`--match-test` to scope.

## Commit & Pull Request Guidelines
- Commits: imperative, concise subject (e.g., `carton: add mint price check`).
- PRs: include purpose, summary of changes, linked issues, and screenshots for UI. Paste `forge build --sizes` or gas diffs if relevant. Ensure tests and linters pass.

## Security & Configuration Tips
- Never commit private keys or RPC URLs. Scripts read `PRIVATE_KEY` via env in `Deploy.s.sol`.
- Use `.env.example` patterns where possible; validate inputs and access control in changes.

## Agent-Specific Instructions
- Follow `CLAUDE.md` for agent behavior, architecture, and persistent project knowledge.
- Use `DEVELOPMENT_PLAN.md` for active tasks, priorities, and session planning.
- Do not duplicate content across files; update the canonical source instead.
- Keep this AGENTS.md focused on contributor workflow; propose process updates via PR referencing those files.
- English practice: When the user writes in English, interpret the intent and point out at most 1–2 key grammar/syntax errors, excluding minor punctuation fixes; avoid full rewrites unless requested.

## Notes (Dev-only UI & Lookups)
- Admin page exists only for development at `/admin/dev`; the navbar link is rendered only when `import.meta.env.DEV` is true. Do not expose/admin-link in production builds.
- Teams lookups in the frontend should use the O(1) map `teamsById` (or `indexTeamsById()` with `useMemo` for dynamic lists) instead of linear `find()` per render when printing many names (e.g., 32 teams).
