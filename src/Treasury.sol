// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Treasury - Manejo centralizado de fondos y premios
/// @notice Contrato reutilizable para manejar prize pools de múltiples torneos
contract Treasury is AccessControl {
    bytes32 public constant TOURNAMENT_MANAGER_ROLE = keccak256("TOURNAMENT_MANAGER_ROLE");
    bytes32 public constant FUND_DEPOSITOR_ROLE = keccak256("FUND_DEPOSITOR_ROLE");

    // TODO: Agregar mappings para:
    // - Prize pools by tournament ID
    mapping(uint256=>uint256) public prizePools;
    // - Tracking for who already claimed
    mapping(uint256 => mapping(uint256 => bool)) public claimed;
    // - Prize distribution by position
    mapping(uint256 => uint8[]) public prizePoolDistributions;
    

    // TODO: Agregar eventos para:
    // - Deposit de fondos
    // Event deposit from sale
    event DepositFromSale(uint256 tournamentId, uint256 amount );
    // - Claim de premios
    event ClaimPrize(uint256 tournamentId, uint256 tokenId, address userAddress, uint256 position);
    // - Cambios en distribution
    event SetPrizeDistribution(uint256 tournamentId, uint8[] percentages);

    constructor(address defaultAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }

    /// @notice Recibe fondos de ventas de cartones
    /// @param tournamentId ID del torneo
    function depositFromSales(uint256 tournamentId) external payable {
        // TODO: Implementar
        // - Verificar que caller tenga FUND_DEPOSITOR_ROLE
        // - Sumar al prize pool del tournament
        // - Emitir evento
    }

    /// @notice User claims prize based on their token's final position
    /// @param tournamentId Tournament ID  
    /// @param tokenId Token ID to claim prize for
    function claimPrize(uint256 tournamentId, uint256 tokenId) external {
        // TODO: Implementar
        // - Verify caller owns the tokenId (carton.ownerOf(tokenId) == msg.sender)
        // - Verify token hasn't claimed already (claimed[tournamentId][tokenId] == false)
        // - Get position from Predictions contract
        // - Calculate prize amount based on position and distribution
        // - Transfer ETH to msg.sender
        // - Mark as claimed
    }

    /// @notice Admin setea distribución de premios por posición
    /// @param tournamentId ID del torneo
    /// @param percentages Array de porcentajes [1st%, 2nd%, 3rd%, ...]
    function setPrizeDistribution(uint256 tournamentId, uint256[] calldata percentages) external {
        // TODO: Implementar
        // - Solo DEFAULT_ADMIN_ROLE
        // - Verificar que percentages sumen <= 100
        // - Guardar distribución
    }

    // TODO: Agregar view functions:
    // - getPrizePool(tournamentId)
    // - getUserPrizeAmount(tournamentId, position)
    // - hasUserClaimed(tournamentId, user)

    // TODO: Agregar emergency functions:
    // - emergencyWithdraw() onlyRole(DEFAULT_ADMIN_ROLE)
    // - pause/unpause functionality
}