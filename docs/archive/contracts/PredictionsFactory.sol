// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Archived from src/ on 2026-06-01.
// Kept only as historical reference after CI size failures showed that this
// unused factory should not stay in the compiled contract set.

import { Predictions } from "../../../src/Predictions.sol";

contract PredictionsFactory {
    event TournamentCreated(
        uint256 indexed tournamentId,
        address indexed predictions,
        address indexed cartones,
        bytes32 teamsHash,
        address owner
    );

    uint256 public nextTournamentId = 1;
    mapping(uint256 => address) public tournaments; // tournamentId -> Predictions contract

    function createTournament(address cartones, bytes32 teamsHash, address owner)
        external
        returns (address predictions)
    {
        uint256 id = nextTournamentId++;
        Predictions p = new Predictions(cartones, id);

        if (teamsHash != bytes32(0)) {
            p.setTeamsHash(teamsHash);
        }

        if (owner != address(0)) {
            p.transferOwnership(owner);
        }

        tournaments[id] = address(p);

        emit TournamentCreated(id, address(p), cartones, teamsHash, owner);
        return address(p);
    }
}
