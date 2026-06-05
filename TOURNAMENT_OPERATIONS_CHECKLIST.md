# Tournament Operations Checklist

Manual operating checklist for running a tournament without backend automation.

## Before Opening Predictions

- Confirm `Carton` points to the correct treasury.
- Confirm `Carton.activeTournamentId` is the intended tournament.
- Confirm carton prices and accepted payment tokens are correct.
- Confirm `Predictions.totalGames` matches the real number of group-stage games to be predicted.
- Confirm `submissionDeadline` is set correctly.
- If applicable, confirm team metadata and winners config are finalized before users start submitting.

## Before Users Submit

- Buy a test carton with a dev/admin wallet.
- Submit one test prediction and verify `getPrediction(tokenId)` returns the expected picks.
- If winners are enabled, submit winners once and verify `getWinnersPrediction(tokenId)`.
- Verify the frontend reads the stored prediction correctly.

## During Tournament

- After each match day, load official results with `setResults` for new games.
- If a previously loaded score was wrong and the tournament is not closed, fix it with `updateResults`.
- After loading or correcting results, recalculate points for all relevant tokens using `calculateTotalPoints(tokenId)`.
- Rebuild and publish leaderboard positions with `setPositions(...)` after recalculating.
- Double-check the top positions before any public announcement.

## Before Closing Tournament

- Confirm all intended match results are loaded.
- Confirm any official winners/final placements needed for scoring are loaded.
- Recalculate points for every participating token.
- Re-run `setPositions(...)` with the final ordering.
- Verify prize distributions are configured in `Treasury` for each asset to be claimed.
- Verify prize pools have the expected balances.
- Do one manual spot-check on at least the top few cartons.

## Closing Tournament

- Finalize the tournament with `Treasury.finalizeTournament(tournamentId)` once all configured prize assets are ready.
- Treat close as final: after close, result corrections are blocked.
- If the tournament uses multiple assets, close each one intentionally.

## After Closing

- Verify claims work for a winning token.
- Verify non-winning or invalid-position claims revert as expected.
- Do not attempt to correct results after close.
- If something looks wrong after close, stop and investigate before encouraging claims.

## Safe Habits

- Never close the tournament before the final leaderboard is confirmed.
- Never assume partial recalculation is enough; final ranking should recalculate every relevant token.
- Keep a human-readable record of every manual result correction.
- Use one dedicated admin wallet for result operations.
- Announce winners only after on-chain positions and prize configuration are verified.
