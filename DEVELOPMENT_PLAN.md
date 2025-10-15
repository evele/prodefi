# Development Plan

**PURPOSE**: Project planning, task organization, and development roadmap for the team.
This file contains current status, next tasks, priorities, and session planning. For permanent technical information about the project, see CLAUDE.md.

## Current Status (October 14, 2025)

### Completed Features (106 tests passing)

- **Carton.sol (ERC1155)**: ✅ COMPLETE with multi-asset purchase and Treasury integration
  - Auto-incrementing tokenIds (`_nextTokenId`)
  - **Multi-asset purchase**: `buyCarton()` (ETH) and `buyCartonWithToken()` (ERC20/USDC)
  - **Automatic Treasury integration**: Auto-deposits to Treasury on each purchase
  - Security: ReentrancyGuard, SafeERC20, low-level ETH calls
  - Treasury configuration: `setTreasuryAddress()`, `setActiveTournament()`
  - Token management: `setAcceptedToken()`, `setTokenPrice()`
  - Price management (`setCartonPrice()`, `withdraw()`, `withdrawToken()`)
  - Role-based access control (Admin, Minter, Pauser, URI Setter)
  - Comprehensive test coverage (35 tests passing, including Treasury integration tests)

- **Predictions.sol**: ✅ COMPLETE
  - Game predictions (4 games, score predictions)
  - Winner predictions (top 4 teams)
  - Point calculation system
  - Deadline enforcement
  - Position/ranking management with O(1) lookup
  - Added `tokenPositions` mapping and `getCartonPosition()` function
  - Comprehensive test coverage (19 tests passing)

- **Treasury.sol**: ✅ COMPLETE with multi-asset support and tournament lifecycle
  - **Multi-asset prize pool management** (ETH + ERC20/USDC)
  - Role-based access control (FUND_DEPOSITOR_ROLE granted to Carton, TOURNAMENT_MANAGER_ROLE)
  - Full integration with Carton (automatic deposits) and Predictions contracts
  - **Tournament Lifecycle Management**:
    - `closeTournament()`: Snapshots prize pool, freezes deposits/distributions, enables claims
    - Prize pool snapshot prevents late deposits from affecting fairness
    - Multi-asset independent closing (ETH and USDC can close separately)
  - **Implemented Functions**:
    - `depositFromSales()`: Receives ETH from sales, blocks after tournament close
    - `depositFromSalesERC20()`: Receives ERC20 from sales, blocks after tournament close
    - `setPrizeDistribution()`: Admin sets percentage distribution per asset (90-100% total)
    - `claimPrize()`: Users claim prizes based on tokenId positions (requires closed tournament)
    - `getUserPrizeAmount()`: Uses snapshot if closed, live pool if open
  - Security: SafeERC20, checks-effects-interactions pattern
  - Contract references to Carton and Predictions for validation
  - Efficient prize calculation with integer division (rounds down)
  - Comprehensive test coverage (52 tests passing, including full ERC20 flow and lifecycle)

- **Deployment**: ✅ COMPLETE
  - Full setup script with Treasury integration
  - Automatic FUND_DEPOSITOR_ROLE grant to Carton
  - TOURNAMENT_MANAGER_ROLE grant to deployer
  - Tournament and price configuration
  - Prize distribution setup

## Next Phase: Treasury Advanced Features

## Next Tasks (Priority Order)

### ✅ Completed (October 14, 2025)
1. ✅ **Carton→Treasury Integration** (Phase 2 - October 2)
   - Added Treasury address storage and `activeTournamentId` to Carton
   - Modified `buyCarton()` to auto-deposit ETH to Treasury
   - Modified `buyCartonWithToken()` to auto-deposit ERC20 to Treasury
   - Added `setTreasuryAddress()` and `setActiveTournament()` admin functions
   - Granted `FUND_DEPOSITOR_ROLE` to Carton contract in deploy script
   - Security improvements: ReentrancyGuard, SafeERC20, low-level calls
   - 10 new integration tests added (35 total in Carton.t.sol)

2. ✅ **Treasury ERC20 Testing** (October 2)
   - Added 9 comprehensive ERC20 tests to Treasury.t.sol
   - Tests cover: deposits, claims, multi-asset scenarios, access control
   - Multi-asset integration working (users can claim ETH + USDC)
   - 41 total tests in Treasury.t.sol

3. ✅ **Tournament Lifecycle Management** (October 14)
   - Implemented `closeTournament(tournamentId, token)` with prize pool snapshot
   - Freezes deposits and distributions post-close
   - Claims gated to require closed tournament (prevents unfair late deposits)
   - `TOURNAMENT_MANAGER_ROLE` now actively used for closing tournaments
   - Multi-asset independent: ETH and USDC pools close separately
   - Updated `getUserPrizeAmount()` to use snapshot when closed
   - 11 new comprehensive lifecycle tests added (52 total in Treasury.t.sol)
   - **CRITICAL BUG FIXED**: Late deposits no longer affect earlier claimants

### Treasury Advanced Features (Future Enhancements)
1. ~~Add `finalizeTournament(tournamentId, token)` with pool snapshot~~ ✅ DONE (`closeTournament`)
2. ERC20 allowlist per tournament and a real supported-assets registry; implement `getSupportedAssets` using it.
3. Telemetry: `totalClaimed[tournamentId][token]` and optionally a `remainingPool` view.
4. ~~Clarify or remove `TOURNAMENT_MANAGER_ROLE`~~ ✅ DONE (actively used for `closeTournament`)
5. Optional admin flow: withdraw remainder (0–10%) to a designated address after close.

### Phase 4: Advanced Prize Distribution
7. **Create PrizeDistribution.sol**
   - Multiple distribution strategies
   - Configurable per tournament
   - Examples: "Winner takes all", "Top 3", "Graduated", etc.

8. **Emergency & Admin Functions**
   - `emergencyWithdraw()`
   - Pause/unpause functionality
   - Treasury migration capabilities

## Testing Strategy

### ✅ Completed Tests (106 total passing)
- ✅ **Carton tests** (35 tests): Purchase flows, Treasury integration, access control, backward compatibility
- ✅ **Treasury tests** (52 tests):
  - ETH/ERC20 deposits, claims, multi-asset scenarios
  - Prize distributions, view functions, access control
  - **Tournament lifecycle**: close success/failures, snapshot behavior, multi-asset independence
  - Deposit blocking after close, claim gating before close
  - Edge cases and integration flows
- ✅ **Predictions tests** (19 tests): Game/winner predictions, point calculation, positions, deadlines

### Pending Tests (Future Features)
- [x] ~~Finalize snapshot: claims use snapped pool; deposits/distribution changes blocked after finalize.~~ ✅ DONE (11 tests)
- [ ] ERC20 allowlist: allowed tokens accepted, non-allowed rejected; claims work per-asset.
- [ ] Supported assets view reflects registry accurately per tournament.
- [ ] Telemetry: `totalClaimed` and `remainingPool` (if added) report expected values across multiple claims.
- [ ] Remainder withdrawal only possible after close and respects cap (0–10%).

## Architecture Decisions Made

### Future Modularization (Post-MVP)
- **Treasury.sol + TournamentManager.sol** → Could become standalone "ProDefi SDK"
- **Generic prize pool management** → Reusable by third-party prediction platforms
- **Modular design approach** → Football-specific logic separate from core infrastructure
- **Decoupling strategy** → Implement after current football project is complete
- **Monetization potential** → License fees, revenue sharing with third parties

### Treasury Design Principles
1. **Prize by tokenId, not by user**: Users can win multiple prizes with different tokens
2. **Leftover accumulation**: Rounding errors accumulate in prize pool for future tournaments
3. **Percentage-based distribution**: Flexible prize allocation (uint8 for 0-100%)
4. **Role-based access**: Separation of concerns between contracts
5. **Multi-tournament support**: Single Treasury handles multiple competitions

### Key Technical Decisions
- `uint8[]` for percentages (0-100%, gas efficient)
- `mapping(uint256 => mapping(uint256 => bool))` for claims tracking
- Auto-incrementing tokenIds for consistency
- `calldata` for external function parameters
- English comments for universality

## Treasury Status (October 14, 2025)

### ✅ Implemented Features

- **Scope and integration**
  - ✅ Treasury holds ETH/ERC20 prize pools per `(tournamentId, token)`, pays claims by token position from `Predictions`
  - ✅ Tracks `claimed` per `(tournamentId, tokenId, asset)` - users can claim multiple assets
  - ✅ **Full Carton integration**: Automatic deposits from `buyCarton()` and `buyCartonWithToken()`
  - ✅ `FUND_DEPOSITOR_ROLE` granted to Carton contract for seamless flow

- **Tournament Lifecycle** ✨ NEW
  - ✅ `closeTournament(tournamentId, token)` snapshots prize pool and freezes state
  - ✅ Deposits blocked after tournament close (prevents late deposit unfairness)
  - ✅ Claims require closed tournament (ensures all prizes calculated from same pool)
  - ✅ Multi-asset independence: ETH and USDC pools close separately
  - ✅ `getUserPrizeAmount()` uses snapshot when closed, live pool when open
  - ✅ **CRITICAL FIX**: Late deposits no longer affect earlier claimants

- **Security and correctness**
  - ✅ Reentrancy: `claimPrize` uses checks-effects-interactions correctly (sets `claimed` before transfer)
  - ✅ SafeERC20: Secure token transfers for non-standard ERC20 tokens
  - ✅ Carton protected with ReentrancyGuard at entry points (buyCarton, buyCartonWithToken)
  - ✅ Position bounds: guarded; uses distribution length to validate `position`
  - ✅ Access control: `FUND_DEPOSITOR_ROLE` on deposits; `DEFAULT_ADMIN_ROLE` on distribution; `TOURNAMENT_MANAGER_ROLE` on close
  - ✅ `TOURNAMENT_MANAGER_ROLE` actively used for tournament lifecycle management

- **Multi-asset support**
  - ✅ ETH + ERC20 (USDC, etc) fully supported and tested
  - ✅ Separate prize distributions per `(tournamentId, token)`
  - ✅ Users can claim prizes for multiple assets in same tournament
  - ⚠️ Missing: allowlist/registry per tournament for accepted ERC20s and proper `getSupportedAssets` implementation

- **Tests and coverage** (52 tests in Treasury.t.sol)
  - ✅ ETH deposits, ERC20 deposits, claims (both assets)
  - ✅ Multi-asset scenarios (user claims ETH + USDC for same tournament)
  - ✅ Distributions, invalid positions, roles, multi-tournament isolation
  - ✅ Access control, view functions, edge cases
  - ✅ Tournament lifecycle: close, snapshot, deposit blocking, claim gating (11 new tests)

### Pending Features (Non-breaking enhancements)

- **Accounting and telemetry**
  - ~~`prizePools` snapshot on close~~ ✅ DONE
  - **Optional**: Add `totalClaimed[tournamentId][token]` for telemetry and expose `remainingPool` view

- **Features and extensibility**
  - Implement proper `getSupportedAssets(tournamentId)` with real registry (currently hardcoded)
  - ERC20 allowlist per tournament for accepted tokens
  - Emergency controls: `pause/unpause` or `emergencyWithdraw` for ops safety
  - Optional admin flow: withdraw remainder (0–10%) to designated address after close
  - Cross-contract semantics: `Predictions` is global (not per tournament). For parallel tournaments with distinct rankings, need per-tournament positions or multiple `Predictions` instances

## Notes for Tomorrow

### Immediate Focus
**Start with `depositFromSales()` implementation** - it's the simplest function and builds foundation for everything else.

### Questions to Consider
1. What percentage of Carton sales should go to Treasury?
2. Should there be a minimum prize pool before claims are enabled?
3. How to handle tournaments with no participants?
4. Emergency scenarios and admin controls?

### Code Style Reminders
- English comments only
- Follow existing OpenZeppelin patterns
- Comprehensive event emission
- Gas-efficient data types
- Security-first approach (reentrancy, access control)

---

---

## Next Session (September 6, 2025)

**Current Status**: ✅ **COMPLETED - Show owned cartones feature**

### Completed Today (September 5, 2025):

## Related Documents

- See CLAUDE.md for persistent project knowledge and architecture.
- See AGENTS.md for contributor workflow, commands, and conventions.
- **Enhanced Carton.sol**: Added `getUserTokens()` function with automatic tracking
- **Implemented token tracking**: `_update()` override handles mint/burn/transfer events
- **Frontend integration**: Real-time display of user's owned cartones
- **Polling system**: 10-second auto-refresh + window focus refresh
- **Event listeners**: Attempted WebSocket events (works on testnet/mainnet, not Anvil)
- **UI updates**: Dynamic button showing "X Carton(es) Owned"

### Priority Options (choose direction):

1. **Prediction System Implementation** 🎯 RECOMMENDED (next logical step)
   - Game predictions form (4 games, score inputs)
   - Winner predictions (top 4 teams dropdowns/selects)
   - Read/display user's current predictions
   - Submission deadline enforcement in UI

2. **Prize Pool Integration**
   - Display real prize pool data from Treasury contract (real ETH amounts)
   - Calculate and show potential winnings per position
   - Connection status improvements (show deployed contracts status)

3. **Leaderboard & Results**
   - Read real tournament data from Predictions contract
   - Display player rankings with points
   - Prize calculation preview
   - Final results and prize claiming

4. **Admin Features**
   - Admin panel for setting game results
   - Tournament management (create/end tournaments)
   - Prize distribution configuration

### Recommended Next Steps:
**Start with Option 1 (Prediction System)** - Now that users can buy and see cartones, implement the core prediction functionality.

### Learning Focus for Next Session:
- **Form handling**: Complex forms with multiple inputs (game scores, team selections)
- **Contract interactions**: Writing predictions to blockchain with `submitGamePicks()` and `submitWinnerPicks()`
- **State management**: Managing form state across multiple prediction types
- **Validation**: Deadline checks, required fields, data formatting

---

### September 5, 2025 - Frontend Migration + Web3 Integration
- ✅ **Next.js → Vite Migration** completed successfully 
  - Migrated from Next.js 15 to Vite + React + TypeScript
  - Resolved Docker/Chakra UI conflicts with cleaner Vite setup
  - All Web3 dependencies working: Wagmi + RainbowKit + TanStack Query
- ✅ **TanStack Router Setup** - Full SPA with type-safe routing
  - File-based routing: `/`, `/predictions`, `/leaderboard`
  - Type-safe navigation with active link styling
  - Shared layout with navigation + wallet connection
- ✅ **Contracts Deployed to Anvil** - Real Web3 integration working
  - Deployed Carton, Predictions, Treasury contracts to localhost:8545
  - Generated and configured ABIs correctly in frontend
  - Environment variables setup for contract addresses
- ✅ **Working Web3 Features**
  - Real ETH balance display in header (updates every 5s)
  - Price reading from deployed contract (0.1 ETH)
  - Buy Carton transaction working with loading states
  - Toast notifications for transaction feedback (Sonner integration)
- 🧠 **Learning achieved**: Migration strategies, TanStack Router concepts, Web3 hooks (useReadContract, useWriteContract, useWaitForTransactionReceipt)

### July 25, 2025 - Treasury View Functions + Frontend Foundation
- ✅ **Treasury.sol view functions** implemented and tested (32 tests passing)
  - `getPrizePool(tournamentId)` - Returns total ETH pool
  - `getUserPrizeAmount(tournamentId, position)` - Calculates prize per position
  - `hasUserClaimed(tournamentId, tokenId)` - Claim status check
- ✅ **Frontend monorepo setup** (Next.js 15 + TypeScript + Wagmi + shadcn/ui)
- ✅ **Professional UI foundation** with wallet connection
- ✅ **Web3 integration ready** - RainbowKit + Wagmi configured for Anvil
- 🧠 **Learning**: shadcn/ui performance benefits, Web3 stack best practices

### July 23, 2025 - Treasury Core Functions Complete
- ✅ Implemented `depositFromSales()` with role-based access
- ✅ Implemented `setPrizeDistribution()` with validation and array copying
- ✅ Implemented `claimPrize()` with full prize claiming logic
- ✅ Added contract references to Carton and Predictions
- ✅ Enhanced Predictions.sol with O(1) position lookup
- ✅ Fixed test warnings and maintained clean compilation
- 🧠 **Learning achieved**: calldata vs memory, array copying, integer division, secure ETH transfers

## Progress (September 9, 2025)

### Completed
- Frontend status UX: simplified TokenStatusBadge, added 'expired' state.
- CartonListItem: on-chain status per token (used/winners) and deadline-aware 'expired'.

## Progress (September 12, 2025)

### Completed
- Admin page (dev-only) at `/admin/dev` with owner actions: setTeamsHash, freezeTeamsHash, setSubmissionDeadline.
- Dev-only navbar link to Admin guarded by `import.meta.env.DEV`.
- Teams lookup optimization: introduced `teamsById` and `indexTeamsById()` for O(1) id→name rendering; kept `getTeamNameById()` for occasional lookups.

### Notes
- Frontend .env holds contract addresses for Anvil (VITE_CARTON_ADDRESS, VITE_PREDICTIONS_ADDRESS, VITE_TREASURY_ADDRESS).
- Admin UI is intentionally disabled in production builds and shows a message if accessed.

## Next Session (September 13, 2025)

### Topic: Prediction Forms (UI + writes)

Goals:
- Wire game form state with onChange handlers (6 games fixture as placeholder).
- Winners form: 4 team selects (unique selection, uses `teams`/`teamsById`).
- Contract writes: `submitPrediction(uint256, Game[])` and `predictWinners(uint256, uint8[4])` via Wagmi.
- Prefill from on-chain reads: `getPrediction(tokenId)` and `getWinnersPrediction(tokenId)`.
- Disable/guard: respect `submissionDeadline` and `used(tokenId)`; prevent edits when expired/used.
- UX: toasts for pending/success/error; loading/disabled states on buttons.

Done criteria:
- Submitting both forms updates on-chain state and reflects in UI after refetch.
- Prevent duplicate submissions when `used(tokenId)` is true or after deadline.
- Inputs validated (scores uint8, winners unique, ids uint8) and typed correctly for ABI.
- Deadline UI: banner + live countdown in /predictions; inputs/buttons disabled when expired; summary on Home.
- DX: added script/dev-cast.sh and documented usage in README.

### Next Focus
- Implement on-chain submission from UI:
  - Wire submitPrediction(tokenId, Game[]) and predictWinners(tokenId, uint8[4]).
  - Form state + validation (ids, duplicates, deadline).
  - UX: loading states, toasts, refetch reads on success.

## Session (October 2, 2025)

### Completed: Multi-asset Treasury Integration

**What was implemented:**
1. **Treasury ERC20 Testing** (9 new tests in Treasury.t.sol)
   - Full ERC20 deposit/claim flow with USDC MockERC20
   - Multi-asset scenarios (user claims both ETH and USDC)
   - Access control for `depositFromSalesERC20()`
   - View functions for ERC20 prize pools

2. **Carton→Treasury Integration** (10 new tests in Carton.t.sol)
   - Added `treasury` and `activeTournamentId` storage to Carton
   - Created ITreasury interface for contract calls
   - Modified `buyCarton()`: auto-deposits ETH to Treasury when configured
   - Modified `buyCartonWithToken()`: auto-deposits ERC20 to Treasury when configured
   - Added admin setters: `setTreasuryAddress()`, `setActiveTournament()`
   - Backward compatibility: works without Treasury configured (legacy mode)

3. **Security Improvements** (contributed by Codex review)
   - Added ReentrancyGuard to Carton: `buyCarton()`, `buyCartonWithToken()`, `withdraw()`, `withdrawToken()`
   - Replaced `transfer()` with low-level `.call()` for ETH transfers (wallet compatibility)
   - Added SafeERC20 usage in `withdrawToken()` (non-standard token support)
   - Fixed event emission to use actual price, not msg.value

4. **Deploy Script Updates**
   - Configured Treasury address and active tournament in Carton
   - Granted `FUND_DEPOSITOR_ROLE` to Carton contract
   - Full end-to-end integration working

**Test Results:** 95 tests passing (was 76)
- Carton: 35 tests (was 25)
- Treasury: 41 tests (was 32)
- Predictions: 19 tests

**Key Achievement:** Complete multi-asset purchase-to-prize-pool flow working seamlessly. Users can buy cartones with ETH or USDC, funds automatically go to Treasury, and users can claim prizes in multiple assets.

**Documentation:**
- Updated CLAUDE.md with current status (October 2, 2025)
- Updated DEVELOPMENT_PLAN.md with completed features and pending tasks

## Session (October 14, 2025)

### Completed: Tournament Lifecycle Management (closeTournament)

**What was implemented:**
1. **closeTournament() Function** (`src/Treasury.sol:191-203`)
   - Snapshots `prizePools[tournamentId][token]` into `closedPrizePools[tournamentId][token]`
   - Sets `isClosedTournament[tournamentId][token] = true`
   - Only `TOURNAMENT_MANAGER_ROLE` can execute
   - Emits `TournamentClosed` event with snapshot amount
   - Validates: tournament not already closed, has prize pool, has distribution set

2. **Deposit Blocking After Close** (`src/Treasury.sol:60, 75`)
   - Both `depositFromSales()` and `depositFromSalesERC20()` revert if tournament closed
   - Prevents unfair late deposits after some users claimed

3. **Claim Gating** (`src/Treasury.sol:87`)
   - `claimPrize()` requires tournament to be closed
   - Ensures all winners claim from same snapshotted pool

4. **View Function Update** (`src/Treasury.sol:148-162`)
   - `getUserPrizeAmount()` uses `closedPrizePools` when tournament closed
   - Uses live `prizePools` when tournament still open
   - Guarantees consistency in prize calculations

5. **Deploy Script Update** (`script/Deploy.s.sol:58-60`)
   - Grant `TOURNAMENT_MANAGER_ROLE` to deployer
   - Enables admin to close tournaments in production

6. **Comprehensive Testing** (`test/Treasury.t.sol`)
   - 11 new tests for tournament lifecycle
   - Tests: close success, double-close revert, role access, deposit blocking, claim gating
   - Multi-asset independence, snapshot behavior
   - Created `_setupCompleteScenarioWithTreasuryNoClose()` helper for lifecycle tests

**Test Results:** 106 tests passing (was 95)
- Carton: 35 tests
- Treasury: 52 tests (was 41) - **11 new lifecycle tests**
- Predictions: 19 tests

**Critical Bug Fixed:**
- Before: Late deposits could increase prize amounts after early claims (unfair)
- After: Prize pool snapshotted at close, all claimants get fair share from same pool

**Documentation:**
- Updated CLAUDE.md with closeTournament functionality
- Updated DEVELOPMENT_PLAN.md with completed lifecycle feature and test counts

## Session (October 15, 2025)

### Completed: ERC20 Backend Infrastructure

**What was implemented:**
1. **MockERC20 Contract** (`src/mocks/MockERC20.sol`)
   - Configurable decimals (USDC uses 6 decimals)
   - Public `mint()` for testing
   - Based on OpenZeppelin ERC20

2. **Deploy Script Updates** (`script/Deploy.s.sol`)
   - Deploys MockUSDC with 6 decimals
   - Configures Carton: `setAcceptedToken(USDC, true)` and `setTokenPrice(USDC, 1 USDC)`
   - Sets USDC prize distribution in Treasury (50%, 30%, 15%, 5%)
   - Mints 1000 USDC to deployer for testing

3. **Deploy Script Automation** (`deploy.sh`)
   - Extracts USDC address from deploy output
   - Updates frontend .env with `VITE_USDC_ADDRESS`
   - Exports USDC ABI to `frontend/src/lib/contracts/usdc-abi.json`
   - Fixed multiple MockERC20 conflicts using `jq` to extract from compiled output

4. **Integration Tests** (`test/ERC20Integration.t.sol`)
   - 3 new tests for complete ERC20 flow
   - `test_BuyCartonWithETH_AutoDepositsToTreasury()` - ETH flow verification
   - `test_BuyCartonWithUSDC_AutoDepositsToTreasury()` - USDC approve + buy flow
   - `test_MultiAssetPrizePool()` - Dual prize pools (ETH + USDC)

5. **Frontend Configuration** (`frontend/src/lib/contracts/`)
   - Added `USDC` to `CONTRACT_ADDRESSES` in `index.ts`
   - Imported and exported `USDC_ABI` in `abis.ts`

**Test Results:** 109 tests passing (was 106)
- Carton: 35 tests
- Treasury: 52 tests
- Predictions: 19 tests
- ERC20Integration: 3 tests (new)

### Current Status: Ready for Frontend Implementation

**✅ Backend Complete:**
- Multi-asset purchase flow working (ETH + USDC)
- Treasury receiving both asset types
- Deploy automation complete
- Frontend config updated (addresses + ABIs)

**🚧 Next: Frontend Multi-Asset Purchase UI**

User needs to implement the ERC20 purchase flow in the frontend. This is a learning task following the guidance workflow.

**Key Requirements:**

1. **Currency Selector** - UI to choose between ETH and USDC
2. **ERC20 Approve Flow** - Two-step transaction process:
   - Check allowance: `usdc.allowance(user, CARTON_ADDRESS)`
   - If insufficient: call `usdc.approve(CARTON_ADDRESS, amount)`
   - Then: call `carton.buyCartonWithToken(USDC_ADDRESS)`
3. **Balance Display** - Show USDC balance alongside ETH
4. **Prize Pool Display** - Read and show both ETH and USDC prize pools from Treasury
5. **State Management** - Handle multi-step transaction flow with proper loading states

**Technical References:**
- Current ETH flow: `frontend/src/routes/index.tsx:33-43`
- Prize pool card: `frontend/src/routes/index.tsx:224-260`
- Wagmi hooks: `useReadContract`, `useWriteContract`, `useWaitForTransactionReceipt`
- Deployed addresses in `frontend/.env` (auto-generated)
- Test wallet has 1000 USDC available for testing

**Learning Focus:**
- ERC20 approve pattern (why 2 transactions?)
- Allowance checking and state management
- Multi-step transaction UX
- Reading contract state for display

*Last updated: October 15, 2025*
