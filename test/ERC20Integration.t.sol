// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Test.sol";
import {Carton} from "../src/Carton.sol";
import {Treasury} from "../src/Treasury.sol";
import {Predictions} from "../src/Predictions.sol";
import {MockERC20} from "../src/mocks/MockERC20.sol";

contract ERC20IntegrationTest is Test {
    Carton public carton;
    Treasury public treasury;
    Predictions public predictions;
    MockERC20 public usdc;

    address public owner = address(1);
    address public user1 = address(2);
    uint256 public constant TOURNAMENT_ID = 1;

    function setUp() public {
        vm.startPrank(owner);

        // Deploy contracts
        carton = new Carton(owner, owner, owner);
        predictions = new Predictions(address(carton));
        treasury = new Treasury(owner, address(carton), address(predictions));
        usdc = new MockERC20("USD Coin", "USDC", 6);

        // Setup Carton
        carton.setTreasuryAddress(address(treasury));
        carton.setActiveTournament(TOURNAMENT_ID);
        carton.setAcceptedToken(address(usdc), true);
        carton.setTokenPrice(address(usdc), 100 * 10 ** 6); // 100 USDC

        // Setup Treasury roles
        treasury.grantRole(treasury.FUND_DEPOSITOR_ROLE(), address(carton));
        treasury.grantRole(treasury.TOURNAMENT_MANAGER_ROLE(), owner);

        // Setup prize distributions
        uint8[] memory distribution = new uint8[](4);
        distribution[0] = 50;
        distribution[1] = 30;
        distribution[2] = 15;
        distribution[3] = 5;
        treasury.setPrizeDistribution(TOURNAMENT_ID, address(usdc), distribution);

        // Mint USDC to user1 for testing
        usdc.mint(user1, 1000 * 10 ** 6);

        vm.stopPrank();
    }

    function test_BuyCartonWithETH_RevertsAfterUsdcOnlyCleanup() public {
        vm.startPrank(user1);
        vm.deal(user1, 1 ether);
        vm.expectRevert(Carton.EthPurchaseDisabled.selector);
        carton.buyCarton{value: 0.1 ether}();

        vm.stopPrank();
    }

    function test_BuyCartonWithUSDC_AutoDepositsToTreasury() public {
        vm.startPrank(user1);

        uint256 price = 100 * 10 ** 6; // 100 USDC
        uint256 treasuryBalanceBefore = treasury.getPrizePool(TOURNAMENT_ID, address(usdc));

        // Approve Carton to spend USDC
        usdc.approve(address(carton), price);

        // Buy carton with USDC
        carton.buyCartonWithToken(address(usdc));

        uint256 treasuryBalanceAfter = treasury.getPrizePool(TOURNAMENT_ID, address(usdc));

        assertEq(treasuryBalanceAfter - treasuryBalanceBefore, price, "Treasury should receive USDC");
        assertEq(carton.balanceOf(user1, 1), 1, "User should own token #1");
        assertEq(usdc.balanceOf(user1), 900 * 10 ** 6, "User should have 900 USDC left");

        vm.stopPrank();
    }

    function test_MultipleUsdcPurchasesAccumulateSinglePrizePool() public {
        vm.startPrank(user1);
        usdc.approve(address(carton), 100 * 10 ** 6);
        carton.buyCartonWithToken(address(usdc));
        vm.stopPrank();

        vm.startPrank(address(3));
        usdc.mint(address(3), 1000 * 10 ** 6);
        usdc.approve(address(carton), 100 * 10 ** 6);
        carton.buyCartonWithToken(address(usdc));
        vm.stopPrank();

        assertEq(treasury.getPrizePool(TOURNAMENT_ID, address(usdc)), 200 * 10 ** 6, "USDC pool should have 200 USDC");
    }
}
