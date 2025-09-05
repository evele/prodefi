// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./BaseTest.sol";

contract CartonTest is BaseTest {
    address user = address(0xBEEF);

    function setUp() public override {
        super.setUp();
        // Additional setup specific to Carton tests if needed
    }

    function testMintBatchAndSupply() public {
        uint256[] memory ids = _createUint256Array(1, 2, 0);
        uint256[] memory amounts = _createUint256Array(3, 5, 0);

        // Resize arrays to 2 elements
        assembly {
            mstore(ids, 2)
            mstore(amounts, 2)
        }

        _mintBatchCartons(user, ids, amounts);

        assertEq(carton.totalSupply(1), 3, "ID=1 supply should be 3");
        assertEq(carton.balanceOf(user, 2), 5, "user balance for ID=2 should be 5");
    }

    function testPausePreventsTransfers() public {
        _mintCarton(user, 10);

        vm.prank(pauser);
        carton.pause();

        vm.prank(user);
        vm.expectRevert();
        carton.safeTransferFrom(user, address(this), 10, 1, "");
    }

    function testBurn() public {
        vm.prank(minter);
        uint256 tokenId = carton.mint(user, 2, "");

        vm.prank(user);
        carton.burn(user, tokenId, 2);

        assertEq(carton.totalSupply(tokenId), 0, "supply after burn should be 0");
    }

    // Access Control Tests
    function testOnlyMinterCanMint() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        carton.mint(user, 1, "");

        _mintCarton(user, 1);
        _assertOwnsCarton(user, 1);
    }

    function testOnlyMinterCanMintBatch() public {
        uint256[] memory ids = _createUint256Array(1, 0, 0);
        uint256[] memory amounts = _createUint256Array(1, 0, 0);

        // Resize to 1 element
        assembly {
            mstore(ids, 1)
            mstore(amounts, 1)
        }

        vm.prank(unauthorized);
        vm.expectRevert();
        carton.mintBatch(user, amounts, "");

        _mintBatchCartons(user, ids, amounts);
        _assertOwnsCarton(user, 1);
    }

    function testOnlyPauserCanPause() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        carton.pause();

        vm.prank(pauser);
        carton.pause();
        assertTrue(carton.paused());
    }

    function testOnlyPauserCanUnpause() public {
        vm.prank(pauser);
        carton.pause();

        vm.prank(unauthorized);
        vm.expectRevert();
        carton.unpause();

        vm.prank(pauser);
        carton.unpause();
        assertFalse(carton.paused());
    }

    function testOnlyUriSetterCanSetURI() public {
        string memory newURI = "https://newuri.com/{id}";

        vm.prank(unauthorized);
        vm.expectRevert();
        carton.setURI(newURI);

        vm.prank(uriSetter);
        carton.setURI(newURI);
    }

    function testAdminCanGrantRoles() public {
        address newMinter = address(0x1234);
        bytes32 minterRole = carton.MINTER_ROLE();

        _assertNotHasRole(carton.DEFAULT_ADMIN_ROLE(), unauthorized);

        vm.prank(unauthorized);
        vm.expectRevert();
        carton.grantRole(minterRole, newMinter);

        vm.prank(admin);
        carton.grantRole(minterRole, newMinter);

        vm.prank(newMinter);
        carton.mint(user, 1, "");
        _assertOwnsCarton(user, 1);
    }

    function testAdminCanRevokeRoles() public {
        bytes32 minterRole = carton.MINTER_ROLE();

        _assertHasRole(carton.DEFAULT_ADMIN_ROLE(), admin);

        vm.prank(admin);
        carton.revokeRole(minterRole, minter);

        _assertNotHasRole(minterRole, minter);

        vm.prank(minter);
        vm.expectRevert();
        carton.mint(user, 1, "");
    }

    function testSupportsInterface() public view {
        assertTrue(carton.supportsInterface(0xd9b67a26)); // ERC1155
        assertTrue(carton.supportsInterface(0x7965db0b)); // AccessControl
        assertTrue(carton.supportsInterface(0x01ffc9a7)); // ERC165
    }

    function testBuyCarton() public {
        vm.prank(admin);
        carton.setCartonPrice(0.1 ether);

        vm.deal(user, 1 ether);
        vm.prank(user);
        carton.buyCarton{value: 0.1 ether}();

        assertEq(carton.balanceOf(user, 1), 1, "User should own carton ID 1");
        assertEq(address(carton).balance, 0.1 ether, "Contract should have received payment");
    }

    function testBuyCartonWithExcess() public {
        vm.prank(admin);
        carton.setCartonPrice(0.1 ether);

        vm.deal(user, 1 ether);
        uint256 userBalanceBefore = user.balance;

        vm.prank(user);
        carton.buyCarton{value: 0.15 ether}();

        assertEq(carton.balanceOf(user, 1), 1, "User should own carton ID 1");
        assertEq(address(carton).balance, 0.1 ether, "Contract should have exact price");
        assertEq(user.balance, userBalanceBefore - 0.1 ether, "User should get refund");
    }

    function testBuyCartonInsufficientPayment() public {
        vm.prank(admin);
        carton.setCartonPrice(0.1 ether);

        vm.deal(user, 0.05 ether);
        vm.prank(user);
        vm.expectRevert("Insufficient payment");
        carton.buyCarton{value: 0.05 ether}();
    }

    function testBuyCartonPriceNotSet() public {
        vm.deal(user, 1 ether);
        vm.prank(user);
        vm.expectRevert("Price not set");
        carton.buyCarton{value: 0.1 ether}();
    }

    function testSetCartonPrice() public {
        vm.prank(admin);
        carton.setCartonPrice(0.1 ether);
        assertEq(carton.cartonPrice(), 0.1 ether, "Price should be set");
    }

    function testOnlyAdminCanSetPrice() public {
        vm.prank(user);
        vm.expectRevert();
        carton.setCartonPrice(0.1 ether);
    }

    function testWithdraw() public {
        address recipient = makeAddr("recipient");

        vm.startPrank(admin);
        carton.setCartonPrice(0.1 ether);
        carton.grantRole(carton.DEFAULT_ADMIN_ROLE(), recipient);
        vm.stopPrank();

        vm.deal(user, 1 ether);
        vm.prank(user);
        carton.buyCarton{value: 0.1 ether}();

        uint256 balanceBefore = recipient.balance;
        vm.prank(recipient);
        carton.withdraw();

        assertEq(address(carton).balance, 0, "Contract balance should be 0");
        assertEq(recipient.balance, balanceBefore + 0.1 ether, "Recipient should receive funds");
    }

    function testWithdrawNoFunds() public {
        vm.prank(admin);
        vm.expectRevert("No funds to withdraw");
        carton.withdraw();
    }

    function testOnlyAdminCanWithdraw() public {
        vm.prank(user);
        vm.expectRevert();
        carton.withdraw();
    }

    function testGetUserTokens() public {
        uint256[] memory emptyTokens = carton.getUserTokens(user);
        assertEq(emptyTokens.length, 0, "User should have no tokens initially");
    
        vm.prank(admin);
        carton.setCartonPrice(0.1 ether);
        
        vm.deal(user, 1 ether);
        vm.prank(user);
        carton.buyCarton{value: 0.1 ether}();

        uint256[] memory oneToken = carton.getUserTokens(user);
        assertEq(oneToken.length, 1, "User should have one token");

        vm.prank(user);
        carton.buyCarton{value: 0.1 ether}();
        uint256[] memory twoTokens = carton.getUserTokens(user);
        assertEq(twoTokens.length, 2, "User should have two tokens");

    }

    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event CartonPurchased(address indexed buyer, uint256 indexed tokenId, uint256 price);
}
