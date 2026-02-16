# Development Plan

**PURPOSE**: Project planning, task organization, and development roadmap.
For permanent technical information about the project, see CLAUDE.md.

*Last updated: February 15, 2026*

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

### Frontend: ~60% Complete

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
| Leaderboard | `/leaderboard` | **100% mock/hardcoded data** |
| Claim prizes | - | **Not started** |
| Admin: set results | `/admin/dev` | **Not started** |
| Admin: set official winners | `/admin/dev` | **Not started** |
| Admin: set positions | `/admin/dev` | **Not started** |
| Admin: close tournament | `/admin/dev` | **Not started** |
| Admin: set teams hash/deadline | `/admin/dev` | Done |

### Known Bugs in Contracts — FIXED (Feb 9, 2026)

All critical bugs fixed. Only dead code cleanup remains:
- ~~Array sizing mismatch (`bool[33]` → `bool[49]`)~~ FIXED
- ~~Inconsistent team ID validation~~ FIXED (unified to `> 0 && <= MAX_TEAM_ID`)
- `PredictionsFactory.sol`, `Counter.sol`, `Counter.t.sol` — dead code, pending deletion

### Other Observations

- `useWatchContractEvent` for `CartonPurchased` is commented out (doesn't work on Anvil, polling used instead)
- `TODO: fix rerenders` in `predictions.tsx` around `buildFixture`
- No testnet/mainnet deployment config exists (everything targets Anvil localhost)

---

## MVP Roadmap

The complete tournament flow is:

1. Admin configures torneo (teams, groups, deadline) --> **DONE**
2. Users compran cartones (ETH/USDC) --> **DONE**
3. Users envian predicciones (partidos + ganadores) --> **DONE**
4. Admin setea resultados de partidos --> **falta UI admin**
5. Admin setea ganadores oficiales --> **falta UI admin**
6. Sistema calcula puntos y posiciones --> **contrato listo, falta UI admin**
7. Admin cierra torneo --> **falta UI admin**
8. Users ven leaderboard --> **falta todo**
9. Users claimean premios --> **falta todo**

### MVP Tasks (Priority Order)

#### 1. Fix contract bugs (Small - before any deploy) -- MOSTLY DONE
- ~~Fix array sizes in `Predictions.sol` (`bool[49]`, `bool[49][49]`)~~ DONE
- ~~Unify team ID validation (`> 0 && <= MAX_TEAM_ID` everywhere)~~ DONE
- ~~Add tests for team IDs > 32~~ DONE (Feb 9)
- ~~Delete `Counter.sol/Counter.t.sol`~~ DONE (Feb 14)
- `PredictionsFactory.sol` — keeping for future multi-tournament support
- ~~**Dead code cleanup**: `picks` mapping, `Game` struct dead fields, `MAX_INT`, `teamGroup` system~~ DONE (Feb 14)
  - `picks` mapping removed
  - `Game.team1`/`Game.team2` removed (only `id`, `result`, `set` remain)
  - `MAX_INT` replaced with `type(uint256).max`
  - `teamGroup` system fully removed (mapping, hash, set/frozen flags, setTeamGroups, freezeTeamGroups, events)
  - `teamsHash` consolidated: now anchors id+name+groupId (was id+name only); frontend uses single hash for all verification
  - Commented `onlyBeforeResults` modifier removed
- ~~**Pending decision**: Optimizar validación de duplicados en `submitPrediction()`~~ RESUELTO (ya usa gameId + bool[], discusion.md eliminado)
- **Frontend pending**: After redeploying contracts, admin must `setTeamsHash` with the new consolidated hash (id+name+groupId) via `/admin/dev`

#### ~~2. Wire winner predictions submit (Small)~~ DONE
- ~~Connect `predictWinners(tokenId, uint8[4])` to the existing TeamWinnerSelector UI~~

#### ~~2. Show submitted predictions (Medium)~~ DONE
- ~~Read `getPrediction(tokenId)` and `getWinnersPrediction(tokenId)` from contract~~
- ~~Display user's game scores and winner picks after submission~~
- ~~Replace the placeholder "No predictions submitted yet"~~

#### 3. Admin panel: tournament lifecycle (Medium)
- `setResults(gameId, team1Goals, team2Goals)` - set results per game
- `setOfficialWinners(uint8[4])` - set tournament winners
- `setPositions(uint256[], uint256[])` - set final leaderboard
- `closeTournament(tournamentId, token)` - close and snapshot prize pool
- All contract functions exist, just need UI forms + `writeContract` calls

#### 4. Real leaderboard (Medium)
- Read `getPositions()` from contract
- Read `calculateTotalPoints(tokenId)` per token
- Display ranked list with points, replacing mock data
- Show game points + winner points breakdown

#### 5. Prize claiming UI (Medium)
- Read `getUserPrizeAmount(tournamentId, position)` to show claimable amount
- Read `hasUserClaimed(tournamentId, tokenId)` for claim status
- Call `claimPrize(tournamentId, tokenId, token)` with button
- Show ETH + USDC claimable amounts separately

### Pre-MVP: Validation & Traction (Pending Decision)

Antes de seguir avanzando con el frontend, evaluar si conviene lanzar una landing + waitlist para validar tracción. Decisiones pendientes:

- **Target audience**: ¿Cripto-nativos con wallet o público general? Cambia completamente el mensaje y onboarding
- **Canal de distribución**: ¿Dónde mandar tráfico? (Twitter/X cripto, comunidades deportivas, Reddit, ads pagos). Sin tráfico la landing no valida nada
- **Métrica de éxito**: Definir de antemano qué número de signups = tracción suficiente para seguir construyendo
- **Stack de la landing**: ¿No-code (Carrd, Framer) para ir rápido, o página estática propia? No necesita ser parte del monorepo
- **Waitlist tooling**: Mailchimp, Buttondown, Google Form, o algo custom

Estado: **Pensando, retomar semana del 16 Feb 2026**

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

## Related Documents

- See CLAUDE.md for persistent project knowledge and architecture.
- See AGENTS.md for contributor workflow, commands, and conventions.
