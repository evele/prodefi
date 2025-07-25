// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Carton} from "./Carton.sol";
import {Predictions} from "./Predictions.sol";

/// @title Treasury - Manejo centralizado de fondos y premios
/// @notice Contrato reutilizable para manejar prize pools de múltiples torneos
contract Treasury is AccessControl {
    bytes32 public constant TOURNAMENT_MANAGER_ROLE = keccak256("TOURNAMENT_MANAGER_ROLE");
    bytes32 public constant FUND_DEPOSITOR_ROLE = keccak256("FUND_DEPOSITOR_ROLE");

    // TODO: Agregar mappings para:
    // - Prize pools by tournament ID
    mapping(uint256 => uint256) public prizePools;
    // - Tracking for who already claimed
    mapping(uint256 => mapping(uint256 => bool)) public claimed;
    // - Prize distribution by position
    mapping(uint256 => uint8[]) public prizePoolDistributions;

    Carton public cartonContract;
    Predictions public predictionsContract;

    // TODO: Agregar eventos para:
    // - Deposit de fondos
    // Event deposit from sale
    event DepositFromSale(uint256 tournamentId, uint256 amount);
    // - Claim de premios
    event ClaimPrize(uint256 tournamentId, uint256 tokenId, address userAddress, uint256 position);
    // - Cambios en distribution
    event SetPrizeDistribution(uint256 tournamentId, uint8[] percentages);

    constructor(address defaultAdmin, address cartonAddress, address predictionsAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(FUND_DEPOSITOR_ROLE, defaultAdmin);
        cartonContract = Carton(cartonAddress);
        predictionsContract = Predictions(predictionsAddress);
    }

    /// @notice Recibe fondos de ventas de cartones
    /// @param tournamentId ID del torneo
    function depositFromSales(uint256 tournamentId) external payable onlyRole(FUND_DEPOSITOR_ROLE) {
        // NOTE: later we will proably add support to use stablecoins
        prizePools[tournamentId] += msg.value;
        emit DepositFromSale(tournamentId, msg.value);
    }

    /// @notice User claims prize based on their token's final position
    /// @param tournamentId Tournament ID
    /// @param tokenId Token ID to claim prize for
    function claimPrize(uint256 tournamentId, uint256 tokenId) external {
        // TODO: Implementar
        require(cartonContract.balanceOf(msg.sender, tokenId) > 0, "Not token owner");
        require(!claimed[tournamentId][tokenId], "Already claimed");
        uint256 position = predictionsContract.getCartonPosition(tokenId);
        uint8 percentage_position = prizePoolDistributions[tournamentId][position - 1];
        uint256 prize_amount = (prizePools[tournamentId] * percentage_position) / 100;

        (bool success,) = payable(msg.sender).call{value: prize_amount}("");
        require(success, "Transfer failed");
        claimed[tournamentId][tokenId] = true;
        emit ClaimPrize(tournamentId, tokenId, msg.sender, position);
    }

    /// @notice Admin setea distribución de premios por posición
    /// @param tournamentId ID del torneo
    /// @param percentages Array de porcentajes [1st%, 2nd%, 3rd%, ...]
    function setPrizeDistribution(uint256 tournamentId, uint8[] calldata percentages)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        // NOTE: ahora voy a verificar que sume entre 90% y 100% porque tal vez luego 5% para beneficiencia y 5% para development
        uint256 sum_percentages = 0;
        for (uint256 i = 0; i < percentages.length; i++) {
            require(percentages[i] <= 100, "Percentage must be between 0 and 100");
            sum_percentages += percentages[i];
        }
        require(sum_percentages >= 90 && sum_percentages <= 100, "Percentage sum must be between 90 and 100");

        delete prizePoolDistributions[tournamentId];
        for (uint256 i = 0; i < percentages.length; i++) {
            prizePoolDistributions[tournamentId].push(percentages[i]);
        }
        emit SetPrizeDistribution(tournamentId, percentages);
    }

    // TODO: Agregar view functions:
    // - getPrizePool(tournamentId)
    function getPrizePool(uint256 tournamentId) external view returns (uint256) {
        return prizePools[tournamentId];
    }
    // - getUserPrizeAmount(tournamentId, position)

    function getUserPrizeAmount(uint256 tournamentId, uint256 position) external view returns (uint256) {
        require(position > 0 && position <= prizePoolDistributions[tournamentId].length, "Invalid position");
        uint8 percentage_position = prizePoolDistributions[tournamentId][position - 1];
        return (prizePools[tournamentId] * percentage_position) / 100;
    }
    // - hasUserClaimed(tournamentId, user)

    function hasUserClaimed(uint256 tournamentId, uint256 tokenId) external view returns (bool) {
        return claimed[tournamentId][tokenId];
    }
    // TODO: Agregar emergency functions:
    // - emergencyWithdraw() onlyRole(DEFAULT_ADMIN_ROLE)
    // - pause/unpause functionality
}
