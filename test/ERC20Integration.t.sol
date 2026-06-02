// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { Test } from "forge-std/Test.sol";
import { Carton } from "../src/Carton.sol";
import { Treasury } from "../src/Treasury.sol";
import { Predictions } from "../src/Predictions.sol";
import { MockERC20 } from "../src/mocks/MockERC20.sol";

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
        predictions = new Predictions(address(carton), TOURNAMENT_ID);
        treasury = new Treasury(owner, address(carton), 500);
        usdc = new MockERC20("USD Coin", "USDC", 6);

        // Setup Carton
        carton.setTreasuryAddress(address(treasury));
        treasury.setSupportedPrizeToken(address(usdc), true);
        carton.setActiveTournament(TOURNAMENT_ID);
        carton.setAcceptedToken(address(usdc), true);
        carton.setTokenPrice(TOURNAMENT_ID, address(usdc), 100 * 10 ** 6); // 100 USDC

        // Setup Treasury roles
        treasury.grantRole(treasury.FUND_DEPOSITOR_ROLE(), address(carton));
        treasury.grantRole(treasury.TOURNAMENT_MANAGER_ROLE(), owner);
        treasury.registerTournament(TOURNAMENT_ID, address(predictions));

        // Mint USDC to user1 for testing
        usdc.mint(user1, 1000 * 10 ** 6);

        vm.stopPrank();
    }

    function test_BuyCartonWithUSDC_AutoDepositsToTreasury() public {
        vm.startPrank(user1);

        uint256 price = 100 * 10 ** 6; // 100 USDC
        uint256 treasuryBalanceBefore = treasury.getPrizePool(TOURNAMENT_ID, address(usdc));

        // Approve Carton to spend USDC
        usdc.approve(address(carton), price);

        // Buy carton with USDC
        carton.buyCartonWithToken(TOURNAMENT_ID, address(usdc));

        uint256 treasuryBalanceAfter = treasury.getPrizePool(TOURNAMENT_ID, address(usdc));

        assertEq(
            treasuryBalanceAfter - treasuryBalanceBefore, 95 * 10 ** 6, "Treasury should receive the 95% prizeable pool"
        );
        assertEq(treasury.globalReserve(address(usdc)), 5 * 10 ** 6, "Treasury should track the 5% reserve");
        assertEq(carton.balanceOf(user1, 1), 1, "User should own token #1");
        assertEq(usdc.balanceOf(user1), 900 * 10 ** 6, "User should have 900 USDC left");

        vm.stopPrank();
    }

    function test_MultipleUsdcPurchasesAccumulateSinglePrizePool() public {
        vm.startPrank(user1);
        usdc.approve(address(carton), 100 * 10 ** 6);
        carton.buyCartonWithToken(TOURNAMENT_ID, address(usdc));
        vm.stopPrank();

        vm.startPrank(address(3));
        usdc.mint(address(3), 1000 * 10 ** 6);
        usdc.approve(address(carton), 100 * 10 ** 6);
        carton.buyCartonWithToken(TOURNAMENT_ID, address(usdc));
        vm.stopPrank();

        assertEq(
            treasury.getPrizePool(TOURNAMENT_ID, address(usdc)), 190 * 10 ** 6, "USDC prize pool should have 190 USDC"
        );
        assertEq(treasury.globalReserve(address(usdc)), 10 * 10 ** 6, "USDC reserve should have 10 USDC");
    }
}
