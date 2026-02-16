// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Test.sol";
import "../src/Carton.sol";
import "../src/Predictions.sol";

contract PredictionsTest is Test {
    Carton cart;
    Predictions preds;
    address user = address(0xABCD);
    uint256 TOKEN_ID;

    function setUp() public {
        // 1) Deploy Carton and grant all roles to this test contract
        cart = new Carton(address(this), address(this), address(this));
        // 2) Mint a carton (ERC-1155) to user
        TOKEN_ID = cart.mint(user, 1, "");

        // 3) Deploy Predictions pointing to Carton
        preds = new Predictions(address(cart));

        // 4) Set deadline for 1 day from now
        uint256 deadline = block.timestamp + 1 days;
        preds.setSubmissionDeadline(deadline);
        preds.setTotalGames(4);
    }

    function testSubmitAndReadPicks() public {
        // Set deadline for 1 day from now
        uint256 deadline = block.timestamp + 1 days;
        preds.setSubmissionDeadline(deadline);

        // Create a Prediction array of length 4 (1-based gameIds)
        Predictions.Prediction[] memory arr = new Predictions.Prediction[](4);
        arr[0] = Predictions.Prediction({gameId: 1, result: [uint8(0), uint8(1)]});
        arr[1] = Predictions.Prediction({gameId: 2, result: [uint8(1), uint8(0)]});
        arr[2] = Predictions.Prediction({gameId: 3, result: [uint8(2), uint8(1)]});
        arr[3] = Predictions.Prediction({gameId: 4, result: [uint8(0), uint8(0)]});

        // Simulate user calling submitPrediction
        vm.prank(user);
        preds.submitPrediction(TOKEN_ID, arr);

        // Verify that getPrediction returns stored data
        Predictions.Prediction[] memory stored = preds.getPrediction(TOKEN_ID);
        assertEq(stored.length, 4, "length should be 4");

        // Check fields of stored[0]
        assertEq(stored[0].gameId, 1, "stored[0].gameId should be 1");
        assertEq(stored[0].result[0], 0, "stored[0].result[0] should be 0");
        assertEq(stored[0].result[1], 1, "stored[0].result[1] should be 1");

        // Also check stored[3]
        assertEq(stored[3].gameId, 4, "stored[3].gameId should be 4");
        assertEq(stored[3].result[0], 0, "stored[3].result[0] should be 0");
        assertEq(stored[3].result[1], 0, "stored[3].result[1] should be 0");

        // A second submission with same tokenId should revert
        vm.prank(user);
        vm.expectRevert();
        preds.submitPrediction(TOKEN_ID, arr);
    }

    function testOnlyOwnerCannotSubmit() public {
        Predictions.Prediction[] memory arr2 = new Predictions.Prediction[](4);
        arr2[0] = Predictions.Prediction({gameId: 1, result: [uint8(0), uint8(1)]});
        arr2[1] = Predictions.Prediction({gameId: 2, result: [uint8(1), uint8(0)]});
        arr2[2] = Predictions.Prediction({gameId: 3, result: [uint8(2), uint8(1)]});
        arr2[3] = Predictions.Prediction({gameId: 4, result: [uint8(0), uint8(0)]});

        // Simulate that a non-owner calls and should revert
        vm.prank(address(0xDEAD));
        vm.expectRevert();
        preds.submitPrediction(TOKEN_ID, arr2);
    }

    function testSetSubmissionDeadline() public {
        // 1) Try setting deadline in the past should revert
        // 0) Advance block 2 days to be able to subtract without underflow
        vm.warp(2 days);
        uint256 currentTime = block.timestamp; // == 2 days
        // 1) Try setting deadline in the past should revert
        vm.expectRevert("Deadline must be in the future");
        preds.setSubmissionDeadline(currentTime - 1 days); // now equals 1 day

        // 2) Set deadline for 1 day from now
        vm.warp(currentTime);
        uint256 deadline = currentTime + 1 days;
        preds.setSubmissionDeadline(deadline);

        // 3) Verify that deadline was set correctly
        assertEq(preds.submissionDeadline(), deadline);

        // 4) Try setting new deadline before current should revert
        vm.warp(currentTime + 1 hours);
        vm.expectRevert("Deadline must be in the future");
        preds.setSubmissionDeadline(currentTime);
    }

    function testSubmitPredictionBeforeDeadline() public {
        // 1) Establecer deadline para dentro de 1 día
        uint256 deadline = block.timestamp + 1 days;
        preds.setSubmissionDeadline(deadline);

        // 2) Crear array de predicciones (1-based gameIds)
        Predictions.Prediction[] memory arr = new Predictions.Prediction[](4);
        arr[0] = Predictions.Prediction({gameId: 1, result: [uint8(0), uint8(1)]});
        arr[1] = Predictions.Prediction({gameId: 2, result: [uint8(1), uint8(0)]});
        arr[2] = Predictions.Prediction({gameId: 3, result: [uint8(2), uint8(1)]});
        arr[3] = Predictions.Prediction({gameId: 4, result: [uint8(0), uint8(0)]});

        // 3) Simular que el usuario envía las predicciones antes del deadline
        vm.prank(user);
        preds.submitPrediction(TOKEN_ID, arr);

        // 4) Verificar que las predicciones se guardaron correctamente
        Predictions.Prediction[] memory stored = preds.getPrediction(TOKEN_ID);
        assertEq(stored.length, 4);
    }

    function testSubmitPredictionAfterDeadline() public {
        // 1) Establecer deadline para dentro de 1 día
        uint256 deadline = block.timestamp + 1 days;
        preds.setSubmissionDeadline(deadline);

        // 2) Crear array de predicciones
        Predictions.Prediction[] memory arr = new Predictions.Prediction[](4);
        arr[0] = Predictions.Prediction({gameId: 1, result: [uint8(0), uint8(1)]});
        arr[1] = Predictions.Prediction({gameId: 2, result: [uint8(1), uint8(0)]});
        arr[2] = Predictions.Prediction({gameId: 3, result: [uint8(2), uint8(1)]});
        arr[3] = Predictions.Prediction({gameId: 4, result: [uint8(0), uint8(0)]});

        // 3) Saltar al día después del deadline
        vm.warp(deadline + 1);

        // 4) Intentar enviar predicciones después del deadline debe revertir
        vm.prank(user);
        vm.expectRevert("Prediction deadline passed");
        preds.submitPrediction(TOKEN_ID, arr);
    }

    function testInvalidPrediction() public {
        // 1) Intentar enviar menos partidos que TOTAL_GAMES
        Predictions.Prediction[] memory arr3 = new Predictions.Prediction[](3);
        vm.prank(user);
        vm.expectRevert("Must submit predictions for all games");
        preds.submitPrediction(TOKEN_ID, arr3);

        // 2) Intentar hacer predicción después de que se establezcan resultados
        preds.setResults(2, 2, 2);
        preds.setResults(3, 2, 1);
        preds.setResults(4, 0, 3);

        Predictions.Prediction[] memory arr5 = new Predictions.Prediction[](4);
        arr5[0] = Predictions.Prediction({gameId: 1, result: [uint8(0), uint8(1)]});
        arr5[1] = Predictions.Prediction({gameId: 2, result: [uint8(0), uint8(0)]});
        arr5[2] = Predictions.Prediction({gameId: 3, result: [uint8(0), uint8(0)]});
        arr5[3] = Predictions.Prediction({gameId: 4, result: [uint8(0), uint8(0)]});
        vm.prank(user);
        vm.expectRevert("Cannot predict after results are set");
        preds.submitPrediction(TOKEN_ID, arr5);
    }

    // ========== Game ID validation tests ==========

    function testSubmitPrediction_GameIdZero() public {
        Predictions.Prediction[] memory arr = new Predictions.Prediction[](4);
        arr[0] = Predictions.Prediction({gameId: 0, result: [uint8(1), uint8(0)]});
        arr[1] = Predictions.Prediction({gameId: 2, result: [uint8(1), uint8(0)]});
        arr[2] = Predictions.Prediction({gameId: 3, result: [uint8(1), uint8(0)]});
        arr[3] = Predictions.Prediction({gameId: 4, result: [uint8(1), uint8(0)]});

        vm.prank(user);
        vm.expectRevert("Invalid game ID");
        preds.submitPrediction(TOKEN_ID, arr);
    }

    function testSubmitPrediction_GameIdOutOfRange() public {
        Predictions.Prediction[] memory arr = new Predictions.Prediction[](4);
        arr[0] = Predictions.Prediction({gameId: 1, result: [uint8(1), uint8(0)]});
        arr[1] = Predictions.Prediction({gameId: 2, result: [uint8(1), uint8(0)]});
        arr[2] = Predictions.Prediction({gameId: 3, result: [uint8(1), uint8(0)]});
        arr[3] = Predictions.Prediction({gameId: 5, result: [uint8(1), uint8(0)]});

        vm.prank(user);
        vm.expectRevert("Invalid game ID");
        preds.submitPrediction(TOKEN_ID, arr);
    }

    function testSubmitPrediction_DuplicateGameId() public {
        Predictions.Prediction[] memory arr = new Predictions.Prediction[](4);
        arr[0] = Predictions.Prediction({gameId: 1, result: [uint8(1), uint8(0)]});
        arr[1] = Predictions.Prediction({gameId: 2, result: [uint8(1), uint8(0)]});
        arr[2] = Predictions.Prediction({gameId: 1, result: [uint8(0), uint8(1)]});
        arr[3] = Predictions.Prediction({gameId: 4, result: [uint8(1), uint8(0)]});

        vm.prank(user);
        vm.expectRevert("Duplicate game ID");
        preds.submitPrediction(TOKEN_ID, arr);
    }

    modifier setup() {
        // Mintear el cartón para el usuario
        cart.mint(user, 1, "");

        // Set deadline for 1 day from now
        uint256 deadline = block.timestamp + 1 days;
        preds.setSubmissionDeadline(deadline);

        _;
    }

    function testWinnerPrediction_NoCarton() public {
        // Try making winner prediction without having carton
        vm.prank(address(0xDEAD));
        vm.expectRevert();
        preds.predictWinners(TOKEN_ID, [1, 2, 3, 4]);
    }

    function testWinnerPrediction_Valid() public setup {
        // Hacer predicción válida de ganadores
        vm.prank(user);
        preds.predictWinners(TOKEN_ID, [1, 2, 3, 4]);

        // Verify it was stored correctly
        uint8[4] memory prediction = preds.getWinnersPrediction(TOKEN_ID);
        assertEq(prediction[0], 1);
        assertEq(prediction[1], 2);
        assertEq(prediction[2], 3);
        assertEq(prediction[3], 4);
    }

    function testWinnerPrediction_InvalidTeam() public setup {
        // Intentar predecir equipo inválido (>= MAX_TEAM_ID)
        vm.prank(user);
        vm.expectRevert("Invalid team ID");
        preds.predictWinners(TOKEN_ID, [49, 2, 3, 4]);
    }

    function testWinnerPrediction_DuplicateTeams() public setup {
        // Intentar predecir equipos duplicados
        vm.prank(user);
        vm.expectRevert("Duplicate team ID");
        preds.predictWinners(TOKEN_ID, [1, 2, 2, 4]);
    }

    function testWinnerPrediction_AlreadyPredicted() public setup {
        // Hacer predicción válida de ganadores
        vm.prank(user);
        preds.predictWinners(TOKEN_ID, [1, 2, 3, 4]);

        // Intentar hacer otra predicción de ganadores
        vm.prank(user);
        vm.expectRevert("Winners already predicted");
        preds.predictWinners(TOKEN_ID, [1, 2, 3, 4]);
    }

    function testPointsCalculation() public {
        // Hacer predicción de partidos (1-based gameIds)
        uint256[] memory pos;

        Predictions.Prediction[] memory gamePreds = new Predictions.Prediction[](4);
        gamePreds[0] = Predictions.Prediction({gameId: 1, result: [uint8(2), uint8(1)]});
        gamePreds[1] = Predictions.Prediction({gameId: 2, result: [uint8(1), uint8(1)]});
        gamePreds[2] = Predictions.Prediction({gameId: 3, result: [uint8(0), uint8(2)]});
        gamePreds[3] = Predictions.Prediction({gameId: 4, result: [uint8(2), uint8(2)]});

        // First submit predictions before setting results
        vm.prank(user);
        preds.submitPrediction(TOKEN_ID, gamePreds);

        // Establecer resultados de los partidos (1-based gameIds)
        preds.setResults(1, 2, 1); // Exacto: 7 + 2 = 9 puntos
        preds.setResults(2, 1, 1); // Empate: 7 + 2 = 9 puntos
        preds.setResults(3, 0, 3); // Acertar visitante: 6 + 2 = 8 puntos
        preds.setResults(4, 2, 2); // Empate: 7 + 2 = 9 puntos

        // Verificar puntos de cada partido
        assertEq(preds.calculatePoints(TOKEN_ID, 0), 9);
        assertEq(preds.calculatePoints(TOKEN_ID, 1), 9);
        assertEq(preds.calculatePoints(TOKEN_ID, 2), 8);
        assertEq(preds.calculatePoints(TOKEN_ID, 3), 9);

        // Verificar puntos totales (solo partidos)
        assertEq(preds.calculateTotalPoints(TOKEN_ID), 35);

        // Establecer ganadores oficiales
        preds.setOfficialWinners([1, 2, 3, 4]);

        // Hacer predicción de ganadores
        vm.prank(user);
        preds.predictWinners(TOKEN_ID, [1, 2, 3, 4]);

        // Verificar puntos de ganadores
        assertEq(preds.calculateWinnerPoints(TOKEN_ID), 55); // 19 + 16 + 10 + 10

        // Verificar puntos totales (partidos + ganadores)
        assertEq(preds.calculateTotalPoints(TOKEN_ID), 90); // 35 + 55

        // Establecer posiciones
        uint256[] memory ids = new uint256[](1);
        uint256[] memory points = new uint256[](1);
        ids[0] = TOKEN_ID;
        points[0] = 90;
        preds.setPositions(ids, points);

        // Verificar que las posiciones se establecieron correctamente
        pos = preds.getPositions();
        assertEq(pos.length, 1);
        assertEq(pos[0], TOKEN_ID);

        // Actualizar puntos totales
        vm.prank(user);
        preds.updateTotalPoints(TOKEN_ID);
        assertEq(preds.totalPoints(TOKEN_ID), 90);
    }

    function testSetPositions() public {
        uint256[] memory pos;

        // 1) Intentar establecer posiciones con arrays de diferente longitud
        uint256[] memory ids = new uint256[](1);
        uint256[] memory points = new uint256[](2);
        ids[0] = TOKEN_ID;
        points[0] = 90;
        points[1] = 80;
        vm.expectRevert("Arrays must have same length");
        preds.setPositions(ids, points);

        // 2) Intentar establecer posiciones con puntos desordenados
        ids = new uint256[](2);
        points = new uint256[](2);
        ids[0] = TOKEN_ID;
        ids[1] = TOKEN_ID + 1;
        points[0] = 80;
        points[1] = 90;
        vm.expectRevert("Points must be ordered");
        preds.setPositions(ids, points);

        // 3) Establecer posiciones correctamente
        points[0] = 90;
        points[1] = 80;
        preds.setPositions(ids, points);
        pos = preds.getPositions();
        assertEq(pos.length, 2);
        assertEq(pos[0], TOKEN_ID);
        assertEq(pos[1], TOKEN_ID + 1);
    }

    function testSetResults() public {
        // Only owner can set results
        vm.prank(address(0xDEAD));
        vm.expectRevert();
        preds.setResults(1, 2, 1);

        // gameId = 0 should revert (1-based)
        vm.expectRevert("Invalid game ID");
        preds.setResults(0, 2, 1);

        // gameId out of range should revert
        vm.expectRevert("Invalid game ID");
        preds.setResults(5, 2, 1);

        // Establecer resultados dos veces debe revertir
        preds.setResults(1, 2, 1);
        vm.expectRevert("Results already set for this game");
        preds.setResults(1, 2, 1);

        // Verificar que los resultados se establecieron correctamente
        uint8[2] memory result = preds.getGameResults(1);
        assertEq(result[0], 2, "Team1 goals should be 2");
        assertEq(result[1], 1, "Team2 goals should be 1");
    }

    // ========== Team ID > 32 tests (array sizing fix) ==========

    function testWinnerPrediction_HighTeamIds() public setup {
        // Predict winners with high team IDs (all valid: 1-48)
        vm.prank(user);
        preds.predictWinners(TOKEN_ID, [33, 34, 47, 48]);

        uint8[4] memory prediction = preds.getWinnersPrediction(TOKEN_ID);
        assertEq(prediction[0], 33);
        assertEq(prediction[3], 48);
    }

    function testWinnerPrediction_RevertTeamIdZero() public setup {
        vm.prank(user);
        vm.expectRevert("Invalid team ID");
        preds.predictWinners(TOKEN_ID, [0, 2, 3, 4]);
    }

    function testSetOfficialWinners_RevertTeamIdZero() public {
        vm.expectRevert("Invalid team ID");
        preds.setOfficialWinners([0, 2, 3, 4]);
    }

    function testSetOfficialWinners_MaxTeamIdValid() public {
        // Team 48 (== MAX_TEAM_ID) should now be valid
        preds.setOfficialWinners([45, 46, 47, 48]);

        (bool isSet) = preds.officialWinners();
        assertTrue(isSet);
    }

    function testGetGameResults_GameIdZero() public {
        vm.expectRevert("Invalid game ID");
        preds.getGameResults(0);
    }

    function testGetGameResults_GameIdOutOfRange() public {
        vm.expectRevert("Invalid game ID");
        preds.getGameResults(5);
    }
}
