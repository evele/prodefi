# ProDefi Development Plan

## 📋 Current Status (July 15, 2025)

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
  - Position/ranking management
  - Comprehensive test coverage (14 tests passing)

- **Test Infrastructure**: 39 tests passing
  - BaseTest.sol with utilities
  - Integration tests
  - All core functionality covered

## 🚧 In Progress: Treasury System

### Current Architecture Decision
**Multi-contract approach** (better than monolithic):
- `Treasury.sol`: Centralized fund management
- `Carton.sol`: Sends % of sales to Treasury
- `Predictions.sol`: Notifies Treasury of final positions
- Future: `PrizeDistribution.sol`: Different prize distribution strategies

### Treasury.sol Progress
**Structure defined** ✅:
```solidity
// Prize pools by tournament
mapping(uint256 => uint256) public prizePools;

// Track claims by tournament and tokenId
mapping(uint256 => mapping(uint256 => bool)) public claimed;

// Prize distribution percentages by tournament
mapping(uint256 => uint8[]) public prizePoolDistributions;
```

**Events defined** ✅:
- `DepositFromSale(uint256 tournamentId, uint256 amount)`
- `ClaimPrize(uint256 tournamentId, uint256 tokenId, address userAddress, uint256 position)`
- `SetPrizeDistribution(uint256 tournamentId, uint8[] percentages)`

## 🎯 Next Tasks (Priority Order)

### Phase 1: Complete Treasury Basic Functions
1. **Implement `depositFromSales()`** 
   - Role verification (`FUND_DEPOSITOR_ROLE`)
   - Add `msg.value` to prize pool
   - Emit event
   - **Status**: Ready for implementation

2. **Implement `setPrizeDistribution()`**
   - Admin only (`DEFAULT_ADMIN_ROLE`)
   - Validate percentages sum ≤ 100
   - Store distribution
   - Handle "leftover" accumulation strategy

3. **Create view functions**
   - `getPrizePool(tournamentId)`
   - `getUserPrizeAmount(tournamentId, tokenId)`
   - `hasTokenClaimed(tournamentId, tokenId)`

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

*Last updated: July 15, 2025 - 21:35*
*Next session: Continue with Treasury.sol implementation*