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

- Date: 15-05-2026
- Operator: Eric
- Target environment: `Local / Anvil`
- Git commit / branch: 20-admin-decouple
- Frontend URL: http://localhost:5173/
- Admin URL: http://localhost:5174/
- RPC URL: ni idea creo que ninguno
- Active chain ID: 31337

## Wallet Map

Fill this once per run.

- Predictions owner wallet: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- Treasury `DEFAULT_ADMIN_ROLE` wallet: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- Treasury `TOURNAMENT_MANAGER_ROLE` wallet: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- User test wallet A: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- User test wallet B: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
- User test wallet C: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC

## Contract Snapshot

- `Carton` address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
- `Predictions` address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
- `Treasury` address: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
- `USDC` address: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
- Active tournament ID: 1 (creo)

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
| 1.1 | `forge test` passes from repo root | | PASS  |  |
| 1.2 | `frontend/npm run build` passes | | PASS |  |
| 1.3 | `admin/pnpm build` passes | | PASS |  |
| 1.4 | `Predictions.owner()` wallet is identified | | PASS |  |
| 1.5 | `Treasury.DEFAULT_ADMIN_ROLE` wallet is identified | | PASS  |  |
| 1.6 | `Treasury.TOURNAMENT_MANAGER_ROLE` wallet is identified | | PASS  |  |

## Step 2. Local Environment

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| 2.1 | `anvil` is running | | PASS  |  |
| 2.2 | Fresh local contracts are deployed | | PASS |  |
| 2.3 | Local env files point to current `Carton`, `Predictions`, `Treasury`, `USDC` | | PASS |  |
| 2.4 | Frontend is running | | PASS  |  |
| 2.5 | Admin app is running |  | PASS  |  |
| 2.6 | Expected admin wallet is connected | | PASS  |  |

## Step 3. Admin Identity Check

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| 3.1 | Admin page opens correctly |  | PASS  |  |
| 3.2 | Connected address matches expected wallet |  | PASS  |  |
| 3.3 | `Can manage predictions` is `true` for owner wallet |  | PASS  |  |
| 3.4 | Treasury role flags match expectations |  | PASS |  |
| 3.5 | Connected chain is Anvil for local smoke test |  | PASS  |  |

## Step 4. Tournament Config Check

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| 4.1 | `Carton.activeTournamentId` is correct |  | PASS |  |
| 4.2 | `Predictions.totalGames` is correct |  |  | PASS |
| 4.3 | `submissionDeadline` is in the future |  |  | No se seta de una el submission va luego |
| 4.4 | Accepted tokens and prices are correct |  | PASS |  |
| 4.5 | `Carton` points to the expected `Treasury` |  |   | Tal vez? |

## Step 5. Sales and Purchase Check

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| 5.1 | Buy at least one carton as a user | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | 0xfdeabcef895c8ab640c8de9fd3d3fd150d21ab99112bd52075330d31e82730d3 | PASS |  |
| 5.2 | Purchase succeeds |  |  | PASS  |  |
| 5.3 | Token appears in wallet / UI |  |  | PASS |  |
| 5.4 | If using USDC, payment reaches `Treasury` |  |  | PASS |  |
| 5.5 | Prize pool increases as expected |  |  | PASS |  |

## Step 6. Prediction Submission Check

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| 6.1 | Submit one full prediction |  |  | PASS  |  |
| 6.2 | Submission tx succeeds |  | 0xcb93b012781953152216a065d540e234e1d6ae5ad8c24527a5850c18bf7a0c59 | PASS |  |
| 6.3 | UI shows stored prediction |  |  | PASS  |  |
| 6.4 | If winners are enabled, submit winners once |  |  | PASS | ?? todo se envía en una única transacción |
| 6.5 | Winners prediction is stored correctly |  |  | PASS |  |

## Step 7. Sales Closure Check

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| 7.1 | Close sales from admin flow |  | 0xaede50ddfa5e0440efabd6d4ea69510ef69fc40602939406ebc936ea4d3a25fb | PASS | debería verse cerrado en el front, quitar cartelote de compra |
| 7.2 | New purchases now fail |  |  | PASS |  |
| 7.3 | Result loading is now allowed |  |  | PASS | aunque no sé del todo a q chota se refiere  |

## Path A. Single Result Flow

Use this path to validate the normal production-style result workflow.

### Step A1. First Result Load

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| A1.1 | Load one result with `setResults` from admin app |  |  | PASS |  |
| A1.2 | Tx succeeds |  |0x6f79d83f7ff6b057a89af4fe0eeed0dd48592e522040e4aa0a8029fe8be10201  | PASS | now the users cant complete his predictions not enough info about it |
| A1.3 | Row shows stored score |  |  | PASS |  |

### Step A2. Duplicate Protection

| ID | Check | Wallet | Evidence | Result | Notes |
|---|---|---|---|---|---|
| A2.1 | Try to set same result again through first-load path |  |  | PASS | no tengo más el botón de set  - hay que modificar el batch para que me permita enviar menos resultados es una goma como está actualmente porque o sólo envío todos de una .. o todos de a uno, no puedo meter 2 o 3 de auno y luego enviar batch el resto, una cagada -- ahora parece que anduvo, cosa eh mandinga|
| A2.2 | It no longer behaves like a first write |  |  | PASS |  |
| A2.3 | UI routes to `updateResults` for already-set games |  |  | PASS |  |

### Step A3. Correction Flow

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| A3.1 | Change an already-set score |  |  | PASS |  |
| A3.2 | `updateResults` succeeds before finalization |  |  | PASS  |  |
| A3.3 | Corrected score appears on screen |  |  | PASS |  |

## Path B. Batch Result Flow on Anvil

Use this path only on local Anvil. This is a dev helper and should not be available on production chains.

### Step B1. Visibility Guard

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| B1.1 | Batch button is visible on Anvil |  | PASS |  |
| B1.2 | Button label shows number of visible unset games |  | PASS |  |

### Step B2. Batch Happy Path

| ID | Check | Wallet | Evidence / tx hash | Result | Notes |
|---|---|---|---|---|---|
| B2.1 | Fill several visible unset games |  |  | PASS  |  |
| B2.2 | Click `Set In Batch` |  |  | PASS |  |
| B2.3 | One tx sets all intended visible games |  |  | PASS  |  |
| B2.4 | Already-set rows were skipped |  |  | PASS |  |
| B2.5 | Empty rows were skipped |  |  | PASS |  |
| B2.6 | Game ID list in tx matches expectation |  |  | PASS | eso espero demasiado quilombo chequearlo |

### Step B3. Batch Validation

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| B3.1 | Enter at least one invalid visible score |  |  |  |
| B3.2 | Batch action is blocked before sending |  | BLOCKED |  ya los había enviado |
| B3.3 | Fix invalid row and retry successfully |  |  |  |

### Step B4. Non-Anvil Guard

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| B4.1 | Switch to non-Anvil chain or environment |  | PASS |  |
| B4.2 | Batch button is not shown |  | PASS |  |
| B4.3 | Manual `setResultsBatch` call outside Anvil reverts |  | BLOCKED | no tengo el botón para probar  |

## Path C. Points and Leaderboard

### Step C1. Partial Scoring

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| C1.1 | After loading some results, points can be recalculated |  | PASS |  |
| C1.2 | Partial scoring behaves as expected |  | PASS |  |

### Step C2. Final Scoring Inputs

| ID | Check | Evidence | Result | Notes |
|---|---|---|---|---|
| C2.1 | All intended match results are loaded |  | PASS |  |
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
