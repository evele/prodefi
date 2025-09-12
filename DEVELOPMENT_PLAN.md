# Development Plan

**PURPOSE**: Project planning, task organization, and development roadmap for the team.
This file contains current status, next tasks, priorities, and session planning. For permanent technical information about the project, see CLAUDE.md.

## Current Status (July 23, 2025)

### Completed Features
- **Carton.sol (ERC1155)**: Complete with purchase system
  - Auto-incrementing tokenIds (`_nextTokenId`)
  - Public `buyCarton()` function with ETH payment
  - Price management (`setCartonPrice()`, `withdraw()`)
  - Role-based access control (Admin, Minter, Pauser, URI Setter)
  - Comprehensive test coverage (20 tests passing)

- **Predictions.sol**: Full prediction logic
  - Game predictions (4 games, score predictions)
  - Winner predictions (top 4 teams)
  - Point calculation system
  - Deadline enforcement
  - Position/ranking management with O(1) lookup
  - Added `tokenPositions` mapping and `getCartonPosition()` function
  - Comprehensive test coverage (14 tests passing)

- **Test Infrastructure**: 39 tests passing
  - BaseTest.sol with utilities
  - Integration tests
  - All core functionality covered

- **Treasury.sol**: ✅ CORE FUNCTIONS COMPLETE
  - Prize pool management with ETH (future USDC support planned)
  - Role-based access control (FUND_DEPOSITOR_ROLE, TOURNAMENT_MANAGER_ROLE)
  - Integration with Carton and Predictions contracts
  - **Implemented Functions**:
    - `depositFromSales()`: Receives ETH from sales, updates prize pools
    - `setPrizeDistribution()`: Admin sets percentage distribution (90-100% total)
    - `claimPrize()`: Users claim prizes based on tokenId positions
  - Contract references to Carton and Predictions for validation
  - Efficient prize calculation with integer division (rounds down)

## Next Phase: Treasury Integration & View Functions

## Next Tasks (Priority Order)

### Phase 1: Complete Treasury View Functions
1. **✅ `depositFromSales()`** - COMPLETED
   - Role verification with `onlyRole(FUND_DEPOSITOR_ROLE)`
   - Adds `msg.value` to prize pool mapping
   - Emits `DepositFromSale` event

2. **✅ `setPrizeDistribution()`** - COMPLETED
   - Admin only with `onlyRole(DEFAULT_ADMIN_ROLE)`
   - Validates percentages sum between 90-100% (reserves for charity/dev)
   - Copies calldata array to storage with proper loop
   - Emits `SetPrizeDistribution` event

3. **✅ `claimPrize()`** - COMPLETED
   - Verifies token ownership via Carton contract
   - Prevents double claiming with mapping
   - Gets position from Predictions contract (O(1) lookup)
   - Calculates prize with integer division
   - Transfers ETH with secure `call{value}` pattern
   - Marks as claimed and emits event

4. **Create view functions** - NEXT PRIORITY
   - `getPrizePool(tournamentId)`
   - `getUserPrizeAmount(tournamentId, position)`
   - `hasUserClaimed(tournamentId, tokenId)`

### Phase 2: Integrate Treasury with Carton Sales
4. **Modify Carton.sol**
   - Add Treasury address storage
   - Modify `buyCarton()` to send % to Treasury
   - Add `setTreasuryAddress()` admin function
   - Grant `FUND_DEPOSITOR_ROLE` to Carton contract

### Phase 3: Prize Claiming System
5. **Implement `claimPrize()`**
   - Verify token ownership
   - Get position from Predictions contract
   - Calculate prize amount
   - Transfer ETH
   - Mark as claimed

6. **Integrate with Predictions.sol**
   - Add Treasury address reference
   - Grant `TOURNAMENT_MANAGER_ROLE` to Predictions
   - Link tournament completion with Treasury

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

### Phase 1 Tests
- [ ] `depositFromSales()` basic functionality
- [ ] Role-based access control
- [ ] Prize pool accumulation
- [ ] Event emission

### Phase 2 Tests
- [ ] Integration test: Carton purchase → Treasury deposit
- [ ] Percentage calculation accuracy
- [ ] Multiple tournament isolation

### Phase 3 Tests
- [ ] End-to-end flow: Purchase → Predict → Claim
- [ ] Double-claim prevention
- [ ] Prize calculation accuracy
- [ ] Leftover accumulation

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

*Last updated: September 9, 2025*
