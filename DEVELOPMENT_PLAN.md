# ProDefi Development Plan

**PURPOSE**: Project planning, task organization, and development roadmap for the team.
This file contains current status, next tasks, priorities, and session planning. For permanent technical information about the project, see CLAUDE.md.

## 📋 Current Status (July 23, 2025)

### ✅ Completed Features
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

## 🚧 Next Phase: Treasury Integration & View Functions

## 🎯 Next Tasks (Priority Order)

### Phase 1: Complete Treasury View Functions ⏳
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

## 🧪 Testing Strategy

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

## 💡 Architecture Decisions Made

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

## 📝 Notes for Tomorrow

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

## 🎯 Next Session (July 24, 2025)

**PRIORITY**: Implement Treasury.sol comprehensive tests
- Treasury core functions are complete (`depositFromSales`, `setPrizeDistribution`, `claimPrize`)
- Need comprehensive test coverage following existing patterns in BaseTest.sol
- Test scenarios: role access, prize calculations, integration with Carton/Predictions
- User is committed to daily coding practice - continue with testing phase

---

## 🎉 Recent Session Achievements

### July 23, 2025 - Treasury Core Functions Complete
- ✅ Implemented `depositFromSales()` with role-based access
- ✅ Implemented `setPrizeDistribution()` with validation and array copying
- ✅ Implemented `claimPrize()` with full prize claiming logic
- ✅ Added contract references to Carton and Predictions
- ✅ Enhanced Predictions.sol with O(1) position lookup
- ✅ Fixed test warnings and maintained clean compilation
- 🧠 **Learning achieved**: calldata vs memory, array copying, integer division, secure ETH transfers

*Last updated: July 23, 2025*