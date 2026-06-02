// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

interface ICartonTournamentContext {
    function treasury() external view returns (address);
}

interface ICartonTournamentTokenLookup {
    function tokenTournamentId(uint256 tokenId) external view returns (uint256);
}

interface ITreasuryTournamentStatus {
    function isTournamentClosedAnyAsset(uint256 tournamentId) external view returns (bool);
}

interface ITreasurySalesClosed {
    function salesClosed(uint256 tournamentId) external view returns (bool);
}

/// @title Predictions Contract for Prode Cards
contract Predictions is Ownable {
    error TeamsHashAlreadyFrozen();
    error DeadlineMustBeFuture();
    error SubmissionDeadlineLocked();
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
    error OfficialWinnersLocked();
    error OfficialWinnersNotSet();
    error NoPredictionForToken();
    error NoPredictionsSubmitted();
    error TournamentClosedForCorrections();
    error TournamentSalesStillOpen();
    error SubmissionWindowStillOpen();
    error BatchResultsOnlyOnAnvil();
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
    error GoalValueTooHigh();
    error CompetitionStateChanged();
    error LeaderboardStale();

    IERC1155 public cartones;
    uint256 public immutable TOURNAMENT_ID;
    /// @notice Anchor for off-chain teams config (id + name + groupId)
    /// @dev Set via setTeamsHash(); frontend verifies local config against this before submitting predictions
    bytes32 public teamsHash;
    bool public teamsHashFrozen;

    event TeamsHashUpdated(bytes32 oldHash, bytes32 newHash);
    event TeamsHashFrozen();
    event SubmissionDeadlineUpdated(uint256 oldDeadline, uint256 newDeadline);

    // Number of games required in a prediction (configurable by owner before submissions start)
    uint8 public totalGames = 72;
    uint8 constant LOCAL = 0;
    uint8 constant EMPATE = 1;
    uint8 constant VISITANTE = 2;
    uint8 constant MAX_TEAM_ID = 48; // Maximum allowed team ID
    uint8 constant MAX_GOALS = 99; // Sanity cap for realistic football scores
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
    event OfficialWinnersUpdated(uint8[4] oldTeams, uint8[4] newTeams);

    // Structure to store winner predictions
    struct WinnersPrediction {
        uint8[4] teams; // Team IDs
        bool set; // Whether prediction is set
    }

    mapping(uint256 => WinnersPrediction) public winnersPredictions;

    uint256 public submissionDeadline; // Deadline for submitting predictions

    // Events for winner predictions
    event WinnersPredicted(address indexed user, uint256 indexed tokenId, uint8[4] teams);

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
    uint256 public competitionStateRevision;
    uint256 public positionsVersion;
    uint256 public leaderboardCompetitionStateRevision;
    uint256 public positionsUpdateNonce;
    mapping(uint256 => uint256) public tokenPositions; // tokenId => position (1-indexed)
    mapping(uint256 => uint256) public tokenPositionsVersion; // tokenId => leaderboard version
    bool public positionsUpdateInProgress;
    uint256 public pendingTournamentId;
    uint256 public pendingCompetitionStateRevision;
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
    event CompetitionStateRevisionUpdated(uint256 oldRevision, uint256 newRevision);

    // Call Ownable(msg.sender) to assign the owner correctly
    constructor(address _cartones, uint256 _tournamentId) Ownable(msg.sender) {
        if (_tournamentId == 0) revert InvalidTournamentId();
        cartones = IERC1155(_cartones);
        TOURNAMENT_ID = _tournamentId;
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
        if (_isSubmissionDeadlineLocked()) revert SubmissionDeadlineLocked();

        uint256 oldDeadline = submissionDeadline;
        submissionDeadline = _deadline;
        emit SubmissionDeadlineUpdated(oldDeadline, _deadline);
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

    // Legacy fallback only. Admin/frontend use the batched leaderboard flow
    // (`beginPositionsUpdate` -> `appendPositionsBatch` -> `finalizePositionsUpdate`).
    // Keep this only as an emergency operational fallback.
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
        leaderboardCompetitionStateRevision = competitionStateRevision;
        uint256 maxPoints = type(uint256).max;
        uint256 currentRank = 0;
        uint256 previousPoints = type(uint256).max;

        uint256 predictionPointsLength = _predictionPoints.length;
        for (uint256 i; i < predictionPointsLength;) {
            uint256 tokenId = _predictionIds[i];
            if (maxPoints < _predictionPoints[i]) revert PointsNotOrdered();
            if (tokenPendingVersion[tokenId] == newVersion) revert DuplicatePositionToken();
            if (!used[tokenId] || _tokenTournamentId(tokenId) != TOURNAMENT_ID) {
                revert TokenNotEligibleForTournament();
            }

            if (i == 0 || _predictionPoints[i] < previousPoints) {
                currentRank = i + 1;
                previousPoints = _predictionPoints[i];
            }

            tokenPendingVersion[tokenId] = newVersion;
            tokenPositions[tokenId] = currentRank;
            tokenPositionsVersion[tokenId] = newVersion;
            maxPoints = _predictionPoints[i];
            unchecked {
                ++i;
            }
        }

        emit PositionsUpdated(_predictionIds);
        return true;
    }

    function beginPositionsUpdate(uint256 expectedEntries) external onlyOwner {
        if (positionsUpdateInProgress) revert PositionsUpdateAlreadyInProgress();
        if (expectedEntries == 0) revert InvalidExpectedEntries();
        if (submittedCountByTournament[TOURNAMENT_ID] != expectedEntries) revert ExpectedEntriesMismatch();

        positionsUpdateInProgress = true;
        pendingTournamentId = TOURNAMENT_ID;
        pendingCompetitionStateRevision = competitionStateRevision;
        pendingExpectedEntries = expectedEntries;
        pendingProcessedEntries = 0;
        pendingLastPoints = 0;
        pendingHasLastPoints = false;
        pendingCurrentRank = 0;
        pendingPositionsVersion = positionsUpdateNonce + 1;
        positionsUpdateNonce = pendingPositionsVersion;
        delete pendingPositionTokenIds;

        emit PositionsUpdateBegan(TOURNAMENT_ID, pendingPositionsVersion, expectedEntries);
    }

    function appendPositionsBatch(uint256[] calldata tokenIds, uint256[] calldata points) external onlyOwner {
        if (!positionsUpdateInProgress) revert PositionsUpdateNotInProgress();
        if (competitionStateRevision != pendingCompetitionStateRevision) revert CompetitionStateChanged();
        if (tokenIds.length == 0) revert EmptyPositionsBatch();
        if (tokenIds.length != points.length) revert ArrayLengthMismatch();

        uint256 processedEntries = pendingProcessedEntries;
        if (processedEntries + tokenIds.length > pendingExpectedEntries) revert BatchExceedsExpectedEntries();

        uint256 lastPoints = pendingLastPoints;
        bool hasLastPoints = pendingHasLastPoints;
        uint256 currentRank = pendingCurrentRank;

        uint256 tokenIdsLength = tokenIds.length;
        for (uint256 i; i < tokenIdsLength;) {
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
            unchecked {
                ++i;
            }
        }

        pendingProcessedEntries = processedEntries + tokenIds.length;
        pendingLastPoints = lastPoints;
        pendingHasLastPoints = hasLastPoints;
        pendingCurrentRank = currentRank;

        emit PositionsBatchAppended(pendingTournamentId, pendingPositionsVersion, pendingProcessedEntries);
    }

    function finalizePositionsUpdate() external onlyOwner {
        if (!positionsUpdateInProgress) revert PositionsUpdateNotInProgress();
        if (competitionStateRevision != pendingCompetitionStateRevision) revert CompetitionStateChanged();
        if (pendingProcessedEntries != pendingExpectedEntries) revert PositionsUpdateIncomplete();

        positionsVersion = pendingPositionsVersion;
        leaderboardCompetitionStateRevision = pendingCompetitionStateRevision;

        emit PositionsUpdateFinalized(pendingTournamentId, pendingPositionsVersion, pendingProcessedEntries);

        _clearPendingPositionsState();
    }

    function cancelPositionsUpdate() external onlyOwner {
        if (!positionsUpdateInProgress) revert PositionsUpdateNotInProgress();

        uint256 pendingTokenIdsLength = pendingPositionTokenIds.length;
        for (uint256 i; i < pendingTokenIdsLength;) {
            uint256 tokenId = pendingPositionTokenIds[i];
            if (tokenPositionBackupVersion[tokenId] == pendingPositionsVersion) {
                tokenPositions[tokenId] = tokenPositionBackup[tokenId];
                tokenPositionsVersion[tokenId] = tokenPositionVersionBackup[tokenId];
            }
            unchecked {
                ++i;
            }
        }

        emit PositionsUpdateCancelled(pendingTournamentId, pendingPositionsVersion);

        _clearPendingPositionsState();
    }

    function getCartonPosition(uint256 tokenId) public view returns (uint256) {
        if (!_hasCurrentLeaderboard()) revert LeaderboardStale();
        if (tokenPositionsVersion[tokenId] != positionsVersion || tokenPositions[tokenId] == 0) {
            revert TokenNotInLeaderboard();
        }
        return tokenPositions[tokenId];
    }

    function allResultsSet() public view returns (bool) {
        uint8 totalGamesCount = totalGames;
        for (uint8 i = 1; i <= totalGamesCount; ++i) {
            if (!games[i].set) return false;
        }
        return totalGamesCount > 0;
    }

    function officialWinnersSet() external view returns (bool) {
        return officialWinners.set;
    }

    function hasFinalPositions() public view returns (bool) {
        return _hasCurrentLeaderboard();
    }

    function isTokenInCurrentLeaderboard(uint256 tokenId) external view returns (bool) {
        return
            _hasCurrentLeaderboard() && tokenPositionsVersion[tokenId] == positionsVersion
                && tokenPositions[tokenId] != 0;
    }

    function isReadyForFinalization() external view returns (bool) {
        return allResultsSet() && officialWinners.set && hasFinalPositions();
    }

    modifier onlyCartonOwner(uint256 tokenId) {
        _onlyCartonOwner(tokenId);
        _;
    }

    function _onlyCartonOwner(uint256 tokenId) internal {
        if (cartones.balanceOf(msg.sender, tokenId) < 1) revert NotCartonOwner();
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
        if (_tokenTournamentId(tokenId) != TOURNAMENT_ID) revert TokenNotEligibleForTournament();

        bool[] memory usedGameId = new bool[](totalGames + 1);

        used[tokenId] = true;
        submittedCountByTournament[TOURNAMENT_ID] += 1;
        if (!predictionsStarted) predictionsStarted = true;

        uint256 predictionLength = _prediction.length;
        for (uint256 i; i < predictionLength;) {
            uint8 gameId = _prediction[i].gameId;
            if (gameId == 0 || gameId > totalGames) revert InvalidGameId();
            if (usedGameId[gameId]) revert DuplicateGameId();
            if (games[gameId].set) revert ResultsAlreadySet();
            _validateGoals(_prediction[i].result[0], _prediction[i].result[1]);
            usedGameId[gameId] = true;
            predictions[tokenId].push(Prediction({ gameId: gameId, result: _prediction[i].result }));
            unchecked {
                ++i;
            }
        }

        emit PredictionsSubmitted(sender, tokenId);
    }

    function setResults(uint8 gameId, uint8 team1Goals, uint8 team2Goals) external onlyOwner {
        if (gameId == 0 || gameId > totalGames) revert InvalidGameId();
        if (games[gameId].set) revert ResultsAlreadySet();
        _revertIfTournamentSalesOpen();
        _revertIfSubmissionWindowStillOpen();

        _setResult(gameId, team1Goals, team2Goals);
        _advanceCompetitionStateRevision();
    }

    function setResultsBatch(uint8[] calldata gameIds, uint8[] calldata team1Goals, uint8[] calldata team2Goals)
        external
        onlyOwner
    {
        if (block.chainid != 31337) revert BatchResultsOnlyOnAnvil();
        if (gameIds.length != team1Goals.length || gameIds.length != team2Goals.length) revert ArrayLengthMismatch();

        _revertIfTournamentSalesOpen();
        _revertIfSubmissionWindowStillOpen();

        bool[] memory usedGameId = new bool[](totalGames + 1);

        uint256 gameIdsLength = gameIds.length;
        for (uint256 i; i < gameIdsLength;) {
            uint8 gameId = gameIds[i];
            if (gameId == 0 || gameId > totalGames) revert InvalidGameId();
            if (usedGameId[gameId]) revert DuplicateGameId();
            if (games[gameId].set) revert ResultsAlreadySet();

            usedGameId[gameId] = true;
            _setResult(gameId, team1Goals[i], team2Goals[i]);
            unchecked {
                ++i;
            }
        }

        _advanceCompetitionStateRevision();
    }

    function updateResults(uint8 gameId, uint8 team1Goals, uint8 team2Goals) external onlyOwner {
        if (gameId == 0 || gameId > totalGames) revert InvalidGameId();
        _revertIfTournamentClosedForCorrections();

        Game storage game = games[gameId];
        if (!game.set) revert ResultNotSet();

        uint8 oldTeam1Goals = game.result[0];
        uint8 oldTeam2Goals = game.result[1];

        _validateGoals(team1Goals, team2Goals);
        game.result = [team1Goals, team2Goals];
        _advanceCompetitionStateRevision();

        emit ResultsUpdated(gameId, oldTeam1Goals, oldTeam2Goals, team1Goals, team2Goals);
    }

    function _isSubmissionDeadlineLocked() internal view returns (bool) {
        if (predictionsStarted) return true;
        if (submissionDeadline != 0 && block.timestamp >= submissionDeadline) return true;
        if (_tournamentSalesClosed()) return true;
        return _hasAnyResultSet();
    }

    function _revertIfSubmissionWindowStillOpen() internal view {
        if (submissionDeadline != 0 && block.timestamp < submissionDeadline) {
            revert SubmissionWindowStillOpen();
        }
    }

    function _treasuryAddress() internal view returns (address) {
        return ICartonTournamentContext(address(cartones)).treasury();
    }

    function _tournamentSalesClosed() internal view returns (bool) {
        address treasury = _treasuryAddress();
        if (treasury == address(0)) return false;

        return ITreasurySalesClosed(treasury).salesClosed(TOURNAMENT_ID);
    }

    function _hasAnyResultSet() internal view returns (bool) {
        uint8 totalGamesCount = totalGames;
        for (uint8 i = 1; i <= totalGamesCount; ++i) {
            if (games[i].set) return true;
        }
        return false;
    }

    function _revertIfTournamentSalesOpen() internal view {
        address treasury = _treasuryAddress();
        if (treasury == address(0)) return;

        if (!_tournamentSalesClosed()) {
            revert TournamentSalesStillOpen();
        }
    }

    function _setResult(uint8 gameId, uint8 team1Goals, uint8 team2Goals) internal {
        _validateGoals(team1Goals, team2Goals);
        games[gameId].result = [team1Goals, team2Goals];
        games[gameId].set = true;

        emit ResultsSet(gameId, team1Goals, team2Goals);
    }

    function _validateGoals(uint8 team1Goals, uint8 team2Goals) internal pure {
        if (team1Goals > MAX_GOALS || team2Goals > MAX_GOALS) revert GoalValueTooHigh();
    }

    function _revertIfTournamentClosedForCorrections() internal view {
        address treasury = _treasuryAddress();
        if (treasury == address(0)) return;

        if (ITreasuryTournamentStatus(treasury).isTournamentClosedAnyAsset(TOURNAMENT_ID)) {
            revert TournamentClosedForCorrections();
        }
    }

    function _tokenTournamentId(uint256 tokenId) internal view returns (uint256) {
        return ICartonTournamentTokenLookup(address(cartones)).tokenTournamentId(tokenId);
    }

    function _clearPendingPositionsState() internal {
        positionsUpdateInProgress = false;
        pendingTournamentId = 0;
        pendingCompetitionStateRevision = 0;
        pendingPositionsVersion = 0;
        pendingExpectedEntries = 0;
        pendingProcessedEntries = 0;
        pendingLastPoints = 0;
        pendingHasLastPoints = false;
        pendingCurrentRank = 0;
        delete pendingPositionTokenIds;
    }

    function _hasCurrentLeaderboard() internal view returns (bool) {
        return positionsVersion > 0 && !positionsUpdateInProgress
            && leaderboardCompetitionStateRevision == competitionStateRevision;
    }

    function _advanceCompetitionStateRevision() internal {
        uint256 oldRevision = competitionStateRevision;
        uint256 newRevision = oldRevision + 1;
        competitionStateRevision = newRevision;
        emit CompetitionStateRevisionUpdated(oldRevision, newRevision);
    }

    function getPrediction(uint256 tokenId) external view returns (Prediction[] memory) {
        return predictions[tokenId];
    }

    function getGameResults(uint8 gameId) external view returns (uint8[2] memory) {
        if (gameId == 0 || gameId > totalGames) revert InvalidGameId();
        return games[gameId].result;
    }

    // Funciones de cálculo de puntos
    function calculatePoints(uint256 tokenId, uint8 index) internal view returns (uint8) {
        Prediction memory pred = predictions[tokenId][index];
        Game storage game = games[pred.gameId];
        if (!game.set) revert ResultNotSet();

        uint16 diffTotal = uint16(calculateDifferencePoints(pred.result[0], game.result[0]))
            + uint16(calculateDifferencePoints(pred.result[1], game.result[1]));
        // forge-lint: disable-next-line(unsafe-typecast) -- diffTotal < MATCH_BASE_POINTS (= 7) guaranteed by ternary guard
        uint8 points = diffTotal >= MATCH_BASE_POINTS ? 0 : uint8(MATCH_BASE_POINTS - diffTotal);

        if (
            getLocalEmpateVisitante(pred.result[0], pred.result[1])
                == getLocalEmpateVisitante(game.result[0], game.result[1])
        ) {
            points += MATCH_OUTCOME_BONUS;
        }

        return points;
    }

    function calculateDifferencePoints(uint8 goalsP, uint8 goalsR) internal pure returns (uint8) {
        return goalsR >= goalsP ? goalsR - goalsP : goalsP - goalsR;
    }

    function getLocalEmpateVisitante(uint8 goalsL, uint8 goalsV) internal pure returns (uint8) {
        return (goalsL > goalsV) ? LOCAL : (goalsL == goalsV) ? EMPATE : VISITANTE;
    }

    // Functions for winner predictions
    function predictWinners(uint256 tokenId, uint8[4] calldata teams) external onlyCartonOwner(tokenId) {
        _predictWinners(msg.sender, tokenId, teams);
    }

    function _predictWinners(address sender, uint256 tokenId, uint8[4] calldata teams) internal {
        if (block.timestamp >= submissionDeadline) revert DeadlinePassed();
        if (winnersPredictions[tokenId].set) revert WinnersAlreadyPredicted();
        if (_tokenTournamentId(tokenId) != TOURNAMENT_ID) revert TokenNotEligibleForTournament();

        if (!allDifferent(teams)) revert DuplicateTeamId();

        // Validate that team IDs are valid
        for (uint256 i; i < MAX_WINNERS;) {
            if (teams[i] == 0 || teams[i] > MAX_TEAM_ID) revert InvalidTeamId();
            unchecked {
                ++i;
            }
        }

        winnersPredictions[tokenId] = WinnersPrediction({ teams: teams, set: true });

        emit WinnersPredicted(sender, tokenId, teams);
    }

    function allDifferent(uint8[4] calldata teams) internal pure returns (bool) {
        for (uint256 i; i < MAX_WINNERS;) {
            for (uint256 j = i + 1; j < MAX_WINNERS;) {
                if (teams[i] == teams[j]) {
                    return false;
                }
                unchecked {
                    ++j;
                }
            }
            unchecked {
                ++i;
            }
        }
        return true;
    }

    function getWinnersPrediction(uint256 tokenId) external view returns (uint8[4] memory) {
        return winnersPredictions[tokenId].teams;
    }

    function getOfficialWinners() external view returns (uint8[4] memory teams, bool set) {
        OfficialWinners storage winners = officialWinners;
        return (winners.teams, winners.set);
    }

    // Function to set official winners (only for owner)
    function setOfficialWinners(uint8[4] calldata teams) external onlyOwner {
        if (officialWinners.set) revert OfficialWinnersAlreadySet();

        _validateOfficialWinners(teams);

        officialWinners = OfficialWinners({ teams: teams, set: true });
        _advanceCompetitionStateRevision();

        emit OfficialWinnersSet(teams);
    }

    function updateOfficialWinners(uint8[4] calldata teams) external onlyOwner {
        if (!officialWinners.set) revert OfficialWinnersNotSet();
        _revertIfTournamentClosedForCorrections();
        _revertIfOfficialWinnersLocked();

        uint8[4] memory previousTeams = officialWinners.teams;
        _validateOfficialWinners(teams);

        officialWinners = OfficialWinners({ teams: teams, set: true });
        _advanceCompetitionStateRevision();

        emit OfficialWinnersUpdated(previousTeams, teams);
    }

    function _validateOfficialWinners(uint8[4] calldata teams) internal pure {
        // Validate that team IDs are valid and there are no duplicates
        for (uint256 i; i < MAX_WINNERS;) {
            if (teams[i] == 0 || teams[i] > MAX_TEAM_ID) revert InvalidTeamId();
            for (uint256 j = i + 1; j < MAX_WINNERS;) {
                if (teams[i] == teams[j]) revert DuplicateTeamId();
                unchecked {
                    ++j;
                }
            }
            unchecked {
                ++i;
            }
        }
    }

    function _revertIfOfficialWinnersLocked() internal view {
        if (positionsUpdateInProgress || positionsVersion > 0) revert OfficialWinnersLocked();
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

        // Each stored prediction currently has exactly `totalGames` entries because
        // submitPrediction enforces an exact-length payload and setTotalGames is
        // locked after submissions start. If partial submissions are ever allowed,
        // revisit this loop bound before changing that invariant.
        uint8 totalGamesCount = totalGames;
        for (uint8 i; i < totalGamesCount;) {
            if (games[predictions[tokenId][i].gameId].set) {
                gamePoints += calculatePoints(tokenId, i);
            }
            unchecked {
                ++i;
            }
        }

        // Si los ganadores están establecidos, sumar los puntos de los ganadores
        if (officialWinners.set && winnersPredictions[tokenId].set) {
            winnerPoints = calculateWinnerPoints(tokenId);
        }

        return gamePoints + winnerPoints;
    }
}
