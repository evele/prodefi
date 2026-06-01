// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Carton } from "./Carton.sol";

interface ICompetitionEngine {
    function isReadyForFinalization() external view returns (bool);
    function competitionStateRevision() external view returns (uint256);
    function isTokenInCurrentLeaderboard(uint256 tokenId) external view returns (bool);
}

/// @title Treasury - Centralized multi-asset fund and prize management
/// @notice Reusable contract for managing prize pools across multiple tournaments with ETH/ERC20 support
contract Treasury is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint16 public constant BPS_DENOMINATOR = 10_000;

    error ZeroAmount();
    error TournamentAlreadyClosed();
    error UseDepositForETH();
    error TournamentNotClosed();
    error NotTokenOwner();
    error AlreadyClaimed();
    error InvalidPosition();
    error NoPrizeAvailable();
    error ETHTransferFailed();
    error InvalidPercentage();
    error InvalidPercentageSum();
    error NoPrizePool();
    error NoPrizeDistribution();
    error SalesAlreadyClosed();
    error SalesNotClosed();
    error TournamentNotFinalized();
    error TournamentNotReadyForFinalization();
    error InvalidReserveBps();
    error FinalPrizeAmountsAlreadyLoaded();
    error FinalPrizeAmountsAlreadySealed();
    error FinalPrizeAmountsNotSealed();
    error FinalPrizeAmountsExceedPrizePool();
    error NoPrizeRecipientsProvided();
    error PrizeArrayLengthMismatch();
    error InvalidTournamentId();
    error TournamentNotRegistered();
    error InvalidCompetitionEngine();
    error CompetitionEngineAlreadyFrozen();
    error TokenTournamentMismatch();
    error InsufficientGlobalReserve();
    error UnsupportedPrizeToken();
    error ZeroTokenAddress();
    error PrizeDistributionRemovalNotAllowed();
    error CompetitionStateRevisionMismatch();
    error TokenNotInCurrentLeaderboard();

    bytes32 public constant TOURNAMENT_MANAGER_ROLE = keccak256("TOURNAMENT_MANAGER_ROLE");
    bytes32 public constant FUND_DEPOSITOR_ROLE = keccak256("FUND_DEPOSITOR_ROLE");

    // Multi-asset prize pools: tournamentId => token => amount
    // address(0) = ETH, other addresses = ERC20 tokens
    mapping(uint256 => mapping(address => uint256)) public prizePools;
    mapping(address => uint256) public globalReserve;
    mapping(address => bool) public supportedPrizeTokens;

    // Tracking claims per tournament, tokenId (NFT), and asset
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public claimed;

    // Prize distribution by tournament and asset type
    mapping(uint256 => mapping(address => uint8[])) public prizePoolDistributions;
    mapping(uint256 => mapping(address => bool)) public prizeDistributionSet;
    mapping(uint256 => address[]) public prizeDistributionTokens;

    // Snapshots prizepool to finalize
    mapping(uint256 => mapping(address => uint256)) public closedPrizePools;

    // Exact per-carton prizes, loaded before finalization.
    mapping(uint256 => mapping(uint256 => mapping(address => uint256))) public finalPrizeAmounts;
    mapping(uint256 => mapping(address => uint256)) public finalPrizeAmountTotals;
    mapping(uint256 => mapping(address => uint256)) public finalPrizeAmountsDraftRevision;
    mapping(uint256 => mapping(address => uint256)) public finalPrizeAmountsSealedRevision;
    mapping(uint256 => mapping(address => bool)) public finalPrizeAmountsReady;

    // Flag of closed tournament
    mapping(uint256 => mapping(address => bool)) public isClosedTournament;
    mapping(uint256 => bool) public isTournamentClosedAnyAsset;
    mapping(uint256 => bool) public salesClosed;
    mapping(uint256 => bool) public tournamentFinalized;
    mapping(uint256 => bool) public tournamentRegistered;
    mapping(uint256 => address) public competitionEngineByTournament;
    uint256[] private registeredTournamentIds;

    Carton public cartonContract;
    uint16 public immutable reserveBps;

    // Events
    event DepositFromSale(uint256 indexed tournamentId, address indexed token, uint256 amount);
    event SalesClosed(uint256 indexed tournamentId);
    event ClaimPrize(
        uint256 indexed tournamentId,
        uint256 indexed tokenId,
        address indexed user,
        address token,
        uint256 position,
        uint256 amount
    );
    event SetPrizeDistribution(uint256 indexed tournamentId, address indexed token, uint8[] percentages);
    event FinalPrizeAmountsUpdated(
        uint256 indexed tournamentId, address indexed token, uint256[] tokenIds, uint256[] amounts
    );
    event FinalPrizeAmountsSealed(
        uint256 indexed tournamentId, address indexed token, uint256 totalAssigned, uint256 reserveAdded
    );
    event FinalPrizeAmountsReopened(uint256 indexed tournamentId, address indexed token);
    event TournamentFinalized(uint256 indexed tournamentId);
    event TournamentClosed(uint256 indexed tournamentId, address indexed token, uint256 closedPrizePool);
    event TournamentRegistered(uint256 indexed tournamentId, address indexed engine);
    event ReserveSeeded(uint256 indexed tournamentId, address indexed token, uint256 amount);
    event SupportedPrizeTokenSet(address indexed token, bool supported);
    event PrizeDistributionRemoved(uint256 indexed tournamentId, address indexed token);
    event CompetitionEngineChanged(uint256 indexed tournamentId, address indexed oldEngine, address indexed newEngine);

    constructor(address defaultAdmin, address cartonAddress, uint16 reserveBps_) {
        if (reserveBps_ >= BPS_DENOMINATOR) revert InvalidReserveBps();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(FUND_DEPOSITOR_ROLE, defaultAdmin);
        cartonContract = Carton(cartonAddress);
        reserveBps = reserveBps_;
    }

    function registerTournament(uint256 tournamentId, address engine) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (tournamentId == 0) revert InvalidTournamentId();
        if (engine == address(0)) revert InvalidCompetitionEngine();
        if (salesClosed[tournamentId]) revert CompetitionEngineAlreadyFrozen();

        if (!tournamentRegistered[tournamentId]) {
            tournamentRegistered[tournamentId] = true;
            registeredTournamentIds.push(tournamentId);
            emit TournamentRegistered(tournamentId, engine);
        } else {
            address oldEngine = competitionEngineByTournament[tournamentId];
            if (oldEngine != engine) {
                emit CompetitionEngineChanged(tournamentId, oldEngine, engine);
            }
        }

        competitionEngineByTournament[tournamentId] = engine;
    }

    /// @notice Marks an ERC20 token as supported for sales deposits and prize pools.
    /// @dev ETH (address(0)) is always supported and must not be configured here.
    function setSupportedPrizeToken(address token, bool supported) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (token == address(0)) revert ZeroTokenAddress();

        supportedPrizeTokens[token] = supported;
        emit SupportedPrizeTokenSet(token, supported);
    }

    function isSupportedPrizeToken(address token) public view returns (bool) {
        return token == address(0) || supportedPrizeTokens[token];
    }

    /// @notice Deposits ETH from sales to tournament prize pool
    /// @param tournamentId Tournament ID
    function depositFromSales(uint256 tournamentId) external payable onlyRole(FUND_DEPOSITOR_ROLE) {
        _requireRegisteredTournament(tournamentId);
        if (msg.value == 0) revert ZeroAmount();
        if (salesClosed[tournamentId]) revert SalesAlreadyClosed();

        uint256 reserveAmount = (msg.value * reserveBps) / BPS_DENOMINATOR;
        globalReserve[address(0)] += reserveAmount;
        prizePools[tournamentId][address(0)] += msg.value - reserveAmount;

        emit DepositFromSale(tournamentId, address(0), msg.value);
    }

    /// @notice Deposits ERC20 tokens from sales to tournament prize pool
    /// @param tournamentId Tournament ID
    /// @param token ERC20 token address
    /// @param amount Amount to deposit
    function depositFromSalesERC20(uint256 tournamentId, address token, uint256 amount)
        external
        onlyRole(FUND_DEPOSITOR_ROLE)
    {
        _requireRegisteredTournament(tournamentId);
        if (token == address(0)) revert UseDepositForETH();
        _requireSupportedPrizeToken(token);
        if (amount == 0) revert ZeroAmount();
        if (salesClosed[tournamentId]) revert SalesAlreadyClosed();

        // Only standard, non-fee-on-transfer and non-rebasing ERC20 tokens are supported.
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        uint256 reserveAmount = (amount * reserveBps) / BPS_DENOMINATOR;
        globalReserve[token] += reserveAmount;
        prizePools[tournamentId][token] += amount - reserveAmount;

        emit DepositFromSale(tournamentId, token, amount);
    }

    function closeSales(uint256 tournamentId) external onlyRole(TOURNAMENT_MANAGER_ROLE) {
        _requireRegisteredTournament(tournamentId);
        if (salesClosed[tournamentId]) revert SalesAlreadyClosed();
        salesClosed[tournamentId] = true;
        emit SalesClosed(tournamentId);
    }

    /// @notice User claims prize based on their token's final position for specific asset
    /// @param tournamentId Tournament ID
    /// @param tokenId Token ID to claim prize for
    /// @param token Token address (address(0) for ETH)
    function claimPrize(uint256 tournamentId, uint256 tokenId, address token) external nonReentrant {
        _requireRegisteredTournament(tournamentId);
        if (!tournamentFinalized[tournamentId]) revert TournamentNotFinalized();
        if (cartonContract.balanceOf(msg.sender, tokenId) == 0) revert NotTokenOwner();
        if (cartonContract.tokenTournamentId(tokenId) != tournamentId) revert TokenTournamentMismatch();
        if (claimed[tournamentId][tokenId][token]) revert AlreadyClaimed();

        uint256 prize_amount = finalPrizeAmounts[tournamentId][tokenId][token];
        if (prize_amount == 0) revert NoPrizeAvailable();

        claimed[tournamentId][tokenId][token] = true;

        if (token == address(0)) {
            // ETH transfer
            (bool success,) = payable(msg.sender).call{ value: prize_amount }("");
            if (!success) revert ETHTransferFailed();
        } else {
            // ERC20 transfer
            IERC20(token).safeTransfer(msg.sender, prize_amount);
        }

        emit ClaimPrize(tournamentId, tokenId, msg.sender, token, 0, prize_amount);
    }

    /// @notice Admin sets prize distribution by position for specific asset
    /// @param tournamentId Tournament ID
    /// @param token Token address (address(0) for ETH)
    /// @param percentages Array of percentages [1st%, 2nd%, 3rd%, ...]
    function setPrizeDistribution(uint256 tournamentId, address token, uint8[] calldata percentages)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _requireRegisteredTournament(tournamentId);
        _requireSupportedPrizeToken(token);
        if (!salesClosed[tournamentId]) revert SalesNotClosed();
        if (tournamentFinalized[tournamentId]) revert TournamentAlreadyClosed();
        if (finalPrizeAmountTotals[tournamentId][token] > 0 || finalPrizeAmountsReady[tournamentId][token]) {
            revert FinalPrizeAmountsAlreadyLoaded();
        }

        // Percentages may leave an explicit reserve for development, donation, or jackpot.
        uint256 sum_percentages = 0;
        uint256 percentagesLength = percentages.length;
        for (uint256 i; i < percentagesLength;) {
            if (percentages[i] > 100) revert InvalidPercentage();
            sum_percentages += percentages[i];
            unchecked {
                ++i;
            }
        }
        if (sum_percentages == 0 || sum_percentages > 100) revert InvalidPercentageSum();

        if (!prizeDistributionSet[tournamentId][token]) {
            prizeDistributionSet[tournamentId][token] = true;
            prizeDistributionTokens[tournamentId].push(token);
        }

        delete prizePoolDistributions[tournamentId][token];
        for (uint256 i; i < percentagesLength;) {
            prizePoolDistributions[tournamentId][token].push(percentages[i]);
            unchecked {
                ++i;
            }
        }
        emit SetPrizeDistribution(tournamentId, token, percentages);
    }

    function removePrizeDistributionToken(uint256 tournamentId, address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _requireRegisteredTournament(tournamentId);
        if (tournamentFinalized[tournamentId]) revert TournamentAlreadyClosed();
        if (!prizeDistributionSet[tournamentId][token]) revert NoPrizeDistribution();
        if (
            prizePools[tournamentId][token] > 0 || finalPrizeAmountTotals[tournamentId][token] > 0
                || finalPrizeAmountsReady[tournamentId][token]
        ) {
            revert PrizeDistributionRemovalNotAllowed();
        }

        address[] storage tokens = prizeDistributionTokens[tournamentId];
        uint256 tokensLength = tokens.length;
        for (uint256 i; i < tokensLength;) {
            if (tokens[i] == token) {
                uint256 lastIndex = tokensLength - 1;
                if (i != lastIndex) {
                    tokens[i] = tokens[lastIndex];
                }
                tokens.pop();

                delete prizeDistributionSet[tournamentId][token];
                delete prizePoolDistributions[tournamentId][token];
                delete finalPrizeAmountTotals[tournamentId][token];
                delete finalPrizeAmountsDraftRevision[tournamentId][token];
                delete finalPrizeAmountsSealedRevision[tournamentId][token];
                delete finalPrizeAmountsReady[tournamentId][token];

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
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _requireRegisteredTournament(tournamentId);
        if (!salesClosed[tournamentId]) revert SalesNotClosed();
        if (tournamentFinalized[tournamentId]) revert TournamentAlreadyClosed();
        if (!prizeDistributionSet[tournamentId][token]) revert NoPrizeDistribution();
        if (finalPrizeAmountsReady[tournamentId][token]) revert FinalPrizeAmountsAlreadySealed();
        if (tokenIds.length == 0) revert NoPrizeRecipientsProvided();
        if (tokenIds.length != amounts.length) revert PrizeArrayLengthMismatch();

        uint256 runningTotal = finalPrizeAmountTotals[tournamentId][token];
        uint256 tokenIdsLength = tokenIds.length;
        for (uint256 i; i < tokenIdsLength;) {
            if (cartonContract.tokenTournamentId(tokenIds[i]) != tournamentId) revert TokenTournamentMismatch();
            if (amounts[i] != 0 && !_isTokenInCurrentLeaderboard(tournamentId, tokenIds[i])) {
                revert TokenNotInCurrentLeaderboard();
            }

            uint256 previousAmount = finalPrizeAmounts[tournamentId][tokenIds[i]][token];
            runningTotal = runningTotal - previousAmount + amounts[i];
            finalPrizeAmounts[tournamentId][tokenIds[i]][token] = amounts[i];
            unchecked {
                ++i;
            }
        }

        if (runningTotal > prizePools[tournamentId][token]) revert FinalPrizeAmountsExceedPrizePool();

        finalPrizeAmountTotals[tournamentId][token] = runningTotal;
        finalPrizeAmountsDraftRevision[tournamentId][token] = _competitionStateRevision(tournamentId);
        emit FinalPrizeAmountsUpdated(tournamentId, token, tokenIds, amounts);
    }

    function sealFinalPrizeAmounts(uint256 tournamentId, address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _requireRegisteredTournament(tournamentId);
        if (!salesClosed[tournamentId]) revert SalesNotClosed();
        if (tournamentFinalized[tournamentId]) revert TournamentAlreadyClosed();
        if (!prizeDistributionSet[tournamentId][token]) revert NoPrizeDistribution();
        if (finalPrizeAmountsReady[tournamentId][token]) revert FinalPrizeAmountsAlreadySealed();
        if (!_competitionEngineReady(tournamentId)) revert TournamentNotReadyForFinalization();

        uint256 currentRevision = _competitionStateRevision(tournamentId);
        if (finalPrizeAmountsDraftRevision[tournamentId][token] != currentRevision) {
            revert CompetitionStateRevisionMismatch();
        }

        uint256 assignedTotal = finalPrizeAmountTotals[tournamentId][token];
        uint256 prizeablePool = prizePools[tournamentId][token];
        if (assignedTotal > prizeablePool) revert FinalPrizeAmountsExceedPrizePool();

        uint256 reserveAddition = prizeablePool - assignedTotal;
        finalPrizeAmountsReady[tournamentId][token] = true;
        finalPrizeAmountsSealedRevision[tournamentId][token] = currentRevision;

        emit FinalPrizeAmountsSealed(tournamentId, token, assignedTotal, reserveAddition);
    }

    function reopenFinalPrizeAmounts(uint256 tournamentId, address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _requireRegisteredTournament(tournamentId);
        if (tournamentFinalized[tournamentId]) revert TournamentAlreadyClosed();
        if (!prizeDistributionSet[tournamentId][token]) revert NoPrizeDistribution();
        if (!finalPrizeAmountsReady[tournamentId][token]) revert FinalPrizeAmountsNotSealed();

        finalPrizeAmountsReady[tournamentId][token] = false;
        finalPrizeAmountsDraftRevision[tournamentId][token] = 0;
        finalPrizeAmountsSealedRevision[tournamentId][token] = 0;

        emit FinalPrizeAmountsReopened(tournamentId, token);
    }

    // View functions
    /// @notice Get prize pool amount for specific tournament and token
    /// @param tournamentId Tournament ID
    /// @param token Token address (address(0) for ETH)
    function getPrizePool(uint256 tournamentId, address token) external view returns (uint256) {
        return prizePools[tournamentId][token];
    }

    function getGlobalReserve(address token) external view returns (uint256) {
        return globalReserve[token];
    }

    /// @notice Calculate prize amount for specific position and asset
    /// @param tournamentId Tournament ID
    /// @param token Token address (address(0) for ETH)
    /// @param position Position in leaderboard (1-indexed)
    function getUserPrizeAmount(uint256 tournamentId, address token, uint256 position) external view returns (uint256) {
        if (position == 0 || position > prizePoolDistributions[tournamentId][token].length) revert InvalidPosition();
        uint8 percentage_position = prizePoolDistributions[tournamentId][token][position - 1];

        // Use closed pool if tournament is closed, otherwise use current pool
        uint256 poolToUse =
            tournamentFinalized[tournamentId] ? closedPrizePools[tournamentId][token] : prizePools[tournamentId][token];

        return (poolToUse * percentage_position) / 100;
    }

    function getClaimablePrizeAmount(uint256 tournamentId, uint256 tokenId, address token)
        external
        view
        returns (uint256)
    {
        return finalPrizeAmounts[tournamentId][tokenId][token];
    }

    /// @notice Check if user has claimed prize for specific asset
    /// @param tournamentId Tournament ID
    /// @param tokenId Token ID
    /// @param token Token address (address(0) for ETH)
    function hasUserClaimed(uint256 tournamentId, uint256 tokenId, address token) external view returns (bool) {
        return claimed[tournamentId][tokenId][token];
    }

    function getPrizeDistributionTokenCount(uint256 tournamentId) external view returns (uint256) {
        return prizeDistributionTokens[tournamentId].length;
    }

    function getRegisteredTournamentIds() external view returns (uint256[] memory) {
        return registeredTournamentIds;
    }

    function isTournamentRegistered(uint256 tournamentId) external view returns (bool) {
        return tournamentRegistered[tournamentId];
    }

    function seedTournamentFromReserve(uint256 tournamentId, address token, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _requireRegisteredTournament(tournamentId);
        _requireSupportedPrizeToken(token);
        if (amount == 0) revert ZeroAmount();
        if (tournamentFinalized[tournamentId]) revert TournamentAlreadyClosed();
        if (finalPrizeAmountsReady[tournamentId][token]) revert FinalPrizeAmountsAlreadySealed();
        if (globalReserve[token] < amount) revert InsufficientGlobalReserve();

        globalReserve[token] -= amount;
        prizePools[tournamentId][token] += amount;

        emit ReserveSeeded(tournamentId, token, amount);
    }

    /// @notice Finalizes the whole tournament and snapshots all configured prize assets.
    function finalizeTournament(uint256 tournamentId) public onlyRole(TOURNAMENT_MANAGER_ROLE) {
        _requireRegisteredTournament(tournamentId);
        if (tournamentFinalized[tournamentId]) revert TournamentAlreadyClosed();
        if (!salesClosed[tournamentId]) revert SalesNotClosed();

        address[] storage tokens = prizeDistributionTokens[tournamentId];
        if (tokens.length == 0) revert NoPrizeDistribution();

        uint256 closedAssets = 0;
        uint256 tokensLength = tokens.length;
        for (uint256 i; i < tokensLength;) {
            address token = tokens[i];
            uint256 pool = prizePools[tournamentId][token];
            if (pool != 0 || finalPrizeAmountTotals[tournamentId][token] != 0) {
                if (pool == 0) revert NoPrizePool();
                if (prizePoolDistributions[tournamentId][token].length == 0) revert NoPrizeDistribution();
                if (!finalPrizeAmountsReady[tournamentId][token]) revert FinalPrizeAmountsNotSealed();
                closedAssets += 1;
            }
            unchecked {
                ++i;
            }
        }

        if (closedAssets == 0) revert NoPrizePool();

        address engine = competitionEngineByTournament[tournamentId];
        if (engine == address(0) || !ICompetitionEngine(engine).isReadyForFinalization()) {
            revert TournamentNotReadyForFinalization();
        }
        uint256 currentRevision = ICompetitionEngine(engine).competitionStateRevision();

        for (uint256 i; i < tokensLength;) {
            address token = tokens[i];
            uint256 pool = prizePools[tournamentId][token];
            uint256 assignedTotal = finalPrizeAmountTotals[tournamentId][token];
            if (pool != 0 || assignedTotal != 0) {
                if (finalPrizeAmountsSealedRevision[tournamentId][token] != currentRevision) {
                    revert CompetitionStateRevisionMismatch();
                }
                if (assignedTotal > pool) revert FinalPrizeAmountsExceedPrizePool();

                uint256 reserveAddition = pool - assignedTotal;
                globalReserve[token] += reserveAddition;
                prizePools[tournamentId][token] = assignedTotal;
                closedPrizePools[tournamentId][token] = assignedTotal;
                isClosedTournament[tournamentId][token] = true;
                emit TournamentClosed(tournamentId, token, assignedTotal);
            }
            unchecked {
                ++i;
            }
        }

        tournamentFinalized[tournamentId] = true;
        isTournamentClosedAnyAsset[tournamentId] = true;
        emit TournamentFinalized(tournamentId);
    }

    function _requireRegisteredTournament(uint256 tournamentId) internal view {
        if (tournamentId == 0) revert InvalidTournamentId();
        if (!tournamentRegistered[tournamentId]) revert TournamentNotRegistered();
    }

    function _requireSupportedPrizeToken(address token) internal view {
        if (!isSupportedPrizeToken(token)) revert UnsupportedPrizeToken();
    }

    function _competitionEngineReady(uint256 tournamentId) internal view returns (bool) {
        address engine = competitionEngineByTournament[tournamentId];
        if (engine == address(0)) return false;
        return ICompetitionEngine(engine).isReadyForFinalization();
    }

    function _competitionStateRevision(uint256 tournamentId) internal view returns (uint256) {
        address engine = competitionEngineByTournament[tournamentId];
        if (engine == address(0)) revert InvalidCompetitionEngine();
        return ICompetitionEngine(engine).competitionStateRevision();
    }

    function _isTokenInCurrentLeaderboard(uint256 tournamentId, uint256 tokenId) internal view returns (bool) {
        address engine = competitionEngineByTournament[tournamentId];
        if (engine == address(0)) return false;
        return ICompetitionEngine(engine).isTokenInCurrentLeaderboard(tokenId);
    }
}
