# Prize And Tournament Lifecycle Plan

## Goal

Consolidate the tournament lifecycle so sales, prediction submission, results, final ranking, prize finalization, and claims are handled as distinct states with clear contract invariants.

This plan keeps multi-token prize accounting in `Treasury`, while treating the tournament lifecycle itself as a tournament-wide state machine.

## Product Flow

1. Users buy cartons while sales are open.
2. Admin closes sales for the tournament.
3. Admin sets prize distribution after sales close, when the final pool is known.
4. Users can still submit predictions until `submissionDeadline`.
5. Admin sets results as matches are played.
6. Frontend/backend may compute provisional rankings offchain for display.
7. Admin sets final positions onchain once at the end.
8. Admin finalizes the tournament.
9. Users claim prizes.

Example business timing:

- Sales may close 24h before the first match.
- Prediction submission may remain open until 4h before kickoff.
- Results are loaded onchain during the tournament.
- Final leaderboard is computed offchain, then anchored onchain once.

## Key Decisions

### Lifecycle is tournament-wide

- `closeSales` should be by `tournamentId`, not by token.
- `finalizeTournament` should be by `tournamentId`, not by token.
- Results corrections should be blocked after tournament finalization.

### Prize accounting remains token-based

- `Treasury` remains multi-token internally.
- Prize pools, prize distributions, and prize claims remain indexed by `tournamentId + token`.
- Frontend/product flow remains USDC-only for now.

### Final ranking is computed offchain, anchored onchain once

- Results are official onchain inputs.
- Provisional rankings can be computed offchain for frontend display.
- Final positions are set onchain once and become the source of truth for claims.
- Do not recalculate leaderboard onchain after every result.

### Distribution does not need to sum to 100%

- Keep room for reserves such as development, donation, jackpot, or future allocation.
- Replace the current arbitrary `90-100%` constraint with a clearer policy during implementation.

## Target Contract Lifecycle

### Phase 1: Sales Open

- Users can buy cartons.
- Prize pool grows from sales deposits.
- Predictions may already be open.

### Phase 2: Sales Closed

- Admin calls `closeSales(tournamentId)`.
- New purchases are blocked.
- No new sales deposits should be accepted.
- Prize pool is now economically final for the current tournament.

### Phase 3: Prize Distribution Configured

- Admin calls `setPrizeDistribution(tournamentId, token, percentages)`.
- This should only be allowed after sales close.
- This should be blocked after tournament finalization.

### Phase 4: Prediction Submission Closed

- `submissionDeadline` expires.
- Users can no longer submit game predictions or winner predictions.
- This remains separate from sales close.

### Phase 5: Tournament In Progress / Completed

- Admin sets or corrects results while tournament is active.
- Admin sets official winners when available.
- Provisional leaderboard can be computed offchain.

### Phase 6: Final Positions Set

- Admin calls `setPositions(tokenIds, points)` once the tournament is complete.
- These positions become the ranking source of truth for claims.

### Phase 7: Tournament Finalized

- Admin calls `finalizeTournament(tournamentId)`.
- This enables claims.
- This locks result corrections.
- This snapshots per-token pools used for prize claims.

### Phase 8: Claims

- Users call `claimPrize(tournamentId, tokenId, token)`.
- Claims remain token-based.

## Planned Contract Changes

### Treasury

Add tournament-wide lifecycle state:

```solidity
mapping(uint256 => bool) public salesClosed;
mapping(uint256 => bool) public tournamentFinalized;
```

Keep token-based prize accounting:

```solidity
mapping(uint256 => mapping(address => uint256)) public prizePools;
mapping(uint256 => mapping(address => uint8[])) public prizePoolDistributions;
mapping(uint256 => mapping(address => uint256)) public finalizedPrizePools;
```

Add:

- `closeSales(uint256 tournamentId)`
- `finalizeTournament(uint256 tournamentId)`

Change behavior:

- `setPrizeDistribution` only after sales close
- `setPrizeDistribution` blocked after finalization
- `claimPrize` only after finalization
- snapshot prize pools during finalization, not during sales close

### Carton

`buyCartonWithToken` should revert if sales are closed for `activeTournamentId`.

This should be an explicit check before the transfer/mint/deposit path continues.

### Predictions

Keep `submissionDeadline` as prediction-submission logic only.

Potential helper/state functions:

- `allResultsSet()`
- `officialWinnersSet()`
- `hasFinalPositions()` or equivalent helper around `positionsVersion`

Results correction should revert after `tournamentFinalized(tournamentId)`.

## Finalization Preconditions

`finalizeTournament(tournamentId)` should require at least:

- sales closed
- prize distribution configured for required prize assets
- final positions set
- official winners set
- ideally all results set

Exact implementation can stay pragmatic, but finalization should fail if the tournament is not truly ready for prize claims.

## Why Final Positions Stay Offchain Until The End

Computing and ordering the full leaderboard onchain after every result is unnecessary and expensive.

Better model:

- results are official onchain inputs
- provisional leaderboard is computed offchain for display
- final leaderboard is anchored onchain once

This keeps the claim mechanism trustable without turning every match update into a heavy ranking write path.

## Deferred Integrity Improvements

These are intentionally deferred and should be revisited after the lifecycle refactor is stable:

- add a challenge window between `setPositions` and `finalizeTournament`
- add batched verification of final positions/points
- add a `resultsHash` and/or `leaderboardHash` commitment to anchor the offchain ranking computation

These ideas matter, but they should not block the first cleanup pass on tournament states.

## Testing Plan

### Contract tests

- cannot buy after `closeSales`
- can still submit predictions after sales close but before `submissionDeadline`
- cannot set prize distribution before sales close
- cannot change prize distribution after finalization
- cannot finalize before required conditions are met
- cannot claim before finalization
- cannot correct results after finalization

### Integration tests

- full tournament lifecycle from purchase to claim
- separate sales close from prediction deadline
- final positions set once at the end
- per-token prize claim still works with tournament-wide finalization

## Frontend / Admin Changes

Admin UI should expose explicit lifecycle actions:

- set submission deadline
- close sales
- set prize distribution
- set results
- set official winners
- set final positions
- finalize tournament

Admin UI should also show a lifecycle checklist:

- sales open/closed
- submission deadline configured / expired
- distribution configured
- results complete
- official winners set
- final positions set
- tournament finalized
- claims enabled

## Current Scope Recommendation

Implement first:

1. tournament-wide `closeSales`
2. tournament-wide `finalizeTournament`
3. explicit purchase block after sales close
4. distribution only after sales close
5. claims only after finalization
6. updated tests for the new lifecycle

Then revisit integrity hardening:

1. challenge window
2. batched verification
3. results/leaderboard hash commitments
