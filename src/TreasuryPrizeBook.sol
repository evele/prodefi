// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

interface ICompetitionEnginePrizeBook {
    function isReadyForFinalization() external view returns (bool);
    function competitionStateRevision() external view returns (uint256);
    function isTokenInCurrentLeaderboard(uint256 tokenId) external view returns (bool);
}

interface ICartonTournamentLookup {
    function tokenTournamentId(uint256 tokenId) external view returns (uint256);
}

interface ITreasuryPrizeBookHost {
    function isSupportedPrizeToken(address token) external view returns (bool);
    function salesClosed(uint256 tournamentId) external view returns (bool);
    function tournamentFinalized(uint256 tournamentId) external view returns (bool);
    function isTournamentRegistered(uint256 tournamentId) external view returns (bool);
    function competitionEngineByTournament(uint256 tournamentId) external view returns (address);
    function prizePools(uint256 tournamentId, address token) external view returns (uint256);
}

contract TreasuryPrizeBook {
    error NotTreasury();
    error TournamentAlreadyClosed();
    error SalesNotClosed();
    error InvalidPosition();
    error NoPrizeDistribution();
    error FinalPrizeAmountsAlreadyLoaded();
    error FinalPrizeAmountsAlreadySealed();
    error FinalPrizeAmountsNotSealed();
    error FinalPrizeAmountsExceedPrizePool();
    error NoPrizeRecipientsProvided();
    error PrizeArrayLengthMismatch();
    error InvalidTournamentId();
    error TournamentNotRegistered();
    error InvalidCompetitionEngine();
    error TokenTournamentMismatch();
    error UnsupportedPrizeToken();
    error PrizeDistributionRemovalNotAllowed();
    error CompetitionStateRevisionMismatch();
    error TokenNotInCurrentLeaderboard();
    error TournamentNotReadyForFinalization();
    error InvalidPercentage();
    error InvalidPercentageSum();

    mapping(uint256 => mapping(address => uint8[])) private _prizePoolDistributions;
    mapping(uint256 => mapping(address => bool)) private _prizeDistributionSet;
    mapping(uint256 => address[]) private _prizeDistributionTokens;

    mapping(uint256 => mapping(uint256 => mapping(address => uint256))) private _finalPrizeAmounts;
    mapping(uint256 => mapping(address => uint256)) private _finalPrizeAmountTotals;
    mapping(uint256 => mapping(address => uint256)) private _finalPrizeAmountsDraftRevision;
    mapping(uint256 => mapping(address => uint256)) private _finalPrizeAmountsSealedRevision;
    mapping(uint256 => mapping(address => bool)) private _finalPrizeAmountsReady;

    address public immutable TREASURY;
    ICartonTournamentLookup public immutable CARTON_CONTRACT;

    event SetPrizeDistribution(uint256 indexed tournamentId, address indexed token, uint8[] percentages);
    event FinalPrizeAmountsUpdated(
        uint256 indexed tournamentId, address indexed token, uint256[] tokenIds, uint256[] amounts
    );
    event FinalPrizeAmountsSealed(
        uint256 indexed tournamentId, address indexed token, uint256 totalAssigned, uint256 reserveAdded
    );
    event FinalPrizeAmountsReopened(uint256 indexed tournamentId, address indexed token);
    event PrizeDistributionRemoved(uint256 indexed tournamentId, address indexed token);

    constructor(address treasuryAddress, address cartonAddress) {
        TREASURY = treasuryAddress;
        CARTON_CONTRACT = ICartonTournamentLookup(cartonAddress);
    }

    modifier onlyTreasury() {
        _onlyTreasury();
        _;
    }

    function _onlyTreasury() internal {
        if (msg.sender != TREASURY) revert NotTreasury();
    }

    function setPrizeDistribution(uint256 tournamentId, address token, uint8[] calldata percentages)
        external
        onlyTreasury
    {
        ITreasuryPrizeBookHost host = ITreasuryPrizeBookHost(TREASURY);
        _requireRegisteredTournament(host, tournamentId);
        if (!host.isSupportedPrizeToken(token)) revert UnsupportedPrizeToken();
        if (!host.salesClosed(tournamentId)) revert SalesNotClosed();
        if (host.tournamentFinalized(tournamentId)) revert TournamentAlreadyClosed();
        if (_finalPrizeAmountTotals[tournamentId][token] > 0 || _finalPrizeAmountsReady[tournamentId][token]) {
            revert FinalPrizeAmountsAlreadyLoaded();
        }

        uint256 sumPercentages = 0;
        uint256 percentagesLength = percentages.length;
        for (uint256 i; i < percentagesLength;) {
            if (percentages[i] > 100) revert InvalidPercentage();
            sumPercentages += percentages[i];
            unchecked {
                ++i;
            }
        }
        if (sumPercentages == 0 || sumPercentages > 100) revert InvalidPercentageSum();

        if (!_prizeDistributionSet[tournamentId][token]) {
            _prizeDistributionSet[tournamentId][token] = true;
            _prizeDistributionTokens[tournamentId].push(token);
        }

        delete _prizePoolDistributions[tournamentId][token];
        for (uint256 i; i < percentagesLength;) {
            _prizePoolDistributions[tournamentId][token].push(percentages[i]);
            unchecked {
                ++i;
            }
        }

        emit SetPrizeDistribution(tournamentId, token, percentages);
    }

    function removePrizeDistributionToken(uint256 tournamentId, address token) external onlyTreasury {
        ITreasuryPrizeBookHost host = ITreasuryPrizeBookHost(TREASURY);
        _requireRegisteredTournament(host, tournamentId);
        if (host.tournamentFinalized(tournamentId)) revert TournamentAlreadyClosed();
        if (!_prizeDistributionSet[tournamentId][token]) revert NoPrizeDistribution();
        if (
            host.prizePools(tournamentId, token) > 0 || _finalPrizeAmountTotals[tournamentId][token] > 0
                || _finalPrizeAmountsReady[tournamentId][token]
        ) {
            revert PrizeDistributionRemovalNotAllowed();
        }

        address[] storage tokens = _prizeDistributionTokens[tournamentId];
        uint256 tokensLength = tokens.length;
        for (uint256 i; i < tokensLength;) {
            if (tokens[i] == token) {
                uint256 lastIndex = tokensLength - 1;
                if (i != lastIndex) {
                    tokens[i] = tokens[lastIndex];
                }
                tokens.pop();

                delete _prizeDistributionSet[tournamentId][token];
                delete _prizePoolDistributions[tournamentId][token];
                delete _finalPrizeAmountTotals[tournamentId][token];
                delete _finalPrizeAmountsDraftRevision[tournamentId][token];
                delete _finalPrizeAmountsSealedRevision[tournamentId][token];
                delete _finalPrizeAmountsReady[tournamentId][token];

                emit PrizeDistributionRemoved(tournamentId, token);
                return;
            }
            unchecked {
                ++i;
            }
        }

        revert NoPrizeDistribution();
    }

    function setFinalPrizeAmounts(
        uint256 tournamentId,
        address token,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts
    ) external onlyTreasury {
        ITreasuryPrizeBookHost host = ITreasuryPrizeBookHost(TREASURY);
        _requireRegisteredTournament(host, tournamentId);
        if (!host.salesClosed(tournamentId)) revert SalesNotClosed();
        if (host.tournamentFinalized(tournamentId)) revert TournamentAlreadyClosed();
        if (!_prizeDistributionSet[tournamentId][token]) revert NoPrizeDistribution();
        if (_finalPrizeAmountsReady[tournamentId][token]) revert FinalPrizeAmountsAlreadySealed();
        if (tokenIds.length == 0) revert NoPrizeRecipientsProvided();
        if (tokenIds.length != amounts.length) revert PrizeArrayLengthMismatch();

        uint256 runningTotal = _finalPrizeAmountTotals[tournamentId][token];
        uint256 tokenIdsLength = tokenIds.length;
        for (uint256 i; i < tokenIdsLength;) {
            uint256 tokenId = tokenIds[i];
            if (CARTON_CONTRACT.tokenTournamentId(tokenId) != tournamentId) revert TokenTournamentMismatch();
            if (amounts[i] != 0 && !_isTokenInCurrentLeaderboard(host, tournamentId, tokenId)) {
                revert TokenNotInCurrentLeaderboard();
            }

            uint256 previousAmount = _finalPrizeAmounts[tournamentId][tokenId][token];
            runningTotal = runningTotal - previousAmount + amounts[i];
            _finalPrizeAmounts[tournamentId][tokenId][token] = amounts[i];
            unchecked {
                ++i;
            }
        }

        if (runningTotal > host.prizePools(tournamentId, token)) revert FinalPrizeAmountsExceedPrizePool();

        _finalPrizeAmountTotals[tournamentId][token] = runningTotal;
        _finalPrizeAmountsDraftRevision[tournamentId][token] = _competitionStateRevision(host, tournamentId);
        emit FinalPrizeAmountsUpdated(tournamentId, token, tokenIds, amounts);
    }

    function sealFinalPrizeAmounts(uint256 tournamentId, address token) external onlyTreasury {
        ITreasuryPrizeBookHost host = ITreasuryPrizeBookHost(TREASURY);
        _requireRegisteredTournament(host, tournamentId);
        if (!host.salesClosed(tournamentId)) revert SalesNotClosed();
        if (host.tournamentFinalized(tournamentId)) revert TournamentAlreadyClosed();
        if (!_prizeDistributionSet[tournamentId][token]) revert NoPrizeDistribution();
        if (_finalPrizeAmountsReady[tournamentId][token]) revert FinalPrizeAmountsAlreadySealed();
        if (!_competitionEngineReady(host, tournamentId)) revert TournamentNotReadyForFinalization();

        uint256 currentRevision = _competitionStateRevision(host, tournamentId);
        if (_finalPrizeAmountsDraftRevision[tournamentId][token] != currentRevision) {
            revert CompetitionStateRevisionMismatch();
        }

        uint256 assignedTotal = _finalPrizeAmountTotals[tournamentId][token];
        uint256 prizeablePool = host.prizePools(tournamentId, token);
        if (assignedTotal > prizeablePool) revert FinalPrizeAmountsExceedPrizePool();

        _finalPrizeAmountsReady[tournamentId][token] = true;
        _finalPrizeAmountsSealedRevision[tournamentId][token] = currentRevision;

        emit FinalPrizeAmountsSealed(tournamentId, token, assignedTotal, prizeablePool - assignedTotal);
    }

    function reopenFinalPrizeAmounts(uint256 tournamentId, address token) external onlyTreasury {
        ITreasuryPrizeBookHost host = ITreasuryPrizeBookHost(TREASURY);
        _requireRegisteredTournament(host, tournamentId);
        if (host.tournamentFinalized(tournamentId)) revert TournamentAlreadyClosed();
        if (!_prizeDistributionSet[tournamentId][token]) revert NoPrizeDistribution();
        if (!_finalPrizeAmountsReady[tournamentId][token]) revert FinalPrizeAmountsNotSealed();

        _finalPrizeAmountsReady[tournamentId][token] = false;
        _finalPrizeAmountsDraftRevision[tournamentId][token] = 0;
        _finalPrizeAmountsSealedRevision[tournamentId][token] = 0;

        emit FinalPrizeAmountsReopened(tournamentId, token);
    }

    function prizePoolDistributions(uint256 tournamentId, address token, uint256 index) external view returns (uint8) {
        return _prizePoolDistributions[tournamentId][token][index];
    }

    function prizeDistributionSet(uint256 tournamentId, address token) external view returns (bool) {
        return _prizeDistributionSet[tournamentId][token];
    }

    function prizeDistributionTokens(uint256 tournamentId, uint256 index) external view returns (address) {
        return _prizeDistributionTokens[tournamentId][index];
    }

    function finalPrizeAmounts(uint256 tournamentId, uint256 tokenId, address token) external view returns (uint256) {
        return _finalPrizeAmounts[tournamentId][tokenId][token];
    }

    function finalPrizeAmountTotals(uint256 tournamentId, address token) external view returns (uint256) {
        return _finalPrizeAmountTotals[tournamentId][token];
    }

    function finalPrizeAmountsDraftRevision(uint256 tournamentId, address token) external view returns (uint256) {
        return _finalPrizeAmountsDraftRevision[tournamentId][token];
    }

    function finalPrizeAmountsSealedRevision(uint256 tournamentId, address token) external view returns (uint256) {
        return _finalPrizeAmountsSealedRevision[tournamentId][token];
    }

    function finalPrizeAmountsReady(uint256 tournamentId, address token) external view returns (bool) {
        return _finalPrizeAmountsReady[tournamentId][token];
    }

    function getPrizeDistributionTokenCount(uint256 tournamentId) external view returns (uint256) {
        return _prizeDistributionTokens[tournamentId].length;
    }

    function getPrizeDistributionTokenAt(uint256 tournamentId, uint256 index) external view returns (address) {
        return _prizeDistributionTokens[tournamentId][index];
    }

    function getPrizePoolDistributionLength(uint256 tournamentId, address token) external view returns (uint256) {
        return _prizePoolDistributions[tournamentId][token].length;
    }

    function getUserPrizeAmount(uint256 tournamentId, address token, uint256 position, uint256 poolToUse)
        external
        view
        returns (uint256)
    {
        if (position == 0 || position > _prizePoolDistributions[tournamentId][token].length) {
            revert InvalidPosition();
        }
        uint8 percentagePosition = _prizePoolDistributions[tournamentId][token][position - 1];
        return (poolToUse * percentagePosition) / 100;
    }

    function _requireRegisteredTournament(ITreasuryPrizeBookHost host, uint256 tournamentId) internal view {
        if (tournamentId == 0) revert InvalidTournamentId();
        if (!host.isTournamentRegistered(tournamentId)) revert TournamentNotRegistered();
    }

    function _competitionEngineReady(ITreasuryPrizeBookHost host, uint256 tournamentId) internal view returns (bool) {
        address engine = host.competitionEngineByTournament(tournamentId);
        if (engine == address(0)) return false;
        return ICompetitionEnginePrizeBook(engine).isReadyForFinalization();
    }

    function _competitionStateRevision(ITreasuryPrizeBookHost host, uint256 tournamentId)
        internal
        view
        returns (uint256)
    {
        address engine = host.competitionEngineByTournament(tournamentId);
        if (engine == address(0)) revert InvalidCompetitionEngine();
        return ICompetitionEnginePrizeBook(engine).competitionStateRevision();
    }

    function _isTokenInCurrentLeaderboard(ITreasuryPrizeBookHost host, uint256 tournamentId, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        address engine = host.competitionEngineByTournament(tournamentId);
        if (engine == address(0)) return false;
        return ICompetitionEnginePrizeBook(engine).isTokenInCurrentLeaderboard(tokenId);
    }
}
