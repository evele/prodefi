# Prize Payout Implementation Plan

## Goal

Implement the fixed ProDefi payout model across app, admin and onchain flow.

Locked product decisions:

- `95%` of cartón revenue goes to the prizeable pool
- `5%` stays out of the prizeable pool for infrastructure, maintenance and gas subsidy
- the first `32` final positions are always prize-eligible
- prize structure is fixed and does not scale the number of paid places with field size
- final ranking is ordered only by total points
- ties share position using standard competition ranking: `1, 2, 2, 4`
- there is no secondary tie-break by exact scores or any other metric
- if a tie spans prize positions, the occupied prizes are added together and split equally among the tied cartones
- prizes are paid in `USDC`

## Fixed Payout Pyramid

Use this percentage vector for `setPrizeDistribution()`:

```txt
22,14,9,7,4,4,4,4,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
```

Band view:

- `1°`: `22%`
- `2°`: `14%`
- `3°`: `9%`
- `4°`: `7%`
- `5°-8°`: `4%` each
- `9°-16°`: `2%` each
- `17°-32°`: `1%` each

## Current State

What already fits:

- `Treasury.setPrizeDistribution()` already accepts an externally computed payout vector
- admin UI already allows sending comma-separated integer percentages
- the product is already USDC-only from the user-facing flow

What does not fit yet:

- `Predictions.setPositions()` stores sequential positions only and cannot represent shared ranks like `1, 2, 2, 4`
- `Treasury.claimPrize()` pays a single position percentage and cannot split the sum of occupied prize positions across tied cartones
- frontend leaderboard and claim flows assume one scalar position per token, not a shared payout block
- deploy/admin defaults still reflect the old short payout table mindset

## Recommended Implementation Direction

### 1. Product Constants

Create a single source of truth for the payout pyramid in the frontend and admin layer.

Suggested shape:

- `frontend/src/lib/prize-pyramid.ts`
- export the 32-place vector
- export grouped labels for UI (`1`, `2`, `3`, `4`, `5-8`, `9-16`, `17-32`)
- export helper functions to compute current prize amounts from:
  - sold cartones
  - cartón price
  - pool percentage (`95%`)

### 2. Admin Preview Flow

Extend admin so the payout can be previewed before finalization.

Admin should show:

- cartones sold
- gross sales
- prizeable pool (`95%`)
- retained amount (`5%`)
- current USDC amount per paid position
- grouped view by bands and exact view per position

Admin actions should remain:

- close sales
- set prize distribution
- finalize tournament

But the default distribution input should be seeded from the fixed 32-place vector instead of a 4-place table.

### 3. Ranking Model Changes

Remove the old exact-score tie-break assumption everywhere.

Required behavior:

- order by total points only
- equal points share rank
- rank numbering must skip occupied positions (`1, 2, 2, 4`)

This affects:

- offchain ranking computation in app/admin
- any admin helper that builds final positions
- leaderboard display wording

## 4. Onchain Prize Claim Model

This is the main gap.

Current `Treasury.claimPrize()` logic is position-based only:

- read one token position
- look up one percentage
- pay that single position amount

That is not enough for shared prize blocks.

### Recommended solution

Keep the payout vector as the base public rule, but store final claimable amounts per token at finalization time.

Suggested direction:

- compute final grouped payouts offchain after results are final
- for each token in the final leaderboard, compute exact USDC amount claimable after tie splitting
- write those exact claimable amounts into Treasury in a finalization step
- make claim read exact amount instead of deriving it from only `position -> percentage`

Suggested contract shape:

- `mapping(uint256 => mapping(uint256 => mapping(address => uint256))) finalPrizeAmounts`
  - `tournamentId -> tokenId -> token -> amount`

Possible flow:

1. close sales
2. set 32-place payout distribution vector
3. admin computes final leaderboard with shared ranks
4. admin submits final prize amounts per token for the active payout asset
5. finalize tournament
6. users claim exact amount

Benefits:

- fully supports `1, 2, 2, 4`
- preserves the public payout pyramid
- avoids forcing Treasury to reconstruct tie groups onchain
- keeps claims simple and deterministic

### Alternative

Encode tie blocks onchain and derive split amounts in `claimPrize()`.

Not recommended for MVP:

- more state complexity
- more edge cases
- harder to audit and verify

## 5. Frontend User Experience

### Home / Leaderboard

Show the payout model clearly:

- `95%` prizeable pool
- `32` paid positions
- grouped pyramid labels
- current estimated USDC amount per band or position

### Leaderboard

Leaderboard should support shared positions visually:

- show shared rank labels (`2`, `2`, then `4`)
- mark tied entries consistently
- if useful, show a note when a prize block is being split

### Claim UI

Claim UI should read exact claimable USDC amount from Treasury once the finalization model is updated.

## 6. Deploy / Defaults

Update deploy/admin defaults:

- remove the old `50/30/15/5` example mindset
- replace it with the fixed 32-place vector
- ensure documentation and admin placeholders match the live rule

## 7. Tests

Add or update tests for:

- fixed 32-place distribution vector storage
- final ranking ordered only by total points
- no secondary tie-break by exacts
- shared positions using `1, 2, 2, 4`
- prize split over occupied positions
  - example: tie on `2°` splits positions `2 + 3`
- tie crossing the bottom of the paid field
  - example: shared block including `31°` and `32°`
- exact claim amount per token after finalization
- admin preview math for `95%` prizeable pool

## 8. Rollout Order

Recommended implementation sequence:

1. add frontend/admin prize pyramid constants and preview helpers
2. update landing/app copy to the locked payout model
3. update ranking computation to remove the exact-score tie-break
4. implement shared-rank support in final leaderboard generation
5. extend Treasury to support exact per-token final claim amounts
6. update claim UI to read exact amounts
7. update deploy defaults and tests

## 9. Open Questions To Confirm Before Coding

These are small, but should be locked before implementation:

- whether the retained `5%` remains offchain/accounting-only or needs an explicit onchain treasury path
- whether the app should display prizes live before sales close or only as estimates
- whether home shows grouped bands only or all 32 positions
