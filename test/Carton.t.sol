// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Test.sol";
import "../src/Carton.sol";

contract CartonTest is Test {
    Carton nft;
    address user = address(0xBEEF);

    function setUp() public {
        // Asignamos todos los roles a este mismo contrato de test
        nft = new Carton(address(this), address(this), address(this));
    }

    function testMintBatchAndSupply() public {
        // Preparamos arrays dinámicos en memoria
        uint256[] memory ids = new uint256[](2);
        ids[0] = 1;
        ids[1] = 2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 3;
        amounts[1] = 5;

        // Mint batch
        nft.mintBatch(user, ids, amounts, "");

        // Comprobamos supply y balance
        assertEq(nft.totalSupply(1), 3, "supply de ID=1 debe ser 3");
        assertEq(nft.balanceOf(user, 2), 5, "balance de user en ID=2 debe ser 5");
    }

     function testPausePreventsTransfers() public {
        // Mint primero para tener tokens disponibles
        nft.mint(user, 10, 1, "");
        // Pausamos el contrato
        nft.pause();

        // Simulamos que el user intenta transferir y debe revertir
        vm.prank(user);
        vm.expectRevert();
        nft.safeTransferFrom(user, address(this), 10, 1, "");
    }

    function testBurn() public {
        // Mint y luego quemamos
        nft.mint(user, 42, 2, "");

        vm.prank(user);
        nft.burn(user, 42, 2);

        // Tras quemar, el totalSupply debe bajarse a 0
        assertEq(nft.totalSupply(42), 0, "supply tras burn debe ser 0");
    }
}
