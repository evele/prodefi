# Contract Size Plan

## Goal
Reduce bytecode size in the 3 largest contracts using the highest-impact techniques from the Ethereum.org downsizing guide.

## Current Sizes (baseline before this plan)
- `Carton`: `24,490 B`, margin `+86 B`
- `Predictions`: `22,667 B`, margin `+1,909 B`
- `Treasury`: `20,522 B`, margin `+4,054 B`

## Sizes After Phase 2+3 (DONE)
- `Carton`: `22,004 B`, margin `+2,572 B` ✅ (-2,486 B)
- `Predictions`: `22,307 B`, margin `+2,269 B` ✅ (-360 B)
- `Treasury`: `20,522 B`, margin `+4,054 B` (unchanged)

## Principles
- Measure before changing.
- Optimize highest-impact items first.
- Prefer contract separation over micro-optimizations.
- Do not break frontend unless the change is explicitly adopted.
- Re-run `forge build --force --sizes` after each isolated measurement.
- Re-run `forge test` after the final chosen set of changes.

## Phase 1: Baseline ✅ DONE
Measure current sizes for:
- `Carton`
- `Predictions`
- `Treasury`
- helper contracts:
  - `CartonSalesConfig`
  - `TreasuryPrizeBook`

Deliverable:
- table with contract, runtime size, margin, and notes

## Phase 2: Carton ✅ DONE
Applied A+B+C: -2,486 B, margin 86 → 2,572 B. 222/222 tests. ABI regenerado por deploy.

1. ✅ Remove legacy ETH code (`buyCarton`, `EthPurchaseDisabled`, `cartonPrice`, `setCartonPrice`, `PriceUpdated`)
2. ✅ Remove `ERC1155Burnable`
3. ✅ Remove `ERC1155Supply`
4. ⏭ Move secondary admin logic — not needed, margen suficiente
5. ✅ Keep `getUserTokens` — frontend depende de él

## Phase 3: Predictions ✅ DONE
Applied P1+P2 partial: -360 B, margin 1,909 → 2,269 B. 220/220 tests.

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

## Phase 4: Treasury ⏭ SKIPPED
Margin already 4,054 B — no urgency. Measured: removing 9 PRIZE_BOOK facades saves 2,261 B but requires frontend + test changes. Deferred.

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

## Phase 5: Combined Measurements ✅ DONE
- A solo: -904 B → margen 990
- B solo: -1,000 B → margen 1,086
- C solo: -690 B → margen 776
- A+B: -1,880 B → margen 1,966
- A+B+C: -2,486 B → margen 2,572 ← elegido

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
