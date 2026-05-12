// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface ICartonTournamentContext {
    function activeTournamentId() external view returns (uint256);
    function treasury() external view returns (address);
}

interface ICartonTournamentTokenLookup {
    function tokenTournamentId(uint256 tokenId) external view returns (uint256);
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
    error InvalidTournamentId();
    error InvalidExpectedEntries();
    error ExpectedEntriesMismatch();
    error PositionsUpdateAlreadyInProgress();
    error PositionsUpdateNotInProgress();
    error EmptyPositionsBatch();
    error BatchExceedsExpectedEntries();
    error TokenNotEligibleForTournament();
    error DuplicatePositionToken();
    error PositionsUpdateIncomplete();

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
    uint8 constant MATCH_BASE_POINTS = 7; // Base points before score-difference penalties
    uint8 constant MATCH_OUTCOME_BONUS = 3; // Bonus for guessing local/draw/visitor correctly
    uint8 constant POINTS_FIRST = 25; // Points for guessing first place
    uint8 constant POINTS_SECOND = 18; // Points for guessing second place
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
    mapping(uint256 => uint256) public submittedCountByTournament;
    uint256 public positionsVersion;
    uint256 public positionsUpdateNonce;
    mapping(uint256 => uint256) public tokenPositions; // tokenId => position (1-indexed)
    mapping(uint256 => uint256) public tokenPositionsVersion; // tokenId => leaderboard version
    bool public positionsUpdateInProgress;
    uint256 public pendingTournamentId;
    uint256 public pendingPositionsVersion;
    uint256 public pendingExpectedEntries;
    uint256 public pendingProcessedEntries;
    uint256 public pendingLastPoints;
    bool public pendingHasLastPoints;
    uint256 public pendingCurrentRank;
    mapping(uint256 => uint256) public tokenPendingVersion;
    mapping(uint256 => uint256) private tokenPositionBackup;
    mapping(uint256 => uint256) private tokenPositionVersionBackup;
    mapping(uint256 => uint256) private tokenPositionBackupVersion;
    uint256[] private pendingPositionTokenIds;

    // Event for when positions are updated (emits the ordered list from calldata for off-chain consumers)
    event PositionsUpdated(uint256[] positions);
    event PositionsUpdateBegan(uint256 indexed tournamentId, uint256 indexed version, uint256 expectedEntries);
    event PositionsBatchAppended(uint256 indexed tournamentId, uint256 indexed version, uint256 processedEntries);
    event PositionsUpdateFinalized(uint256 indexed tournamentId, uint256 indexed version, uint256 processedEntries);
    event PositionsUpdateCancelled(uint256 indexed tournamentId, uint256 indexed version);

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
    // TODO: Final leaderboard integrity improvements:
    // - Add an optional challenge window between setting final positions and tournament finalization.
    // - Add batched verification so final positions can be checked in chunks without recalculating every token in one tx.
    // - Add a resultsHash/leaderboardHash commitment to anchor the offchain ranking calculation used for final positions.
    function setPositions(uint256[] calldata _predictionIds, uint256[] calldata _predictionPoints)
        public
        onlyOwner
        returns (bool success)
    {
        if (positionsUpdateInProgress) revert PositionsUpdateAlreadyInProgress();
        if (_predictionIds.length == 0) revert NoPredictionsProvided();
        if (_predictionIds.length != _predictionPoints.length) revert ArrayLengthMismatch();

        uint256 newVersion = positionsUpdateNonce + 1;
        positionsUpdateNonce = newVersion;
        positionsVersion = newVersion;
        uint256 maxPoints = type(uint256).max;
        uint256 currentRank = 0;
        uint256 previousPoints = type(uint256).max;

        for (uint256 i = 0; i < _predictionPoints.length; i++) {
            if (maxPoints < _predictionPoints[i]) revert PointsNotOrdered();

            if (i == 0 || _predictionPoints[i] < previousPoints) {
                currentRank = i + 1;
                previousPoints = _predictionPoints[i];
            }

            tokenPositions[_predictionIds[i]] = currentRank;
            tokenPositionsVersion[_predictionIds[i]] = newVersion;
            maxPoints = _predictionPoints[i];
        }

        emit PositionsUpdated(_predictionIds);
        return true;
    }

    function beginPositionsUpdate(uint256 tournamentId, uint256 expectedEntries) external onlyOwner {
        if (positionsUpdateInProgress) revert PositionsUpdateAlreadyInProgress();
        if (tournamentId == 0) revert InvalidTournamentId();
        if (expectedEntries == 0) revert InvalidExpectedEntries();
        if (submittedCountByTournament[tournamentId] != expectedEntries) revert ExpectedEntriesMismatch();

        positionsUpdateInProgress = true;
        pendingTournamentId = tournamentId;
        pendingExpectedEntries = expectedEntries;
        pendingProcessedEntries = 0;
        pendingLastPoints = 0;
        pendingHasLastPoints = false;
        pendingCurrentRank = 0;
        pendingPositionsVersion = positionsUpdateNonce + 1;
        positionsUpdateNonce = pendingPositionsVersion;
        delete pendingPositionTokenIds;

        emit PositionsUpdateBegan(tournamentId, pendingPositionsVersion, expectedEntries);
    }

    function appendPositionsBatch(uint256[] calldata tokenIds, uint256[] calldata points) external onlyOwner {
        if (!positionsUpdateInProgress) revert PositionsUpdateNotInProgress();
        if (tokenIds.length == 0) revert EmptyPositionsBatch();
        if (tokenIds.length != points.length) revert ArrayLengthMismatch();

        uint256 processedEntries = pendingProcessedEntries;
        if (processedEntries + tokenIds.length > pendingExpectedEntries) revert BatchExceedsExpectedEntries();

        uint256 lastPoints = pendingLastPoints;
        bool hasLastPoints = pendingHasLastPoints;
        uint256 currentRank = pendingCurrentRank;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            uint256 pointValue = points[i];

            if ((i > 0 && pointValue > points[i - 1]) || (i == 0 && hasLastPoints && pointValue > lastPoints)) {
                revert PointsNotOrdered();
            }

            if (tokenPendingVersion[tokenId] == pendingPositionsVersion) revert DuplicatePositionToken();
            if (!used[tokenId] || _tokenTournamentId(tokenId) != pendingTournamentId) {
                revert TokenNotEligibleForTournament();
            }

            tokenPositionBackup[tokenId] = tokenPositions[tokenId];
            tokenPositionVersionBackup[tokenId] = tokenPositionsVersion[tokenId];
            tokenPositionBackupVersion[tokenId] = pendingPositionsVersion;
            pendingPositionTokenIds.push(tokenId);

            uint256 globalIndex = processedEntries + i;
            if (!hasLastPoints) {
                currentRank = 1;
                hasLastPoints = true;
            } else if (pointValue < lastPoints) {
                currentRank = globalIndex + 1;
            }

            tokenPendingVersion[tokenId] = pendingPositionsVersion;
            tokenPositions[tokenId] = currentRank;
            tokenPositionsVersion[tokenId] = pendingPositionsVersion;
            lastPoints = pointValue;
        }

        pendingProcessedEntries = processedEntries + tokenIds.length;
        pendingLastPoints = lastPoints;
        pendingHasLastPoints = hasLastPoints;
        pendingCurrentRank = currentRank;

        emit PositionsBatchAppended(pendingTournamentId, pendingPositionsVersion, pendingProcessedEntries);
    }

    function finalizePositionsUpdate() external onlyOwner {
        if (!positionsUpdateInProgress) revert PositionsUpdateNotInProgress();
        if (pendingProcessedEntries != pendingExpectedEntries) revert PositionsUpdateIncomplete();

        positionsVersion = pendingPositionsVersion;

        emit PositionsUpdateFinalized(pendingTournamentId, pendingPositionsVersion, pendingProcessedEntries);

        _clearPendingPositionsState();
    }

    function cancelPositionsUpdate() external onlyOwner {
        if (!positionsUpdateInProgress) revert PositionsUpdateNotInProgress();

        for (uint256 i = 0; i < pendingPositionTokenIds.length; i++) {
            uint256 tokenId = pendingPositionTokenIds[i];
            if (tokenPositionBackupVersion[tokenId] != pendingPositionsVersion) continue;

            tokenPositions[tokenId] = tokenPositionBackup[tokenId];
            tokenPositionsVersion[tokenId] = tokenPositionVersionBackup[tokenId];
        }

        emit PositionsUpdateCancelled(pendingTournamentId, pendingPositionsVersion);

        _clearPendingPositionsState();
    }

    function getCartonPosition(uint256 tokenId) public view returns (uint256) {
        if (tokenPositionsVersion[tokenId] != positionsVersion || tokenPositions[tokenId] == 0) {
            revert TokenNotInLeaderboard();
        }
        return tokenPositions[tokenId];
    }

    function allResultsSet() public view returns (bool) {
        for (uint8 i = 1; i <= totalGames; i++) {
            if (!games[i].set) return false;
        }
        return totalGames > 0;
    }

    function officialWinnersSet() external view returns (bool) {
        return officialWinners.set;
    }

    function hasFinalPositions() public view returns (bool) {
        return positionsVersion > 0;
    }

    function isReadyForFinalization() external view returns (bool) {
        return allResultsSet() && officialWinners.set && hasFinalPositions();
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
        submittedCountByTournament[_tokenTournamentId(tokenId)] += 1;
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

    function _tokenTournamentId(uint256 tokenId) internal view returns (uint256) {
        return ICartonTournamentTokenLookup(address(cartones)).tokenTournamentId(tokenId);
    }

    function _clearPendingPositionsState() internal {
        positionsUpdateInProgress = false;
        pendingTournamentId = 0;
        pendingPositionsVersion = 0;
        pendingExpectedEntries = 0;
        pendingProcessedEntries = 0;
        pendingLastPoints = 0;
        pendingHasLastPoints = false;
        pendingCurrentRank = 0;
        delete pendingPositionTokenIds;
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

        uint16 diffTotal = uint16(calculateDifferencePoints(pred.result[0], game.result[0]))
            + uint16(calculateDifferencePoints(pred.result[1], game.result[1]));
        uint8 points = diffTotal >= MATCH_BASE_POINTS ? 0 : uint8(MATCH_BASE_POINTS - diffTotal);

        if (
            getLocalEmpateVisitante(pred.result[0], pred.result[1])
                == getLocalEmpateVisitante(game.result[0], game.result[1])
        ) {
            points += MATCH_OUTCOME_BONUS;
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
        if (officialWinners.set && winnersPredictions[tokenId].set) {
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
