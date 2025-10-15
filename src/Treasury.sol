// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Carton} from "./Carton.sol";
import {Predictions} from "./Predictions.sol";

/// @title Treasury - Centralized multi-asset fund and prize management
/// @notice Reusable contract for managing prize pools across multiple tournaments with ETH/ERC20 support
contract Treasury is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant TOURNAMENT_MANAGER_ROLE = keccak256("TOURNAMENT_MANAGER_ROLE");
    bytes32 public constant FUND_DEPOSITOR_ROLE = keccak256("FUND_DEPOSITOR_ROLE");

    // Multi-asset prize pools: tournamentId => token => amount
    // address(0) = ETH, other addresses = ERC20 tokens
    mapping(uint256 => mapping(address => uint256)) public prizePools;

    // Tracking claims per tournament, tokenId (NFT), and asset
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public claimed;

    // Prize distribution by tournament and asset type
    mapping(uint256 => mapping(address => uint8[])) public prizePoolDistributions;

    // Snapshots prizepool to finalize
    mapping(uint256 => mapping(address => uint256)) public closedPrizePools;

    // Flag of closed tournament
    mapping(uint256 => mapping(address => bool)) public isClosedTournament;

    Carton public cartonContract;
    Predictions public predictionsContract;

    // Events
    event DepositFromSale(uint256 indexed tournamentId, address indexed token, uint256 amount);
    event ClaimPrize(
        uint256 indexed tournamentId,
        uint256 indexed tokenId,
        address indexed user,
        address token,
        uint256 position,
        uint256 amount
    );
    event SetPrizeDistribution(uint256 indexed tournamentId, address indexed token, uint8[] percentages);
    event TournamentClosed(uint256 indexed tournamentId, address indexed token, uint256 closedPrizePool);

    constructor(address defaultAdmin, address cartonAddress, address predictionsAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(FUND_DEPOSITOR_ROLE, defaultAdmin);
        cartonContract = Carton(cartonAddress);
        predictionsContract = Predictions(predictionsAddress);
    }

    /// @notice Deposits ETH from sales to tournament prize pool
    /// @param tournamentId Tournament ID
    function depositFromSales(uint256 tournamentId) external payable onlyRole(FUND_DEPOSITOR_ROLE) {
        require(msg.value > 0, "Amount must be greater than 0");
        require(!isClosedTournament[tournamentId][address(0)], "Tournament already closed");
        prizePools[tournamentId][address(0)] += msg.value;
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
        require(token != address(0), "Use depositFromSales for ETH");
        require(amount > 0, "Amount must be greater than 0");
        require(!isClosedTournament[tournamentId][token], "Tournament already closed");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        prizePools[tournamentId][token] += amount;
        emit DepositFromSale(tournamentId, token, amount);
    }

    /// @notice User claims prize based on their token's final position for specific asset
    /// @param tournamentId Tournament ID
    /// @param tokenId Token ID to claim prize for
    /// @param token Token address (address(0) for ETH)
    function claimPrize(uint256 tournamentId, uint256 tokenId, address token) external {
        require(isClosedTournament[tournamentId][token], "Tournament not closed");
        require(cartonContract.balanceOf(msg.sender, tokenId) > 0, "Not token owner");
        require(!claimed[tournamentId][tokenId][token], "Already claimed");

        uint256 position = predictionsContract.getCartonPosition(tokenId);
        require(position > 0 && position <= prizePoolDistributions[tournamentId][token].length, "Invalid position");

        uint8 percentage_position = prizePoolDistributions[tournamentId][token][position - 1];
        uint256 prize_amount = (closedPrizePools[tournamentId][token] * percentage_position) / 100;
        require(prize_amount > 0, "No prize available");

        claimed[tournamentId][tokenId][token] = true;

        if (token == address(0)) {
            // ETH transfer
            (bool success,) = payable(msg.sender).call{value: prize_amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 transfer
            IERC20(token).safeTransfer(msg.sender, prize_amount);
        }

        emit ClaimPrize(tournamentId, tokenId, msg.sender, token, position, prize_amount);
    }

    /// @notice Admin sets prize distribution by position for specific asset
    /// @param tournamentId Tournament ID
    /// @param token Token address (address(0) for ETH)
    /// @param percentages Array of percentages [1st%, 2nd%, 3rd%, ...]
    function setPrizeDistribution(uint256 tournamentId, address token, uint8[] calldata percentages)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        // Verify percentages sum between 90% and 100% (reserve for charity/development)
        uint256 sum_percentages = 0;
        for (uint256 i = 0; i < percentages.length; i++) {
            require(percentages[i] <= 100, "Percentage must be between 0 and 100");
            sum_percentages += percentages[i];
        }
        require(sum_percentages >= 90 && sum_percentages <= 100, "Percentage sum must be between 90 and 100");

        delete prizePoolDistributions[tournamentId][token];
        for (uint256 i = 0; i < percentages.length; i++) {
            prizePoolDistributions[tournamentId][token].push(percentages[i]);
        }
        emit SetPrizeDistribution(tournamentId, token, percentages);
    }

    // View functions
    /// @notice Get prize pool amount for specific tournament and token
    /// @param tournamentId Tournament ID
    /// @param token Token address (address(0) for ETH)
    function getPrizePool(uint256 tournamentId, address token) external view returns (uint256) {
        return prizePools[tournamentId][token];
    }

    /// @notice Calculate prize amount for specific position and asset
    /// @param tournamentId Tournament ID
    /// @param token Token address (address(0) for ETH)
    /// @param position Position in leaderboard (1-indexed)
    function getUserPrizeAmount(uint256 tournamentId, address token, uint256 position)
        external
        view
        returns (uint256)
    {
        require(position > 0 && position <= prizePoolDistributions[tournamentId][token].length, "Invalid position");
        uint8 percentage_position = prizePoolDistributions[tournamentId][token][position - 1];

        // Use closed pool if tournament is closed, otherwise use current pool
        uint256 poolToUse = isClosedTournament[tournamentId][token]
            ? closedPrizePools[tournamentId][token]
            : prizePools[tournamentId][token];

        return (poolToUse * percentage_position) / 100;
    }

    /// @notice Check if user has claimed prize for specific asset
    /// @param tournamentId Tournament ID
    /// @param tokenId Token ID
    /// @param token Token address (address(0) for ETH)
    function hasUserClaimed(uint256 tournamentId, uint256 tokenId, address token) external view returns (bool) {
        return claimed[tournamentId][tokenId][token];
    }

    /// @notice Get all supported assets for a tournament
    /// @param tournamentId Tournament ID
    /// @dev Returns assets that have non-zero prize pools
    function getSupportedAssets(uint256 tournamentId) external view returns (address[] memory) {
        // Note: This is a simple implementation that requires off-chain tracking
        // For a more robust solution, consider maintaining an assets array per tournament
        address[] memory assets = new address[](2); // ETH + one ERC20 for example
        uint256 count = 0;

        if (prizePools[tournamentId][address(0)] > 0) {
            assets[count] = address(0);
            count++;
        }

        // Add logic here to check for specific ERC20 tokens
        // This could be enhanced with a proper assets registry

        // Resize array to actual count
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = assets[i];
        }
        return result;
    }

    /// @notice Closes tournament and snapshots prize pool for claims
    /// @param tournamentId Tournament ID
    /// @param token Token address (address(0) for ETH)
    function closeTournament(uint256 tournamentId, address token) external onlyRole(TOURNAMENT_MANAGER_ROLE) {
        require(!isClosedTournament[tournamentId][token], "Tournament already closed");
        require(prizePools[tournamentId][token] > 0, "No prize pool");
        require(prizePoolDistributions[tournamentId][token].length > 0, "No prize distribution");

        closedPrizePools[tournamentId][token] = prizePools[tournamentId][token];
        isClosedTournament[tournamentId][token] = true;

        emit TournamentClosed(tournamentId, token, closedPrizePools[tournamentId][token]);
    }
}
