# Contract Size Plan

## Goal
Reduce bytecode size in the 3 largest contracts using the highest-impact techniques from the Ethereum.org downsizing guide.

## Current Sizes
- `Carton`: `24,490 B`, margin `+86 B`
- `Predictions`: `22,667 B`, margin `+1,909 B`
- `Treasury`: `20,522 B`, margin `+4,054 B`

## Principles
- Measure before changing.
- Optimize highest-impact items first.
- Prefer contract separation over micro-optimizations.
- Do not break frontend unless the change is explicitly adopted.
- Re-run `forge build --force --sizes` after each isolated measurement.
- Re-run `forge test` after the final chosen set of changes.

## Phase 1: Baseline
Measure current sizes for:
- `Carton`
- `Predictions`
- `Treasury`
- helper contracts:
  - `CartonSalesConfig`
  - `TreasuryPrizeBook`

Deliverable:
- table with contract, runtime size, margin, and notes

## Phase 2: Carton
`Carton` has the smallest remaining headroom, so it gets priority.

Measure these isolated palancas:

1. Remove legacy ETH code
- `buyCarton()`
- `EthPurchaseDisabled`
- `cartonPrice`
- `setCartonPrice`
- `PriceUpdated` (the legacy event emitted by `setCartonPrice`, not `TokenPriceUpdated`)
- related tests
- related ABI entries

2. Remove `ERC1155Burnable`
- remove the inheritance and import
- update/remove burn tests

3. Remove `ERC1155Supply`
- remove the inheritance and import
- update/remove `totalSupply` tests

4. Move secondary admin logic out
- consider moving `withdraw`, `withdrawToken`, or other low-value admin helpers to a separate contract if needed

5. Keep `getUserTokens` for now
- frontend depends on it in:
  - `frontend/src/routes/predictions.tsx`
  - `frontend/src/routes/index.tsx`
  - `frontend/src/routes/leaderboard.tsx`

Target:
- recover at least `1.5 KB`
- ideally recover `2 KB+`

## Phase 3: Predictions
Secondary target after Carton.

Measure these isolated palancas:

1. Split scoring helpers
- `calculatePoints`
- `calculateWinnerPoints`
- `calculateTotalPoints`
- `calculateDifferencePoints`
- `getLocalEmpateVisitante`

2. Review view helpers
- `getPrediction`
- `getGameResults`
- `getOfficialWinners`
- `getWinnersPrediction`
- `allResultsSet`
- `hasFinalPositions`

3. Compact lifecycle state
- review `pending*`, `tokenPositions*`, and related draft state for possible extraction

4. Compact modifiers and visibility
- reduce modifier bytecode if possible
- change `public` to `external` where safe

Target:
- recover `1-2 KB`

## Phase 4: Treasury
Lower priority because it already has healthy margin.

Measure these isolated palancas:

1. Remove or merge facade getters if possible
- only if frontend/admin can read through helper contracts directly

2. Move registry/engine admin state if needed
- `registerTournament`
- `competitionEngineByTournament`
- `registeredTournamentIds`

3. Remove convenience views not used externally
- only if no frontend/admin consumer depends on them

Target:
- keep healthy margin, avoid unnecessary churn

## Phase 5: Combined Measurements
Measure:
- `Carton A+B+C`
- `Carton A+B`
- `Carton A+C`
- `Carton B+C`

Pick the smallest set that gives comfortable headroom.

## Decision Rule
- If `Carton` gets to `> 1.5 KB` margin after safe removals, stop there.
- If not, revisit `getUserTokens` migration to event-based ownership reconstruction.
- Only consider off-chain enumeration if the simpler removals are insufficient.

## Frontend Impact
Potentially touched:
- `frontend/src/lib/contracts/abis.ts`
- `frontend/src/routes/index.tsx`
- `frontend/src/routes/predictions.tsx`
- `frontend/src/routes/leaderboard.tsx`
- `frontend/src/components/ClaimSection.tsx`
- `admin/src/AdminPage.tsx`

## Verification
- `forge build --force --sizes`
- `forge test`
- final `git status` clean except intended changes

## Deliverable
A table with:
- palanca
- bytes ahorrados
- margen resultante
- rompe tests
- toca frontend
- recommendation
