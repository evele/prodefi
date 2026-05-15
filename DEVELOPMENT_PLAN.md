# Development Plan

**PURPOSE**: Project planning, task organization, and development roadmap.
For project overview and stable architecture notes, see README.md.

*Last updated: May 12, 2026*

---

## Current Status

### Smart Contracts: COMPLETE (158 tests passing)

| Contract | Tests | Status |
|---|---|---|
| Carton.sol (ERC1155) | 40 | Complete - tournament-aware mint/purchase flows, Treasury auto-deposit |
| Treasury.sol | 57 | Complete - tournament lifecycle, claims, global reserve, tournament engines |
| Predictions.sol | 55 | Complete - game/winner predictions, points, positions, tournament-scoped engine |
| ERC20Integration | 3 | Complete - end-to-end USDC purchase flow |
| Integration | 3 | Complete - full workflow, deadline enforcement |
| ~~Counter (boilerplate)~~ | ~~2~~ | ~~Deleted (Feb 14)~~ |

**Deploy script**: Complete with full Treasury integration, role configuration, MockUSDC deployment.

### Frontend: ~90% Complete (MVP flow complete)

| Feature | Route | Status |
|---|---|---|
| Buy carton (USDC-only + approve flow) | `/` | Done |
| View owned cartones | `/` | Done |
| Prize pools display (USDC) | `/` | Done |
| Submission deadline countdown | `/` | Done |
| Game predictions submit | `/predictions` | Done |
| Winner predictions UI + submit | `/predictions` | Done |
| View submitted predictions | `/predictions` | Done |
| Leaderboard | `/leaderboard` | Done — real on-chain data |
| Claim prizes | `/predictions` | Done — ClaimSection per carton |
| Official fixture schedule + grouping modes | `/fixtures` | Done |
| Admin: set results | `/admin/dev` | Done |
| Admin: set official winners | `/admin/dev` | Done |
| Admin: set positions | `/admin/dev` | Done |
| Admin: close tournament | `/admin/dev` | Done |
| Admin: set teams hash/deadline | `/admin/dev` | Done |

### Known Bugs in Contracts — FIXED

All critical bugs fixed. All dead code cleaned up:
- ~~Array sizing mismatch (`bool[33]` → `bool[49]`)~~ FIXED
- ~~Inconsistent team ID validation~~ FIXED (unified to `> 0 && <= MAX_TEAM_ID`)
- ~~`Counter.sol`, `Counter.t.sol`~~ DELETED (Feb 14)
- `PredictionsFactory.sol` — kept intentionally for future multi-tournament support

### Other Observations

- `useWatchContractEvent` for `CartonPurchased` is commented out (doesn't work on Anvil, polling used instead)
- `TODO: fix rerenders` in `predictions.tsx` around `buildFixture`
- No testnet/mainnet deployment config exists (everything targets Anvil localhost)
- Leaderboard no longer depends on `getPositions()` storage array; frontend reconstructs rankings from `Carton.nextTokenId()` + `Predictions.tokenPositions(tokenId)` and filters stale entries with `positionsVersion` / `tokenPositionsVersion`
- Alternative considered for future: use `PositionsUpdated` logs as the leaderboard source, optionally storing a `lastPositionsBlock` pointer to query a narrow block range instead of scanning long history
- Frontend still assumes a single active `Predictions` address in `.env`; this is now intentional product scope, while onchain contracts already support a shared multi-tournament architecture underneath

### Multi-Tournament Refactor Status (May 2026)

Completed in code and tests:

- `Treasury` now resolves one competition engine per tournament instead of using a single global `Predictions` reference
- `Treasury` claims now validate `Carton.tokenTournamentId(tokenId)` directly
- retained reserve accounting moved to shared `globalReserve[asset]`
- `Carton` core flows now support explicit `tournamentId` for mint/purchase
- `Predictions` is now tournament-scoped with immutable `tournamentId`
- full contract suite passes with the new architecture (`158` tests)

Product/frontend scope kept intentionally narrow for now:

- one active `Predictions` address in frontend `.env`
- one active tournament UX at a time
- historical claims use the token's real tournament context, even if predictions UI stays bound to the active engine

Implementation notes for the refactor are tracked in `docs/plans/refactormt.md`.

### Scoring Follow-up (May 2026)

Decision locked:

- Keep the current scoring philosophy where closeness to the exact score matters, not only `local / empate / visitante`
- Keep the current `7`-based score curve concept for match predictions
- Match scoring is now `max(0, 7 - diffTotal) + 3` when `local / empate / visitante` is correct
- Exact match predictions now cap at `10` points per game, with a per-game floor of `0`
- Winner scoring is now `25 / 18 / 10 / 10` for `1st / 2nd / 3rd / 4th`

Completed in code and tests:

- Fixed the old `Predictions.sol::calculatePoints()` bug where `abs(7 - diffTotal)` caused points to rise again after `diffTotal > 7`
- Added/updated contract tests for:
  - exact result -> `10`
  - close miss (e.g. `6-5` vs `5-5`)
  - sign-only hit with large miss (e.g. `6-5` vs `1-0`)
  - large miss where `diffTotal > 7` -> base `0`
  - updated winner weights `25 / 18 / 10 / 10`
  - total points when official winners exist but a carton never submitted winner picks
- `/reglas` in `landing/site` now reflects the current scoring definition

Payout / tie product decision locked (see `docs/plans/PRIZE_PAYOUT_IMPLEMENTATION_PLAN.md`):

1. Final ranking is ordered only by total points.
2. If two or more cartones tie on points, they share the position using standard competition ranking (`1, 2, 2, 4`).
3. There is no secondary tie-break by exact scores or any other metric.
4. If a shared block covers prize positions, sum the occupied prizes and split them equally among the tied cartones.
5. Prize model is a fixed 32-place pyramid over the prizeable pool, not a variable-ITM MTT structure.

Next implementation follow-up:

1. Reflect the shared-position rule in code and admin/final-ranking flow
2. Ensure prize-claim logic supports shared ranking blocks like `1, 2, 2, 4`
3. Replace the old default payout assumptions with the fixed 32-place pyramid
4. Replace one-shot `setPositions(...)` admin usage with a batched leaderboard publication flow for large fields

### Recently Completed: USDC-Only Cleanup (Apr 2026)

Completed in code:

- `src/Carton.sol`: `buyCarton()` is disabled onchain; purchases go through `buyCartonWithToken()`
- `script/Deploy.s.sol`: deploy/setup now configures only USDC acceptance, price, and prize distribution
- `frontend/src/routes/index.tsx`: home buy flow is USDC-only with approve + buy UX
- `frontend/src/routes/leaderboard.tsx` and `frontend/src/components/ClaimSection.tsx`: product-facing pool/prize/claim UI shows USDC only
- `frontend/src/routes/admin.dev.tsx`: close-tournament flow is aligned to USDC-only admin usage
- `frontend/src/lib/transaction-errors.ts`: purchase/claim errors now reflect the USDC-only product flow
- `test/Carton.t.sol`: ETH purchase tests updated to expect `EthPurchaseDisabled`

Important note:

- Treasury internals still support multi-asset pools; the product/deploy flow is now USDC-only
- Native ETH is still relevant for gas, so keeping gas-awareness in the UI remains intentional

### Next Session Plan: Prediction Screen Polish

Shipped today in `/predictions`:

- Incomplete match predictions now block submission again and show clearer visual feedback
- Added a combined onchain submit path for `games + winners` while keeping the two separate writes as fallback
- Reset local draft state when switching cartons and after successful submits
- Reused the same `Partidos` / `Ganadores` panels to show already-submitted onchain data
- Removed the duplicate submitted-predictions block from the bottom of the page
- Added clearer per-panel state labels (`Pendiente`, `Borrador`, `Enviado onchain`, `Vencido`)
- Read-only submitted values now keep strong contrast instead of appearing dimmed

Tomorrow's priorities:

1. Keep polishing submitted prediction presentation in the same panels
   - Move sent predictions farther away from "disabled form" aesthetics and closer to a clean summary state
   - Tighten hierarchy/spacing between panel header, status badge, and footer help text
2. Improve success / next-action cues after submit
   - After `games-only` submit, point more strongly to the winners section
   - After full submit, show a clearer "done / waiting for results" state
3. Surface claimable prizes earlier from `/` and `/leaderboard`
4. Do a mobile cleanup pass on dense screens after the state polish lands
5. Before putting the landing fully online, add lightweight anti-spam protection to the waitlist
   - hidden honeypot field
   - server-side rate limiting
   - duplicate email protection / normalization
   - optional Turnstile if basic protections are not enough

Verification for the next frontend pass:

- `cd frontend && npm run lint`
- `cd frontend && npm run build`

---

## MVP Roadmap

The complete tournament flow is:

1. Admin configures torneo (teams, groups, deadline) --> **DONE**
2. Users compran cartones (USDC-only) --> **DONE**
3. Users envian predicciones (partidos + ganadores) --> **DONE**
4. Admin setea resultados de partidos --> **DONE**
5. Admin setea ganadores oficiales --> **DONE**
6. Sistema calcula puntos y posiciones --> **contrato listo, UI admin DONE**
7. Admin cierra torneo --> **DONE**
8. Users ven leaderboard --> **DONE**
9. Users claimean premios --> **DONE**

### MVP Tasks (Priority Order)

#### ~~1. Fix contract bugs~~ DONE (Feb 14)
- All array sizes, team ID validation, dead code (picks, Game struct, MAX_INT, teamGroup system, Counter) cleaned up
- `teamsHash` consolidated to anchor id+name+groupId; frontend uses single hash verification
- **Note**: After redeploying contracts, admin must `setTeamsHash` with the consolidated hash via `/admin/dev`

#### ~~2. Wire winner predictions submit (Small)~~ DONE
- ~~Connect `predictWinners(tokenId, uint8[4])` to the existing TeamWinnerSelector UI~~

#### ~~2. Show submitted predictions (Medium)~~ DONE
- ~~Read `getPrediction(tokenId)` and `getWinnersPrediction(tokenId)` from contract~~
- ~~Display user's game scores and winner picks after submission~~
- ~~Replace the placeholder "No predictions submitted yet"~~

#### ~~3. Admin panel: tournament lifecycle (Medium)~~ DONE
- ~~`setResults(gameId, team1Goals, team2Goals)`~~ Done (SetResultsSection)
- ~~`setOfficialWinners(uint8[4])`~~ Done (SetOfficialWinnersSection)
- ~~`setPositions(uint256[], uint256[])`~~ Done (SetPositionsSection)
- ~~`closeTournament(tournamentId, token)`~~ Done (CloseTournamentSection)

#### ~~4. Real leaderboard (Medium)~~ DONE (Feb 18)
- ~~Read `getPositions()` from contract~~
- ~~Read `calculateTotalPoints(tokenId)` per token~~
- ~~Display ranked list with points, replacing mock data~~
- Prize/points breakdown, "You" badge, empty state

#### ~~5. Prize claiming UI (Medium)~~ DONE (Feb 18)
- ~~Read `getUserPrizeAmount(tournamentId, position)` to show claimable amount~~
- ~~Read `hasUserClaimed(tournamentId, tokenId)` for claim status~~
- ~~Call `claimPrize(tournamentId, tokenId, token)` with button~~
- ~~Show claimable prize amounts in UI~~
- `ClaimSection` component in `/predictions`, per selected carton, hidden until tournament closed, currently USDC-only

### Pre-MVP: Validation & Traction (Pending Decision)

### Frontend UX Focus (Apr 2026)

Context: the MVP flow is functionally complete, so the next highest-leverage work is reducing friction in the core loop `buy carton -> submit predictions -> claim prize`.

#### Recently shipped

- Home now prioritizes the next actionable carton instead of treating all owned cartons equally
- After a successful purchase, the user is redirected directly into `/predictions?carton=<newTokenId>`
- The home screen surfaces a clear "Tu siguiente paso" CTA for the best carton to continue
- The predictions screen auto-selects the most actionable owned carton when opened without a query param
- Carton status handling was normalized (`none` / `partial` / `complete` / `expired`) and winner-prediction detection was made consistent in the frontend
- Prediction submit UX now blocks incomplete match submissions again and supports a combined submit path for `games + winners`
- Submitted predictions are now rendered inside the same `Partidos` / `Ganadores` panels, with hidden send CTAs once that section is already onchain
- Switching cartons and successful submits now reset local drafts correctly instead of leaking previous values
- Read-only submitted prediction values now keep legibility instead of looking dimmed
- Home and predictions now surface explicit native-gas warnings when the connected wallet has no ETH, clarifying that the USDC-only product flow still requires gas for approvals, submits, and claims

#### Next UX sprint recommendation (Priority Order)

1. Finish polishing the unified prediction panels (`/predictions`)
   - Push submitted sections farther toward a clean summary/read-only state instead of a disabled-form look
   - Improve visual hierarchy between carton status, panel state, and footer guidance
   - Goal: make the main prediction screen feel coherent instead of "edit mode + archive mode" mixed together

2. Better blocked/empty/success states
   - Improve copy + primary CTA for:
      - wallet disconnected
      - no cartons owned
     - deadline expired
     - teams hash unset / mismatch
     - tournament not fully configured
   - After successful submit, show a stronger "what next" cue instead of only a toast
   - Goal: users should always know the next action, even when blocked

3. Claim visibility upgrade
   - Surface claimable state earlier from `/` and `/leaderboard`, not only inside `/predictions`
   - Consider a lightweight home card like "You have prizes ready to claim"
   - Goal: make rewards more visible and emotionally sticky

4. Mobile polish on dense screens
   - Revisit `/predictions`, `/leaderboard`, and fixtures on smaller screens
   - Focus on hierarchy, spacing, sticky context, and readability over visual ornament
   - Goal: reduce the feeling of "too much info at once"

#### Product ideas worth evaluating after the UX sprint

- Personal dashboard card on home:
  - active cartons
  - predictions pending
  - best current rank
  - claimable prizes
- Tournament readiness panel for users:
  - deadline set
  - teams synced
  - results phase / claim phase
- Smarter onboarding logic:
  - if connected user has unfinished cartons, bias the app toward prediction continuation rather than purchase

#### Suggested execution order

1. Finish unified prediction panel polish
2. Add stronger blocked/success states
3. Expose claimable prizes earlier
4. Do mobile cleanup pass

This keeps work tightly focused on conversion through the main loop before branching into broader product experiments.

Antes de seguir avanzando con el frontend, evaluar si conviene lanzar una landing + waitlist para validar tracción. Decisiones pendientes:

- **Target audience**: ¿Cripto-nativos con wallet o público general? Cambia completamente el mensaje y onboarding
- **Canal de distribución**: ¿Dónde mandar tráfico? (Twitter/X cripto, comunidades deportivas, Reddit, ads pagos). Sin tráfico la landing no valida nada
- **Métrica de éxito**: Definir de antemano qué número de signups = tracción suficiente para seguir construyendo
- **Stack de la landing**: ¿No-code (Carrd, Framer) para ir rápido, o página estática propia? No necesita ser parte del monorepo
- **Waitlist tooling**: Mailchimp, Buttondown, Google Form, o algo custom

Estado: **Pendiente de decisión — MVP flow ya completo, momento ideal para evaluar antes de seguir**

### Opción: Mini Apps como canal de distribución

En lugar de (o además de) una landing, ProDefi podría desplegarse como Mini App en plataformas existentes con audiencia propia. Esto resuelve el problema de distribución y reduce la fricción de onboarding.

**Plataformas evaluadas:**

- **Lemon Cash** (`https://lemon.me/miniapps`, docs: `https://lemoncash.mintlify.app/quickstart/quickstart`)
  - SDK: `@lemoncash/mini-app-sdk`
  - `authenticate()` devuelve wallet del usuario directamente — sin MetaMask, sin RainbowKit
  - `deposit()` nativo para USDC
  - Chain: **Polygon** (requiere redeploy de contratos)
  - Audiencia: millones de usuarios LatAm con USDC listo — público general, no cripto-nativo
  - Encaja muy bien: compra de carton con USDC ya está implementada, solo cambia el canal

- **Farcaster Mini Apps** (antes "Frames", cliente principal: Warpcast)
  - SDK: `@farcaster/frame-sdk`
  - Provee FID (Farcaster ID) + wallet nativa del usuario
  - Chain: EVM (Ethereum/Base) — compatible con contratos actuales
  - Audiencia: 100% cripto-nativa, ya tienen wallets
  - Casi plug-and-play con el stack actual

- **Beexo**
  - A evaluar — explorar ecosistema y SDK disponible

**Consideraciones generales:**
- El frontend React/Vite es reutilizable en todos los casos
- El modelo de contratos (ERC1155 + USDC) encaja bien con todas las plataformas
- Lemon requiere deploy en Polygon; Farcaster es compatible con EVM actual
- Cada plataforma resuelve distribución + identidad + wallet en un solo paso

Estado: **Opción identificada — pendiente de decisión sobre qué plataforma priorizar**

### Investigación futura: Gas sponsorship / Account Abstraction

Si el objetivo pasa a ser reducir fricción de onboarding y permitir uso sin ETH nativo, evaluar una capa de gas sponsorship antes de seguir puliendo UX de compra.

**Hipótesis inicial:** para ProDefi parece más prometedor investigar `ERC-4337` + `paymaster` que meta-transactions tradicionales tipo `EIP-2771`, porque permitiría subsidiar gas en flujos como submit de predicciones, claims y compra con USDC sin requerir saldo nativo.

**Preguntas a responder antes de implementar full production:**

- **Chain objetivo**: confirmar la red final soportada por el proveedor elegido para embedded wallets + sponsorship
- **Tipo de wallet**: definir si se apunta a EOAs tradicionales, embedded wallets, o smart accounts desde el inicio
- **Cobertura del sponsorship**: decidir si subsidiar solo `submitPredictions` / `claimPrize`, o también `approve + buyCartonWithToken`
- **Proveedor / stack**: comparar opciones concretas (`Openfort`, `Privy`, `Dynamic`, `Para`, `Alchemy Account Kit`, `ZeroDev`, `Biconomy`, Safe, etc.)
- **Impacto en frontend**: revisar si conviene reemplazar parcialmente el flujo Wagmi/RainbowKit actual por un stack con smart accounts
- **Impacto en contratos**: verificar si el modelo actual funciona sin cambios relevantes bajo `ERC-4337` y qué casos sí requerirían adaptación
- **Alternativas**: dejar documentado cuándo tendría sentido evaluar `EIP-2771` o `EIP-7702` en vez de 4337

**Decisión tomada (dev spike):** avanzar con `Openfort` como proveedor inicial por costo/feature set. Se prioriza `email/social login + embedded wallet`, dejando la elección final de red para después.

**Spike ejecutado en frontend (May 2026):**

- Se instaló `@openfort/react` en `frontend/`.
- Se integró una primera capa de `OpenfortProvider` + `OpenfortWagmiBridge` en `frontend/src/components/providers.tsx`.
- Se agregó config reusable de chain/env en `frontend/src/lib/chains.ts`.
- Se actualizó `frontend/src/lib/wagmi.ts` para usar Openfort cuando haya keys configuradas y la chain esté soportada, con fallback al flujo actual de `RainbowKit` cuando no.
- Se reemplazó el `ConnectButton` de la app shell por `frontend/src/components/WalletButton.tsx`, con soporte para:
  - `email OTP`
  - `Google`
  - wallet externa opcional
- Se agregó `frontend/.env.example` con variables para chain, RPC y keys de Openfort.
- El build de `frontend/` pasa después de la integración.

**Importante:** Openfort no quedó activado ciegamente sobre `Anvil`. Mientras no existan keys reales de Openfort y una chain soportada/configurada, el frontend sigue cayendo al flujo anterior con RainbowKit para no romper desarrollo local.

**Bloqueos / próximos pasos para activarlo de verdad:**

1. Elegir una chain soportada por Openfort para embedded wallets + sponsorship.
2. Deployar contratos de ProDefi en esa red/testnet.
3. Cargar en `frontend/.env`:
   - `VITE_OPENFORT_PUBLISHABLE_KEY`
   - `VITE_OPENFORT_SHIELD_PUBLISHABLE_KEY`
   - `VITE_CHAIN_ID`
   - `VITE_RPC_URL`
   - direcciones de contratos (`VITE_CARTON_ADDRESS`, `VITE_PREDICTIONS_ADDRESS`, `VITE_TREASURY_ADDRESS`, `VITE_USDC_ADDRESS`)
4. Probar login real con Openfort y validar que `wagmi` siga resolviendo la cuenta embebida correctamente.
5. Elegir el primer flujo transaccional para sponsorship real. Orden sugerido:
   - `submitPredictionAndWinners`
   - `claimPrize`
   - `buyCartonWithToken`

Estado: **Spike inicial integrado en frontend — pendiente activar con keys + red + contratos desplegados**

### Next Session Plan: Openfort Activation

Goal for the next session:

- turn the current Openfort frontend spike into a real end-to-end dev/testnet flow

Tomorrow's priorities:

1. Pick the first real Openfort-compatible chain/testnet
   - prefer a network with strong embedded wallet + sponsorship support
   - keep the choice pragmatic; user-facing chain can be revisited later
2. Deploy ProDefi contracts there and update frontend envs
3. Map the exact ProDefi flows that should benefit from sponsorship first
   - `submitPredictionAndWinners`
   - `claimPrize`
   - `buyCartonWithToken`
   - possible USDC approve replacement paths (`permit`, session keys, or bundling)
4. Validate the current frontend bridge
   - confirm `useAccount`, reads, and writes still work with the embedded wallet path
   - remove or reduce RainbowKit fallback once the Openfort path is stable
5. Implement the first real sponsored action
   - likely target: login + embedded wallet creation + one sponsored action on testnet/dev

Key evaluation questions:

- Can Openfort stay compatible with the current `wagmi`-based read/write model without a large route refactor?
- Can sponsorship cover the first selected flow without changing the current contract model?
- Is there a realistic path to remove the explicit USDC `approve` friction from the happy path?
- When the Openfort path is stable, should the app remain mixed (`Openfort + external wallets`) or become embedded-first?

### Post-MVP (Nice to have)

- ERC20 allowlist per tournament
- `totalClaimed` telemetry + `remainingPool` view
- Admin remainder withdrawal (0-10% after close)
- Emergency controls (pause/unpause, emergencyWithdraw)
- Testnet deployment (Sepolia/Base Goerli)
- Country flags in team UI
- `PredictionsFactory` for multi-tournament support

### Tournament lifecycle consolidation

- Lifecycle state is tournament-wide: `closeSales(tournamentId)` blocks new purchases/deposits, while `finalizeTournament(tournamentId)` snapshots configured prize assets and enables claims.
- Prize accounting remains token-based inside `Treasury` (`prizePools`, `prizePoolDistributions`, claims), but the product/frontend is USDC-only for now.
- Prize distribution is intended to be set after sales close, when the final pool is known. Distribution may sum to less than 100% to leave room for development, donation, jackpot, or other reserves.
- Results can be set onchain as matches are played. Provisional rankings can be computed offchain for display, while final positions are set onchain once and become the source of truth for prize claims.
- Deferred integrity improvements: challenge window before finalization, batched final-position verification, and `resultsHash`/`leaderboardHash` commitments for the offchain ranking calculation.

### Deferred Architecture Follow-up: Shared Treasury + Tournament-Scoped Predictions

- Keep `Treasury` as the shared multi-tournament accounting layer keyed by `tournamentId`.
- Treat each `Predictions` deployment as one tournament instance instead of making `Predictions` fully multi-tournament.
- Future architecture step: let `Treasury` resolve the correct `Predictions` contract per `tournamentId` instead of relying on a single global `predictionsContract` reference.
- `Carton` token metadata should remain tournament-aware so admin flows and claims can validate the tournament context cheaply.
- This is intentionally deferred while the current work focuses on batched leaderboard publication for the active tournament model.

---

## Architecture Decisions

### Design Principles
1. **Prize by tokenId, not by user**: Users can win multiple prizes with different tokens
2. **Leftover accumulation**: Rounding errors stay in pool for future tournaments
3. **Percentage-based distribution**: Flexible allocation (uint8 for 0-100%)
4. **Role-based access**: Separation of concerns between contracts
5. **Multi-tournament support**: Single Treasury handles multiple competitions

### Key Technical Decisions
- `uint8[]` for percentages (0-100%, gas efficient)
- Auto-incrementing tokenIds
- `calldata` for external function parameters
- English comments for universality
- `Predictions` is global (not per tournament) - for parallel tournaments need multiple instances or per-tournament positions

---

## Session History (Condensed)

- **Jul 2025**: Treasury core (deposits, distributions, claims, view functions)
- **Sep 5, 2025**: Next.js -> Vite migration, Web3 integration, deploy to Anvil
- **Sep 9, 2025**: Carton status UX (TokenStatusBadge, expired state)
- **Sep 12, 2025**: Admin dev page, teams hash/groups, O(1) team lookup
- **Sep 13, 2025**: Game prediction forms + submission, deadline UI
- **Oct 2, 2025**: Multi-asset Treasury integration (ETH + USDC), security improvements
- **Oct 14, 2025**: Tournament lifecycle (`closeTournament` + snapshot), 106 tests
- **Oct 15, 2025**: MockERC20, deploy automation, frontend multi-asset UI
- **Feb 9, 2026**: Fixed 2 stale tests (team ID 33->49), identified contract bugs, full project review
- **Feb 13, 2026**: Dead code audit (Predictions + Treasury), discusion.md obsoleta, `docs/archive/DEAD_CODE_REVIEW.md` creado
- **Feb 14, 2026**: Dead code cleanup ejecutado (picks, Game struct, MAX_INT, teamGroup system, Counter boilerplate). teamsHash consolidado (id+name+groupId). Frontend actualizado: single hash verification. 116 tests passing
- **Feb 18, 2026**: Real leaderboard (on-chain positions, points, prize pools, "You" badge). Prize claiming UI (ClaimSection per carton in /predictions, ETH + USDC, hidden until closed). MVP flow complete end-to-end.
- **Apr 15, 2026**: USDC-only cleanup completed. ETH purchase disabled onchain, deploy/product flow aligned to USDC-only, and product-facing prize/claim/admin UX updated while keeping native balance visible for gas awareness.
- **Apr 8, 2026**: UX iteration on home/predictions. Added purchase -> prediction handoff, actionable-carton prioritization, clearer carton status surfacing, and automatic selection of the best carton to continue.
- **Apr 15, 2026**: Predictions UX iteration. Added combined submit path, restored incomplete-match submit blocking, reset drafts on carton change/success, unified submitted predictions into the same panels, and improved read-only legibility for already-sent values.
- **May 12, 2026**: Core multi-tournament refactor completed. `Treasury` now resolves tournament-scoped competition engines, uses shared `globalReserve`, and validates claims by `tokenTournamentId`. `Carton` and `Predictions` were updated to explicit/tournament-scoped flows; full contract suite now passes with 158 tests.
- **May 12, 2026**: Fixture UX upgraded. Added official FIFA group-stage schedule data, timezone-aware kickoff conversion, cleaner prediction-match metadata layout, and 3 main fixture tabs (`Por grupo`, `Por fecha`, `Posiciones`) with `localStorage` persistence.

## Related Documents

- See README.md for project overview, architecture, and doc map.
- See AGENTS.md for contributor workflow, commands, and conventions.
- See `knowledge/openfort.md` as the canonical reference before changing the Openfort integration.
