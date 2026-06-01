// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "forge-std/Test.sol";
import "../src/Carton.sol";
import "../src/Predictions.sol";

/// @title Base Test Contract with Common Utilities
/// @notice Provides reusable setup and helper functions for all tests
abstract contract BaseTest is Test {
    // ========== CONTRACTS ==========
    Carton public carton;
    Predictions public predictions;

    // ========== ADDRESSES ==========
    address public admin = address(0x1);
    address public pauser = address(0x2);
    address public minter = address(0x3);
    address public uriSetter = address(0x4);
    address public unauthorized = address(0xDEAD);

    // Test users
    address public user1 = address(0x101);
    address public user2 = address(0x102);
    address public user3 = address(0x103);
    address public user4 = address(0x104);

    // ========== CONSTANTS ==========
    uint256 public constant TOKEN_ID_1 = 1;
    uint256 public constant TOKEN_ID_2 = 2;
    uint256 public constant TOKEN_ID_3 = 3;
    uint256 public constant TOKEN_ID_4 = 4;

    uint256 public constant DEFAULT_DEADLINE_OFFSET = 1 days;

    // Game teams
    uint8 public constant TEAM_1 = 1;
    uint8 public constant TEAM_2 = 2;
    uint8 public constant TEAM_3 = 3;
    uint8 public constant TEAM_4 = 4;
    uint8 public constant TEAM_5 = 5;
    uint8 public constant TEAM_6 = 6;
    uint8 public constant TEAM_7 = 7;
    uint8 public constant TEAM_8 = 8;

    // ========== SETUP ==========

    function setUp() public virtual {
        _deployContracts();
        _setupRoles();
        _setDefaultDeadline();
    }

    function _deployContracts() internal {
        carton = new Carton(admin, pauser, minter);

        vm.prank(admin);
        carton.setActiveTournament(1);

        predictions = new Predictions(address(carton), 1);
    }

    function _setupRoles() internal {
        vm.startPrank(admin);
        carton.grantRole(carton.URI_SETTER_ROLE(), uriSetter);
        carton.grantRole(carton.URI_SETTER_ROLE(), admin);
        vm.stopPrank();
    }

    function _setDefaultDeadline() internal {
        uint256 deadline = block.timestamp + DEFAULT_DEADLINE_OFFSET;
        predictions.setSubmissionDeadline(deadline);
        predictions.setTotalGames(4);
    }

    // ========== CARTON HELPERS ==========

    /// @notice Mint a single carton to user
    function _mintCarton(
        address user,
        uint256 /* tokenId */
    )
        internal
    {
        vm.prank(minter);
        carton.mint(user, 1, "");
    }

    /// @notice Mint cartons to multiple users
    function _mintCartonsToUsers() internal {
        vm.startPrank(minter);
        carton.mint(user1, 1, "");
        carton.mint(user2, 1, "");
        carton.mint(user3, 1, "");
        carton.mint(user4, 1, "");
        vm.stopPrank();
    }

    /// @notice Mint batch cartons
    function _mintBatchCartons(
        address user,
        uint256[] memory,
        /* ids */
        uint256[] memory amounts
    )
        internal
    {
        vm.prank(minter);
        carton.mintBatch(user, amounts, "");
    }

    // ========== PREDICTION HELPERS ==========

    /// @notice Create a valid game prediction array (1-based gameIds)
    function _createValidGamePrediction() internal pure returns (Predictions.Prediction[] memory) {
        Predictions.Prediction[] memory preds = new Predictions.Prediction[](4);
        preds[0] = Predictions.Prediction({ gameId: 1, result: [uint8(2), uint8(1)] });
        preds[1] = Predictions.Prediction({ gameId: 2, result: [uint8(1), uint8(1)] });
        preds[2] = Predictions.Prediction({ gameId: 3, result: [uint8(0), uint8(2)] });
        preds[3] = Predictions.Prediction({ gameId: 4, result: [uint8(3), uint8(0)] });
        return preds;
    }

    /// @notice Create custom game prediction (1-based gameIds)
    function _createGamePrediction(
        uint8[8] memory results // [game1_team1, game1_team2, game2_team1, game2_team2, ...]
    )
        internal
        pure
        returns (Predictions.Prediction[] memory)
    {
        Predictions.Prediction[] memory preds = new Predictions.Prediction[](4);
        for (uint256 i = 0; i < 4; i++) {
            preds[i] = Predictions.Prediction({ gameId: uint8(i + 1), result: [results[i * 2], results[i * 2 + 1]] });
        }
        return preds;
    }

    /// @notice Submit game prediction for user
    function _submitGamePrediction(address user, uint256 tokenId, Predictions.Prediction[] memory preds) internal {
        vm.prank(user);
        predictions.submitPrediction(tokenId, preds);
    }

    /// @notice Submit winner prediction for user
    function _submitWinnerPrediction(address user, uint256 tokenId, uint8[4] memory teams) internal {
        vm.prank(user);
        predictions.predictWinners(tokenId, teams);
    }

    /// @notice Submit complete predictions (games + winners) for user
    function _submitCompletePredictions(
        address user,
        uint256 tokenId,
        Predictions.Prediction[] memory preds,
        uint8[4] memory winners
    ) internal {
        _submitGamePrediction(user, tokenId, preds);
        _submitWinnerPrediction(user, tokenId, winners);
    }

    // ========== GAME RESULT HELPERS ==========

    /// @notice Set all game results with default values (1-based gameIds)
    function _setDefaultGameResults() internal {
        _movePastSubmissionDeadlineIfNeeded();
        predictions.setResults(1, 2, 1);
        predictions.setResults(2, 1, 1);
        predictions.setResults(3, 0, 2);
        predictions.setResults(4, 3, 0);
    }

    /// @notice Set custom game results (1-based gameIds)
    function _setGameResults(uint8[8] memory results) internal {
        _movePastSubmissionDeadlineIfNeeded();
        for (uint8 i = 0; i < 4; i++) {
            predictions.setResults(i + 1, results[i * 2], results[i * 2 + 1]);
        }
    }

    /// @notice Set official winners
    function _setOfficialWinners(uint8[4] memory teams) internal {
        predictions.setOfficialWinners(teams);
    }

    // ========== ASSERTION HELPERS ==========

    /// @notice Assert user owns carton
    function _assertOwnsCarton(address user, uint256 tokenId) internal view {
        assertEq(carton.balanceOf(user, tokenId), 1, "User should own carton");
    }

    /// @notice Assert prediction is submitted
    function _assertPredictionSubmitted(uint256 tokenId) internal view {
        assertTrue(predictions.used(tokenId), "Prediction should be submitted");
    }

    /// @notice Assert points are within expected range
    function _assertPointsInRange(uint256 points, uint256 min, uint256 max) internal pure {
        assertTrue(
            points >= min && points <= max,
            string(abi.encodePacked("Points should be between ", vm.toString(min), " and ", vm.toString(max)))
        );
    }

    /// @notice Assert user has role
    function _assertHasRole(bytes32 role, address user) internal view {
        assertTrue(carton.hasRole(role, user), "User should have role");
    }

    /// @notice Assert user does not have role
    function _assertNotHasRole(bytes32 role, address user) internal view {
        assertFalse(carton.hasRole(role, user), "User should not have role");
    }

    // ========== TIME HELPERS ==========

    /// @notice Move to after deadline
    function _moveToAfterDeadline() internal {
        vm.warp(block.timestamp + DEFAULT_DEADLINE_OFFSET + 1);
    }

    /// @notice Move to after the configured submission deadline when tests need to publish results.
    function _movePastSubmissionDeadlineIfNeeded() internal {
        uint256 deadline = predictions.submissionDeadline();
        if (deadline != 0 && block.timestamp <= deadline) {
            vm.warp(deadline + 1);
        }
    }

    /// @notice Move to before deadline
    function _moveToBeforeDeadline() internal {
        vm.warp(block.timestamp - 1);
    }

    /// @notice Set custom deadline
    function _setDeadline(uint256 deadline) internal {
        predictions.setSubmissionDeadline(deadline);
    }

    // ========== SCENARIO HELPERS ==========

    /// @notice Setup complete scenario with users, cartons, and predictions
    function _setupCompleteScenario() internal {
        _mintCartonsToUsers();

        // User 1 - Perfect predictions
        Predictions.Prediction[] memory preds1 = _createValidGamePrediction();
        _submitCompletePredictions(user1, TOKEN_ID_1, preds1, [TEAM_1, TEAM_2, TEAM_3, TEAM_4]);

        // User 2 - Good predictions
        uint8[8] memory results2 = [2, 0, 1, 2, 0, 1, 2, 1];
        Predictions.Prediction[] memory preds2 = _createGamePrediction(results2);
        _submitCompletePredictions(user2, TOKEN_ID_2, preds2, [TEAM_1, TEAM_3, TEAM_2, TEAM_4]);

        // User 3 - Poor predictions
        uint8[8] memory results3 = [1, 1, 2, 0, 1, 0, 1, 2];
        Predictions.Prediction[] memory preds3 = _createGamePrediction(results3);
        _submitCompletePredictions(user3, TOKEN_ID_3, preds3, [TEAM_5, TEAM_6, TEAM_7, TEAM_8]);

        // Set official results
        _setDefaultGameResults();
        _setOfficialWinners([TEAM_1, TEAM_2, TEAM_3, TEAM_4]);
    }

    /// @notice Calculate and return all user points
    function _calculateAllUserPoints() internal view returns (uint256[] memory) {
        uint256[] memory points = new uint256[](3);
        points[0] = predictions.calculateTotalPoints(TOKEN_ID_1);
        points[1] = predictions.calculateTotalPoints(TOKEN_ID_2);
        points[2] = predictions.calculateTotalPoints(TOKEN_ID_3);
        return points;
    }

    // ========== EXPECTATION HELPERS ==========

    /// @notice Expect revert with specific error for access control
    function _expectAccessControlRevert(address user, bytes32 role) internal {
        vm.expectRevert(
            abi.encodeWithSelector(bytes4(keccak256("AccessControlUnauthorizedAccount(address,bytes32)")), user, role)
        );
    }

    /// @notice Expect revert with specific message
    function _expectRevertWithMessage(string memory message) internal {
        vm.expectRevert(bytes(message));
    }

    // ========== UTILITY HELPERS ==========

    /// @notice Create array of addresses
    function _createAddressArray(address a1, address a2, address a3) internal pure returns (address[] memory) {
        address[] memory addresses = new address[](3);
        addresses[0] = a1;
        addresses[1] = a2;
        addresses[2] = a3;
        return addresses;
    }

    /// @notice Create array of uint256
    function _createUint256Array(uint256 a1, uint256 a2, uint256 a3) internal pure returns (uint256[] memory) {
        uint256[] memory values = new uint256[](3);
        values[0] = a1;
        values[1] = a2;
        values[2] = a3;
        return values;
    }

    /// @notice Log test info for debugging
    function _logTestInfo(string memory testName) internal pure {
        console.log("=== Running Test:", testName, "===");
    }
}
