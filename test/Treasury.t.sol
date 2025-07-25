// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./BaseTest.sol";
import "../src/Treasury.sol";

/// @title Treasury Contract Test Suite
/// @notice Comprehensive tests for Treasury prize pool management
contract TreasuryTest is BaseTest {
    // ========== ADDITIONAL CONTRACTS ==========
    Treasury public treasury;
    
    // ========== ADDITIONAL ADDRESSES ==========
    address public fundDepositor = address(0x5);
    address public tournamentManager = address(0x6);
    
    // ========== CONSTANTS ==========
    uint256 public constant TOURNAMENT_ID_1 = 1;
    uint256 public constant TOURNAMENT_ID_2 = 2;
    uint256 public constant INITIAL_DEPOSIT = 1 ether;
    uint256 public constant SMALL_DEPOSIT = 0.1 ether;
    
    // ========== SETUP ==========
    
    function setUp() public override {
        // Deploy contracts with admin as owner for Predictions
        carton = new Carton(admin, pauser, minter);
        
        vm.prank(admin);
        predictions = new Predictions(address(carton));
        
        _setupRoles();
        
        vm.prank(admin);
        uint256 deadline = block.timestamp + DEFAULT_DEADLINE_OFFSET;
        predictions.setSubmissionDeadline(deadline);
        _deployTreasury();
        _setupTreasuryRoles();
        _setupInitialData();
    }
    
    function _deployTreasury() internal {
        treasury = new Treasury(admin, address(carton), address(predictions));
    }
    
    function _setupTreasuryRoles() internal {
        vm.startPrank(admin);
        treasury.grantRole(treasury.FUND_DEPOSITOR_ROLE(), fundDepositor);
        treasury.grantRole(treasury.TOURNAMENT_MANAGER_ROLE(), tournamentManager);
        vm.stopPrank();
    }
    
    function _setupInitialData() internal {
        // Give ETH to test addresses
        vm.deal(fundDepositor, 10 ether);
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
        vm.deal(user3, 1 ether);
        vm.deal(user4, 1 ether);
    }
    
    // ========== TREASURY HELPERS ==========
    
    /// @notice Deposit funds to treasury
    function _depositFunds(uint256 tournamentId, uint256 amount) internal {
        vm.prank(fundDepositor);
        treasury.depositFromSales{value: amount}(tournamentId);
    }
    
    /// @notice Set default prize distribution (50%, 30%, 15%, 5%)
    function _setDefaultPrizeDistribution(uint256 tournamentId) internal {
        uint8[] memory percentages = new uint8[](4);
        percentages[0] = 50; // 1st place
        percentages[1] = 30; // 2nd place
        percentages[2] = 15; // 3rd place
        percentages[3] = 5;  // 4th place
        
        vm.prank(admin);
        treasury.setPrizeDistribution(tournamentId, percentages);
    }
    
    /// @notice Set custom prize distribution
    function _setPrizeDistribution(uint256 tournamentId, uint8[] memory percentages) internal {
        vm.prank(admin);
        treasury.setPrizeDistribution(tournamentId, percentages);
    }
    
    /// @notice Setup complete scenario with predictions and positions
    function _setupCompleteScenarioWithTreasury(uint256 tournamentId) internal {
        // Setup cartons and predictions
        _mintCartonsToUsers();
        
        // Submit predictions manually (like in _setupCompleteScenario but with owner control)
        // User 1 - Perfect predictions
        Predictions.Game[] memory games1 = _createValidGamePrediction();
        _submitCompletePredictions(user1, TOKEN_ID_1, games1, [TEAM_1, TEAM_2, TEAM_3, TEAM_4]);
        
        // User 2 - Good predictions
        uint8[8] memory results2 = [2, 0, 1, 2, 0, 1, 2, 1];
        Predictions.Game[] memory games2 = _createGamePrediction(
            [TEAM_1, TEAM_3, TEAM_5, TEAM_7],
            [TEAM_2, TEAM_4, TEAM_6, TEAM_8],
            results2
        );
        _submitCompletePredictions(user2, TOKEN_ID_2, games2, [TEAM_1, TEAM_3, TEAM_2, TEAM_4]);
        
        // User 3 - Poor predictions
        uint8[8] memory results3 = [1, 1, 2, 0, 1, 0, 1, 2];
        Predictions.Game[] memory games3 = _createGamePrediction(
            [TEAM_1, TEAM_3, TEAM_5, TEAM_7],
            [TEAM_2, TEAM_4, TEAM_6, TEAM_8],
            results3
        );
        _submitCompletePredictions(user3, TOKEN_ID_3, games3, [TEAM_5, TEAM_6, TEAM_7, TEAM_8]);
        
        // Set official results (with admin permission)
        vm.startPrank(admin);
        predictions.setResults(0, 2, 1);
        predictions.setResults(1, 1, 1);
        predictions.setResults(2, 0, 2);
        predictions.setResults(3, 3, 0);
        predictions.setOfficialWinners([TEAM_1, TEAM_2, TEAM_3, TEAM_4]);
        vm.stopPrank();
        
        // Calculate points and set positions (ordered from highest to lowest)
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = TOKEN_ID_1; // 1st place
        tokenIds[1] = TOKEN_ID_2; // 2nd place  
        tokenIds[2] = TOKEN_ID_3; // 3rd place
        
        uint256[] memory points = _calculateAllUserPoints();
        
        vm.prank(admin);
        predictions.setPositions(tokenIds, points);
        
        // Setup treasury
        _depositFunds(tournamentId, INITIAL_DEPOSIT);
        _setDefaultPrizeDistribution(tournamentId);
    }
    
    // ========== DEPOSIT TESTS ==========
    
    function test_DepositFromSales_Success() public {
        _logTestInfo("DepositFromSales Success");
        
        uint256 initialBalance = treasury.prizePools(TOURNAMENT_ID_1);
        
        vm.expectEmit(true, true, false, true);
        emit Treasury.DepositFromSale(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        
        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        
        assertEq(treasury.prizePools(TOURNAMENT_ID_1), initialBalance + INITIAL_DEPOSIT);
    }
    
    function test_DepositFromSales_MultipleDeposits() public {
        _logTestInfo("DepositFromSales Multiple Deposits");
        
        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _depositFunds(TOURNAMENT_ID_1, SMALL_DEPOSIT);
        
        assertEq(treasury.prizePools(TOURNAMENT_ID_1), INITIAL_DEPOSIT + SMALL_DEPOSIT);
    }
    
    function test_DepositFromSales_MultipleTournaments() public {
        _logTestInfo("DepositFromSales Multiple Tournaments");
        
        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _depositFunds(TOURNAMENT_ID_2, SMALL_DEPOSIT);
        
        assertEq(treasury.prizePools(TOURNAMENT_ID_1), INITIAL_DEPOSIT);
        assertEq(treasury.prizePools(TOURNAMENT_ID_2), SMALL_DEPOSIT);
    }
    
    function test_DepositFromSales_OnlyFundDepositorRole() public {
        _logTestInfo("DepositFromSales Role Access Control");
        
        vm.deal(unauthorized, INITIAL_DEPOSIT);
        
        bytes32 role = treasury.FUND_DEPOSITOR_ROLE();
        vm.expectRevert(abi.encodeWithSelector(
            bytes4(keccak256("AccessControlUnauthorizedAccount(address,bytes32)")), 
            unauthorized, 
            role
        ));
        
        vm.prank(unauthorized);
        treasury.depositFromSales{value: INITIAL_DEPOSIT}(TOURNAMENT_ID_1);
    }
    
    function test_DepositFromSales_AdminCanDeposit() public {
        _logTestInfo("DepositFromSales Admin Access");
        
        vm.deal(admin, INITIAL_DEPOSIT);
        
        vm.prank(admin);
        treasury.depositFromSales{value: INITIAL_DEPOSIT}(TOURNAMENT_ID_1);
        
        assertEq(treasury.prizePools(TOURNAMENT_ID_1), INITIAL_DEPOSIT);
    }
    
    function test_DepositFromSales_ZeroValue() public {
        _logTestInfo("DepositFromSales Zero Value");
        
        vm.expectEmit(true, true, false, true);
        emit Treasury.DepositFromSale(TOURNAMENT_ID_1, 0);
        
        vm.prank(fundDepositor);
        treasury.depositFromSales{value: 0}(TOURNAMENT_ID_1);
        
        assertEq(treasury.prizePools(TOURNAMENT_ID_1), 0);
    }
    
    // ========== SET PRIZE DISTRIBUTION TESTS ==========
    
    function test_SetPrizeDistribution_Success() public {
        _logTestInfo("SetPrizeDistribution Success");
        
        uint8[] memory percentages = new uint8[](3);
        percentages[0] = 60;
        percentages[1] = 30;
        percentages[2] = 10;
        
        vm.expectEmit(true, false, false, true);
        emit Treasury.SetPrizeDistribution(TOURNAMENT_ID_1, percentages);
        
        _setPrizeDistribution(TOURNAMENT_ID_1, percentages);
        
        // Verify storage
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, 0), 60);
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, 1), 30);
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, 2), 10);
    }
    
    function test_SetPrizeDistribution_ExactlyNinetyPercent() public {
        _logTestInfo("SetPrizeDistribution Exactly 90%");
        
        uint8[] memory percentages = new uint8[](2);
        percentages[0] = 50;
        percentages[1] = 40;
        
        _setPrizeDistribution(TOURNAMENT_ID_1, percentages);
        
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, 0), 50);
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, 1), 40);
    }
    
    function test_SetPrizeDistribution_ExactlyHundredPercent() public {
        _logTestInfo("SetPrizeDistribution Exactly 100%");
        
        uint8[] memory percentages = new uint8[](1);
        percentages[0] = 100;
        
        _setPrizeDistribution(TOURNAMENT_ID_1, percentages);
        
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, 0), 100);
    }
    
    function test_SetPrizeDistribution_RevertTooLow() public {
        _logTestInfo("SetPrizeDistribution Revert Too Low");
        
        uint8[] memory percentages = new uint8[](2);
        percentages[0] = 50;
        percentages[1] = 39;
        
        _expectRevertWithMessage("Percentage sum must be between 90 and 100");
        
        _setPrizeDistribution(TOURNAMENT_ID_1, percentages);
    }
    
    function test_SetPrizeDistribution_RevertTooHigh() public {
        _logTestInfo("SetPrizeDistribution Revert Too High");
        
        uint8[] memory percentages = new uint8[](2);
        percentages[0] = 60;
        percentages[1] = 41;
        
        _expectRevertWithMessage("Percentage sum must be between 90 and 100");
        
        _setPrizeDistribution(TOURNAMENT_ID_1, percentages);
    }
    
    function test_SetPrizeDistribution_RevertIndividualPercentageTooHigh() public {
        _logTestInfo("SetPrizeDistribution Individual Percentage Too High");
        
        uint8[] memory percentages = new uint8[](1);
        percentages[0] = 101;
        
        _expectRevertWithMessage("Percentage must be between 0 and 100");
        
        _setPrizeDistribution(TOURNAMENT_ID_1, percentages);
    }
    
    function test_SetPrizeDistribution_OnlyAdminRole() public {
        _logTestInfo("SetPrizeDistribution Role Access Control");
        
        uint8[] memory percentages = new uint8[](1);
        percentages[0] = 100;
        
        bytes32 role = treasury.DEFAULT_ADMIN_ROLE();
        vm.expectRevert(abi.encodeWithSelector(
            bytes4(keccak256("AccessControlUnauthorizedAccount(address,bytes32)")), 
            unauthorized, 
            role
        ));
        
        vm.prank(unauthorized);
        treasury.setPrizeDistribution(TOURNAMENT_ID_1, percentages);
    }
    
    function test_SetPrizeDistribution_OverwritePrevious() public {
        _logTestInfo("SetPrizeDistribution Overwrite Previous");
        
        // Set initial distribution
        uint8[] memory initial = new uint8[](2);
        initial[0] = 70;
        initial[1] = 20;
        _setPrizeDistribution(TOURNAMENT_ID_1, initial);
        
        // Set new distribution
        uint8[] memory updated = new uint8[](3);
        updated[0] = 50;
        updated[1] = 30;
        updated[2] = 10;
        _setPrizeDistribution(TOURNAMENT_ID_1, updated);
        
        // Verify new values
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, 0), 50);
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, 1), 30);
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, 2), 10);
    }
    
    function test_SetPrizeDistribution_EmptyArray() public {
        _logTestInfo("SetPrizeDistribution Empty Array");
        
        uint8[] memory empty = new uint8[](0);
        
        _expectRevertWithMessage("Percentage sum must be between 90 and 100");
        
        _setPrizeDistribution(TOURNAMENT_ID_1, empty);
    }
    
    // ========== CLAIM PRIZE TESTS ==========
    
    function test_ClaimPrize_Success() public {
        _logTestInfo("ClaimPrize Success");
        
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        
        uint256 expectedPrize = (INITIAL_DEPOSIT * 50) / 100; // 1st place gets 50%
        uint256 initialBalance = user1.balance;
        
        vm.expectEmit(true, true, true, true);
        emit Treasury.ClaimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, user1, 1);
        
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1);
        
        assertEq(user1.balance, initialBalance + expectedPrize);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1));
    }
    
    function test_ClaimPrize_SecondPlace() public {
        _logTestInfo("ClaimPrize Second Place");
        
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        
        uint256 expectedPrize = (INITIAL_DEPOSIT * 30) / 100; // 2nd place gets 30%
        uint256 initialBalance = user2.balance;
        
        vm.prank(user2);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_2);
        
        assertEq(user2.balance, initialBalance + expectedPrize);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_2));
    }
    
    function test_ClaimPrize_RevertNotOwner() public {
        _logTestInfo("ClaimPrize Revert Not Owner");
        
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        
        _expectRevertWithMessage("Not token owner");
        
        vm.prank(user2); // user2 trying to claim user1's token
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1);
    }
    
    function test_ClaimPrize_RevertAlreadyClaimed() public {
        _logTestInfo("ClaimPrize Revert Already Claimed");
        
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        
        // First claim - should succeed
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1);
        
        // Second claim - should fail
        _expectRevertWithMessage("Already claimed");
        
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1);
    }
    
    function test_ClaimPrize_MultipleUsersCanClaim() public {
        _logTestInfo("ClaimPrize Multiple Users Can Claim");
        
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        
        uint256 user1InitialBalance = user1.balance;
        uint256 user2InitialBalance = user2.balance;
        
        // Both users claim
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1);
        
        vm.prank(user2);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_2);
        
        // Verify both received correct amounts
        uint256 expectedPrize1 = (INITIAL_DEPOSIT * 50) / 100;
        uint256 expectedPrize2 = (INITIAL_DEPOSIT * 30) / 100;
        
        assertEq(user1.balance, user1InitialBalance + expectedPrize1);
        assertEq(user2.balance, user2InitialBalance + expectedPrize2);
        
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1));
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_2));
    }
    
    function test_ClaimPrize_TokenNotInLeaderboard() public {
        _logTestInfo("ClaimPrize Token Not In Leaderboard");
        
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        
        // Mint a carton that has never been added to the leaderboard
        _mintCarton(user4, TOKEN_ID_4);
        
        // Try to claim with a token that's not in the leaderboard
        // This should fail with "Token not in leaderboard" from getCartonPosition()
        vm.expectRevert("Token not in leaderboard");
        vm.prank(user4);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_4);
    }
    
    // ========== INTEGRATION TESTS ==========
    
    function test_Integration_FullFlow() public {
        _logTestInfo("Integration Full Flow");
        
        // Setup scenario
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        
        // Verify initial state
        assertEq(treasury.prizePools(TOURNAMENT_ID_1), INITIAL_DEPOSIT);
        assertFalse(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1));
        
        // All users claim their prizes
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1);
        
        vm.prank(user2);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_2);
        
        vm.prank(user3);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_3);
        
        // Verify final state
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1));
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_2));
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_3));
        
        // Prize pool should remain (leftover from rounding + 4th place unclaimed)
        assertEq(treasury.prizePools(TOURNAMENT_ID_1), INITIAL_DEPOSIT);
    }
    
    function test_Integration_MultiTournamentSupport() public {
        _logTestInfo("Integration Multi Tournament Support");
        
        // Setup two tournaments
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        
        // Tournament 2 with different distribution
        _depositFunds(TOURNAMENT_ID_2, 2 ether);
        uint8[] memory distribution2 = new uint8[](2);
        distribution2[0] = 80;
        distribution2[1] = 20;
        _setPrizeDistribution(TOURNAMENT_ID_2, distribution2);
        
        // Claims for tournament 1
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1);
        
        // Verify isolation between tournaments
        assertFalse(treasury.claimed(TOURNAMENT_ID_2, TOKEN_ID_1));
        
        // User can claim same token for different tournament
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_2, TOKEN_ID_1);
        
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1));
        assertTrue(treasury.claimed(TOURNAMENT_ID_2, TOKEN_ID_1));
    }
    
    // ========== EDGE CASES ==========
    
    function test_EdgeCase_RoundingInPrizeCalculation() public {
        _logTestInfo("Edge Case Rounding in Prize Calculation");
        
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        
        // Deposit amount that will cause rounding
        _depositFunds(TOURNAMENT_ID_1, 333 wei); // Total becomes 1 ether + 333 wei
        
        uint256 totalPool = treasury.prizePools(TOURNAMENT_ID_1);
        uint256 expectedPrize = (totalPool * 50) / 100; // Should round down
        
        uint256 initialBalance = user1.balance;
        
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1);
        
        assertEq(user1.balance, initialBalance + expectedPrize);
    }
    
    function test_EdgeCase_SingleWinnerTakesAll() public {
        _logTestInfo("Edge Case Single Winner Takes All");
        
        _mintCarton(user1, TOKEN_ID_1);
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = TOKEN_ID_1;
        uint256[] memory points = new uint256[](1);
        points[0] = 100; // High points for 1st place
        
        vm.prank(admin);
        predictions.setPositions(tokenIds, points);
        
        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        
        uint8[] memory distribution = new uint8[](1);
        distribution[0] = 100;
        _setPrizeDistribution(TOURNAMENT_ID_1, distribution);
        
        uint256 initialBalance = user1.balance;
        
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1);
        
        assertEq(user1.balance, initialBalance + INITIAL_DEPOSIT);
    }
    
    // ========== VIEW FUNCTIONS TESTS ==========
    
    function test_GetPrizePool_EmptyTournament() public {
        _logTestInfo("GetPrizePool Empty Tournament");
        
        uint256 prizePool = treasury.getPrizePool(TOURNAMENT_ID_1);
        assertEq(prizePool, 0);
    }
    
    function test_GetPrizePool_WithDeposits() public {
        _logTestInfo("GetPrizePool With Deposits");
        
        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _depositFunds(TOURNAMENT_ID_1, SMALL_DEPOSIT);
        
        uint256 prizePool = treasury.getPrizePool(TOURNAMENT_ID_1);
        assertEq(prizePool, INITIAL_DEPOSIT + SMALL_DEPOSIT);
    }
    
    function test_GetUserPrizeAmount_ValidPosition() public {
        _logTestInfo("GetUserPrizeAmount Valid Position");
        
        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        
        // Test different positions
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, 1), (INITIAL_DEPOSIT * 50) / 100); // 1st place: 50%
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, 2), (INITIAL_DEPOSIT * 30) / 100); // 2nd place: 30%
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, 3), (INITIAL_DEPOSIT * 15) / 100); // 3rd place: 15%
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, 4), (INITIAL_DEPOSIT * 5) / 100);  // 4th place: 5%
    }
    
    function test_GetUserPrizeAmount_InvalidPosition() public {
        _logTestInfo("GetUserPrizeAmount Invalid Position");
        
        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        
        // Test position 0 (should revert)
        vm.expectRevert("Invalid position");
        treasury.getUserPrizeAmount(TOURNAMENT_ID_1, 0);
        
        // Test position out of bounds (should revert)
        vm.expectRevert("Invalid position");
        treasury.getUserPrizeAmount(TOURNAMENT_ID_1, 5);
    }
    
    function test_HasUserClaimed_InitiallyFalse() public {
        _logTestInfo("HasUserClaimed Initially False");
        
        bool hasClaimed = treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1);
        assertFalse(hasClaimed);
    }
    
    function test_HasUserClaimed_AfterClaim() public {
        _logTestInfo("HasUserClaimed After Claim");
        
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        
        // Before claim
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1));
        
        // Make claim
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1);
        
        // After claim
        assertTrue(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1));
        
        // Other tokens should still be false
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_2));
    }
    
    function test_ViewFunctions_Integration() public {
        _logTestInfo("View Functions Integration");
        
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        
        // Test getPrizePool
        uint256 totalPool = treasury.getPrizePool(TOURNAMENT_ID_1);
        assertEq(totalPool, INITIAL_DEPOSIT);
        
        // Test getUserPrizeAmount for different positions
        uint256 firstPlacePrize = treasury.getUserPrizeAmount(TOURNAMENT_ID_1, 1);
        uint256 secondPlacePrize = treasury.getUserPrizeAmount(TOURNAMENT_ID_1, 2);
        
        assertEq(firstPlacePrize, (INITIAL_DEPOSIT * 50) / 100);
        assertEq(secondPlacePrize, (INITIAL_DEPOSIT * 30) / 100);
        
        // Test hasUserClaimed before and after claims
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1));
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_2));
        
        // User1 claims
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1);
        
        assertTrue(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1));
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_2)); // Still false
        
        // Verify balances
        assertEq(user1.balance, 1 ether + firstPlacePrize);
    }
}