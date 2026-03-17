// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Predictions Contract for Prode Cards
contract Predictions is Ownable {
    IERC1155 public cartones;
    /// @notice Anchor for off-chain teams config (id + name + groupId)
    /// @dev Set via setTeamsHash(); frontend verifies local config against this before submitting predictions
    bytes32 public teamsHash;
    bool public teamsHashFrozen;

    event TeamsHashUpdated(bytes32 oldHash, bytes32 newHash);
    event TeamsHashFrozen();

    // Number of games required in a prediction (configurable by owner before submissions start)
    uint8 public totalGames = 72;
    uint8 immutable LOCAL = 0;
    uint8 immutable EMPATE = 1;
    uint8 immutable VISITANTE = 2;
    uint8 immutable MAX_TEAM_ID = 48; // Maximum allowed team ID
    uint8 immutable MAX_WINNERS = 4; // Maximum number of winner teams to predict
    uint8 constant POINTS_FIRST = 19; // Points for guessing first place
    uint8 constant POINTS_SECOND = 16; // Points for guessing second place
    uint8 constant POINTS_THIRD_FOURTH = 10; // Points for guessing third or fourth place

    // Structure to store official winners
    struct OfficialWinners {
        uint8[4] teams; // Team IDs
        bool set; // Whether winners are set
    }

    OfficialWinners public officialWinners;

    // Event for when official winners are set
    event OfficialWinnersSet(uint8[4] teams);

    // Structure to store winner predictions
    struct WinnersPrediction {
        uint8[4] teams; // Team IDs
        bool set; // Whether prediction is set
    }

    mapping(uint256 => WinnersPrediction) public winnersPredictions;
    mapping(uint256 => uint256) public totalPoints; // tokenID -> total points

    uint256 public submissionDeadline; // Deadline for submitting predictions

    // Events for winner predictions
    event WinnersPredicted(address indexed user, uint256 indexed tokenId, uint8[4] teams);
    event PointsUpdated(uint256 indexed tokenId, uint256 points);

    event PredictionsSubmitted(address indexed user, uint256 indexed tokenId);
    event ResultsSet(uint8 indexed gameId, uint8 team1Goals, uint8 team2Goals);
    event TotalGamesUpdated(uint8 oldValue, uint8 newValue);

    /// @notice Stores the official result for a game
    /// @dev result[0] = team1 goals, result[1] = team2 goals.
    /// Team assignment per gameId is defined off-chain; integrity is anchored by `teamsHash`.
    struct Game {
        uint8 id;
        uint8[2] result;
        bool set;
    }

    // Lightweight struct for user predictions (only gameId + result)
    struct Prediction {
        uint8 gameId;
        uint8[2] result;
    }

    mapping(uint8 => Game) public games;

    mapping(uint256 => Prediction[]) predictions; // token ID -> prediction (Prediction[])

    // uint256[] public positions; // array of token IDs ordered from higher to lower

    mapping(uint256 => bool) public used;
    uint256[] public positions; // array of token IDs ordered from highest to lowest
    mapping(uint256 => uint256) public tokenPositions; // tokenId => position (1-indexed)

    // Event for when positions are updated
    event PositionsUpdated(uint256[] positions);

    // Getter function to obtain positions
    function getPositions() public view returns (uint256[] memory) {
        return positions;
    }

    // Call Ownable(msg.sender) to assign the owner correctly
    constructor(address _cartones) Ownable(msg.sender) {
        cartones = IERC1155(_cartones);
    }

    // Allow owner to set teams metadata hash; can be frozen
    function setTeamsHash(bytes32 h) external onlyOwner {
        require(!teamsHashFrozen, "teamsHash frozen");
        emit TeamsHashUpdated(teamsHash, h);
        teamsHash = h;
    }

    function freezeTeamsHash() external onlyOwner {
        require(!teamsHashFrozen, "already frozen");
        teamsHashFrozen = true;
        emit TeamsHashFrozen();
    }

    // Function to set the time limit for predictions
    function setSubmissionDeadline(uint256 _deadline) external onlyOwner {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        submissionDeadline = _deadline;
    }
    // Guard to prevent changing game count after any prediction was submitted

    bool public predictionsStarted;
    /// @notice Configure the number of games required per prediction
    /// @dev Can only be set before any prediction is submitted to avoid inconsistencies

    function setTotalGames(uint8 _totalGames) external onlyOwner {
        require(!predictionsStarted, "Predictions already started");
        require(_totalGames > 0, "totalGames must be > 0");
        emit TotalGamesUpdated(totalGames, _totalGames);
        totalGames = _totalGames;
    }

    // Function for owner to set positions
    function setPositions(uint256[] memory _predictionIds, uint256[] memory _predictionPoints)
        public
        onlyOwner
        returns (bool success)
    {
        require(_predictionIds.length > 0, "No predictions provided");
        require(_predictionIds.length == _predictionPoints.length, "Arrays must have same length");

        uint256 maxPoints = type(uint256).max;
        delete positions;

        for (uint256 i = 0; i < _predictionPoints.length; i++) {
            require(maxPoints >= _predictionPoints[i], "Points must be ordered");
            positions.push(_predictionIds[i]);
            tokenPositions[_predictionIds[i]] = i + 1;
            maxPoints = _predictionPoints[i];
        }

        emit PositionsUpdated(positions);
        return true;
    }

    function getCartonPosition(uint256 tokenId) public view returns (uint256) {
        require(tokenPositions[tokenId] > 0, "Token not in leaderboard");
        return tokenPositions[tokenId];
    }

    modifier onlyCartonOwner(uint256 tokenId) {
        require(cartones.balanceOf(msg.sender, tokenId) >= 1, "You aren't the owner of this carton");
        _;
    }

    function submitPrediction(uint256 tokenId, Prediction[] calldata _prediction) external onlyCartonOwner(tokenId) {
        require(block.timestamp < submissionDeadline, "Prediction deadline passed");
        require(!used[tokenId], "Prediction already submitted");
        require(_prediction.length == totalGames, "Must submit predictions for all games");

        bool[] memory usedGameId = new bool[](totalGames + 1);

        for (uint256 i = 0; i < _prediction.length; i++) {
            require(_prediction[i].gameId > 0 && _prediction[i].gameId <= totalGames, "Invalid game ID");
            require(!usedGameId[_prediction[i].gameId], "Duplicate game ID");
            require(!games[_prediction[i].gameId].set, "Cannot predict after results are set");
            usedGameId[_prediction[i].gameId] = true;
        }

        used[tokenId] = true;
        if (!predictionsStarted) predictionsStarted = true;

        for (uint256 i = 0; i < _prediction.length; i++) {
            predictions[tokenId].push(Prediction({gameId: _prediction[i].gameId, result: _prediction[i].result}));
        }

        emit PredictionsSubmitted(msg.sender, tokenId);
    }

    function setResults(uint8 gameId, uint8 team1Goals, uint8 team2Goals) external onlyOwner {
        require(gameId > 0 && gameId <= totalGames, "Invalid game ID");
        require(!games[gameId].set, "Results already set for this game");

        games[gameId].result = [team1Goals, team2Goals];
        games[gameId].set = true;

        emit ResultsSet(gameId, team1Goals, team2Goals);
    }

    function getPrediction(uint256 tokenId) external view returns (Prediction[] memory) {
        return predictions[tokenId];
    }

    function getGameResults(uint8 gameId) external view returns (uint8[2] memory) {
        require(gameId > 0 && gameId <= totalGames, "Invalid game ID");
        return games[gameId].result;
    }

    // Funciones de cálculo de puntos
    function calculatePoints(uint256 tokenId, uint8 index) public view returns (uint8) {
        require(games[predictions[tokenId][index].gameId].set, "Result not set for this game");

        uint8 points = abs(
            int8(
                7
                    - (
                        calculateDifferencePoints(
                            predictions[tokenId][index].result[0], games[predictions[tokenId][index].gameId].result[0]
                        )
                            + calculateDifferencePoints(
                                predictions[tokenId][index].result[1], games[predictions[tokenId][index].gameId].result[1]
                            )
                    )
            )
        );

        if (
            getLocalEmpateVisitante(predictions[tokenId][index].result[0], predictions[tokenId][index].result[1])
                == getLocalEmpateVisitante(
                    games[predictions[tokenId][index].gameId].result[0], games[predictions[tokenId][index].gameId].result[1]
                )
        ) {
            points += 2;
        }

        return points;
    }

    function calculateDifferencePoints(uint8 goalsP, uint8 goalsR) public pure returns (uint8) {
        return abs(int8(goalsR) - int8(goalsP));
    }

    function getLocalEmpateVisitante(uint8 goalsL, uint8 goalsV) public pure returns (uint8) {
        return (goalsL > goalsV) ? LOCAL : (goalsL == goalsV) ? EMPATE : VISITANTE;
    }

    function abs(int8 x) public pure returns (uint8) {
        return uint8(x >= 0 ? x : -x);
    }

    // Functions for winner predictions
    function predictWinners(uint256 tokenId, uint8[4] calldata teams) external onlyCartonOwner(tokenId) {
        require(block.timestamp < submissionDeadline, "Prediction deadline passed");
        require(!winnersPredictions[tokenId].set, "Winners already predicted");

        require(all_different(teams), "Duplicate team ID");

        // Validate that team IDs are valid
        for (uint256 i = 0; i < MAX_WINNERS; i++) {
            require(teams[i] > 0 && teams[i] <= MAX_TEAM_ID, "Invalid team ID");
        }

        winnersPredictions[tokenId] = WinnersPrediction({teams: teams, set: true});

        emit WinnersPredicted(msg.sender, tokenId, teams);
    }

    function all_different(uint8[4] memory teams) public pure returns (bool) {
        for (uint256 i = 0; i < MAX_WINNERS; i++) {
            for (uint256 j = i + 1; j < MAX_WINNERS; j++) {
                if (teams[i] == teams[j]) {
                    return false;
                }
            }
        }
        return true;
    }

    function getWinnersPrediction(uint256 tokenId) external view returns (uint8[4] memory) {
        return winnersPredictions[tokenId].teams;
    }

    // Function to set official winners (only for owner)
    function setOfficialWinners(uint8[4] calldata teams) external onlyOwner {
        // NOTE: what if theres some error? .. proably need to add some edition capability or get them from oracles.
        require(!officialWinners.set, "Official winners already set");

        // Validate that team IDs are valid and there are no duplicates
        for (uint256 i = 0; i < MAX_WINNERS; i++) {
            require(teams[i] > 0 && teams[i] <= MAX_TEAM_ID, "Invalid team ID");
            for (uint256 j = i + 1; j < MAX_WINNERS; j++) {
                require(teams[i] != teams[j], "Duplicate team ID");
            }
        }

        officialWinners = OfficialWinners({teams: teams, set: true});

        emit OfficialWinnersSet(teams);
    }

    // Function to calculate winner points
    function calculateWinnerPoints(uint256 tokenId) public view returns (uint256) {
        require(officialWinners.set, "Official winners not set yet");
        require(winnersPredictions[tokenId].set, "No winners prediction for this token");

        uint256 points = 0;
        uint8[4] memory predicted = winnersPredictions[tokenId].teams;
        uint8[4] memory official = officialWinners.teams;

        // Puntos por acertar el primer puesto
        if (predicted[0] == official[0]) points += POINTS_FIRST;

        // Puntos por acertar el segundo puesto
        if (predicted[1] == official[1]) points += POINTS_SECOND;

        // Puntos por acertar el tercer o cuarto puesto
        if (predicted[2] == official[2] || predicted[2] == official[3]) points += POINTS_THIRD_FOURTH;
        if (predicted[3] == official[2] || predicted[3] == official[3]) points += POINTS_THIRD_FOURTH;

        return points;
    }

    // Function to calculate total points (games + winners)
    function calculateTotalPoints(uint256 tokenId) public view returns (uint256) {
        uint256 gamePoints = 0;
        uint256 winnerPoints = 0;

        // Calcular puntos de los partidos
        for (uint8 i = 0; i < totalGames; i++) {
            gamePoints += calculatePoints(tokenId, i);
        }

        // Si los ganadores están establecidos, sumar los puntos de los ganadores
        if (officialWinners.set) {
            winnerPoints = calculateWinnerPoints(tokenId);
        }

        return gamePoints + winnerPoints;
    }

    // Function to update total points of a carton
    function updateTotalPoints(uint256 tokenId) external {
        require(used[tokenId], "No predictions submitted for this token");
        uint256 newPoints = calculateTotalPoints(tokenId);
        totalPoints[tokenId] = newPoints;
        emit PointsUpdated(tokenId, newPoints);
    }
}
