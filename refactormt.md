# Multi-Tournament Refactor Plan

## Goal

Support simultaneous tournaments with:

- one shared `Treasury`
- one shared `Carton`
- one competition engine per tournament
- a global reserve that can fund future tournaments

The key design goal is to decouple tournament mechanics from prize accounting so different competition engines can plug into the same NFT + treasury flow.

## Agreed Decisions

1. Support simultaneous tournaments onchain.
2. Keep a shared `Treasury` across tournaments.
3. Keep a shared `Carton` across tournaments.
4. Move reserve accounting from per-tournament reserve buckets to a shared `globalReserve` per asset.
5. Treat `Predictions` as one tournament-scoped engine instance, not as a global system.
6. Make `tournamentId` explicit in core mint/purchase flows.
7. Remove hard architectural dependency from `Treasury` to `Predictions`.

## Target Architecture

### Carton

Responsibilities:

- mint NFTs
- assign each token to a `tournamentId`
- route sale proceeds to `Treasury`

Target changes:

- explicit tournament-aware mint and purchase functions
- no silent minting for `tournamentId == 0`
- no reliance on `activeTournamentId` for core correctness
- likely tournament-specific prices for simultaneous tournaments

### Treasury

Responsibilities:

- manage prize pools per tournament and asset
- manage claims per tournament and tokenId
- manage tournament sales/finalization lifecycle
- manage a global reserve per asset

Target changes:

- replace single `predictionsContract` with per-tournament engine lookup
- validate token tournament ownership directly via `Carton.tokenTournamentId(tokenId)`
- stop reading ranking/position data during claims
- send retained reserve and unallocated remainder to `globalReserve[asset]`
- allow admin to seed a tournament from global reserve

### Competition Engine

Responsibilities:

- accept submissions
- store/update official results
- compute or publish standings
- expose readiness for tournament finalization

Target changes:

- define a minimal engine interface for `Treasury`
- make each engine deployment tournament-scoped
- make `Predictions` store an immutable `tournamentId`
- remove all dependency on `Carton.activeTournamentId()`

### Frontend

Responsibilities:

- resolve tournament context per token and per view
- resolve engine address per tournament
- support simultaneous tournament UX

Target changes:

- stop assuming one global `VITE_PREDICTIONS_ADDRESS`
- stop deriving historical claims from `activeTournamentId`
- resolve `tokenId -> tournamentId -> engine`
- add tournament selection/listing flows

## Minimal Onchain Interface

`Treasury` should depend on a minimal engine interface such as:

```solidity
interface ICompetitionEngine {
    function isReadyForFinalization() external view returns (bool);
}
```

This keeps prize accounting independent from the internal scoring logic.

## Treasury Data Model

Keep:

- `prizePools[tournamentId][asset]`
- `claimed[tournamentId][tokenId][asset]`
- `finalPrizeAmounts[tournamentId][tokenId][asset]`
- tournament lifecycle flags keyed by `tournamentId`

Refactor:

- replace `Predictions public predictionsContract`
- add `mapping(uint256 => address) public competitionEngineByTournament`
- replace `reservePools[tournamentId][asset]` with `mapping(address => uint256) public globalReserve`

Likely admin flows:

- `registerTournament(uint256 tournamentId, address engine)`
- `seedTournamentFromReserve(uint256 tournamentId, address asset, uint256 amount)`

## Carton Data Model

Keep:

- `tokenTournamentId[tokenId]`

Refactor core flows toward explicit tournament selection:

- `mintForTournament(...)`
- `mintBatchForTournament(...)`
- `buyCartonWithToken(uint256 tournamentId, address token)`

Likely pricing change for simultaneous tournaments:

- `tokenPricesByTournament[tournamentId][asset]`

## Predictions Refactor

Target shape:

- one deployment per tournament
- immutable `tournamentId`
- tournament-local readiness/finalization semantics

Specific fixes:

- constructor receives `tournamentId`
- `beginPositionsUpdate` no longer receives `tournamentId`
- correction lock uses the contract's own `tournamentId`
- token eligibility checks use `Carton.tokenTournamentId(tokenId)` against local `tournamentId`

## Frontend Migration Notes

Main breaking assumptions today:

- one global predictions address
- `activeTournamentId` used as current truth for claims and leaderboard context
- hardcoded single-engine flows in predictions/leaderboard/admin routes

Migration target:

- tournament registry or at least tournament lookup from `Treasury`
- resolve engine per tournament before reading predictions/rankings
- resolve token tournament before building claim UI

## Test Plan

Add/replace tests for:

1. two simultaneous tournaments with two different engine instances
2. interleaved sales for both tournaments through one `Carton`
3. claims only succeed for matching `tokenTournamentId`
4. finalization only checks the registered engine for that tournament
5. reserve accumulates globally across tournaments
6. reserve can seed a new tournament
7. mint/purchase revert for zero or unregistered tournament ids
8. old fake multi-tournament tests are removed or rewritten

## Implementation Order

1. Refactor `Treasury` to use per-tournament engines and `globalReserve`.
2. Refactor `Carton` to use explicit `tournamentId` in core flows.
3. Refactor `Predictions` into a tournament-scoped engine.
4. Update Solidity tests.
5. Update deployment flow and generated ABIs.
6. Update frontend tournament and engine resolution.
7. Re-test claim, leaderboard, and admin flows end-to-end.

## Progress Log

### 2026-05-12

- Plan created in `refactormt.md`.
- Architecture decisions locked:
  - simultaneous tournaments
  - shared `Treasury`
  - shared `Carton`
  - global reserve per asset
  - one engine per tournament
- Next implementation target: refactor `Treasury` first.

### 2026-05-12 - Core Contracts Implemented

- Added test-first coverage for the new architecture before changing contracts.
- `Treasury` refactor implemented:
  - removed the single global `Predictions` dependency
  - added `competitionEngineByTournament[tournamentId]`
  - added tournament registration and lookup
  - added `globalReserve[asset]`
  - added `seedTournamentFromReserve(...)`
  - claims now validate `Carton.tokenTournamentId(tokenId)`
  - finalization now checks the registered engine for the target tournament only
- `Carton` refactor implemented:
  - added explicit `mintForTournament(...)`
  - added explicit `mintBatchForTournament(...)`
  - added explicit `buyCartonWithToken(tournamentId, token)`
  - added tournament-specific token pricing
  - wrapper functions still exist for `activeTournamentId` flows while the frontend migrates
  - ERC20 treasury deposits now use `forceApprove`
- `Predictions` refactor implemented:
  - constructor is now tournament-scoped
  - stores immutable `tournamentId`
  - `beginPositionsUpdate(...)` now uses local tournament context
  - submissions and winner picks now reject tokens from other tournaments
  - result correction lock now checks the contract's own tournament in `Treasury`
- Deployment helpers updated:
  - `Deploy.s.sol`
  - `PredictionsFactory.sol`
- Verification:
  - full `forge test` suite passes (`151 passed, 0 failed`)
  - `frontend` build passes (`npm run build`)

### Remaining Follow-Up

- Migrate frontend and generated ABIs away from the single global predictions address assumption.
- Update admin and claim flows to resolve `tokenId -> tournamentId -> engine`.

### 2026-05-12 - Frontend Active-Tournament Integration

- Frontend scope kept intentionally narrow:
  - one active `Predictions` address in `.env`
  - one active tournament UX at a time
  - no tournament registry UI yet
- Updated frontend integrations to match the refactored contracts:
  - `index.tsx` now buys with `buyCartonWithToken(tournamentId, token)`
  - `index.tsx` now reads `tokenPricesByTournament(...)`
  - `index.tsx` now shows `getGlobalReserve(...)` instead of the removed per-tournament reserve view
  - `admin.dev.tsx` now calls `beginPositionsUpdate(expectedEntries)`
  - `admin.dev.tsx` now reads `getGlobalReserve(...)`
- Narrowed product behavior so prediction flows only operate on the active tournament:
  - `predictions.tsx` filters wallet cartones down to the active tournament before computing statuses
  - wallet-owned cartones from other tournaments are treated as non-editable in the active engine UI
- Hardened claims for historical tokens:
  - `ClaimSection.tsx` now resolves `tokenTournamentId(tokenId)` for claims
  - it only attempts to show rank from `Predictions` when the token belongs to the active tournament exposed in frontend
  - historical tokens can still show claimable prize state even if the active engine cannot provide their rank
- Regenerated frontend ABI artifacts from the refactored contracts.
- Verification:
  - `npm run build` passes after frontend integration changes

### 2026-05-12 - Official Fixture Schedule Added

- Pulled official FIFA World Cup 2026 group-stage schedule data from FIFA content endpoints.
- Added `frontend/src/lib/worldcup2026-group-schedule.json` with official group-stage kickoff times and venues.
- Added `frontend/src/lib/fixture-time.ts` to convert/display fixture kickoff times by language:
  - `es` -> Buenos Aires, Argentina (`GMT-3`)
  - `en` -> US Eastern Time (`ET`)
- Merged schedule metadata into local `Game` objects without changing existing `gameId` generation.
- Updated `FixturesView` to:
  - show official day and kickoff time when a match has no result yet
  - show venue for upcoming matches
  - sort displayed matches inside each group by official kickoff time
- Added a fixture-page note driven by the active language/timezone presentation.
- Extended the same fixture time conversion into `predictions`:
  - group-stage matches are now shown in kickoff order inside each group
  - match cards now show date, converted kickoff time, and venue above the score inputs
- Verification:
  - `npm run build` passes after schedule integration

### 2026-05-12 - Fixture Grouping Modes

- Replaced the old double-tab layout with 3 main fixture tabs:
  - `Por grupo`
  - `Por fecha`
  - `Posiciones`
- Persisted the selected fixture tab in `localStorage` so the view survives reloads.
- `Por fecha` reuses existing official kickoff data and groups matches by local display day.
- Date buckets render matches with subtle `Grupo X` badges so group context is preserved.
- Added a stable day-key helper in `fixture-time.ts` for date bucketing.
- Updated frontend copy from `Fixtures` to `Fixture` in the page header and navbar.
- Verification:
  - `npm run build` passes after fixture grouping changes
