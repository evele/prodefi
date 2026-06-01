// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./BaseTest.sol";
import "../src/Treasury.sol";
import "./mocks/MockERC20.sol";

contract MockCompetitionEngine {
    bool public ready;

    function setReady(bool newReady) external {
        ready = newReady;
    }

    function isReadyForFinalization() external view returns (bool) {
        return ready;
    }
}

contract ReentrantPrizeClaimer {
    Treasury public immutable treasury;
    uint256 public tournamentId;
    uint256 public tokenId;
    bool public reentryAttempted;
    bool public reentryBlocked;

    constructor(Treasury treasury_) {
        treasury = treasury_;
    }

    function attack(uint256 tournamentId_, uint256 tokenId_) external {
        tournamentId = tournamentId_;
        tokenId = tokenId_;
        treasury.claimPrize(tournamentId_, tokenId_, address(0));
    }

    receive() external payable {
        if (reentryAttempted) return;
        reentryAttempted = true;

        try treasury.claimPrize(tournamentId, tokenId, address(0)) { }
        catch {
            reentryBlocked = true;
        }
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        pure
        returns (bytes4)
    {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x01ffc9a7 || interfaceId == 0x4e2312e0;
    }
}

/// @title Treasury Contract Test Suite
/// @notice Comprehensive tests for Treasury prize pool management
contract TreasuryTest is BaseTest {
    // ========== ADDITIONAL CONTRACTS ==========
    Treasury public treasury;
    MockERC20 public USDC;
    MockCompetitionEngine public tournament2Engine;

    // ========== ADDITIONAL ADDRESSES ==========
    address public fundDepositor = address(0x5);
    address public tournamentManager = address(0x6);

    // ========== CONSTANTS ==========
    uint256 public constant TOURNAMENT_ID_1 = 1;
    uint256 public constant TOURNAMENT_ID_2 = 2;
    uint256 public constant INITIAL_DEPOSIT = 1 ether;
    uint256 public constant SMALL_DEPOSIT = 0.1 ether;
    address public constant ETH_TOKEN = address(0); // ETH representation
    uint16 public constant RESERVE_BPS = 500;

    // ========== SETUP ==========

    function setUp() public override {
        // Deploy contracts with admin as owner for Predictions
        carton = new Carton(admin, pauser, minter);

        vm.prank(admin);
        carton.setActiveTournament(TOURNAMENT_ID_1);

        vm.prank(admin);
        predictions = new Predictions(address(carton), TOURNAMENT_ID_1);

        tournament2Engine = new MockCompetitionEngine();

        _setupRoles();

        vm.startPrank(admin);
        predictions.setSubmissionDeadline(block.timestamp + DEFAULT_DEADLINE_OFFSET);
        predictions.setTotalGames(4);
        vm.stopPrank();
        _deployTreasury();
        _setupTreasuryRoles();
        _setupInitialData();
    }

    function _deployTreasury() internal {
        treasury = new Treasury(admin, address(carton), 500);
        USDC = new MockERC20("USDC", "USDC", 6);

        vm.startPrank(admin);
        carton.setTreasuryAddress(address(treasury));
        treasury.setSupportedPrizeToken(address(USDC), true);
        treasury.registerTournament(TOURNAMENT_ID_1, address(predictions));
        treasury.registerTournament(TOURNAMENT_ID_2, address(tournament2Engine));
        vm.stopPrank();
    }

    function _mintTournamentToken(address to, uint256 tournamentId) internal returns (uint256) {
        vm.prank(minter);
        return carton.mintForTournament(to, tournamentId, 1, "");
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
        treasury.depositFromSales{ value: amount }(tournamentId);
    }

    /// @notice Set default prize distribution (50%, 30%, 15%, 5%) for ETH
    function _setDefaultPrizeDistribution(uint256 tournamentId) internal {
        uint8[] memory percentages = new uint8[](4);
        percentages[0] = 50; // 1st place
        percentages[1] = 30; // 2nd place
        percentages[2] = 15; // 3rd place
        percentages[3] = 5; // 4th place

        _closeSalesIfOpen(tournamentId);
        vm.prank(admin);
        treasury.setPrizeDistribution(tournamentId, ETH_TOKEN, percentages);
    }

    /// @notice Set custom prize distribution for ETH
    function _setPrizeDistribution(uint256 tournamentId, uint8[] memory percentages) internal {
        _closeSalesIfOpen(tournamentId);
        vm.prank(admin);
        treasury.setPrizeDistribution(tournamentId, ETH_TOKEN, percentages);
    }

    /// @notice Set custom prize distribution for specific token
    function _setPrizeDistribution(uint256 tournamentId, address token, uint8[] memory percentages) internal {
        _closeSalesIfOpen(tournamentId);
        vm.prank(admin);
        treasury.setPrizeDistribution(tournamentId, token, percentages);
    }

    function _closeSalesIfOpen(uint256 tournamentId) internal {
        if (!treasury.salesClosed(tournamentId)) {
            vm.prank(tournamentManager);
            treasury.closeSales(tournamentId);
        }
    }

    function _prizeableAmount(uint256 grossAmount) internal pure returns (uint256) {
        return grossAmount - ((grossAmount * RESERVE_BPS) / 10_000);
    }

    function _reserveAmount(uint256 grossAmount) internal pure returns (uint256) {
        return (grossAmount * RESERVE_BPS) / 10_000;
    }

    function _setFinalPrizeAmountsAndSeal(
        uint256 tournamentId,
        address token,
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) internal {
        vm.startPrank(admin);
        treasury.setFinalPrizeAmounts(tournamentId, token, tokenIds, amounts);
        treasury.sealFinalPrizeAmounts(tournamentId, token);
        vm.stopPrank();
    }

    function _setDefaultFinalPrizeAmounts(uint256 tournamentId, address token) internal {
        uint256 prizePool = treasury.getPrizePool(tournamentId, token);

        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = TOKEN_ID_1;
        tokenIds[1] = TOKEN_ID_2;
        tokenIds[2] = TOKEN_ID_3;

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = (prizePool * 50) / 100;
        amounts[1] = (prizePool * 30) / 100;
        amounts[2] = (prizePool * 15) / 100;

        _setFinalPrizeAmountsAndSeal(tournamentId, token, tokenIds, amounts);
    }

    function _setupSubmittedPredictionsScenario() internal {
        _mintCartonsToUsers();

        Predictions.Prediction[] memory preds1 = _createValidGamePrediction();
        _submitCompletePredictions(user1, TOKEN_ID_1, preds1, [TEAM_1, TEAM_2, TEAM_3, TEAM_4]);

        uint8[8] memory results2 = [2, 0, 1, 2, 0, 1, 2, 1];
        Predictions.Prediction[] memory preds2 = _createGamePrediction(results2);
        _submitCompletePredictions(user2, TOKEN_ID_2, preds2, [TEAM_1, TEAM_3, TEAM_2, TEAM_4]);

        uint8[8] memory results3 = [1, 1, 2, 0, 1, 0, 1, 2];
        Predictions.Prediction[] memory preds3 = _createGamePrediction(results3);
        _submitCompletePredictions(user3, TOKEN_ID_3, preds3, [TEAM_5, TEAM_6, TEAM_7, TEAM_8]);
    }

    function _setOfficialResultsAndPositions() internal {
        _closeSalesIfOpen(TOURNAMENT_ID_1);

        vm.startPrank(admin);
        predictions.setResults(1, 2, 1);
        predictions.setResults(2, 1, 1);
        predictions.setResults(3, 0, 2);
        predictions.setResults(4, 3, 0);
        predictions.setOfficialWinners([TEAM_1, TEAM_2, TEAM_3, TEAM_4]);
        vm.stopPrank();

        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = TOKEN_ID_1;
        tokenIds[1] = TOKEN_ID_2;
        tokenIds[2] = TOKEN_ID_3;

        uint256[] memory points = _calculateAllUserPoints();

        vm.prank(admin);
        predictions.setPositions(tokenIds, points);
    }

    function _setupScenarioWithOpenSales(uint256 tournamentId) internal {
        _setupSubmittedPredictionsScenario();
        _depositFunds(tournamentId, INITIAL_DEPOSIT);
    }

    /// @notice Setup complete scenario with predictions and positions before tournament finalization
    function _setupCompleteScenarioWithTreasuryNoClose(uint256 tournamentId) internal {
        _setupScenarioWithOpenSales(tournamentId);
        _setOfficialResultsAndPositions();
    }

    /// @notice Setup complete scenario with predictions and positions
    function _setupCompleteScenarioWithTreasury(uint256 tournamentId) internal {
        _setupCompleteScenarioWithTreasuryNoClose(tournamentId);

        _closeSalesIfOpen(tournamentId);
        _setDefaultPrizeDistribution(tournamentId);
        _setDefaultFinalPrizeAmounts(tournamentId, ETH_TOKEN);

        // Finalize tournament so claims can work
        vm.prank(tournamentManager);
        treasury.finalizeTournament(tournamentId);
    }

    // ========== DEPOSIT TESTS ==========

    function test_DepositFromSales_Success() public {
        _logTestInfo("DepositFromSales Success");

        uint256 initialBalance = treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN);

        vm.expectEmit(true, true, false, true);
        emit Treasury.DepositFromSale(TOURNAMENT_ID_1, ETH_TOKEN, INITIAL_DEPOSIT);

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);

        assertEq(treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN), initialBalance + _prizeableAmount(INITIAL_DEPOSIT));
        assertEq(treasury.globalReserve(ETH_TOKEN), _reserveAmount(INITIAL_DEPOSIT));
    }

    function test_DepositFromSales_MultipleDeposits() public {
        _logTestInfo("DepositFromSales Multiple Deposits");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _depositFunds(TOURNAMENT_ID_1, SMALL_DEPOSIT);

        assertEq(
            treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN),
            _prizeableAmount(INITIAL_DEPOSIT) + _prizeableAmount(SMALL_DEPOSIT)
        );
    }

    function test_DepositFromSales_MultipleTournaments() public {
        _logTestInfo("DepositFromSales Multiple Tournaments");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _depositFunds(TOURNAMENT_ID_2, SMALL_DEPOSIT);

        assertEq(treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN), _prizeableAmount(INITIAL_DEPOSIT));
        assertEq(treasury.prizePools(TOURNAMENT_ID_2, ETH_TOKEN), _prizeableAmount(SMALL_DEPOSIT));
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
        treasury.depositFromSales{ value: INITIAL_DEPOSIT }(TOURNAMENT_ID_1);
    }

    function test_DepositFromSales_AdminCanDeposit() public {
        _logTestInfo("DepositFromSales Admin Access");

        vm.deal(admin, INITIAL_DEPOSIT);

        vm.prank(admin);
        treasury.depositFromSales{ value: INITIAL_DEPOSIT }(TOURNAMENT_ID_1);

        assertEq(treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN), _prizeableAmount(INITIAL_DEPOSIT));
    }

    function test_DepositFromSales_ZeroValue() public {
        _logTestInfo("DepositFromSales Zero Value");

        vm.expectRevert(Treasury.ZeroAmount.selector);

        vm.prank(fundDepositor);
        treasury.depositFromSales{ value: 0 }(TOURNAMENT_ID_1);
    }

    // ========== SET PRIZE DISTRIBUTION TESTS ==========

    function test_SetPrizeDistribution_Success() public {
        _logTestInfo("SetPrizeDistribution Success");

        uint8[] memory percentages = new uint8[](3);
        percentages[0] = 60;
        percentages[1] = 30;
        percentages[2] = 10;

        _closeSalesIfOpen(TOURNAMENT_ID_1);

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

    function test_SetPrizeDistribution_RevertZeroSum() public {
        _logTestInfo("SetPrizeDistribution Revert Zero Sum");

        uint8[] memory percentages = new uint8[](2);
        percentages[0] = 0;
        percentages[1] = 0;

        _closeSalesIfOpen(TOURNAMENT_ID_1);

        vm.expectRevert(Treasury.InvalidPercentageSum.selector);

        vm.prank(admin);
        treasury.setPrizeDistribution(TOURNAMENT_ID_1, ETH_TOKEN, percentages);
    }

    function test_SetPrizeDistribution_RevertTooHigh() public {
        _logTestInfo("SetPrizeDistribution Revert Too High");

        uint8[] memory percentages = new uint8[](2);
        percentages[0] = 60;
        percentages[1] = 41;

        _closeSalesIfOpen(TOURNAMENT_ID_1);

        vm.expectRevert(Treasury.InvalidPercentageSum.selector);

        vm.prank(admin);
        treasury.setPrizeDistribution(TOURNAMENT_ID_1, ETH_TOKEN, percentages);
    }

    function test_SetPrizeDistribution_RevertIndividualPercentageTooHigh() public {
        _logTestInfo("SetPrizeDistribution Individual Percentage Too High");

        uint8[] memory percentages = new uint8[](1);
        percentages[0] = 101;

        _closeSalesIfOpen(TOURNAMENT_ID_1);

        vm.expectRevert(Treasury.InvalidPercentage.selector);

        vm.prank(admin);
        treasury.setPrizeDistribution(TOURNAMENT_ID_1, ETH_TOKEN, percentages);
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

        _closeSalesIfOpen(TOURNAMENT_ID_1);

        vm.expectRevert(Treasury.InvalidPercentageSum.selector);

        vm.prank(admin);
        treasury.setPrizeDistribution(TOURNAMENT_ID_1, ETH_TOKEN, empty);
    }

    function test_SetPrizeDistribution_RevertUnsupportedPrizeToken() public {
        MockERC20 unsupportedToken = new MockERC20("Unsupported", "BAD", 6);
        uint8[] memory percentages = new uint8[](1);
        percentages[0] = 100;

        _closeSalesIfOpen(TOURNAMENT_ID_1);

        vm.prank(admin);
        vm.expectRevert(Treasury.UnsupportedPrizeToken.selector);
        treasury.setPrizeDistribution(TOURNAMENT_ID_1, address(unsupportedToken), percentages);
    }

    // ========== CLAIM PRIZE TESTS ==========

    function test_ClaimPrize_Success() public {
        _logTestInfo("ClaimPrize Success");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        uint256 expectedPrize = (_prizeableAmount(INITIAL_DEPOSIT) * 50) / 100; // 1st place gets 50% of prizeable pool
        uint256 initialBalance = user1.balance;

        vm.expectEmit(true, true, true, true);
        emit Treasury.ClaimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, user1, ETH_TOKEN, 0, expectedPrize);

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        assertEq(user1.balance, initialBalance + expectedPrize);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
    }

    function test_ClaimPrize_SecondPlace() public {
        _logTestInfo("ClaimPrize Second Place");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        uint256 expectedPrize = (_prizeableAmount(INITIAL_DEPOSIT) * 30) / 100; // 2nd place gets 30% of prizeable pool
        uint256 initialBalance = user2.balance;

        vm.prank(user2);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN);

        assertEq(user2.balance, initialBalance + expectedPrize);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN));
    }

    function test_ClaimPrize_RevertNotOwner() public {
        _logTestInfo("ClaimPrize Revert Not Owner");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        vm.expectRevert(Treasury.NotTokenOwner.selector);

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
        vm.expectRevert(Treasury.AlreadyClaimed.selector);

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);
    }

    function test_ClaimPrize_BlocksEthReentrancy() public {
        _logTestInfo("ClaimPrize Blocks ETH Reentrancy");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        ReentrantPrizeClaimer attacker = new ReentrantPrizeClaimer(treasury);
        vm.prank(user1);
        carton.safeTransferFrom(user1, address(attacker), TOKEN_ID_1, 1, "");

        uint256 expectedPrize = (_prizeableAmount(INITIAL_DEPOSIT) * 50) / 100;

        attacker.attack(TOURNAMENT_ID_1, TOKEN_ID_1);

        assertTrue(attacker.reentryAttempted());
        assertTrue(attacker.reentryBlocked());
        assertEq(address(attacker).balance, expectedPrize);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
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
        uint256 expectedPrize1 = (_prizeableAmount(INITIAL_DEPOSIT) * 50) / 100;
        uint256 expectedPrize2 = (_prizeableAmount(INITIAL_DEPOSIT) * 30) / 100;

        assertEq(user1.balance, user1InitialBalance + expectedPrize1);
        assertEq(user2.balance, user2InitialBalance + expectedPrize2);

        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN));
    }

    function test_ClaimPrize_SharedFirstPlaceSplitsCombinedPayout() public {
        _logTestInfo("ClaimPrize Shared First Place Split");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);

        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = TOKEN_ID_1;
        tokenIds[1] = TOKEN_ID_2;
        tokenIds[2] = TOKEN_ID_3;

        uint256[] memory tiedPoints = new uint256[](3);
        tiedPoints[0] = 100;
        tiedPoints[1] = 100;
        tiedPoints[2] = 80;

        vm.prank(admin);
        predictions.setPositions(tokenIds, tiedPoints);

        assertEq(predictions.getCartonPosition(TOKEN_ID_1), 1);
        assertEq(predictions.getCartonPosition(TOKEN_ID_2), 1);
        assertEq(predictions.getCartonPosition(TOKEN_ID_3), 3);

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        uint256 prizePool = treasury.getPrizePool(TOURNAMENT_ID_1, ETH_TOKEN);
        uint256 sharedFirstPlacePrize = (prizePool * 80) / 100;
        uint256 sharedFirstPlaceShare = sharedFirstPlacePrize / 2;
        uint256 thirdPlacePrize = (prizePool * 15) / 100;

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = sharedFirstPlaceShare;
        amounts[1] = sharedFirstPlaceShare;
        amounts[2] = thirdPlacePrize;

        _setFinalPrizeAmountsAndSeal(TOURNAMENT_ID_1, ETH_TOKEN, tokenIds, amounts);

        uint256 expectedReserveAfterSeal =
            _reserveAmount(INITIAL_DEPOSIT) + (prizePool - (sharedFirstPlaceShare * 2) - thirdPlacePrize);
        assertEq(treasury.getClaimablePrizeAmount(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN), sharedFirstPlaceShare);
        assertEq(treasury.getClaimablePrizeAmount(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN), sharedFirstPlaceShare);
        assertEq(treasury.getClaimablePrizeAmount(TOURNAMENT_ID_1, TOKEN_ID_3, ETH_TOKEN), thirdPlacePrize);
        assertEq(treasury.globalReserve(ETH_TOKEN), expectedReserveAfterSeal);

        vm.prank(tournamentManager);
        treasury.finalizeTournament(TOURNAMENT_ID_1);

        uint256 user1InitialBalance = user1.balance;
        uint256 user2InitialBalance = user2.balance;

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        vm.prank(user2);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN);

        assertEq(user1.balance, user1InitialBalance + sharedFirstPlaceShare);
        assertEq(user2.balance, user2InitialBalance + sharedFirstPlaceShare);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN));
    }

    function test_ClaimPrize_TokenNotInLeaderboard() public {
        _logTestInfo("ClaimPrize Token Not In Leaderboard");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        // Mint a carton that has never been added to the leaderboard
        _mintCarton(user4, TOKEN_ID_4);

        // Try to claim with a token that never received a finalized prize amount.
        vm.expectRevert(Treasury.NoPrizeAvailable.selector);
        vm.prank(user4);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_4, ETH_TOKEN);
    }

    // ========== INTEGRATION TESTS ==========

    function test_Integration_FullFlow() public {
        _logTestInfo("Integration Full Flow");

        // Setup scenario
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        // Verify initial state
        assertEq(treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN), (_prizeableAmount(INITIAL_DEPOSIT) * 95) / 100);
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

        // Prize pool now reflects the exact finalized claimable total; the unallocated 4th-place slice moved to reserve.
        assertEq(treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN), (_prizeableAmount(INITIAL_DEPOSIT) * 95) / 100);
    }

    function test_Integration_MultiTournamentSupport() public {
        _logTestInfo("Integration Multi Tournament Support");

        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);

        uint256 tournament2Token1 = _mintTournamentToken(user1, TOURNAMENT_ID_2);
        uint256 tournament2Token2 = _mintTournamentToken(user2, TOURNAMENT_ID_2);

        _depositFunds(TOURNAMENT_ID_2, 2 ether);
        uint8[] memory distribution2 = new uint8[](2);
        distribution2[0] = 80;
        distribution2[1] = 20;
        _setPrizeDistribution(TOURNAMENT_ID_2, distribution2);

        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tournament2Token1;
        tokenIds[1] = tournament2Token2;

        uint256 tournament2Pool = treasury.getPrizePool(TOURNAMENT_ID_2, ETH_TOKEN);
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = (tournament2Pool * 80) / 100;
        amounts[1] = (tournament2Pool * 20) / 100;

        tournament2Engine.setReady(true);

        _setFinalPrizeAmountsAndSeal(TOURNAMENT_ID_2, ETH_TOKEN, tokenIds, amounts);

        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_2, ETH_TOKEN);

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        assertFalse(treasury.claimed(TOURNAMENT_ID_2, tournament2Token1, ETH_TOKEN));

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_2, tournament2Token1, ETH_TOKEN);

        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
        assertTrue(treasury.claimed(TOURNAMENT_ID_2, tournament2Token1, ETH_TOKEN));
    }

    function test_FinalizeTournament_UsesRegisteredEngineForEachTournament() public {
        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);

        vm.prank(tournamentManager);
        treasury.finalizeTournament(TOURNAMENT_ID_1);

        uint256 tournament2TokenId = _mintTournamentToken(user1, TOURNAMENT_ID_2);
        _depositFunds(TOURNAMENT_ID_2, INITIAL_DEPOSIT);

        uint8[] memory percentages = new uint8[](1);
        percentages[0] = 100;
        _setPrizeDistribution(TOURNAMENT_ID_2, percentages);

        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = tournament2TokenId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = treasury.getPrizePool(TOURNAMENT_ID_2, ETH_TOKEN);

        tournament2Engine.setReady(true);
        _setFinalPrizeAmountsAndSeal(TOURNAMENT_ID_2, ETH_TOKEN, tokenIds, amounts);

        tournament2Engine.setReady(false);

        vm.prank(tournamentManager);
        vm.expectRevert(Treasury.TournamentNotReadyForFinalization.selector);
        treasury.finalizeTournament(TOURNAMENT_ID_2);
    }

    function test_SealFinalPrizeAmounts_RevertsWhenEngineNotReady() public {
        uint256 tournament2TokenId = _mintTournamentToken(user1, TOURNAMENT_ID_2);
        _depositFunds(TOURNAMENT_ID_2, INITIAL_DEPOSIT);

        uint8[] memory percentages = new uint8[](1);
        percentages[0] = 100;
        _setPrizeDistribution(TOURNAMENT_ID_2, percentages);

        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = tournament2TokenId;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = treasury.getPrizePool(TOURNAMENT_ID_2, ETH_TOKEN);

        vm.prank(admin);
        treasury.setFinalPrizeAmounts(TOURNAMENT_ID_2, ETH_TOKEN, tokenIds, amounts);

        vm.prank(admin);
        vm.expectRevert(Treasury.TournamentNotReadyForFinalization.selector);
        treasury.sealFinalPrizeAmounts(TOURNAMENT_ID_2, ETH_TOKEN);
    }

    function test_ClaimPrize_RevertsForWrongTournamentToken() public {
        _setupCompleteScenarioWithTreasury(TOURNAMENT_ID_1);
        uint256 tournament2TokenId = _mintTournamentToken(user1, TOURNAMENT_ID_2);

        vm.prank(user1);
        vm.expectRevert(Treasury.TokenTournamentMismatch.selector);
        treasury.claimPrize(TOURNAMENT_ID_1, tournament2TokenId, ETH_TOKEN);
    }

    function test_SeedTournamentFromReserve_MovesFundsIntoPrizePool() public {
        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);

        uint256 reserveAmount = _reserveAmount(INITIAL_DEPOSIT);

        vm.prank(admin);
        treasury.seedTournamentFromReserve(TOURNAMENT_ID_2, ETH_TOKEN, reserveAmount);

        assertEq(treasury.globalReserve(ETH_TOKEN), 0);
        assertEq(treasury.prizePools(TOURNAMENT_ID_2, ETH_TOKEN), reserveAmount);
    }

    function test_SeedTournamentFromReserve_RevertsAfterFinalPrizeAmountsSeal() public {
        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);

        uint256 reserveAmount = treasury.getGlobalReserve(ETH_TOKEN);

        vm.prank(admin);
        vm.expectRevert(Treasury.FinalPrizeAmountsAlreadySealed.selector);
        treasury.seedTournamentFromReserve(TOURNAMENT_ID_1, ETH_TOKEN, reserveAmount);
    }

    // ========== EDGE CASES ==========

    function test_EdgeCase_RoundingInPrizeCalculation() public {
        _logTestInfo("Edge Case Rounding in Prize Calculation");

        _setupScenarioWithOpenSales(TOURNAMENT_ID_1);

        // Deposit amount that will cause rounding
        _depositFunds(TOURNAMENT_ID_1, 333 wei); // Total becomes 1 ether + 333 wei

        _setOfficialResultsAndPositions();

        uint256 totalPool = treasury.prizePools(TOURNAMENT_ID_1, ETH_TOKEN);
        uint256 expectedPrize = (totalPool * 50) / 100; // Should round down

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);

        // Finalize tournament
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
        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _closeSalesIfOpen(TOURNAMENT_ID_1);

        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = TOKEN_ID_1;
        uint256[] memory points = new uint256[](1);
        points[0] = 100; // High points for 1st place

        vm.prank(admin);
        predictions.setPositions(tokenIds, points);

        vm.startPrank(admin);
        predictions.setResults(1, 2, 1);
        predictions.setResults(2, 1, 1);
        predictions.setResults(3, 0, 2);
        predictions.setResults(4, 3, 0);
        predictions.setOfficialWinners([TEAM_1, TEAM_2, TEAM_3, TEAM_4]);
        vm.stopPrank();

        uint8[] memory distribution = new uint8[](1);
        distribution[0] = 100;
        _setPrizeDistribution(TOURNAMENT_ID_1, distribution);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = treasury.getPrizePool(TOURNAMENT_ID_1, ETH_TOKEN);
        _setFinalPrizeAmountsAndSeal(TOURNAMENT_ID_1, ETH_TOKEN, tokenIds, amounts);

        // Close tournament
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        uint256 initialBalance = user1.balance;

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        assertEq(user1.balance, initialBalance + _prizeableAmount(INITIAL_DEPOSIT));
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
        assertEq(prizePool, _prizeableAmount(INITIAL_DEPOSIT) + _prizeableAmount(SMALL_DEPOSIT));
    }

    function test_GetUserPrizeAmount_ValidPosition() public {
        _logTestInfo("GetUserPrizeAmount Valid Position");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        // Test different positions
        uint256 prizePool = _prizeableAmount(INITIAL_DEPOSIT);
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 1), (prizePool * 50) / 100); // 1st place: 50%
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 2), (prizePool * 30) / 100); // 2nd place: 30%
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 3), (prizePool * 15) / 100); // 3rd place: 15%
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 4), (prizePool * 5) / 100); // 4th place: 5%
    }

    function test_GetUserPrizeAmount_InvalidPosition() public {
        _logTestInfo("GetUserPrizeAmount Invalid Position");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        // Test position 0 (should revert)
        vm.expectRevert(Treasury.InvalidPosition.selector);
        treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 0);

        // Test position out of bounds (should revert)
        vm.expectRevert(Treasury.InvalidPosition.selector);
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
        assertEq(totalPool, (_prizeableAmount(INITIAL_DEPOSIT) * 95) / 100);

        // `getUserPrizeAmount` remains a position preview, while claims read the finalized exact amount per token.
        uint256 firstPlacePreview = treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 1);
        uint256 secondPlacePreview = treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 2);
        uint256 firstPlaceClaimable = treasury.getClaimablePrizeAmount(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        uint256 assignedPool = (_prizeableAmount(INITIAL_DEPOSIT) * 95) / 100;
        assertEq(firstPlacePreview, (assignedPool * 50) / 100);
        assertEq(secondPlacePreview, (assignedPool * 30) / 100);
        assertEq(firstPlaceClaimable, (_prizeableAmount(INITIAL_DEPOSIT) * 50) / 100);

        // Test hasUserClaimed before and after claims
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN));

        // User1 claims
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        assertTrue(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
        assertFalse(treasury.hasUserClaimed(TOURNAMENT_ID_1, TOKEN_ID_2, ETH_TOKEN)); // Still false

        // Verify balances
        assertEq(user1.balance, 1 ether + firstPlaceClaimable);
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

        assertEq(treasury.prizePools(TOURNAMENT_ID_1, address(USDC)), initialBalance + _prizeableAmount(depositAmount));
        assertEq(treasury.globalReserve(address(USDC)), _reserveAmount(depositAmount));
        assertEq(USDC.balanceOf(address(treasury)), depositAmount);
    }

    function test_DepositFromSalesERC20_RevertZeroAddress() public {
        _logTestInfo("DepositFromSalesERC20 Revert Zero Address");

        vm.expectRevert(Treasury.UseDepositForETH.selector);

        vm.prank(fundDepositor);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(0), 1000);
    }

    function test_DepositFromSalesERC20_RevertZeroAmount() public {
        _logTestInfo("DepositFromSalesERC20 Revert Zero Amount");

        vm.expectRevert(Treasury.ZeroAmount.selector);

        vm.prank(fundDepositor);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), 0);
    }

    function test_DepositFromSalesERC20_RevertUnsupportedPrizeToken() public {
        _logTestInfo("DepositFromSalesERC20 Revert Unsupported Prize Token");

        MockERC20 unsupportedToken = new MockERC20("Unsupported", "BAD", 6);
        uint256 depositAmount = 1000 * 10 ** 6;
        unsupportedToken.mint(fundDepositor, depositAmount);

        vm.startPrank(fundDepositor);
        unsupportedToken.approve(address(treasury), depositAmount);
        vm.expectRevert(Treasury.UnsupportedPrizeToken.selector);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(unsupportedToken), depositAmount);
        vm.stopPrank();
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

        _setupScenarioWithOpenSales(TOURNAMENT_ID_1);

        // Deposit USDC and set distribution
        uint256 depositAmount = 1000 * 10 ** 6; // 1000 USDC
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), depositAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
        vm.stopPrank();

        _setOfficialResultsAndPositions();

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1, address(USDC));
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, address(USDC));

        vm.prank(tournamentManager);
        treasury.finalizeTournament(TOURNAMENT_ID_1);

        uint256 expectedPrize = (_prizeableAmount(depositAmount) * 50) / 100; // 1st place gets 50%
        uint256 initialBalance = USDC.balanceOf(user1);

        vm.expectEmit(true, true, true, true);
        emit Treasury.ClaimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, user1, address(USDC), 0, expectedPrize);

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC));

        assertEq(USDC.balanceOf(user1), initialBalance + expectedPrize);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC)));
    }

    function test_ClaimPrize_ERC20_AlreadyClaimed() public {
        _logTestInfo("ClaimPrize ERC20 Already Claimed");

        _setupScenarioWithOpenSales(TOURNAMENT_ID_1);

        uint256 depositAmount = 1000 * 10 ** 6;
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), depositAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
        vm.stopPrank();

        _setOfficialResultsAndPositions();

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1, address(USDC));
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, address(USDC));

        vm.prank(tournamentManager);
        treasury.finalizeTournament(TOURNAMENT_ID_1);

        // First claim
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC));

        // Second claim should fail
        vm.expectRevert(Treasury.AlreadyClaimed.selector);

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC));
    }

    function test_MultiAsset_SameTournament() public {
        _logTestInfo("Multi Asset Same Tournament");

        _setupScenarioWithOpenSales(TOURNAMENT_ID_1);

        // Deposit USDC
        uint256 usdcAmount = 1000 * 10 ** 6;
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), usdcAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), usdcAmount);
        vm.stopPrank();

        _setOfficialResultsAndPositions();

        // Set ETH and USDC distributions before finalization.
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1, address(USDC));
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, address(USDC));

        vm.prank(tournamentManager);
        treasury.finalizeTournament(TOURNAMENT_ID_1);

        // User claims both ETH and USDC prizes
        uint256 ethBalanceBefore = user1.balance;
        uint256 usdcBalanceBefore = USDC.balanceOf(user1);

        vm.startPrank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(0)); // ETH
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC)); // USDC
        vm.stopPrank();

        // Verify both claims
        uint256 expectedEth = (_prizeableAmount(INITIAL_DEPOSIT) * 50) / 100;
        uint256 expectedUsdc = (_prizeableAmount(usdcAmount) * 50) / 100;

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
        assertEq(prizePool, _prizeableAmount(depositAmount));
    }

    function test_GetUserPrizeAmount_ERC20() public {
        _logTestInfo("GetUserPrizeAmount ERC20");

        uint256 depositAmount = 1000 * 10 ** 6;

        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), depositAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
        vm.stopPrank();

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1, address(USDC));

        uint256 prizePool = _prizeableAmount(depositAmount);
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, address(USDC), 1), (prizePool * 50) / 100);
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, address(USDC), 2), (prizePool * 30) / 100);
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, address(USDC), 3), (prizePool * 15) / 100);
        assertEq(treasury.getUserPrizeAmount(TOURNAMENT_ID_1, address(USDC), 4), (prizePool * 5) / 100);
    }

    /// @notice Set default prize distribution (50%, 30%, 15%, 5%) for specific token
    function _setDefaultPrizeDistribution(uint256 tournamentId, address token) internal {
        uint8[] memory percentages = new uint8[](4);
        percentages[0] = 50; // 1st place
        percentages[1] = 30; // 2nd place
        percentages[2] = 15; // 3rd place
        percentages[3] = 5; // 4th place

        _closeSalesIfOpen(tournamentId);
        vm.prank(admin);
        treasury.setPrizeDistribution(tournamentId, token, percentages);
    }

    // ========== CLOSE TOURNAMENT TESTS ==========

    function test_CloseTournament_Success() public {
        _logTestInfo("CloseTournament Success");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);

        vm.expectEmit(true, true, false, true);
        emit Treasury.TournamentClosed(TOURNAMENT_ID_1, ETH_TOKEN, (_prizeableAmount(INITIAL_DEPOSIT) * 95) / 100);

        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        assertTrue(treasury.isClosedTournament(TOURNAMENT_ID_1, ETH_TOKEN));
        assertEq(treasury.closedPrizePools(TOURNAMENT_ID_1, ETH_TOKEN), (_prizeableAmount(INITIAL_DEPOSIT) * 95) / 100);
    }

    function test_CloseTournament_MarksTournamentClosedAcrossAssets() public {
        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);

        assertFalse(treasury.isTournamentClosedAnyAsset(TOURNAMENT_ID_1));

        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        assertTrue(treasury.isTournamentClosedAnyAsset(TOURNAMENT_ID_1));
    }

    function test_CloseTournament_RevertAlreadyClosed() public {
        _logTestInfo("CloseTournament Revert Already Closed");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);

        vm.startPrank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        vm.expectRevert(Treasury.TournamentAlreadyClosed.selector);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);
        vm.stopPrank();
    }

    function test_CloseTournament_RevertNoPrizePool() public {
        _logTestInfo("CloseTournament Revert No Prize Pool");

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        vm.expectRevert(Treasury.NoPrizePool.selector);

        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);
    }

    function test_CloseTournament_RevertNoPrizeDistribution() public {
        _logTestInfo("CloseTournament Revert No Prize Distribution");

        _depositFunds(TOURNAMENT_ID_1, INITIAL_DEPOSIT);
        _closeSalesIfOpen(TOURNAMENT_ID_1);

        vm.expectRevert(Treasury.NoPrizeDistribution.selector);

        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);
    }

    function test_CloseTournament_OnlyTournamentManagerRole() public {
        _logTestInfo("CloseTournament Role Access Control");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);

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

        vm.prank(tournamentManager);
        treasury.closeSales(TOURNAMENT_ID_1);

        vm.expectRevert(Treasury.SalesAlreadyClosed.selector);

        _depositFunds(TOURNAMENT_ID_1, SMALL_DEPOSIT);
    }

    function test_CloseTournament_ERC20DepositsFailAfterClose() public {
        _logTestInfo("CloseTournament ERC20 Deposits Fail After Close");

        uint256 depositAmount = 1000 * 10 ** 6;
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), depositAmount * 2);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
        vm.stopPrank();

        vm.prank(tournamentManager);
        treasury.closeSales(TOURNAMENT_ID_1);

        vm.expectRevert(Treasury.SalesAlreadyClosed.selector);

        vm.prank(fundDepositor);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), depositAmount);
    }

    function test_CloseTournament_ClaimsOnlyWorkAfterClose() public {
        _logTestInfo("CloseTournament Claims Only Work After Close");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);

        // Try to claim before closing
        vm.expectRevert(Treasury.TournamentNotFinalized.selector);

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);

        // Finalize tournament
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
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);

        // Finalize tournament with 1 ETH
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        uint256 expectedPrize = (_prizeableAmount(INITIAL_DEPOSIT) * 50) / 100; // 50% of prizeable pool

        // Claim prize
        uint256 balanceBefore = user1.balance;
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);

        // User should receive 50% of INITIAL_DEPOSIT, not any future deposits
        assertEq(user1.balance, balanceBefore + expectedPrize);
    }

    function test_CloseTournament_MultiAssetIndependence() public {
        _logTestInfo("CloseTournament Multi Asset Independence");

        _setupScenarioWithOpenSales(TOURNAMENT_ID_1);

        // Setup USDC pool
        uint256 usdcAmount = 1000 * 10 ** 6;
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), usdcAmount);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), usdcAmount);
        vm.stopPrank();

        _setOfficialResultsAndPositions();

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1, address(USDC));

        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, address(USDC));
        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);

        // Finalize tournament; all configured prize assets are snapshotted.
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        // ETH and USDC should be closed together because lifecycle is tournament-wide.
        assertTrue(treasury.isClosedTournament(TOURNAMENT_ID_1, ETH_TOKEN));
        assertTrue(treasury.isClosedTournament(TOURNAMENT_ID_1, address(USDC)));

        // Cannot deposit USDC after sales close/finalization.
        vm.startPrank(fundDepositor);
        USDC.approve(address(treasury), usdcAmount);
        vm.expectRevert(Treasury.SalesAlreadyClosed.selector);
        treasury.depositFromSalesERC20(TOURNAMENT_ID_1, address(USDC), usdcAmount);
        vm.stopPrank();

        // Can claim both configured assets.
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, address(USDC));

        // Can claim ETH
        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN);
        assertTrue(treasury.claimed(TOURNAMENT_ID_1, TOKEN_ID_1, ETH_TOKEN));
    }

    function test_CloseTournament_GetUserPrizeAmountUsesSnapshot() public {
        _logTestInfo("CloseTournament GetUserPrizeAmount Uses Snapshot");

        _setupCompleteScenarioWithTreasuryNoClose(TOURNAMENT_ID_1);
        _setDefaultPrizeDistribution(TOURNAMENT_ID_1);

        // Before close - uses current pool
        uint256 prizeBeforeClose = treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 1);
        assertEq(prizeBeforeClose, (_prizeableAmount(INITIAL_DEPOSIT) * 50) / 100);

        _setDefaultFinalPrizeAmounts(TOURNAMENT_ID_1, ETH_TOKEN);

        // Close tournament
        vm.prank(tournamentManager);
        treasury.closeTournament(TOURNAMENT_ID_1, ETH_TOKEN);

        // After close the snapshot reflects the sealed claimable pool, which may be smaller if some paid places were left empty.
        uint256 prizeAfterClose = treasury.getUserPrizeAmount(TOURNAMENT_ID_1, ETH_TOKEN, 1);
        assertEq(prizeAfterClose, (((_prizeableAmount(INITIAL_DEPOSIT) * 95) / 100) * 50) / 100);

        assertLt(prizeAfterClose, prizeBeforeClose);
    }
}
