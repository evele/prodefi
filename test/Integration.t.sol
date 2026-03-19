// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./BaseTest.sol";

/// @title Integration Tests for ProDefi System
/// @notice Tests the complete workflow from minting cartones to final rankings
contract IntegrationTest is BaseTest {
    function setUp() public override {
        super.setUp();
        _mintCartonsToUsers();
    }

    /// @notice Test complete workflow: mint → predict games → predict winners → set results → calculate rankings
    function testCompleteWorkflow() public {
        _logTestInfo("Complete Workflow");

        // ========== PHASE 1: GAME PREDICTIONS ==========

        // User 1 predictions - very accurate (will match official results exactly)
        Predictions.Prediction[] memory user1Preds = _createValidGamePrediction();
        _submitGamePrediction(user1, TOKEN_ID_1, user1Preds);

        // User 2 predictions - moderately accurate
        uint8[8] memory results2 = [2, 0, 1, 2, 1, 2, 2, 1];
        Predictions.Prediction[] memory user2Preds = _createGamePrediction(results2);
        _submitGamePrediction(user2, TOKEN_ID_2, user2Preds);

        // User 3 predictions - less accurate
        uint8[8] memory results3 = [1, 1, 2, 0, 0, 1, 1, 1];
        Predictions.Prediction[] memory user3Preds = _createGamePrediction(results3);
        _submitGamePrediction(user3, TOKEN_ID_3, user3Preds);

        // ========== PHASE 2: WINNER PREDICTIONS ==========

        _submitWinnerPrediction(user1, TOKEN_ID_1, [TEAM_1, TEAM_2, TEAM_3, TEAM_4]); // Perfect
        _submitWinnerPrediction(user2, TOKEN_ID_2, [TEAM_1, TEAM_3, TEAM_2, TEAM_4]); // Good
        _submitWinnerPrediction(user3, TOKEN_ID_3, [TEAM_5, TEAM_6, TEAM_7, TEAM_8]); // Poor

        // ========== PHASE 3: SET OFFICIAL RESULTS ==========

        _setDefaultGameResults(); // Matches user1's predictions exactly
        _setOfficialWinners([TEAM_1, TEAM_2, TEAM_3, TEAM_4]); // Perfect match for user1

        // ========== PHASE 4: CALCULATE AND VERIFY POINTS ==========

        uint256[] memory allPoints = _calculateAllUserPoints();

        // User 1 should have perfect predictions (36 game + 55 winner = 91 total)
        assertEq(allPoints[0], 91, "User1 should have 91 total points");

        // Verify ranking order
        assertTrue(allPoints[0] > allPoints[1], "User1 should have more points than User2");
        assertTrue(allPoints[1] > allPoints[2], "User2 should have more points than User3");

        // Verify minimum point thresholds
        _assertPointsInRange(allPoints[0], 85, 95); // User1 high score
        _assertPointsInRange(allPoints[1], 10, 60); // User2 medium score
        _assertPointsInRange(allPoints[2], 0, 40); // User3 low score

        // ========== PHASE 5: UPDATE POINTS AND SET RANKINGS ==========

        // Update stored points
        predictions.updateTotalPoints(TOKEN_ID_1);
        predictions.updateTotalPoints(TOKEN_ID_2);
        predictions.updateTotalPoints(TOKEN_ID_3);

        // Verify stored points match calculated points
        assertEq(predictions.totalPoints(TOKEN_ID_1), allPoints[0]);
        assertEq(predictions.totalPoints(TOKEN_ID_2), allPoints[1]);
        assertEq(predictions.totalPoints(TOKEN_ID_3), allPoints[2]);

        // Set final rankings
        uint256[] memory ids = _createUint256Array(TOKEN_ID_1, TOKEN_ID_2, TOKEN_ID_3);
        predictions.setPositions(ids, allPoints);

        // Verify final rankings
        assertEq(predictions.getCartonPosition(TOKEN_ID_1), 1); // 1st place
        assertEq(predictions.getCartonPosition(TOKEN_ID_2), 2); // 2nd place
        assertEq(predictions.getCartonPosition(TOKEN_ID_3), 3); // 3rd place

        // ========== VERIFICATION OF COMPLETE SYSTEM STATE ==========

        _assertOwnsCarton(user1, TOKEN_ID_1);
        _assertOwnsCarton(user2, TOKEN_ID_2);
        _assertOwnsCarton(user3, TOKEN_ID_3);

        _assertPredictionSubmitted(TOKEN_ID_1);
        _assertPredictionSubmitted(TOKEN_ID_2);
        _assertPredictionSubmitted(TOKEN_ID_3);
    }

    /// @notice Test workflow with deadline enforcement
    function testDeadlineEnforcement() public {
        _moveToAfterDeadline();

        Predictions.Prediction[] memory preds = _createValidGamePrediction();

        vm.expectRevert(Predictions.DeadlinePassed.selector);
        _submitGamePrediction(user1, TOKEN_ID_1, preds);

        vm.expectRevert(Predictions.DeadlinePassed.selector);
        _submitWinnerPrediction(user1, TOKEN_ID_1, [TEAM_1, TEAM_2, TEAM_3, TEAM_4]);
    }

    /// @notice Test multiple users competing scenario
    function testMultipleUsersCompetition() public {
        _setupCompleteScenario();

        uint256[] memory points = _calculateAllUserPoints();

        // Verify points are different (competition working)
        assertTrue(points[0] != points[1], "User1 and User2 should have different points");
        assertTrue(points[1] != points[2], "User2 and User3 should have different points");
        assertTrue(points[0] != points[2], "User1 and User3 should have different points");

        // At least one user should have non-zero points
        assertTrue(points[0] > 0 || points[1] > 0 || points[2] > 0, "At least one user should score points");
    }
}
