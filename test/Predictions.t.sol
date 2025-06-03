// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Test.sol";
import "../src/Carton.sol";
import "../src/Predictions.sol";

contract PredictionsTest is Test {
    Carton      cart;
    Predictions preds;
    address     user = address(0xABCD);
    uint256     constant TOKEN_ID = 7;

    function setUp() public {
        // 1) Deploy Carton y otorgamos todos los roles a este contrato de test
        cart = new Carton(address(this), address(this), address(this));
        // 2) Mint un cartón (ERC-1155) al usuario ‘user’
        cart.mint(user, TOKEN_ID, 1, "");

        // 3) Deploy Predictions apuntando a Carton
        preds = new Predictions(address(cart));
    }

    function testSubmitAndReadPicks() public {
        // 4) Creamos un array de Predictions.Game de longitud 4
        Predictions.Game[] memory arr = new Predictions.Game[](4);

        // Inicializamos cada struct usando la sintaxis Predictions.Game({ ... })
        arr[0] = Predictions.Game({
            id:      1,
            team1:   1,
            team2:   2,
            result:  [uint8(0), uint8(1)],
            set:     false
        });
        arr[1] = Predictions.Game({
            id:      2,
            team1:   3,
            team2:   4,
            result:  [uint8(1), uint8(0)],
            set:     false
        });
        arr[2] = Predictions.Game({
            id:      3,
            team1:   5,
            team2:   6,
            result:  [uint8(2), uint8(1)],
            set:     false
        });
        arr[3] = Predictions.Game({
            id:      4,
            team1:   7,
            team2:   8,
            result:  [uint8(0), uint8(0)],
            set:     false
        });

        // 5) Simulamos que ‘user’ llama a submitPredictions
        vm.prank(user);
        preds.submitPrediction(TOKEN_ID, arr);

        // 6) Verificamos que getPrediction devuelve lo almacenado
        Predictions.Game[] memory stored = preds.getPrediction(TOKEN_ID);
        assertEq(stored.length, 4, "length should be 4");

        // Comprobamos un par de campos de stored[0]
        assertEq(stored[0].id,        1,  "stored[0].id debe ser 1");
        assertEq(stored[0].team1,     1,  "stored[0].team1 debe ser 1");
        assertEq(stored[0].team2,     2,  "stored[0].team2 debe ser 2");
        assertEq(stored[0].result[0], 0,  "stored[0].result[0] debe ser 0");
        assertEq(stored[0].result[1], 1,  "stored[0].result[1] debe ser 1");
        assertEq(stored[0].set,      false, "stored[0].set debe ser false");

        // Comprobamos también stored[3]
        assertEq(stored[3].id,        4,   "stored[3].id debe ser 4");
        assertEq(stored[3].team1,     7,   "stored[3].team1 debe ser 7");
        assertEq(stored[3].team2,     8,   "stored[3].team2 debe ser 8");
        assertEq(stored[3].result[0], 0,   "stored[3].result[0] debe ser 0");
        assertEq(stored[3].result[1], 0,   "stored[3].result[1] debe ser 0");
        assertEq(stored[3].set,      false, "stored[3].set debe ser false");

        // 7) Un segundo envío con el mismo tokenId debe revertir
        vm.prank(user);
        vm.expectRevert();
        preds.submitPrediction(TOKEN_ID, arr);
    }

    function testOnlyOwnerCannotSubmit() public {
        // 8) Creamos otro array de Predictions.Game de longitud 4
        Predictions.Game[] memory arr2 = new Predictions.Game[](4);

        arr2[0] = Predictions.Game({
            id:      1,
            team1:   1,
            team2:   2,
            result:  [uint8(0), uint8(1)],
            set:     false
        });
        arr2[1] = Predictions.Game({
            id:      2,
            team1:   3,
            team2:   4,
            result:  [uint8(1), uint8(0)],
            set:     false
        });
        arr2[2] = Predictions.Game({
            id:      3,
            team1:   5,
            team2:   6,
            result:  [uint8(2), uint8(1)],
            set:     false
        });
        arr2[3] = Predictions.Game({
            id:      4,
            team1:   7,
            team2:   8,
            result:  [uint8(0), uint8(0)],
            set:     false
        });

        // 9) Simulamos que quien NO es dueño del NFT llama y debe revertir
        vm.prank(address(0xDEAD));
        vm.expectRevert();
        preds.submitPrediction(TOKEN_ID, arr2);
    }
}
