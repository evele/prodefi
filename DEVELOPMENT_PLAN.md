# Development Plan

**PURPOSE**: Project planning, task organization, and development roadmap.
For permanent technical information about the project, see CLAUDE.md.

*Last updated: March 19, 2026*

---

## Current Status

### Smart Contracts: COMPLETE (116 tests passing)

| Contract | Tests | Status |
|---|---|---|
| Carton.sol (ERC1155) | 35 | Complete - multi-asset purchase, Treasury auto-deposit |
| Treasury.sol | 52 | Complete - prize pools, tournament lifecycle, claims |
| Predictions.sol | 14 | Complete - game/winner predictions, points, positions |
| ERC20Integration | 3 | Complete - end-to-end multi-asset flow |
| Integration | 3 | Complete - full workflow, deadline enforcement |
| ~~Counter (boilerplate)~~ | ~~2~~ | ~~Deleted (Feb 14)~~ |

**Deploy script**: Complete with full Treasury integration, role configuration, MockUSDC deployment.

### Frontend: ~85% Complete (MVP flow complete)

| Feature | Route | Status |
|---|---|---|
| Buy carton (ETH) | `/` | Done |
| Buy carton (USDC + approve flow) | `/` | Done |
| View owned cartones | `/` | Done |
| Prize pools display (ETH + USDC) | `/` | Done |
| Submission deadline countdown | `/` | Done |
| Game predictions submit | `/predictions` | Done |
| Winner predictions UI + submit | `/predictions` | Done |
| View submitted predictions | `/predictions` | Done |
| Leaderboard | `/leaderboard` | Done — real on-chain data |
| Claim prizes | `/predictions` | Done — ClaimSection per carton |
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

---

## MVP Roadmap

The complete tournament flow is:

1. Admin configures torneo (teams, groups, deadline) --> **DONE**
2. Users compran cartones (ETH/USDC) --> **DONE**
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
- Prize/points breakdown per asset, "You" badge, empty state

#### ~~5. Prize claiming UI (Medium)~~ DONE (Feb 18)
- ~~Read `getUserPrizeAmount(tournamentId, position)` to show claimable amount~~
- ~~Read `hasUserClaimed(tournamentId, tokenId)` for claim status~~
- ~~Call `claimPrize(tournamentId, tokenId, token)` with button~~
- ~~Show ETH + USDC claimable amounts separately~~
- `ClaimSection` component in `/predictions`, per selected carton, hidden until tournament closed

### Pre-MVP: Validation & Traction (Pending Decision)

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

**Preguntas a responder antes de implementar:**

- **Chain objetivo**: confirmar si el deployment futuro será en una red con buen soporte de bundlers/paymasters (Base, Polygon, etc.)
- **Tipo de wallet**: definir si se apunta a EOAs tradicionales, embedded wallets, o smart accounts desde el inicio
- **Cobertura del sponsorship**: decidir si subsidiar solo `submitPredictions` / `claimPrize`, o también `approve + buyCartonWithToken`
- **Proveedor / stack**: comparar opciones concretas (`Alchemy Account Kit`, `ZeroDev`, `Biconomy`, Safe, etc.)
- **Impacto en frontend**: revisar si conviene reemplazar parcialmente el flujo Wagmi/RainbowKit actual por un stack con smart accounts
- **Impacto en contratos**: verificar si el modelo actual funciona sin cambios relevantes bajo `ERC-4337` y qué casos sí requerirían adaptación
- **Alternativas**: dejar documentado cuándo tendría sentido evaluar `EIP-2771` o `EIP-7702` en vez de 4337

Estado: **Pendiente de investigación dedicada — requiere foco técnico específico antes de tomar decisión**

### Post-MVP (Nice to have)

- ERC20 allowlist per tournament
- `totalClaimed` telemetry + `remainingPool` view
- Admin remainder withdrawal (0-10% after close)
- Emergency controls (pause/unpause, emergencyWithdraw)
- Testnet deployment (Sepolia/Base Goerli)
- Country flags in team UI
- `PredictionsFactory` for multi-tournament support

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
- **Feb 13, 2026**: Dead code audit (Predictions + Treasury), discusion.md obsoleta, DEAD_CODE_REVIEW.md creado
- **Feb 14, 2026**: Dead code cleanup ejecutado (picks, Game struct, MAX_INT, teamGroup system, Counter boilerplate). teamsHash consolidado (id+name+groupId). Frontend actualizado: single hash verification. 116 tests passing
- **Feb 18, 2026**: Real leaderboard (on-chain positions, points, prize pools, "You" badge). Prize claiming UI (ClaimSection per carton in /predictions, ETH + USDC, hidden until closed). MVP flow complete end-to-end.

## Related Documents

- See CLAUDE.md for persistent project knowledge and architecture.
- See AGENTS.md for contributor workflow, commands, and conventions.
