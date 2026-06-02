# Smoke Test Checklist

Manual checklist to verify the full tournament flow after contract, admin, or frontend changes.

Use this as a guided script. Follow the numbered steps in order, then choose the path that matches what you want to validate.

## How To Use This File

This file is the master template.

Do not try to reuse the same filled-in copy for multiple runs across different environments.

Recommended usage:

1. Keep this file in the repo as the clean template.
2. For each real execution, create a separate working copy.
3. Fill the working copy only for that single run.

Suggested filenames for copies:

- `qa-runs/2026-05-15-local-anvil.md`
- `qa-runs/2026-05-15-staging-testnet.md`
- `qa-runs/2026-05-15-production-pre-release.md`

Rule of thumb:

- one file copy per environment run
- one `Run Record` per file copy
- do not mix Local, Staging, and Production evidence in the same filled-in file

## Run Record

Fill this before you start.

- Date:
- Operator:
- Target environment: `Local / Anvil`, `Staging / Testnet`, or `Production pre-release`
- Git commit / branch:
- Frontend URL:
- Admin URL:
- RPC URL:
- Active chain ID:

## Wallet Map

Fill this once per run.

- Predictions owner wallet:
- Treasury `DEFAULT_ADMIN_ROLE` wallet:
- Treasury `TOURNAMENT_MANAGER_ROLE` wallet:
- User test wallet A:
- User test wallet B:
- User test wallet C:

## Contract Snapshot

- `Carton` address:
- `Predictions` address:
- `Treasury` address:
- `USDC` address:
- Active tournament ID:

## Result Legend

- `PASS`: behaved exactly as expected
- `FAIL`: unexpected behavior or broken flow
- `BLOCKED`: could not continue because of a prerequisite issue
- `N/A`: intentionally skipped for this environment

## Evidence Log

Add one row for every transaction-producing step and every important revert/guard check.

| Step | Environment | Wallet | Action | Expected | Actual | Tx hash / evidence | Result | Notes |
|---|---|---|---|---|---|---|---|---|
| Example: A1 | Local / Anvil | Predictions owner | `setResults(1,2,1)` | Success | Success | `0x...` | PASS | First result load |

## Environment Blocks

Use the block that matches your target. The detailed steps below remain the source of truth.

### Block 1. Local / Anvil Full Validation

Run all of these:

- Steps `1` through `7`
- Path `A`
- Path `B`
- Path `C`
- Path `D`
- Path `E`
- Path `F`
- Path `G`
- Path `H`
- Exit Criteria

### Block 2. Staging / Testnet Validation

Run all of these:

- Steps `1` through `7`
- Path `A`
- Path `C`
- Path `D`
- Path `E`
- Path `F`
- Path `G`
- Path `H`
- Exit Criteria

Mark these as `N/A` unless your staging chain is intentionally `31337`:

- Path `B`

### Block 3. Production Pre-release Validation

Run this only when contracts, env vars, and admin permissions are already pointed to the intended production deployment.

Run all of these:

- Steps `1`, `3`, and `4`
- Step `5` with the smallest safe real amount
- Step `6` with a dedicated test carton if operationally allowed
- Step `7`
- Path `A`
- Path `C`
- Path `D`
- Path `E`
- Path `F`
- Path `G`
- Path `H`
- Exit Criteria

Mark these as `N/A` in production pre-release:

- Path `B`

Before you start this block:

- [ ] Confirm who approved using real funds.
- [ ] Confirm the maximum acceptable loss for the smoke test.
- [ ] Confirm which wallets are allowed to perform irreversible actions.
- [ ] Confirm where tx hashes and screenshots will be stored.

## Step 1. Preflight

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| 1.1 | `forge test` passes from repo root |  |  |  |
| 1.2 | `frontend/pnpm build` passes |  |  |  |
| 1.3 | `admin/pnpm build` passes |  |  |  |
| 1.4 | `Predictions.owner()` wallet is identified |  |  |  |
| 1.5 | `Treasury.DEFAULT_ADMIN_ROLE` wallet is identified |  |  |  |
| 1.6 | `Treasury.TOURNAMENT_MANAGER_ROLE` wallet is identified |  |  |  |

## Step 2. Local Environment

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| 2.1 | `anvil` is running |  |  |  |
| 2.2 | Fresh local contracts are deployed |  |  |  |
| 2.3 | Local env files point to current `Carton`, `Predictions`, `Treasury`, `USDC` |  |  |  |
| 2.4 | Frontend is running |  |  |  |
| 2.5 | Admin app is running |  |  |  |
| 2.6 | Expected admin wallet is connected |  |  |  |

## Step 3. Admin Identity Check

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| 3.1 | Admin page opens correctly |  |  |  |
| 3.2 | Connected address matches expected wallet |  |  |  |
| 3.3 | `Can manage predictions` is `true` for owner wallet |  |  |  |
| 3.4 | Treasury role flags match expectations |  |  |  |
| 3.5 | Connected chain is Anvil for local smoke test |  |  |  |

## Step 4. Tournament Config Check

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| 4.1 | `Carton.activeTournamentId` is correct |  |  |  |
| 4.2 | `Predictions.totalGames` is correct |  |  |  |
| 4.3 | `submissionDeadline` is in the future |  |  |  |
| 4.4 | Accepted tokens and prices are correct |  |  |  |
| 4.5 | `Carton` points to the expected `Treasury` |  |  |  |

## Step 5. Sales and Purchase Check

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| 5.1 | Buy at least one carton as a user |  |  |  |  |
| 5.2 | Purchase succeeds |  |  |  |  |
| 5.3 | Token appears in wallet / UI |  |  |  |  |
| 5.4 | If using USDC, payment reaches `Treasury` |  |  |  |  |
| 5.5 | Prize pool increases as expected |  |  |  |  |

## Step 6. Prediction Submission Check

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| 6.1 | Submit one full prediction |  |  |  |  |
| 6.2 | Submission tx succeeds |  |  |  |  |
| 6.3 | UI shows stored prediction |  |  |  |  |
| 6.4 | If winners are enabled, submit winners once |  |  |  |  |
| 6.5 | Winners prediction is stored correctly |  |  |  |  |

## Step 7. Sales Closure Check

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| 7.1 | Close sales from admin flow |  |  |  |  |
| 7.2 | New purchases now fail |  |  |  |  |
| 7.3 | Result loading is now allowed |  |  |  |  |

## Path A. Single Result Flow

Use this path to validate the normal production-style result workflow.

### Step A1. First Result Load

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| A1.1 | Load one result with `setResults` from admin app |  |  |  |  |
| A1.2 | Tx succeeds |  |  |  |  |
| A1.3 | Row shows stored score |  |  |  |  |

### Step A2. Duplicate Protection

| ID | Check | Wallet | Evidence | Result | Notes |
|---|---|---|---|---|---|
| A2.1 | Try to set same result again through first-load path |  |  |  |  |
| A2.2 | It no longer behaves like a first write |  |  |  |  |
| A2.3 | UI routes to `updateResults` for already-set games |  |  |  |  |

### Step A3. Correction Flow

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| A3.1 | Change an already-set score |  |  |  |  |
| A3.2 | `updateResults` succeeds before finalization |  |  |  |  |
| A3.3 | Corrected score appears on screen |  |  |  |  |

## Path B. Batch Result Flow on Anvil

Use this path only on local Anvil. This is a dev helper and should not be available on production chains.

### Step B1. Visibility Guard

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| B1.1 | Batch button is visible on Anvil |  |  |  |
| B1.2 | Button label shows number of visible unset games |  |  |  |

### Step B2. Batch Happy Path

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| B2.1 | Fill several visible unset games |  |  |  |  |
| B2.2 | Click `Set Visible In Batch` |  |  |  |  |
| B2.3 | One tx sets all intended visible games |  |  |  |  |
| B2.4 | Already-set rows were skipped |  |  |  |  |
| B2.5 | Empty rows were skipped |  |  |  |  |
| B2.6 | Game ID list in tx matches expectation |  |  |  |  |

### Step B3. Batch Validation

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| B3.1 | Enter at least one invalid visible score |  |  |  |
| B3.2 | Batch action is blocked before sending |  |  |  |
| B3.3 | Fix invalid row and retry successfully |  |  |  |

### Step B4. Non-Anvil Guard

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| B4.1 | Switch to non-Anvil chain or environment |  |  |  |
| B4.2 | Batch button is not shown |  |  |  |
| B4.3 | Manual `setResultsBatch` call outside Anvil reverts |  |  |  |

## Path C. Points and Leaderboard

### Step C1. Partial Scoring

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| C1.1 | After loading some results, points can be recalculated |  |  |  |
| C1.2 | Partial scoring behaves as expected |  |  |  |

### Step C2. Final Scoring Inputs

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| C2.1 | All intended match results are loaded |  |  |  |
| C2.2 | Official winners are loaded if required |  |  |  |
| C2.3 | Tournament is ready for final point calculation |  |  |  |

### Step C3. Positions

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| C3.1 | Generate or load leaderboard positions |  |  |  |  |
| C3.2 | Submit positions |  |  |  |  |
| C3.3 | Top positions shown in UI match intended ranking |  |  |  |  |
| C3.4 | Spot-check at least 2 or 3 cartons manually |  |  |  |  |

## Path D. Prize Distribution and Finalization

### Step D1. Prize Configuration

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| D1.1 | Set prize distribution for each intended asset |  |  |  |  |
| D1.2 | Totals and percentages are correct |  |  |  |  |
| D1.3 | Final prize amounts are loaded if required |  |  |  |  |
| D1.4 | Final prize amounts are sealed if required |  |  |  |  |

### Step D2. Finalization

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| D2.1 | Finalize or close tournament with intended admin flow |  |  |  |  |
| D2.2 | Tournament now reports as finalized / closed |  |  |  |  |

### Step D3. Post-Finalization Guards

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| D3.1 | Result correction is blocked |  |  |  |
| D3.2 | Late prize-pool deposits are blocked |  |  |  |
| D3.3 | New purchases remain blocked |  |  |  |

## Path E. Claim Flow

### Step E1. Winner Claim

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| E1.1 | Claim with a winning token |  |  |  |  |
| E1.2 | Claim succeeds |  |  |  |  |
| E1.3 | Claimed amount is correct |  |  |  |  |

### Step E2. Double Claim Protection

| ID | Check | Wallet | Evidence | Result | Notes |
|---|---|---|---|---|---|
| E2.1 | Try to claim same prize again |  |  |  |  |
| E2.2 | Revert or block happens as expected |  |  |  |  |

### Step E3. Non-Winner / Wrong Token

| ID | Check | Wallet | Evidence | Result | Notes |
|---|---|---|---|---|---|
| E3.1 | Claim with non-winning token fails |  |  |  |  |
| E3.2 | Claim with token from another tournament fails |  |  |  |  |

## Path F. Permission Checks

### Step F1. Predictions Owner Gate

| ID | Check | Wallet | Evidence | Result | Notes |
|---|---|---|---|---|---|
| F1.1 | Connect wallet that is not `Predictions.owner()` |  |  |  |  |
| F1.2 | Results actions are blocked |  |  |  |  |
| F1.3 | Winners actions are blocked |  |  |  |  |
| F1.4 | Positions actions are blocked |  |  |  |  |

### Step F2. Treasury Admin Gate

| ID | Check | Wallet | Evidence | Result | Notes |
|---|---|---|---|---|---|
| F2.1 | Connect wallet without `Treasury.DEFAULT_ADMIN_ROLE` |  |  |  |  |
| F2.2 | Prize distribution is blocked |  |  |  |  |
| F2.3 | Prize amount loading / sealing is blocked |  |  |  |  |

### Step F3. Tournament Manager Gate

| ID | Check | Wallet | Evidence | Result | Notes |
|---|---|---|---|---|---|
| F3.1 | Connect wallet without `Treasury.TOURNAMENT_MANAGER_ROLE` |  |  |  |  |
| F3.2 | Close sales is blocked |  |  |  |  |
| F3.3 | Finalize actions are blocked |  |  |  |  |

## Path G. Deadline and Sales Timing

### Step G1. Before Deadline

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| G1.1 | Prediction submission works before `submissionDeadline` |  |  |  |

### Step G2. After Deadline

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| G2.1 | Advance time or use setup after deadline |  |  |  |
| G2.2 | New prediction submission fails |  |  |  |

### Step G3. Sales vs Results Invariant

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| G3.1 | With sales open, `setResults` fails |  |  |  |  |
| G3.2 | Close sales |  |  |  |  |
| G3.3 | Same result can be set after close |  |  |  |  |

## Path H. Regression Checks

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| H1 | Frontend still loads predictions normally |  |  |  |
| H2 | Admin still loads individual results normally |  |  |  |
| H3 | Admin update flow still works for corrections |  |  |  |
| H4 | Prize and claim flows still work for ETH |  |  |  |
| H5 | Prize and claim flows still work for USDC if enabled |  |  |  |
| H6 | Nothing batch-related appears where it should stay hidden outside Anvil |  |  |  |

## Exit Criteria

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| X1 | Core single-result flow works |  |  |  |
| X2 | Batch flow works on Anvil only |  |  |  |
| X3 | Batch flow is hidden or unavailable outside Anvil |  |  |  |
| X4 | Leaderboard flow works end to end |  |  |  |
| X5 | Prize flow works end to end |  |  |  |
| X6 | Claim flow works end to end |  |  |  |
| X7 | Permission boundaries behave correctly |  |  |  |
| X8 | Post-finalization guards behave correctly |  |  |  |
| X9 | Evidence Log is complete enough for audit |  |  |  |
| X10 | Every `FAIL` or `BLOCKED` item has owner and follow-up note |  |  |  |
