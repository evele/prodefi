// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Contrato de Predicciones para Cartones de Prode
contract Predictions is Ownable {
    IERC1155 public cartones;
    
    uint8 immutable TOTAL_GAMES  = 4; 
    uint8 immutable LOCAL = 0;
    uint8 immutable EMPATE = 1;
    uint8 immutable VISITANTE = 2;

    event PredictionsSubmitted(address indexed user, uint256 indexed tokenId);

    struct Game {
        uint8 id; //will be here too, just to be easy to return (I think)
        uint8 team1;
        uint8 team2;
        uint8[2] result;
        bool set;
    } 
    mapping(uint8 => Game) public games; 
    /* 10 points per team
       3 fourth -- not for now
       4 third
       6 second
       9 first
    */

    /* for later
    uint8[3] public winners;
    mapping(uint256 => uint8[3]) winnersPredictions; // token ID -> array of 4 team ids */

    mapping(uint256 => Game[]) predictions; // token ID -> prediction (Game[])
    
    // uint256[] public positions; // array of token IDs ordered from higher to lower

    uint256 immutable MAX_INT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    
    
    mapping(uint256 => bool) public used;
    mapping(uint256 => uint8[]) public picks;



    // Llamamos a Ownable(msg.sender) para asignar el owner correctamente
    constructor(address _cartones) Ownable(msg.sender) {
        cartones = IERC1155(_cartones);
    }

    modifier onlyCartonOwner(uint256 tokenId) {
        require(cartones.balanceOf(msg.sender, tokenId) >= 1, "You aren't the owner of this carton");
        _;
    }

    function submitPrediction(uint256 tokenId, Game[] calldata _prediction) external onlyCartonOwner(tokenId) {
  
        require(!used[tokenId], "Prediction already submitted");
        used[tokenId] = true;
        // Copiamos cada elemento de _prediction a storage
        for (uint i = 0; i < _prediction.length; i++) {
            predictions[tokenId].push(_prediction[i]);
        }
        emit PredictionsSubmitted(msg.sender, tokenId);
    }


    function getPrediction(uint256 tokenId) external view returns (Game[] memory) {
        return predictions[tokenId];
    }

}
