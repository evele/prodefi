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
    uint8 immutable MAX_TEAM_ID = 32; // Máximo ID de equipo permitido
    uint8 immutable MAX_WINNERS = 4; // Máximo número de equipos ganadores a predecir
    uint8 constant POINTS_FIRST = 19; // Puntos por acertar el primer puesto
    uint8 constant POINTS_SECOND = 16; // Puntos por acertar el segundo puesto
    uint8 constant POINTS_THIRD_FOURTH = 10; // Puntos por acertar el tercer o cuarto puesto

    // Estructura para almacenar los ganadores oficiales
    struct OfficialWinners {
        uint8[4] teams; // IDs de los equipos
        bool set; // Si los ganadores están establecidos
    }
    OfficialWinners public officialWinners;

    // Evento para cuando se establecen los ganadores oficiales
    event OfficialWinnersSet(uint8[4] teams);

    // Estructura para almacenar las predicciones de ganadores
    struct WinnersPrediction {
        uint8[4] teams; // IDs de los equipos
        bool set; // Si la predicción está establecida
    }
    mapping(uint256 => WinnersPrediction) public winnersPredictions;
    mapping(uint256 => uint256) public totalPoints; // tokenID -> puntos totales

    // Eventos para las predicciones de ganadores
    event WinnersPredicted(address indexed user, uint256 indexed tokenId, uint8[4] teams);
    event PointsUpdated(uint256 indexed tokenId, uint256 points);

    event PredictionsSubmitted(address indexed user, uint256 indexed tokenId);
    event ResultsSet(uint8 indexed gameId, uint8 team1Goals, uint8 team2Goals);

    modifier onlyBeforeResults(uint8 gameId) {
        require(!games[gameId].set, "Results already set for this game");
        _;
    }

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
    uint256[] public positions; // array de token IDs ordenados de mayor a menor

    // Evento para cuando se actualizan las posiciones
    event PositionsUpdated(uint256[] positions);

    // Función getter para obtener las posiciones
    function getPositions() public view returns (uint256[] memory) {
        return positions;
    }

    // Llamamos a Ownable(msg.sender) para asignar el owner correctamente
    constructor(address _cartones) Ownable(msg.sender) {
        cartones = IERC1155(_cartones);
    }

    // Función para que el owner establezca las posiciones
    function setPositions(uint256[] memory _predictionIds, uint256[] memory _predictionPoints) 
        public onlyOwner returns(bool success)
    {
        require(_predictionIds.length > 0, "No predictions provided");
        require(_predictionIds.length == _predictionPoints.length, "Arrays must have same length");

        uint256 maxPoints = MAX_INT;
        delete positions;

        for (uint256 i = 0; i < _predictionPoints.length; i++) {
            require(maxPoints >= _predictionPoints[i], "Points must be ordered");
            positions.push(_predictionIds[i]);
            maxPoints = _predictionPoints[i];
        }

        emit PositionsUpdated(positions);
        return true;
    }

    modifier onlyCartonOwner(uint256 tokenId) {
        require(cartones.balanceOf(msg.sender, tokenId) >= 1, "You aren't the owner of this carton");
        _;
    }

    function submitPrediction(uint256 tokenId, Game[] calldata _prediction) external onlyCartonOwner(tokenId) {
        require(!used[tokenId], "Prediction already submitted");
        require(_prediction.length == TOTAL_GAMES, "Must submit predictions for all games");
        
        // Verificar que los IDs de equipos sean válidos
        for (uint i = 0; i < _prediction.length; i++) {
            require(_prediction[i].team1 < MAX_TEAM_ID, "Invalid team1 ID");
            require(_prediction[i].team2 < MAX_TEAM_ID, "Invalid team2 ID");
            require(_prediction[i].id < TOTAL_GAMES, "Invalid game ID");
            require(!games[_prediction[i].id].set, "Cannot predict after results are set");
        }
        
        used[tokenId] = true;
        
        // Copiar cada predicción manualmente
        for (uint i = 0; i < _prediction.length; i++) {
            predictions[tokenId].push(Game({
                id: _prediction[i].id,
                team1: _prediction[i].team1,
                team2: _prediction[i].team2,
                result: _prediction[i].result,
                set: false
            }));
        }
        
        emit PredictionsSubmitted(msg.sender, tokenId);
    }

    function setResults(uint8 gameId, uint8 team1Goals, uint8 team2Goals) external onlyOwner {
        require(gameId < TOTAL_GAMES, "Invalid game ID");
        require(!games[gameId].set, "Results already set for this game");
        
        games[gameId].result = [team1Goals, team2Goals];
        games[gameId].set = true;
        
        emit ResultsSet(gameId, team1Goals, team2Goals);
    }


    function getPrediction(uint256 tokenId) external view returns (Game[] memory) {
        return predictions[tokenId];
    }

    function getGameResults(uint8 gameId) external view returns (uint8[2] memory) {
        require(gameId < TOTAL_GAMES, "Invalid game ID");
        return games[gameId].result;
    }

    // Funciones de cálculo de puntos
    function calculatePoints(uint256 tokenId, uint8 index) public view returns (uint8) {
        require(games[predictions[tokenId][index].id].set, "Result not set for this game");
        
        uint8 points = abs(int8(7 - (
            calculateDifferencePoints(predictions[tokenId][index].result[0], games[predictions[tokenId][index].id].result[0]) +
            calculateDifferencePoints(predictions[tokenId][index].result[1], games[predictions[tokenId][index].id].result[1])
        )));
        
        if (getLocalEmpateVisitante(
            predictions[tokenId][index].result[0],
            predictions[tokenId][index].result[1]
        ) == getLocalEmpateVisitante(
            games[predictions[tokenId][index].id].result[0],
            games[predictions[tokenId][index].id].result[1]
        )) {
            points += 2;
        }
        
        return points;
    }

    function calculateDifferencePoints(uint8 goalsP, uint8 goalsR) public pure returns(uint8) {
        return abs(int8(goalsR) - int8(goalsP));
    }

    function getLocalEmpateVisitante(uint8 goalsL, uint8 goalsV) public pure returns(uint8) {
        return (goalsL > goalsV) ? LOCAL : (goalsL == goalsV) ? EMPATE : VISITANTE;
    }

    function abs(int8 x) public pure returns (uint8) {
        return uint8(x >= 0 ? x : -x);
    }


    // Funciones para las predicciones de ganadores
    function predictWinners(uint256 tokenId, uint8[4] calldata teams) external onlyCartonOwner(tokenId) {
        require(!winnersPredictions[tokenId].set, "Winners already predicted");


        require(all_different(teams), "Duplicate team ID");
        
        // Validar que los IDs de equipos sean válidos
        for (uint i = 0; i < MAX_WINNERS; i++) {
            require(teams[i] < MAX_TEAM_ID, "Invalid team ID");
        }
        
        winnersPredictions[tokenId] = WinnersPrediction({
            teams: teams,
            set: true
        });
        
        emit WinnersPredicted(msg.sender, tokenId, teams);
    }

    function all_different(uint8[4] memory teams) public pure returns (bool) {
        for (uint i = 0; i < MAX_WINNERS; i++) {
            for (uint j = i + 1; j < MAX_WINNERS; j++) {
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

    // Función para establecer los ganadores oficiales (solo para el dueño)
    function setOfficialWinners(uint8[4] calldata teams) external onlyOwner {
        require(!officialWinners.set, "Official winners already set");
        
        // Validar que los IDs de equipos sean válidos y no haya duplicados
        for (uint i = 0; i < MAX_WINNERS; i++) {
            require(teams[i] < MAX_TEAM_ID, "Invalid team ID");
            for (uint j = i + 1; j < MAX_WINNERS; j++) {
                require(teams[i] != teams[j], "Duplicate team ID");
            }
        }
        
        officialWinners = OfficialWinners({
            teams: teams,
            set: true
        });
        
        emit OfficialWinnersSet(teams);
    }

    // Función para calcular los puntos de los ganadores
    function calculateWinnerPoints(uint256 tokenId) public view returns (uint256) {
        require(officialWinners.set, "Official winners not set yet");
        require(winnersPredictions[tokenId].set, "No winners prediction for this token");
        
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

    // Función para calcular el total de puntos (partidos + ganadores)
    function calculateTotalPoints(uint256 tokenId) public view returns (uint256) {
        uint256 gamePoints = 0;
        uint256 winnerPoints = 0;
        
        // Calcular puntos de los partidos
        for (uint8 i = 0; i < TOTAL_GAMES; i++) {
            gamePoints += calculatePoints(tokenId, i);
        }
        
        // Si los ganadores están establecidos, sumar los puntos de los ganadores
        if (officialWinners.set) {
            winnerPoints = calculateWinnerPoints(tokenId);
        }
        
        return gamePoints + winnerPoints;
    }

    // Función para actualizar los puntos totales de un cartón
    function updateTotalPoints(uint256 tokenId) external {
        require(used[tokenId], "No predictions submitted for this token");
        uint256 newPoints = calculateTotalPoints(tokenId);
        totalPoints[tokenId] = newPoints;
        emit PointsUpdated(tokenId, newPoints);
    }
}