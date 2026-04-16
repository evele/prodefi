// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface ICartonTournamentContext {
    function activeTournamentId() external view returns (uint256);
    function treasury() external view returns (address);
}

interface ITreasuryTournamentStatus {
    function isTournamentClosedAnyAsset(uint256 tournamentId) external view returns (bool);
}

/// @title Predictions Contract for Prode Cards
contract Predictions is Ownable {
    error TeamsHashAlreadyFrozen();
    error DeadlineMustBeFuture();
    error PredictionsAlreadyStarted();
    error TotalGamesMustBePositive();
    error NoPredictionsProvided();
    error ArrayLengthMismatch();
    error PointsNotOrdered();
    error TokenNotInLeaderboard();
    error NotCartonOwner();
    error DeadlinePassed();
    error PredictionAlreadySubmitted();
    error WrongPredictionCount();
    error InvalidGameId();
    error DuplicateGameId();
    error ResultsAlreadySet();
    error ResultNotSet();
    error WinnersAlreadyPredicted();
    error DuplicateTeamId();
    error InvalidTeamId();
    error OfficialWinnersAlreadySet();
    error OfficialWinnersNotSet();
    error NoPredictionForToken();
    error NoPredictionsSubmitted();
    error TournamentClosedForCorrections();

    IERC1155 public cartones;
    /// @notice Anchor for off-chain teams config (id + name + groupId)
    /// @dev Set via setTeamsHash(); frontend verifies local config against this before submitting predictions
    bytes32 public teamsHash;
    bool public teamsHashFrozen;

    event TeamsHashUpdated(bytes32 oldHash, bytes32 newHash);
    event TeamsHashFrozen();

    // Number of games required in a prediction (configurable by owner before submissions start)
    uint8 public totalGames = 72;
    uint8 constant LOCAL = 0;
    uint8 constant EMPATE = 1;
    uint8 constant VISITANTE = 2;
    uint8 constant MAX_TEAM_ID = 48; // Maximum allowed team ID
    uint8 constant MAX_WINNERS = 4; // Maximum number of winner teams to predict
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
    event ResultsUpdated(
        uint8 indexed gameId, uint8 oldTeam1Goals, uint8 oldTeam2Goals, uint8 newTeam1Goals, uint8 newTeam2Goals
    );
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

    mapping(uint256 => bool) public used;
    uint256 public positionsVersion;
    mapping(uint256 => uint256) public tokenPositions; // tokenId => position (1-indexed)
    mapping(uint256 => uint256) public tokenPositionsVersion; // tokenId => leaderboard version

    // Event for when positions are updated (emits the ordered list from calldata for off-chain consumers)
    event PositionsUpdated(uint256[] positions);

    // Call Ownable(msg.sender) to assign the owner correctly
    constructor(address _cartones) Ownable(msg.sender) {
        cartones = IERC1155(_cartones);
    }

    // Allow owner to set teams metadata hash; can be frozen
    function setTeamsHash(bytes32 h) external onlyOwner {
        if (teamsHashFrozen) revert TeamsHashAlreadyFrozen();
        emit TeamsHashUpdated(teamsHash, h);
        teamsHash = h;
    }

    function freezeTeamsHash() external onlyOwner {
        if (teamsHashFrozen) revert TeamsHashAlreadyFrozen();
        teamsHashFrozen = true;
        emit TeamsHashFrozen();
    }

    // Function to set the time limit for predictions
    function setSubmissionDeadline(uint256 _deadline) external onlyOwner {
        if (_deadline <= block.timestamp) revert DeadlineMustBeFuture();
        submissionDeadline = _deadline;
    }
    // Guard to prevent changing game count after any prediction was submitted

    bool public predictionsStarted;
    /// @notice Configure the number of games required per prediction
    /// @dev Can only be set before any prediction is submitted to avoid inconsistencies

    function setTotalGames(uint8 _totalGames) external onlyOwner {
        if (predictionsStarted) revert PredictionsAlreadyStarted();
        if (_totalGames == 0) revert TotalGamesMustBePositive();
        emit TotalGamesUpdated(totalGames, _totalGames);
        totalGames = _totalGames;
    }

    // Function for owner to set positions
    function setPositions(uint256[] calldata _predictionIds, uint256[] calldata _predictionPoints)
        public
        onlyOwner
        returns (bool success)
    {
        if (_predictionIds.length == 0) revert NoPredictionsProvided();
        if (_predictionIds.length != _predictionPoints.length) revert ArrayLengthMismatch();

        uint256 newVersion = positionsVersion + 1;
        positionsVersion = newVersion;
        uint256 maxPoints = type(uint256).max;

        for (uint256 i = 0; i < _predictionPoints.length; i++) {
            if (maxPoints < _predictionPoints[i]) revert PointsNotOrdered();
            tokenPositions[_predictionIds[i]] = i + 1;
            tokenPositionsVersion[_predictionIds[i]] = newVersion;
            maxPoints = _predictionPoints[i];
        }

        emit PositionsUpdated(_predictionIds);
        return true;
    }

    function getCartonPosition(uint256 tokenId) public view returns (uint256) {
        if (tokenPositionsVersion[tokenId] != positionsVersion || tokenPositions[tokenId] == 0) {
            revert TokenNotInLeaderboard();
        }
        return tokenPositions[tokenId];
    }

    modifier onlyCartonOwner(uint256 tokenId) {
        if (cartones.balanceOf(msg.sender, tokenId) < 1) revert NotCartonOwner();
        _;
    }

    function submitPrediction(uint256 tokenId, Prediction[] calldata _prediction) external onlyCartonOwner(tokenId) {
        _submitPrediction(msg.sender, tokenId, _prediction);
    }

    function submitPredictionAndWinners(uint256 tokenId, Prediction[] calldata _prediction, uint8[4] calldata teams)
        external
        onlyCartonOwner(tokenId)
    {
        _submitPrediction(msg.sender, tokenId, _prediction);
        _predictWinners(msg.sender, tokenId, teams);
    }

    function _submitPrediction(address sender, uint256 tokenId, Prediction[] calldata _prediction) internal {
        if (block.timestamp >= submissionDeadline) revert DeadlinePassed();
        if (used[tokenId]) revert PredictionAlreadySubmitted();
        if (_prediction.length != totalGames) revert WrongPredictionCount();

        bool[] memory usedGameId = new bool[](totalGames + 1);

        used[tokenId] = true;
        if (!predictionsStarted) predictionsStarted = true;

        for (uint256 i = 0; i < _prediction.length; i++) {
            uint8 gameId = _prediction[i].gameId;
            if (gameId == 0 || gameId > totalGames) revert InvalidGameId();
            if (usedGameId[gameId]) revert DuplicateGameId();
            if (games[gameId].set) revert ResultsAlreadySet();
            usedGameId[gameId] = true;
            predictions[tokenId].push(Prediction({gameId: gameId, result: _prediction[i].result}));
        }

        emit PredictionsSubmitted(sender, tokenId);
    }

    function setResults(uint8 gameId, uint8 team1Goals, uint8 team2Goals) external onlyOwner {
        if (gameId == 0 || gameId > totalGames) revert InvalidGameId();
        if (games[gameId].set) revert ResultsAlreadySet();

        games[gameId].result = [team1Goals, team2Goals];
        games[gameId].set = true;

        emit ResultsSet(gameId, team1Goals, team2Goals);
    }

    function updateResults(uint8 gameId, uint8 team1Goals, uint8 team2Goals) external onlyOwner {
        if (gameId == 0 || gameId > totalGames) revert InvalidGameId();
        _revertIfTournamentClosedForCorrections();

        Game storage game = games[gameId];
        if (!game.set) revert ResultNotSet();

        uint8 oldTeam1Goals = game.result[0];
        uint8 oldTeam2Goals = game.result[1];

        game.result = [team1Goals, team2Goals];

        emit ResultsUpdated(gameId, oldTeam1Goals, oldTeam2Goals, team1Goals, team2Goals);
    }

    function _revertIfTournamentClosedForCorrections() internal view {
        ICartonTournamentContext carton = ICartonTournamentContext(address(cartones));
        uint256 tournamentId = carton.activeTournamentId();
        if (tournamentId == 0) return;

        address treasury = carton.treasury();
        if (treasury == address(0)) return;

        if (ITreasuryTournamentStatus(treasury).isTournamentClosedAnyAsset(tournamentId)) {
            revert TournamentClosedForCorrections();
        }
    }

    function getPrediction(uint256 tokenId) external view returns (Prediction[] memory) {
        return predictions[tokenId];
    }

    function getGameResults(uint8 gameId) external view returns (uint8[2] memory) {
        if (gameId == 0 || gameId > totalGames) revert InvalidGameId();
        return games[gameId].result;
    }

    // Funciones de cálculo de puntos
    function calculatePoints(uint256 tokenId, uint8 index) public view returns (uint8) {
        Prediction memory pred = predictions[tokenId][index];
        Game storage game = games[pred.gameId];
        if (!game.set) revert ResultNotSet();

        uint8 points = abs(
            int8(
                7
                    - (calculateDifferencePoints(pred.result[0], game.result[0])
                        + calculateDifferencePoints(pred.result[1], game.result[1]))
            )
        );

        if (
            getLocalEmpateVisitante(pred.result[0], pred.result[1])
                == getLocalEmpateVisitante(game.result[0], game.result[1])
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
        _predictWinners(msg.sender, tokenId, teams);
    }

    function _predictWinners(address sender, uint256 tokenId, uint8[4] calldata teams) internal {
        if (block.timestamp >= submissionDeadline) revert DeadlinePassed();
        if (winnersPredictions[tokenId].set) revert WinnersAlreadyPredicted();

        if (!all_different(teams)) revert DuplicateTeamId();

        // Validate that team IDs are valid
        for (uint256 i = 0; i < MAX_WINNERS; i++) {
            if (teams[i] == 0 || teams[i] > MAX_TEAM_ID) revert InvalidTeamId();
        }

        winnersPredictions[tokenId] = WinnersPrediction({teams: teams, set: true});

        emit WinnersPredicted(sender, tokenId, teams);
    }

    function all_different(uint8[4] calldata teams) public pure returns (bool) {
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
        if (officialWinners.set) revert OfficialWinnersAlreadySet();

        // Validate that team IDs are valid and there are no duplicates
        for (uint256 i = 0; i < MAX_WINNERS; i++) {
            if (teams[i] == 0 || teams[i] > MAX_TEAM_ID) revert InvalidTeamId();
            for (uint256 j = i + 1; j < MAX_WINNERS; j++) {
                if (teams[i] == teams[j]) revert DuplicateTeamId();
            }
        }

        officialWinners = OfficialWinners({teams: teams, set: true});

        emit OfficialWinnersSet(teams);
    }

    // Function to calculate winner points
    function calculateWinnerPoints(uint256 tokenId) public view returns (uint256) {
        if (!officialWinners.set) revert OfficialWinnersNotSet();
        if (!winnersPredictions[tokenId].set) revert NoPredictionForToken();

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
            if (!games[predictions[tokenId][i].gameId].set) continue;
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
        if (!used[tokenId]) revert NoPredictionsSubmitted();
        uint256 newPoints = calculateTotalPoints(tokenId);
        totalPoints[tokenId] = newPoints;
        emit PointsUpdated(tokenId, newPoints);
    }
}
