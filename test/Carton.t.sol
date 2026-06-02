// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { BaseTest } from "./BaseTest.sol";
import { MockERC20 } from "./mocks/MockERC20.sol";
import { Treasury } from "../src/Treasury.sol";
import { Carton } from "../src/Carton.sol";
import { Predictions } from "../src/Predictions.sol";

contract NonTreasuryContract { }

contract CartonTest is BaseTest {
    event URIUpdated(string oldURI, string newURI);
    event TokenPriceUpdated(uint256 indexed tournamentId, address indexed token, uint256 oldPrice, uint256 newPrice);
    event ActiveTournamentChanged(uint256 indexed oldTournamentId, uint256 indexed newTournamentId);

    address user = address(0xBEEF);

    // forge-lint: disable-next-line(mixed-case-variable)
    MockERC20 USDC;
    Treasury treasury;

    function setUp() public override {
        super.setUp();
        USDC = new MockERC20("USDC", "USDC", 6);
    }

    function _deployTreasuryAndRegister(uint256 tournamentId, address engine)
        internal
        returns (Treasury deployedTreasury)
    {
        deployedTreasury = new Treasury(admin, address(carton), 500);

        vm.startPrank(admin);
        carton.setTreasuryAddress(address(deployedTreasury));
        deployedTreasury.setSupportedPrizeToken(address(USDC), true);
        deployedTreasury.registerTournament(tournamentId, engine);
        vm.stopPrank();
    }

    function testPausePreventsTransfers() public {
        _mintCarton(user, 10);

        vm.prank(pauser);
        carton.pause();

        vm.prank(user);
        vm.expectRevert();
        carton.safeTransferFrom(user, address(this), 10, 1, "");
    }

    function testMint_RevertAmountNotOne() public {
        vm.prank(minter);
        vm.expectRevert(Carton.CartonAmountMustBeOne.selector);
        carton.mint(user, 2, "");
    }

    function testMintBatch_RevertAmountNotOne() public {
        uint256[] memory amounts = _createUint256Array(1, 2, 0);

        assembly {
            mstore(amounts, 2)
        }

        vm.prank(minter);
        vm.expectRevert(Carton.CartonAmountMustBeOne.selector);
        carton.mintBatch(user, amounts, "");
    }

    function testMintForTournament_RevertAmountNotOne() public {
        vm.prank(minter);
        vm.expectRevert(Carton.CartonAmountMustBeOne.selector);
        carton.mintForTournament(user, 1, 2, "");
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

    function testSetURI_EmitsURIUpdated() public {
        string memory newURI = "https://newuri.com/{id}";

        vm.expectEmit(false, false, false, true);
        emit URIUpdated("", newURI);

        vm.prank(uriSetter);
        carton.setURI(newURI);
    }

    function testSetMetadataVariantCount_OnlyAdmin() public {
        vm.prank(unauthorized);
        vm.expectRevert();
        carton.setMetadataVariantCount(48);

        vm.prank(admin);
        carton.setMetadataVariantCount(48);

        assertEq(carton.metadataVariantCount(), 48);
    }

    function testUri_FallsBackToLegacyTemplateWhenVariantsDisabled() public {
        string memory newURI = "https://newuri.com/{id}";

        vm.prank(uriSetter);
        carton.setURI(newURI);

        vm.prank(minter);
        uint256 tokenId = carton.mint(user, 1, "");

        assertEq(carton.variantByTokenId(tokenId), 0);
        assertEq(carton.uri(tokenId), newURI);
    }

    function testMint_AssignsVariantWhenConfigured() public {
        vm.prank(admin);
        carton.setMetadataVariantCount(48);

        vm.prank(minter);
        uint256 tokenId = carton.mint(user, 1, "");

        uint256 variantId = carton.variantByTokenId(tokenId);
        assertGe(variantId, 1);
        assertLe(variantId, 48);
    }

    function testMintBatch_AssignsVariantsWhenConfigured() public {
        vm.prank(admin);
        carton.setMetadataVariantCount(96);

        vm.prank(minter);
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1;
        amounts[1] = 1;
        uint256[] memory ids = carton.mintBatch(user, amounts, "");

        uint256 firstVariant = carton.variantByTokenId(ids[0]);
        uint256 secondVariant = carton.variantByTokenId(ids[1]);

        assertGe(firstVariant, 1);
        assertLe(firstVariant, 96);
        assertGe(secondVariant, 1);
        assertLe(secondVariant, 96);
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

    function testBuyCartonWithToken() public {
        vm.startPrank(admin);
        carton.setAcceptedToken(address(USDC), true);
        carton.setTokenPrice(address(USDC), 1000000);
        carton.setMetadataVariantCount(48);
        vm.stopPrank();

        USDC.mint(user, 1000000);
        uint256 treasuryBalanceBefore = USDC.balanceOf(address(carton)); // NOTE: carton for now
        vm.startPrank(user);
        USDC.approve(address(carton), 1000000);
        carton.buyCartonWithToken(address(USDC));
        vm.stopPrank();

        assertEq(carton.balanceOf(user, 1), 1);
        assertGe(carton.variantByTokenId(1), 1);
        assertLe(carton.variantByTokenId(1), 48);
        assertEq(USDC.balanceOf(address(carton)), treasuryBalanceBefore + 1000000);
    }

    function test_BuyCartonWithUSDT_RevertNotAccepted() public {
        // forge-lint: disable-next-line(mixed-case-variable)
        MockERC20 USDT = new MockERC20("Tether", "USDT", 6);
        USDT.mint(user1, 1_000_000);
        vm.prank(user1);
        USDT.approve(address(carton), 1_000_000);

        vm.prank(user1);
        vm.expectRevert(Carton.TokenNotAccepted.selector);
        carton.buyCartonWithToken(address(USDT));
    }

    function testSetCartonTokenPrice() public {
        vm.prank(admin);
        uint256 price = 1000000;
        carton.setTokenPrice(address(USDC), price);
        assertEq(carton.tokenPricesByTournament(1, address(USDC)), price);
    }

    function testSetCartonTokenPrice_EmitsTokenPriceUpdated() public {
        uint256 initialPrice = 1000000;
        uint256 updatedPrice = 2000000;

        vm.prank(admin);
        carton.setTokenPrice(address(USDC), initialPrice);

        vm.expectEmit(true, true, false, true);
        emit TokenPriceUpdated(1, address(USDC), initialPrice, updatedPrice);

        vm.prank(admin);
        carton.setTokenPrice(address(USDC), updatedPrice);
    }

    function testSetCartonTokenPrice_RevertWhenActiveTournamentNotSet() public {
        Carton freshCarton = new Carton(admin, pauser, minter);

        vm.prank(admin);
        vm.expectRevert(Carton.ActiveTournamentNotSet.selector);
        freshCarton.setTokenPrice(address(USDC), 1000000);
    }

    function testSetCartonTokenPrice_RevertWhenExplicitTournamentIsZero() public {
        vm.prank(admin);
        vm.expectRevert(Carton.ZeroTournamentId.selector);
        carton.setTokenPrice(0, address(USDC), 1000000);
    }

    function testOnlyAdmingCanSetCartonTokenPrice() public {
        vm.prank(user);
        vm.expectRevert();
        uint256 price = 1000000;
        carton.setTokenPrice(address(USDC), price);
    }

    function testWithdraw() public {
        address recipient = makeAddr("recipient");

        vm.startPrank(admin);
        carton.grantRole(carton.DEFAULT_ADMIN_ROLE(), recipient);
        vm.stopPrank();

        vm.deal(address(carton), 0.1 ether);

        uint256 balanceBefore = recipient.balance;
        vm.expectEmit(true, false, false, true);
        emit RescueETHWithdrawn(recipient, 0.1 ether);
        vm.prank(recipient);
        carton.withdraw();

        assertEq(address(carton).balance, 0, "Contract balance should be 0");
        assertEq(recipient.balance, balanceBefore + 0.1 ether, "Recipient should receive funds");
    }

    function testWithdrawNoFunds() public {
        vm.prank(admin);
        vm.expectRevert(Carton.NoFundsToWithdraw.selector);
        carton.withdraw();
    }

    function testOnlyAdminCanWithdraw() public {
        vm.prank(user);
        vm.expectRevert();
        carton.withdraw();
    }

    function testWithdrawToken() public {
        address recipient = makeAddr("tokenRecipient");

        vm.startPrank(admin);
        carton.grantRole(carton.DEFAULT_ADMIN_ROLE(), recipient);
        vm.stopPrank();

        USDC.mint(address(carton), 1_000_000);

        vm.expectEmit(true, true, false, true);
        emit RescueTokenWithdrawn(recipient, address(USDC), 1_000_000);
        vm.prank(recipient);
        carton.withdrawToken(address(USDC));

        assertEq(USDC.balanceOf(address(carton)), 0, "Carton should have no token balance after rescue");
        assertEq(USDC.balanceOf(recipient), 1_000_000, "Recipient should receive rescued tokens");
    }

    function testWithdrawTokenNoFunds() public {
        vm.prank(admin);
        vm.expectRevert(Carton.NoTokensToWithdraw.selector);
        carton.withdrawToken(address(USDC));
    }

    function testGetUserTokens() public {
        uint256[] memory emptyTokens = carton.getUserTokens(user);
        assertEq(emptyTokens.length, 0, "User should have no tokens initially");

        vm.startPrank(minter);
        carton.mint(user, 1, "");
        vm.stopPrank();

        uint256[] memory oneToken = carton.getUserTokens(user);
        assertEq(oneToken.length, 1, "User should have one token");

        vm.startPrank(minter);
        carton.mint(user, 1, "");
        vm.stopPrank();

        uint256[] memory twoTokens = carton.getUserTokens(user);
        assertEq(twoTokens.length, 2, "User should have two tokens");
    }

    function testGetUserTokens_TransferKeepsListsInSync() public {
        vm.startPrank(minter);
        uint256 firstTokenId = carton.mint(user, 1, "");
        uint256 secondTokenId = carton.mint(user, 1, "");
        vm.stopPrank();

        vm.prank(user);
        carton.safeTransferFrom(user, user2, firstTokenId, 1, "");

        uint256[] memory senderTokens = carton.getUserTokens(user);
        uint256[] memory receiverTokens = carton.getUserTokens(user2);

        assertEq(senderTokens.length, 1, "Sender should keep one token");
        assertEq(senderTokens[0], secondTokenId, "Sender should keep the remaining token");
        assertEq(receiverTokens.length, 1, "Receiver should get one token");
        assertEq(receiverTokens[0], firstTokenId, "Receiver should get the transferred token");
    }

    event CartonPurchased(address indexed buyer, uint256 indexed tokenId, uint256 price);
    event TreasuryAddressChanged(address indexed oldTreasury, address indexed newTreasury);
    event RescueETHWithdrawn(address indexed recipient, uint256 amount);
    event RescueTokenWithdrawn(address indexed recipient, address indexed token, uint256 amount);
    event AcceptedTokenSet(address indexed token, bool accepted);

    // ========== TREASURY INTEGRATION TESTS ==========

    function testSetTreasuryAddress() public {
        treasury = new Treasury(admin, address(carton), 500);

        vm.expectEmit(true, true, false, true);
        emit TreasuryAddressChanged(address(0), address(treasury));

        vm.prank(admin);
        carton.setTreasuryAddress(address(treasury));

        assertEq(address(carton.treasury()), address(treasury));
    }

    function testSetTreasuryAddress_OnlyAdmin() public {
        treasury = new Treasury(admin, address(carton), 500);

        vm.prank(user);
        vm.expectRevert();
        carton.setTreasuryAddress(address(treasury));
    }

    function testSetTreasuryAddress_RevertZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert(Carton.ZeroTreasuryAddress.selector);
        carton.setTreasuryAddress(address(0));
    }

    function testSetTreasuryAddress_RevertEOA() public {
        vm.prank(admin);
        vm.expectRevert(Carton.TreasuryAddressNotContract.selector);
        carton.setTreasuryAddress(user);
    }

    function testSetTreasuryAddress_RevertInvalidInterface() public {
        NonTreasuryContract invalidTreasury = new NonTreasuryContract();

        vm.prank(admin);
        vm.expectRevert(Carton.InvalidTreasuryContract.selector);
        carton.setTreasuryAddress(address(invalidTreasury));
    }

    function testSetActiveTournament() public {
        vm.prank(admin);
        carton.setActiveTournament(1);

        assertEq(carton.activeTournamentId(), 1);
    }

    function testSetActiveTournament_EmitsActiveTournamentChanged() public {
        vm.expectEmit(true, true, false, true);
        emit ActiveTournamentChanged(1, 7);

        vm.prank(admin);
        carton.setActiveTournament(7);
    }

    function testMintStoresTokenTournamentId() public {
        vm.prank(admin);
        carton.setActiveTournament(7);

        vm.prank(minter);
        uint256 tokenId = carton.mint(user, 1, "");

        assertEq(carton.tokenTournamentId(tokenId), 7);
    }

    function testSetActiveTournament_OnlyAdmin() public {
        vm.prank(user);
        vm.expectRevert();
        carton.setActiveTournament(1);
    }

    function testSetActiveTournament_RevertZero() public {
        vm.prank(admin);
        vm.expectRevert(Carton.ZeroTournamentId.selector);
        carton.setActiveTournament(0);
    }

    function testBuyCartonWithToken_WithTreasuryIntegration() public {
        // Setup Treasury
        treasury = _deployTreasuryAndRegister(1, address(predictions));

        vm.startPrank(admin);
        carton.setAcceptedToken(address(USDC), true);
        carton.setTokenPrice(address(USDC), 1000000);
        carton.setActiveTournament(1);

        // Grant FUND_DEPOSITOR_ROLE to Carton
        treasury.grantRole(treasury.FUND_DEPOSITOR_ROLE(), address(carton));
        vm.stopPrank();

        // Setup user with USDC
        USDC.mint(user, 1000000);

        vm.startPrank(user);
        USDC.approve(address(carton), 1000000);
        carton.buyCartonWithToken(address(USDC));
        vm.stopPrank();

        // Verify carton was minted
        assertEq(carton.balanceOf(user, 1), 1);
        assertEq(carton.tokenTournamentId(1), 1);

        // Verify USDC was split between prize pool and reserve inside Treasury
        assertEq(treasury.prizePools(1, address(USDC)), 950000);
        assertEq(treasury.globalReserve(address(USDC)), 50000);
        assertEq(USDC.balanceOf(address(carton)), 0); // Carton should have 0 balance
        assertEq(USDC.balanceOf(address(treasury)), 1000000); // Treasury should have the tokens
    }

    function testBuyCartonWithToken_RevertsAfterSalesClose() public {
        treasury = _deployTreasuryAndRegister(1, address(predictions));

        vm.startPrank(admin);
        carton.setAcceptedToken(address(USDC), true);
        carton.setTokenPrice(address(USDC), 1000000);
        carton.setActiveTournament(1);
        treasury.grantRole(treasury.TOURNAMENT_MANAGER_ROLE(), admin);
        treasury.closeSales(1);
        vm.stopPrank();

        USDC.mint(user, 1000000);

        vm.startPrank(user);
        USDC.approve(address(carton), 1000000);
        vm.expectRevert(Carton.TournamentSalesClosed.selector);
        carton.buyCartonWithToken(address(USDC));
        vm.stopPrank();
    }

    function testSetAcceptedToken_RevertsForUnsupportedTreasuryToken() public {
        MockERC20 unsupportedToken = new MockERC20("Unsupported", "BAD", 6);
        treasury = _deployTreasuryAndRegister(1, address(predictions));

        vm.prank(admin);
        vm.expectRevert(Carton.UnsupportedPrizeToken.selector);
        carton.setAcceptedToken(address(unsupportedToken), true);
    }

    function testSetAcceptedToken_RevertsForZeroAddress() public {
        vm.prank(admin);
        vm.expectRevert(Carton.ZeroTokenAddress.selector);
        carton.setAcceptedToken(address(0), true);
    }

    function testSetAcceptedToken_EmitsAcceptedTokenSet() public {
        vm.expectEmit(true, true, false, true);
        emit AcceptedTokenSet(address(USDC), true);

        vm.prank(admin);
        carton.setAcceptedToken(address(USDC), true);

        assertTrue(carton.acceptedTokens(address(USDC)));
    }

    function testSetAcceptedToken_EmitsAcceptedTokenSet_Disabling() public {
        vm.prank(admin);
        carton.setAcceptedToken(address(USDC), true);

        vm.expectEmit(true, true, false, true);
        emit AcceptedTokenSet(address(USDC), false);

        vm.prank(admin);
        carton.setAcceptedToken(address(USDC), false);

        assertFalse(carton.acceptedTokens(address(USDC)));
    }

    function testSetAcceptedToken_OnlyAdmin() public {
        vm.prank(user);
        vm.expectRevert();
        carton.setAcceptedToken(address(USDC), true);
    }

    function testBuyCartonWithToken_WithoutTreasuryConfigured() public {
        // Should work without Treasury (backward compatibility)
        vm.startPrank(admin);
        carton.setAcceptedToken(address(USDC), true);
        carton.setTokenPrice(address(USDC), 1000000);
        vm.stopPrank();

        USDC.mint(user, 1000000);

        vm.startPrank(user);
        USDC.approve(address(carton), 1000000);
        carton.buyCartonWithToken(address(USDC));
        vm.stopPrank();

        assertEq(carton.balanceOf(user, 1), 1);
        assertEq(USDC.balanceOf(address(carton)), 1000000); // Stays in Carton contract
    }

    function testMintForTournamentStoresExplicitTournamentId() public {
        vm.prank(minter);
        uint256 tokenId = carton.mintForTournament(user, 7, 1, "");

        assertEq(carton.tokenTournamentId(tokenId), 7);
    }

    function testBuyCartonWithToken_ExplicitTournamentUsesTargetTournament() public {
        treasury = _deployTreasuryAndRegister(1, address(predictions));
        Predictions predictionsTournament2 = new Predictions(address(carton), 2);

        vm.startPrank(admin);
        treasury.registerTournament(2, address(predictionsTournament2));
        treasury.grantRole(treasury.FUND_DEPOSITOR_ROLE(), address(carton));
        carton.setAcceptedToken(address(USDC), true);
        carton.setTokenPrice(2, address(USDC), 2000000);
        vm.stopPrank();

        USDC.mint(user, 2000000);

        vm.startPrank(user);
        USDC.approve(address(carton), 2000000);
        carton.buyCartonWithToken(2, address(USDC));
        vm.stopPrank();

        assertEq(carton.balanceOf(user, 1), 1);
        assertEq(carton.tokenTournamentId(1), 2);
        assertEq(treasury.prizePools(2, address(USDC)), 1900000);
        assertEq(treasury.globalReserve(address(USDC)), 100000);
    }

    function testBuyCartonWithToken_RevalidatesSupportedTokenInTreasury() public {
        MockERC20 unsupportedToken = new MockERC20("Unsupported", "BAD", 6);

        vm.startPrank(admin);
        carton.setAcceptedToken(address(unsupportedToken), true);
        carton.setTokenPrice(address(unsupportedToken), 1000000);
        treasury = new Treasury(admin, address(carton), 500);
        carton.setTreasuryAddress(address(treasury));
        treasury.registerTournament(1, address(predictions));
        treasury.grantRole(treasury.FUND_DEPOSITOR_ROLE(), address(carton));
        carton.setActiveTournament(1);
        vm.stopPrank();

        unsupportedToken.mint(user, 1000000);

        vm.startPrank(user);
        unsupportedToken.approve(address(carton), 1000000);
        vm.expectRevert(Carton.UnsupportedPrizeToken.selector);
        carton.buyCartonWithToken(address(unsupportedToken));
        vm.stopPrank();
    }

    function testBuyCartonWithToken_RevertsForUnregisteredTournament() public {
        treasury = new Treasury(admin, address(carton), 500);

        vm.startPrank(admin);
        carton.setTreasuryAddress(address(treasury));
        treasury.setSupportedPrizeToken(address(USDC), true);
        carton.setAcceptedToken(address(USDC), true);
        carton.setTokenPrice(2, address(USDC), 1000000);
        vm.stopPrank();

        USDC.mint(user, 1000000);

        vm.startPrank(user);
        USDC.approve(address(carton), 1000000);
        vm.expectRevert(Carton.TournamentNotRegistered.selector);
        carton.buyCartonWithToken(2, address(USDC));
        vm.stopPrank();
    }
}
