// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./BaseTest.sol";
import "../src/Treasury.sol";
import "./mocks/MockERC20.sol";

/// @title Treasury Contract Test Suite
/// @notice Comprehensive tests for Treasury prize pool management
contract TreasuryTest is BaseTest {
    // ========== ADDITIONAL CONTRACTS ==========
    Treasury public treasury;
    MockERC20 public USDC;

    // ========== ADDITIONAL ADDRESSES ==========
    address public fundDepositor = address(0x5);
    address public tournamentManager = address(0x6);

    // ========== CONSTANTS ==========
    uint256 public constant TOURNAMENT_ID_1 = 1;
    uint256 public constant TOURNAMENT_ID_2 = 2;
    uint256 public constant INITIAL_DEPOSIT = 1 ether;
    uint256 public constant SMALL_DEPOSIT = 0.1 ether;
    address public constant ETH_TOKEN = address(0); // ETH representation

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
        vm.startPrank(admin);
        _setDefaultTeamGroups();
        vm.stopPrank();
        _deployTreasury();
        _setupTreasuryRoles();
        _setupInitialData();
    }

    function _deployTreasury() internal {
        treasury = new Treasury(admin, address(carton), address(predictions));
        USDC = new MockERC20("USDC", "USDC", 6);
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

        // Give USDC to test addresses (1M USDC each, 6 decimals)
        USDC.mint(fundDepositor, 10_000_000 * 10 ** 6);
        USDC.mint(user1, 1_000_000 * 10 ** 6);
        USDC.mint(user2, 1_000_000 * 10 ** 6);
        USDC.mint(user3, 1_000_000 * 10 ** 6);
        USDC.mint(user4, 1_000_000 * 10 ** 6);
    }

    // ========== TREASURY HELPERS ==========

    /// @notice Deposit funds to treasury
    function _depositFunds(uint256 tournamentId, uint256 amount) internal {
        vm.prank(fundDepositor);
        treasury.depositFromSales{value: amount}(tournamentId);
    }

    /// @notice Set default prize distribution (50%, 30%, 15%, 5%) for ETH
    function _setDefaultPrizeDistribution(uint256 tournamentId) internal {
        uint8[] memory percentages = new uint8[](4);
        percentages[0] = 50; // 1st place
        percentages[1] = 30; // 2nd place
        percentages[2] = 15; // 3rd place
        percentages[3] = 5; // 4th place

        vm.prank(admin);
        treasury.setPrizeDistribution(tournamentId, ETH_TOKEN, percentages);
    }

    /// @notice Set custom prize distribution for ETH
    function _setPrizeDistribution(uint256 tournamentId, uint8[] memory percentages) internal {
        vm.prank(admin);
        treasury.setPrizeDistribution(tournamentId, ETH_TOKEN, percentages);
    }

    /// @notice Set custom prize distribution for specific token
    function _setPrizeDistribution(uint256 tournamentId, address token, uint8[] memory percentages) internal {
        vm.prank(admin);
        treasury.setPrizeDistribution(tournamentId, token, percentages);
    }

    /// @notice Setup complete scenario with predictions and positions (without closing)
    function _setupCompleteScenarioWithTreasuryNoClose(uint256 tournamentId) internal {
        // Setup cartons and predictions
        _mintCartonsToUsers();

        // Submit predictions manually (like in _setupCompleteScenario but with owner control)
        // User 1 - Perfect predictions
        Predictions.Game[] memory games1 = _createValidGamePrediction();
        _submitCompletePredictions(user1, TOKEN_ID_1, games1, [TEAM_1, TEAM_2, TEAM_3, TEAM_4]);

        // User 2 - Good predictions
        uint8[8] memory results2 = [2, 0, 1, 2, 0, 1, 2, 1];
        Predictions.Game[] memory games2 =
            _createGamePrediction([TEAM_1, TEAM_3, TEAM_5, TEAM_7], [TEAM_2, TEAM_4, TEAM_6, TEAM_8], results2);
        _submitCompletePredictions(user2, TOKEN_ID_2, games2, [TEAM_1, TEAM_3, TEAM_2, TEAM_4]);

        // User 3 - Poor predictions
        uint8[8] memory results3 = [1, 1, 2, 0, 1, 0, 1, 2];
        Predictions.Game[] memory games3 =
            _createGamePrediction([TEAM_1, TEAM_3, TEAM_5, TEAM_7], [TEAM_2, TEAM_4, TEAM_6, TEAM_8], results3);
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

        // Setup treasury (WITHOUT closing)
        _depositFunds(tournamentId, INITIAL_DEPOSIT);
        _setDefaultPrizeDistribution(tournamentId);
    }

    /// @notice Setup complete scenario with predictions and positions
    function _setupCompleteScenarioWithTreasury(uint256 tournamentId) internal {
        _setupCompleteScenarioWithTreasuryNoClose(tournamentId);

        // Close tournament so claims can work
        vm.prank(tournamentManager);
        treasury.closeTournament(tournamentId, ETH_TOKEN);
    }

    // ========== DEPOSIT TESTS ==========

    function test_DepositFromSales_Success() public {
        _logTestInfo("DepositFromSales Success");

        uint256 initialBalance = treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN);

        vm.expectEmit(true, true, false, true);
        emit Treasury.DepositFromSale(TOURNAMENT_ID_1, ETH_TOKEN, INITIAL_DEPOSIT);

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);

        assertEq(treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN), initialBalance + INITIAL_DEPOSIT);
    }

    function test_DepositFromSales_MultipleDeposits() public {
        _logTestInfo("DepositFromSales Multiple Deposits");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _depositFunds(TOURNAMENT_ID_1, SMALL_DEPOSIT);

        assertEq(treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN), INITIAL_DEPOSIT + SMALL_DEPOSIT);
    }

    function test_DepositFromSales_MultipleTournaments() public {
        _logTestInfo("DepositFromSales Multiple Tournaments");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _depositFunds(TOURNAMENT_ID_2, SMALL_DEPOSIT);

        assertEq(treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN), INITIAL_DEPOSIT);
        assertEq(treasury.prizePools(TOURNAMENT_ID_2, ETH_TOKEN), SMALL_DEPOSIT);
    }

    function test_DepositFromSales_OnlyFundDepositorRole() public {
        _logTestInfo("DepositFromSales Role Access Control");

        vm.deal(unauthorized, INITIAL_DEPOSIT);

        bytes32 role = treasury.FUND_DEPOSITOR_ROLE();
        vm.expectRevert(
            abi.encodeWithSelector(
                bytes4(keccak256("AccessControlUnauthorizedAccount(address,bytes32)")), unauthorized, role
            )
        );

        vm.prank(unauthorized);
        treasury.depositFromSales{value: INITIAL_DEPOSIT}(TOURNAMENT_ID_1);
    }

    function test_DepositFromSales_AdminCanDeposit() public {
        _logTestInfo("DepositFromSales Admin Access");

        vm.deal(admin, INITIAL_DEPOSIT);

        vm.prank(admin);
        treasury.depositFromSales{value: INITIAL_DEPOSIT}(TOURNAMENT_ID_1);

        assertEq(treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN), INITIAL_DEPOSIT);
    }

    function test_DepositFromSales_ZeroValue() public {
        _logTestInfo("DepositFromSales Zero Value");

        vm.expectRevert("Amount must be greater than 0");

        vm.prank(fundDepositor);
        treasury.depositFromSales{value: 0}(TOURNAMENT_ID_1);
    }

    // ========== SET PRIZE DISTRIBUTION TESTS ==========

    function test_SetPrizeDistribution_Success() public {
        _logTestInfo("SetPrizeDistribution Success");

        uint8[] memory percentages = new uint8[](3);
        percentages[0] = 60;
        percentages[1] = 30;
        percentages[2] = 10;

        vm.expectEmit(true, false, false, true);
        emit Treasury.SetPrizeDistribution(TOURNAMENT_ID_1, ETH_TOKEN, percentages);

        _setPrizeDistribution(TOURNAMENT_ID_1, percentages);

        // Verify storage
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, ETH_TOKEN, 0), 60);
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, ETH_TOKEN, 1), 30);
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, ETH_TOKEN, 2), 10);
    }

    function test_SetPrizeDistribution_ExactlyNinetyPercent() public {
        _logTestInfo("SetPrizeDistribution Exactly 90%");

        uint8[] memory percentages = new uint8[](2);
        percentages[0] = 50;
        percentages[1] = 40;

        _setPrizeDistribution(TOURNAMENT_ID_1, percentages);

        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, ETH_TOKEN, 0), 50);
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, ETH_TOKEN, 1), 40);
    }

    function test_SetPrizeDistribution_ExactlyHundredPercent() public {
        _logTestInfo("SetPrizeDistribution Exactly 100%");

        uint8[] memory percentages = new uint8[](1);
        percentages[0] = 100;

        _setPrizeDistribution(TOURNAMENT_ID_1, percentages);

        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, ETH_TOKEN, 0), 100);
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
        vm.expectRevert(
            abi.encodeWithSelector(
                bytes4(keccak256("AccessControlUnauthorizedAccount(address,bytes32)")), unauthorized, role
            )
        );

        vm.prank(unauthorized);
        treasury.setPrizeDistribution(TOURNAMENT_ID_1, ETH_TOKEN, percentages);
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
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, ETH_TOKEN, 0), 50);
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, ETH_TOKEN, 1), 30);
        assertEq(treasury.prizePoolDistributions(TOURNAMENT_ID_1, ETH_TOKEN, 2), 10);
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
        emit Treasury.ClaimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, user1, ETH_TOKEN, 1, expectedPrize);

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        assertEq(user1.balance, initialBalance + expectedPrize);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
    }

    function test_ClaimPrize_SecondPlace() public {
        _logTestInfo("ClaimPrize Second Place");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        uint256 expectedPrize = (INITIAL_DEPOSIT * 30) / 100; // 2nd place gets 30%
        uint256 initialBalance = user2.balance;

        vm.prank(user2);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN);

        assertEq(user2.balance, initialBalance + expectedPrize);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN));
    }

    function test_ClaimPrize_RevertNotOwner() public {
        _logTestInfo("ClaimPrize Revert Not Owner");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        _expectRevertWithMessage("Not token owner");

        vm.prank(user2); // user2 trying to claim user1's token
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);
    }

    function test_ClaimPrize_RevertAlreadyClaimed() public {
        _logTestInfo("ClaimPrize Revert Already Claimed");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        // First claim - should succeed
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        // Second claim - should fail
        _expectRevertWithMessage("Already claimed");

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);
    }

    function test_ClaimPrize_MultipleUsersCanClaim() public {
        _logTestInfo("ClaimPrize Multiple Users Can Claim");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        uint256 user1InitialBalance = user1.balance;
        uint256 user2InitialBalance = user2.balance;

        // Both users claim
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        vm.prank(user2);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN);

        // Verify both received correct amounts
        uint256 expectedPrize1 = (INITIAL_DEPOSIT * 50) / 100;
        uint256 expectedPrize2 = (INITIAL_DEPOSIT * 30) / 100;

        assertEq(user1.balance, user1InitialBalance + expectedPrize1);
        assertEq(user2.balance, user2InitialBalance + expectedPrize2);

        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN));
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
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_4, ETH_TOKEN);
    }

    // ========== INTEGRATION TESTS ==========

    function test_Integration_FullFlow() public {
        _logTestInfo("Integration Full Flow");

        // Setup scenario
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        // Verify initial state
        assertEq(treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN), INITIAL_DEPOSIT);
        assertFalse(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));

        // All users claim their prizes
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        vm.prank(user2);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN);

        vm.prank(user3);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_3, ETH_TOKEN);

        // Verify final state
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN));
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_3, ETH_TOKEN));

        // Prize pool should remain (leftover from rounding + 4th place unclaimed)
        assertEq(treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN), INITIAL_DEPOSIT);
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

        // Close tournament 2
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_2, ETH_TOKEN);

        // Claims for tournament 1
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        // Verify isolation between tournaments
        assertFalse(treasury.claimed(TOURNAMENT_ID_2, TOKEN_ID_1, ETH_TOKEN));

        // User can claim same token for different tournament
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_2, TOKEN_ID_1, ETH_TOKEN);

        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
        assertTrue(treasury.claimed(TOURNAMENT_ID_2, TOKEN_ID_1, ETH_TOKEN));
    }

    // ========== EDGE CASES ==========

    function test_EdgeCase_RoundingInPrizeCalculation() public {
        _logTestInfo("Edge Case Rounding in Prize Calculation");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);

        // Deposit amount that will cause rounding
        _depositFunds(TOURNAMENT_ID_1, 333 wei); // Total becomes 1 ether + 333 wei

        uint256 totalPool = treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN);
        uint256 expectedPrize = (totalPool * 50) / 100; // Should round down

        // Close tournament
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        uint256 initialBalance = user1.balance;

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

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

        // Close tournament
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        uint256 initialBalance = user1.balance;

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        assertEq(user1.balance, initialBalance + INITIAL_DEPOSIT);
    }

    // ========== VIEW FUNCTIONS TESTS ==========

    function test_GetPrizePool_EmptyTournament() public {
        _logTestInfo("GetPrizePool Empty Tournament");

        uint256 prizePool = treasury.getPrizePool(TOURNAMENT_ID_1, ETH_TOKEN);
        assertEq(prizePool, 0);
    }

    function test_GetPrizePool_WithDeposits() public {
        _logTestInfo("GetPrizePool With Deposits");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _depositFunds(TOURNAMENT_ID_1, SMALL_DEPOSIT);

        uint256 prizePool = treasury.getPrizePool(TOURNAMENT_ID_1, ETH_TOKEN);
        assertEq(prizePool, INITIAL_DEPOSIT + SMALL_DEPOSIT);
    }

    function test_GetUserPrizeAmount_ValidPosition() public {
        _logTestInfo("GetUserPrizeAmount Valid Position");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        // Test different positions
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 1), (INITIAL_DEPOSIT * 50) / 100); // 1st place: 50%
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 2), (INITIAL_DEPOSIT * 30) / 100); // 2nd place: 30%
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 3), (INITIAL_DEPOSIT * 15) / 100); // 3rd place: 15%
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 4), (INITIAL_DEPOSIT * 5) / 100); // 4th place: 5%
    }

    function test_GetUserPrizeAmount_InvalidPosition() public {
        _logTestInfo("GetUserPrizeAmount Invalid Position");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        // Test position 0 (should revert)
        vm.expectRevert("Invalid position");
        treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 0);

        // Test position out of bounds (should revert)
        vm.expectRevert("Invalid position");
        treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 5);
    }

    function test_HasUserClaimed_InitiallyFalse() public {
        _logTestInfo("HasUserClaimed Initially False");

        bool hasClaimed = treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);
        assertFalse(hasClaimed);
    }

    function test_HasUserClaimed_AfterClaim() public {
        _logTestInfo("HasUserClaimed After Claim");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        // Before claim
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));

        // Make claim
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        // After claim
        assertTrue(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));

        // Other tokens should still be false
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN));
    }

    function test_ViewFunctions_Integration() public {
        _logTestInfo("View Functions Integration");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        // Test getPrizePool
        uint256 totalPool = treasury.getPrizePool(TOURNAMENT_ID_1, ETH_TOKEN);
        assertEq(totalPool, INITIAL_DEPOSIT);

        // Test getUserPrizeAmount for different positions
        uint256 firstPlacePrize = treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 1);
        uint256 secondPlacePrize = treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 2);

        assertEq(firstPlacePrize, (INITIAL_DEPOSIT * 50) / 100);
        assertEq(secondPlacePrize, (INITIAL_DEPOSIT * 30) / 100);

        // Test hasUserClaimed before and after claims
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN));

        // User1 claims
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        assertTrue(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN)); // Still false

        // Verify balances
        assertEq(user1.balance, 1 ether + firstPlacePrize);
    }

    // ========== ERC20 TESTS ==========

    function test_DepositFromSalesERC20_Success() public {
        _logTestInfo("DepositFromSalesERC20 Success");

        uint256 depositAmount = 1000 * 10 ** 6; // 1000 USDC
        uint256 initialBalance = treasury.prizePools(TOURNAMENT_ID_1, address(USDC));

        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), depositAmount);

        vm.expectEmit(true, true, false, true);
        emit Treasury.DepositFromSale(TOURNAMENT_ID_1, address(USDC), depositAmount);

        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
        vm.stopPrank();

        assertEq(treasury.prizePools(TOURNAMENT_ID_1, address(USDC)), initialBalance + depositAmount);
        assertEq(USDC.balanceOf(address(treasury)), depositAmount);
    }

    function test_DepositFromSalesERC20_RevertZeroAddress() public {
        _logTestInfo("DepositFromSalesERC20 Revert Zero Address");

        vm.expectRevert("Use depositFromSales for ETH");

        vm.prank(fundDepositor);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(0), 1000);
    }

    function test_DepositFromSalesERC20_RevertZeroAmount() public {
        _logTestInfo("DepositFromSalesERC20 Revert Zero Amount");

        vm.expectRevert("Amount must be greater than 0");

        vm.prank(fundDepositor);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), 0);
    }

    function test_DepositFromSalesERC20_OnlyFundDepositorRole() public {
        _logTestInfo("DepositFromSalesERC20 Role Access Control");

        uint256 depositAmount = 1000 * 10 ** 6;
        USDC.mint(unauthorized, depositAmount);

        vm.startPrank(unauthorized);
        USDC.approve(address(treasury), depositAmount);

        bytes32 role = treasury.FUND_DEPOSITOR_ROLE();
        vm.expectRevert(
            abi.encodeWithSelector(
                bytes4(keccak256("AccessControlUnauthorizedAccount(address,bytes32)")), unauthorized, role
            )
        );

        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
        vm.stopPrank();
    }

    function test_ClaimPrize_ERC20_Success() public {
        _logTestInfo("ClaimPrize ERC20 Success");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        // Deposit USDC and set distribution
        uint256 depositAmount = 1000 * 10 ** 6; // 1000 USDC
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), depositAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
        vm.stopPrank();

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1, address(USDC));

        // Close USDC tournament
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, address(USDC));

        uint256 expectedPrize = (depositAmount * 50) / 100; // 1st place gets 50%
        uint256 initialBalance = USDC.balanceOf(user1);

        vm.expectEmit(true, true, true, true);
        emit Treasury.ClaimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, user1, address(USDC), 1, expectedPrize);

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC));

        assertEq(USDC.balanceOf(user1), initialBalance + expectedPrize);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC)));
    }

    function test_ClaimPrize_ERC20_AlreadyClaimed() public {
        _logTestInfo("ClaimPrize ERC20 Already Claimed");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        uint256 depositAmount = 1000 * 10 ** 6;
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), depositAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
        vm.stopPrank();

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1, address(USDC));

        // Close USDC tournament
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, address(USDC));

        // First claim
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC));

        // Second claim should fail
        _expectRevertWithMessage("Already claimed");

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC));
    }

    function test_MultiAsset_SameTournament() public {
        _logTestInfo("Multi Asset Same Tournament");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        // Deposit USDC
        uint256 usdcAmount = 1000 * 10 ** 6;
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), usdcAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), usdcAmount);
        vm.stopPrank();

        // Set USDC distribution
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1, address(USDC));

        // Close USDC tournament
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, address(USDC));

        // User claims both ETH and USDC prizes
        uint256 ethBalanceBefore = user1.balance;
        uint256 usdcBalanceBefore = USDC.balanceOf(user1);

        vm.startPrank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(0)); // ETH
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC)); // USDC
        vm.stopPrank();

        // Verify both claims
        uint256 expectedEth = (INITIAL_DEPOSIT * 50) / 100;
        uint256 expectedUsdc = (usdcAmount * 50) / 100;

        assertEq(user1.balance, ethBalanceBefore + expectedEth);
        assertEq(USDC.balanceOf(user1), usdcBalanceBefore + expectedUsdc);

        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, address(0)));
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC)));
    }

    function test_GetPrizePool_ERC20() public {
        _logTestInfo("GetPrizePool ERC20");

        uint256 depositAmount = 5000 * 10 ** 6; // 5000 USDC

        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), depositAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
        vm.stopPrank();

        uint256 prizePool = treasury.getPrizePool(TOURNAMENT_ID_1, address(USDC));
        assertEq(prizePool, depositAmount);
    }

    function test_GetUserPrizeAmount_ERC20() public {
        _logTestInfo("GetUserPrizeAmount ERC20");

        uint256 depositAmount = 1000 * 10 ** 6;

        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), depositAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
        vm.stopPrank();

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1, address(USDC));

        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, address(USDC), 1), (depositAmount * 50) / 100);
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, address(USDC), 2), (depositAmount * 30) / 100);
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, address(USDC), 3), (depositAmount * 15) / 100);
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, address(USDC), 4), (depositAmount * 5) / 100);
    }

    /// @notice Set default prize distribution (50%, 30%, 15%, 5%) for specific token
    function _setDefaultPrizeDistribution(uint256 tournamentId, address token) internal {
        uint8[] memory percentages = new uint8[](4);
        percentages[0] = 50; // 1st place
        percentages[1] = 30; // 2nd place
        percentages[2] = 15; // 3rd place
        percentages[3] = 5; // 4th place

        vm.prank(admin);
        treasury.setPrizeDistribution(tournamentId, token, percentages);
    }

    // ========== CLOSE TOURNAMENT TESTS ==========

    function test_CloseTournament_Success() public {
        _logTestInfo("CloseTournament Success");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        vm.expectEmit(true, true, false, true);
        emit Treasury.TournamentClosed(TOURNAMENT_ID_1, ETH_TOKEN, INITIAL_DEPOSIT);

        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        assertTrue(treasury.isClosedTournament(TOURNAMENT_ID_1, ETH_TOKEN));
        assertEq(treasury.closedPrizePools(TOURNAMENT_ID_1, ETH_TOKEN), INITIAL_DEPOSIT);
    }

    function test_CloseTournament_RevertAlreadyClosed() public {
        _logTestInfo("CloseTournament Revert Already Closed");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        vm.startPrank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        _expectRevertWithMessage("Tournament already closed");
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);
        vm.stopPrank();
    }

    function test_CloseTournament_RevertNoPrizePool() public {
        _logTestInfo("CloseTournament Revert No Prize Pool");

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        _expectRevertWithMessage("No prize pool");

        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);
    }

    function test_CloseTournament_RevertNoPrizeDistribution() public {
        _logTestInfo("CloseTournament Revert No Prize Distribution");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);

        _expectRevertWithMessage("No prize distribution");

        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);
    }

    function test_CloseTournament_OnlyTournamentManagerRole() public {
        _logTestInfo("CloseTournament Role Access Control");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        bytes32 role = treasury.TOURNAMENT_MANAGER_ROLE();
        vm.expectRevert(
            abi.encodeWithSelector(
                bytes4(keccak256("AccessControlUnauthorizedAccount(address,bytes32)")), unauthorized, role
            )
        );

        vm.prank(unauthorized);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);
    }

    function test_CloseTournament_DepositsFailAfterClose() public {
        _logTestInfo("CloseTournament Deposits Fail After Close");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        _expectRevertWithMessage("Tournament already closed");

        _depositFunds(TOURNAMENT_ID_1, SMALL_DEPOSIT);
    }

    function test_CloseTournament_ERC20DepositsFailAfterClose() public {
        _logTestInfo("CloseTournament ERC20 Deposits Fail After Close");

        uint256 depositAmount = 1000 * 10 ** 6;
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), depositAmount * 2);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
        vm.stopPrank();

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1, address(USDC));

        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, address(USDC));

        _expectRevertWithMessage("Tournament already closed");

        vm.prank(fundDepositor);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
    }

    function test_CloseTournament_ClaimsOnlyWorkAfterClose() public {
        _logTestInfo("CloseTournament Claims Only Work After Close");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);

        // Try to claim before closing
        _expectRevertWithMessage("Tournament not closed");

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        // Close tournament
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        // Now claim should work
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
    }

    function test_CloseTournament_SnapshotPreventsFutureDepositsAffectingClaims() public {
        _logTestInfo("CloseTournament Snapshot Prevents Future Deposits Affecting Claims");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);

        // Close tournament with 1 ETH
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        uint256 expectedPrize = (INITIAL_DEPOSIT * 50) / 100; // 50% of 1 ETH

        // Claim prize
        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        // User should receive 50% of INITIAL_DEPOSIT, not any future deposits
        assertEq(user1.balance, balanceBefore + expectedPrize);
    }

    function test_CloseTournament_MultiAssetIndependence() public {
        _logTestInfo("CloseTournament Multi Asset Independence");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);

        // Setup USDC pool
        uint256 usdcAmount = 1000 * 10 ** 6;
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), usdcAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), usdcAmount);
        vm.stopPrank();
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1, address(USDC));

        // Close only ETH tournament
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        // ETH should be closed
        assertTrue(treasury.isClosedTournament(TOURNAMENT_ID_1, ETH_TOKEN));

        // USDC should still be open
        assertFalse(treasury.isClosedTournament(TOURNAMENT_ID_1, address(USDC)));

        // Can still deposit USDC
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), usdcAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), usdcAmount);
        vm.stopPrank();

        // Cannot claim USDC yet
        vm.expectRevert("Tournament not closed");
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC));

        // Can claim ETH
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
    }

    function test_CloseTournament_GetUserPrizeAmountUsesSnapshot() public {
        _logTestInfo("CloseTournament GetUserPrizeAmount Uses Snapshot");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        // Before close - uses current pool
        uint256 prizeBeforeClose = treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 1);
        assertEq(prizeBeforeClose, (INITIAL_DEPOSIT * 50) / 100);

        // Close tournament
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        // After close - uses closed pool (snapshot)
        uint256 prizeAfterClose = treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 1);
        assertEq(prizeAfterClose, (INITIAL_DEPOSIT * 50) / 100);

        // They should be equal since no deposits happened between
        assertEq(prizeBeforeClose, prizeAfterClose);
    }
}
