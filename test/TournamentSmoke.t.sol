// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { BaseTest } from "./BaseTest.sol";
import { Treasury } from "../src/Treasury.sol";
import { MockERC20 } from "./mocks/MockERC20.sol";
import { Carton } from "../src/Carton.sol";
import { Predictions } from "../src/Predictions.sol";

contract TournamentSmokeTest is BaseTest {
    Treasury public treasury;
    MockERC20 public usdc;

    address public tournamentManager = address(0x6);

    uint256 public constant TOURNAMENT_ID = 1;
    uint256 public constant CARTON_PRICE_USDC = 100 * 10 ** 6;
    uint16 public constant RESERVE_BPS = 500;

    function setUp() public override {
        carton = new Carton(admin, pauser, minter);

        vm.prank(admin);
        carton.setActiveTournament(TOURNAMENT_ID);

        vm.prank(admin);
        predictions = new Predictions(address(carton), TOURNAMENT_ID);

        _setupRoles();

        vm.startPrank(admin);
        predictions.setSubmissionDeadline(block.timestamp + DEFAULT_DEADLINE_OFFSET);
        predictions.setTotalGames(4);

        treasury = new Treasury(admin, address(carton), RESERVE_BPS, 60 days);
        usdc = new MockERC20("USDC", "USDC", 6);

        carton.setTreasuryAddress(address(treasury));
        treasury.setSupportedPrizeToken(address(usdc), true);
        carton.setAcceptedToken(address(usdc), true);
        carton.setTokenPrice(TOURNAMENT_ID, address(usdc), CARTON_PRICE_USDC);

        treasury.grantRole(treasury.FUND_DEPOSITOR_ROLE(), address(carton));
        treasury.grantRole(treasury.TOURNAMENT_MANAGER_ROLE(), tournamentManager);
        treasury.registerTournament(TOURNAMENT_ID, address(predictions));
        vm.stopPrank();

        _mintUsdcToUsers();
    }

    function testSmoke_FullTournamentFlow_USDC() public {
        uint256[] memory tokenIds = _buyThreeCartons();

        _submitSmokePredictions(tokenIds);

        vm.prank(tournamentManager);
        treasury.closeSales(TOURNAMENT_ID);

        vm.startPrank(user4);
        usdc.approve(address(carton), CARTON_PRICE_USDC);
        vm.expectRevert(Carton.TournamentSalesClosed.selector);
        carton.buyCartonWithToken(address(usdc));
        vm.stopPrank();

        _setResultsIndividually();
        _setFinalWinnersAndPositions(tokenIds);
        _configureAndSealUsdcPrizes(tokenIds);

        vm.prank(tournamentManager);
        treasury.finalizeTournament(TOURNAMENT_ID);

        uint256 prizePool = treasury.getPrizePool(TOURNAMENT_ID, address(usdc));
        uint256 expectedUser1Prize = (prizePool * 50) / 100;
        uint256 expectedUser2Prize = (prizePool * 30) / 100;
        uint256 expectedUser3Prize = (prizePool * 20) / 100;

        uint256 user1BalanceBefore = usdc.balanceOf(user1);
        uint256 user2BalanceBefore = usdc.balanceOf(user2);
        uint256 user3BalanceBefore = usdc.balanceOf(user3);

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID, tokenIds[0], address(usdc));
        vm.prank(user2);
        treasury.claimPrize(TOURNAMENT_ID, tokenIds[1], address(usdc));
        vm.prank(user3);
        treasury.claimPrize(TOURNAMENT_ID, tokenIds[2], address(usdc));

        assertEq(usdc.balanceOf(user1), user1BalanceBefore + expectedUser1Prize);
        assertEq(usdc.balanceOf(user2), user2BalanceBefore + expectedUser2Prize);
        assertEq(usdc.balanceOf(user3), user3BalanceBefore + expectedUser3Prize);

        assertTrue(treasury.hasUserClaimed(TOURNAMENT_ID, tokenIds[0], address(usdc)));
        assertTrue(treasury.hasUserClaimed(TOURNAMENT_ID, tokenIds[1], address(usdc)));
        assertTrue(treasury.hasUserClaimed(TOURNAMENT_ID, tokenIds[2], address(usdc)));
        assertTrue(treasury.tournamentFinalized(TOURNAMENT_ID));
        assertEq(predictions.getCartonPosition(tokenIds[0]), 1);
        assertEq(predictions.getCartonPosition(tokenIds[1]), 2);
        assertEq(predictions.getCartonPosition(tokenIds[2]), 3);
    }

    function testSmoke_SalesMustCloseBeforeResults() public {
        vm.prank(admin);
        vm.expectRevert(Predictions.TournamentSalesStillOpen.selector);
        predictions.setResults(1, 2, 1);

        vm.prank(tournamentManager);
        treasury.closeSales(TOURNAMENT_ID);

        _movePastSubmissionDeadlineIfNeeded();

        vm.prank(admin);
        predictions.setResults(1, 2, 1);

        uint8[2] memory result = predictions.getGameResults(1);
        assertEq(result[0], 2);
        assertEq(result[1], 1);
    }

    function testSmoke_BatchResults_AnvilOnly() public {
        vm.prank(tournamentManager);
        treasury.closeSales(TOURNAMENT_ID);

        _movePastSubmissionDeadlineIfNeeded();

        uint8[] memory gameIds = new uint8[](4);
        gameIds[0] = 1;
        gameIds[1] = 2;
        gameIds[2] = 3;
        gameIds[3] = 4;

        uint8[] memory team1Goals = new uint8[](4);
        team1Goals[0] = 2;
        team1Goals[1] = 1;
        team1Goals[2] = 0;
        team1Goals[3] = 3;

        uint8[] memory team2Goals = new uint8[](4);
        team2Goals[0] = 1;
        team2Goals[1] = 1;
        team2Goals[2] = 2;
        team2Goals[3] = 0;

        vm.prank(admin);
        predictions.setResultsBatch(gameIds, team1Goals, team2Goals);

        vm.chainId(1);
        vm.prank(admin);
        vm.expectRevert(Predictions.BatchResultsOnlyOnAnvil.selector);
        predictions.setResultsBatch(gameIds, team1Goals, team2Goals);
    }

    function testSmoke_BatchResults_AllOrNothing() public {
        vm.prank(tournamentManager);
        treasury.closeSales(TOURNAMENT_ID);

        _movePastSubmissionDeadlineIfNeeded();

        uint8[] memory gameIds = new uint8[](2);
        gameIds[0] = 1;
        gameIds[1] = 1;

        uint8[] memory team1Goals = new uint8[](2);
        team1Goals[0] = 2;
        team1Goals[1] = 1;

        uint8[] memory team2Goals = new uint8[](2);
        team2Goals[0] = 1;
        team2Goals[1] = 1;

        vm.prank(admin);
        vm.expectRevert(Predictions.DuplicateGameId.selector);
        predictions.setResultsBatch(gameIds, team1Goals, team2Goals);

        (, bool game1Set) = predictions.games(1);
        (, bool game2Set) = predictions.games(2);
        assertFalse(game1Set);
        assertFalse(game2Set);
    }

    function testSmoke_ResultCorrectionWindow() public {
        uint256[] memory tokenIds = _buyThreeCartons();
        _submitSmokePredictions(tokenIds);

        vm.prank(tournamentManager);
        treasury.closeSales(TOURNAMENT_ID);

        vm.startPrank(admin);
        _movePastSubmissionDeadlineIfNeeded();
        predictions.setResults(1, 2, 1);
        predictions.updateResults(1, 3, 2);
        vm.stopPrank();

        uint8[2] memory corrected = predictions.getGameResults(1);
        assertEq(corrected[0], 3);
        assertEq(corrected[1], 2);

        vm.startPrank(admin);
        predictions.updateResults(1, 2, 1);
        predictions.setResults(2, 1, 1);
        predictions.setResults(3, 0, 2);
        predictions.setResults(4, 3, 0);
        vm.stopPrank();

        _setFinalWinnersAndPositions(tokenIds);
        _configureAndSealUsdcPrizes(tokenIds);

        vm.prank(tournamentManager);
        treasury.finalizeTournament(TOURNAMENT_ID);

        vm.prank(admin);
        vm.expectRevert(Predictions.TournamentClosedForCorrections.selector);
        predictions.updateResults(1, 1, 1);
    }

    function testSmoke_ClaimsOnlyAfterFinalization() public {
        uint256[] memory tokenIds = _prepareReadyForFinalizationScenario(false);

        vm.prank(user1);
        vm.expectRevert(Treasury.TournamentNotFinalized.selector);
        treasury.claimPrize(TOURNAMENT_ID, tokenIds[0], address(usdc));

        vm.prank(tournamentManager);
        treasury.finalizeTournament(TOURNAMENT_ID);

        vm.prank(user1);
        treasury.claimPrize(TOURNAMENT_ID, tokenIds[0], address(usdc));

        assertTrue(treasury.hasUserClaimed(TOURNAMENT_ID, tokenIds[0], address(usdc)));
    }

    function testSmoke_RoleBoundaries() public {
        bytes32 tournamentManagerRole = treasury.TOURNAMENT_MANAGER_ROLE();

        vm.prank(unauthorized);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", unauthorized));
        predictions.setResults(1, 2, 1);

        vm.prank(unauthorized);
        vm.expectRevert(_accessControlUnauthorized(unauthorized, 0x0));
        treasury.setPrizeDistribution(TOURNAMENT_ID, address(usdc), _createPercentages(100));

        vm.prank(unauthorized);
        vm.expectRevert(_accessControlUnauthorized(unauthorized, tournamentManagerRole));
        treasury.closeSales(TOURNAMENT_ID);
    }

    function _prepareReadyForFinalizationScenario(bool useBatchResults) internal returns (uint256[] memory tokenIds) {
        tokenIds = _buyThreeCartons();
        _submitSmokePredictions(tokenIds);

        vm.prank(tournamentManager);
        treasury.closeSales(TOURNAMENT_ID);

        if (useBatchResults) {
            _setResultsBatch();
        } else {
            _setResultsIndividually();
        }

        _setFinalWinnersAndPositions(tokenIds);
        _configureAndSealUsdcPrizes(tokenIds);
    }

    function _buyThreeCartons() internal returns (uint256[] memory tokenIds) {
        tokenIds = new uint256[](3);
        tokenIds[0] = _buyCartonWithUsdc(user1);
        tokenIds[1] = _buyCartonWithUsdc(user2);
        tokenIds[2] = _buyCartonWithUsdc(user3);

        assertEq(treasury.getPrizePool(TOURNAMENT_ID, address(usdc)), 285 * 10 ** 6);
        assertEq(treasury.getGlobalReserve(address(usdc)), 15 * 10 ** 6);
    }

    function _buyCartonWithUsdc(address user) internal returns (uint256 tokenId) {
        tokenId = carton.nextTokenId();

        vm.startPrank(user);
        usdc.approve(address(carton), CARTON_PRICE_USDC);
        carton.buyCartonWithToken(address(usdc));
        vm.stopPrank();

        assertEq(carton.balanceOf(user, tokenId), 1);
    }

    function _submitSmokePredictions(uint256[] memory tokenIds) internal {
        Predictions.Prediction[] memory preds1 = _createValidGamePrediction();
        _submitCompletePredictions(user1, tokenIds[0], preds1, [TEAM_1, TEAM_2, TEAM_3, TEAM_4]);

        uint8[8] memory results2 = [2, 0, 1, 2, 0, 1, 2, 1];
        Predictions.Prediction[] memory preds2 = _createGamePrediction(results2);
        _submitCompletePredictions(user2, tokenIds[1], preds2, [TEAM_1, TEAM_3, TEAM_2, TEAM_4]);

        uint8[8] memory results3 = [1, 1, 2, 0, 1, 0, 1, 2];
        Predictions.Prediction[] memory preds3 = _createGamePrediction(results3);
        _submitCompletePredictions(user3, tokenIds[2], preds3, [TEAM_5, TEAM_6, TEAM_7, TEAM_8]);
    }

    function _setResultsIndividually() internal {
        _movePastSubmissionDeadlineIfNeeded();
        vm.startPrank(admin);
        predictions.setResults(1, 2, 1);
        predictions.setResults(2, 1, 1);
        predictions.setResults(3, 0, 2);
        predictions.setResults(4, 3, 0);
        vm.stopPrank();
    }

    function _setResultsBatch() internal {
        _movePastSubmissionDeadlineIfNeeded();
        uint8[] memory gameIds = new uint8[](4);
        gameIds[0] = 1;
        gameIds[1] = 2;
        gameIds[2] = 3;
        gameIds[3] = 4;

        uint8[] memory team1Goals = new uint8[](4);
        team1Goals[0] = 2;
        team1Goals[1] = 1;
        team1Goals[2] = 0;
        team1Goals[3] = 3;

        uint8[] memory team2Goals = new uint8[](4);
        team2Goals[0] = 1;
        team2Goals[1] = 1;
        team2Goals[2] = 2;
        team2Goals[3] = 0;

        vm.prank(admin);
        predictions.setResultsBatch(gameIds, team1Goals, team2Goals);
    }

    function _setFinalWinnersAndPositions(uint256[] memory tokenIds) internal {
        vm.prank(admin);
        predictions.setOfficialWinners([TEAM_1, TEAM_2, TEAM_3, TEAM_4]);

        uint256[] memory points = _calculateAllUserPoints();
        vm.prank(admin);
        predictions.setPositions(tokenIds, points);
    }

    function _configureAndSealUsdcPrizes(uint256[] memory tokenIds) internal {
        uint8[] memory percentages = new uint8[](3);
        percentages[0] = 50;
        percentages[1] = 30;
        percentages[2] = 20;

        vm.prank(admin);
        treasury.setPrizeDistribution(TOURNAMENT_ID, address(usdc), percentages);

        uint256 prizePool = treasury.getPrizePool(TOURNAMENT_ID, address(usdc));
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = (prizePool * 50) / 100;
        amounts[1] = (prizePool * 30) / 100;
        amounts[2] = (prizePool * 20) / 100;

        vm.startPrank(admin);
        treasury.setFinalPrizeAmounts(TOURNAMENT_ID, address(usdc), tokenIds, amounts);
        treasury.sealFinalPrizeAmounts(TOURNAMENT_ID, address(usdc));
        vm.stopPrank();
    }

    function _mintUsdcToUsers() internal {
        usdc.mint(user1, 1_000_000 * 10 ** 6);
        usdc.mint(user2, 1_000_000 * 10 ** 6);
        usdc.mint(user3, 1_000_000 * 10 ** 6);
        usdc.mint(user4, 1_000_000 * 10 ** 6);
    }

    function _createPercentages(uint8 singleValue) internal pure returns (uint8[] memory percentages) {
        percentages = new uint8[](1);
        percentages[0] = singleValue;
    }

    function _accessControlUnauthorized(address account, bytes32 role) internal pure returns (bytes memory) {
        return
            abi.encodeWithSelector(
                bytes4(keccak256("AccessControlUnauthorizedAccount(address,bytes32)")), account, role
            );
    }
}
